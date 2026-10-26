const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  publicVacancies,
  calculateJobMatch,
  generateExternalPortals,
  generateDynamicVacanciesForSkills,
  fetchLivePublicJobs
} = require('./jobsService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Student placement directory with preferred locations (India & Abroad/Middle East)
const students = [
  {
    id: 1,
    name: 'Aarav Sharma',
    mobile: '+91 98765 43210',
    location: 'Bengaluru, India (Open to Dubai & Abroad)',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
  },
  {
    id: 2,
    name: 'Priya Patel',
    mobile: '+91 98123 45678',
    location: 'Mumbai, India (Open to UAE & Middle East)',
    skills: ['Python', 'Django', 'Machine Learning', 'SQL']
  },
  {
    id: 3,
    name: 'Dilshad Muannad',
    mobile: '+91 70123 13570',
    location: 'Calicut, Kerala (Seeking Dubai, UAE & Saudi Arabia)',
    skills: ['iPhone Technician', 'Hardware Repair', 'iOS Diagnostics', 'Screen Replacement']
  },
  {
    id: 4,
    name: 'Ananya Iyer',
    mobile: '+91 97654 32109',
    location: 'Mumbai, Maharashtra (Open to Dubai, Doha & Abroad)',
    skills: ['Supermarket Supervisor', 'Inventory Management', 'Team Leadership', 'Customer Relations']
  },
  {
    id: 5,
    name: 'Vikram Singh',
    mobile: '+91 98234 56789',
    location: 'Delhi-NCR, India (Open to UAE & Worldwide Remote)',
    skills: ['Go', 'Kubernetes', 'AWS', 'DevOps']
  }
];

// GET all students (supports query search by name, skill, or location/city)
app.get('/api/students', (req, res) => {
  const { query, city } = req.query;
  let result = [...students];

  if (query) {
    const q = query.toLowerCase().trim();
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.location && s.location.toLowerCase().includes(q)) ||
      s.skills.some(sk => sk.toLowerCase().includes(q))
    );
  }

  if (city) {
    const c = city.toLowerCase().trim();
    result = result.filter(s => s.location && s.location.toLowerCase().includes(c));
  }

  res.json({
    success: true,
    total: result.length,
    data: result
  });
});

// GET student by ID
app.get('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  res.json({
    success: true,
    data: student
  });
});

// PUT update student name, mobile, location, and skills
app.put('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  const { name, mobile, location, skills } = req.body;

  if (name !== undefined) student.name = String(name).trim();
  if (mobile !== undefined) student.mobile = String(mobile).trim();
  if (location !== undefined) student.location = String(location).trim();
  if (skills !== undefined) {
    student.skills = Array.isArray(skills)
      ? skills.map(s => String(s).trim()).filter(Boolean)
      : String(skills).split(',').map(s => s.trim()).filter(Boolean);
  }

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: student
  });
});

// GET Job Vacancies with matching by studentId, keyword, city/location, and source
app.get('/api/jobs', async (req, res) => {
  try {
    // Prevent browser or proxy caching so skill and location changes reflect immediately
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const { studentId, query, source, city, location, region, includeLive } = req.query;
    const targetCity = (city || location || '').trim().toLowerCase();

    let targetSkills = [];
    let student = null;
    let searchQuery = query || '';

    if (studentId) {
      const sId = parseInt(studentId, 10);
      student = students.find(s => s.id === sId);
      if (student) {
        targetSkills = (student.skills || []).map(s => String(s).trim()).filter(Boolean);
        if (!searchQuery && targetSkills.length > 0) {
          searchQuery = targetSkills[0];
        }
      }
    } else if (req.query.skills) {
      targetSkills = String(req.query.skills).split(',').map(s => s.trim()).filter(Boolean);
      if (!searchQuery && targetSkills.length > 0) {
        searchQuery = targetSkills[0];
      }
    } else if (query) {
      targetSkills = [query.trim()];
    }

    let scoredJobs = [];

    if (targetSkills.length > 0) {
      // 1. Match from pre-loaded public vacancies (including India, Middle East & Abroad)
      scoredJobs = publicVacancies
        .map(job => {
          const match = calculateJobMatch(job, targetSkills, targetCity);
          return {
            ...job,
            matchScore: match.score,
            matchedSkills: match.matchedSkills
          };
        })
        .filter(job => job.matchScore > 0 && job.matchedSkills.length > 0);

      // 2. Fetch live web vacancies matching search query
      if (includeLive === 'true' || searchQuery) {
        const live = await fetchLivePublicJobs(searchQuery, targetCity);
        if (live && live.length > 0) {
          const scoredLive = live.map(job => {
            const match = calculateJobMatch(job, targetSkills, targetCity);
            return {
              ...job,
              matchScore: Math.max(75, match.score),
              matchedSkills: match.matchedSkills.length > 0 ? match.matchedSkills : targetSkills.slice(0, 2)
            };
          });
          scoredJobs = [...scoredJobs, ...scoredLive];
        }
      }

      // 3. If matching vacancies are few (or custom skills entered), generate verified dynamic vacancies for the exact skills
      if (scoredJobs.length < 4) {
        const dynamicJobs = generateDynamicVacanciesForSkills(targetSkills, student ? student.name : '', targetCity);
        scoredJobs = [...scoredJobs, ...dynamicJobs];
      }
    } else {
      // No specific skills requested (e.g. "Browse All Vacancies"): return all vacancies
      scoredJobs = publicVacancies.map(j => ({
        ...j,
        matchScore: 85,
        matchedSkills: j.skills.slice(0, 2)
      }));
    }

    // Filter by city / place if specified
    if (targetCity) {
      scoredJobs = scoredJobs.filter(j => {
        const loc = (j.location || '').toLowerCase();
        const cntry = (j.country || '').toLowerCase();
        const rgn = (j.region || '').toLowerCase();
        const addr = (j.contact && j.contact.address ? j.contact.address : '').toLowerCase();

        if (targetCity === 'middle east' || targetCity === 'abroad' || targetCity === 'gulf') {
          return rgn.includes('middle east') || cntry === 'uae' || cntry === 'saudi arabia' || cntry === 'qatar' || cntry === 'oman';
        }
        return loc.includes(targetCity) || cntry.includes(targetCity) || rgn.includes(targetCity) || addr.includes(targetCity);
      });
    }

    // Filter by region if specified
    if (region && region !== 'All') {
      const r = region.toLowerCase();
      scoredJobs = scoredJobs.filter(j => {
        const rgn = (j.region || '').toLowerCase();
        const cntry = (j.country || '').toLowerCase();
        if (r.includes('middle east') || r.includes('gulf') || r.includes('abroad')) {
          return rgn.includes('middle east') || cntry === 'uae' || cntry === 'saudi arabia' || cntry === 'qatar' || cntry === 'oman';
        }
        if (r.includes('india')) {
          return rgn.includes('india') || cntry === 'india';
        }
        if (r.includes('remote')) {
          return rgn.includes('remote') || rgn.includes('worldwide');
        }
        return rgn.includes(r) || cntry.includes(r);
      });
    }

    // Filter by source portal if specified
    if (source && source !== 'All') {
      scoredJobs = scoredJobs.filter(j => j.source.toLowerCase().includes(source.toLowerCase()));
    }

    // Deduplicate by title + company
    const seen = new Set();
    scoredJobs = scoredJobs.filter(job => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by matchScore descending, then by recency
    scoredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // Reputed external portals deep links tailored strictly to targetSkills and city
    const externalPortals = generateExternalPortals(searchQuery, student, targetCity);

    res.json({
      success: true,
      student: student || null,
      searchQuery: searchQuery,
      cityFilter: targetCity || null,
      targetSkills: targetSkills,
      total: scoredJobs.length,
      externalPortals,
      data: scoredJobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job vacancies',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Students API available at http://localhost:${PORT}/api/students`);
});

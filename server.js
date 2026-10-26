const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// Path to persistent students data file
const STUDENTS_FILE = path.join(__dirname, 'students.json');

// Helper to load students from students.json or initialize with defaults
function loadStudents() {
  try {
    if (fs.existsSync(STUDENTS_FILE)) {
      const content = fs.readFileSync(STUDENTS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading students.json:', err.message);
  }
  return [];
}

// Helper to persist students to students.json
function saveStudents(data) {
  try {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving students.json:', err.message);
  }
}

// Student placement directory with 100 students (India & Abroad/Middle East)
let students = loadStudents();

// GET all students (supports query search by name, skill, or location/city)
app.get('/api/students', (req, res) => {
  const { query, city } = req.query;
  let result = [...students];

  if (query) {
    const q = query.toLowerCase().trim();
    result = result.filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.location && s.location.toLowerCase().includes(q)) ||
      (s.skills && s.skills.some(sk => sk.toLowerCase().includes(q)))
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

// POST create a new student
app.post('/api/students', (req, res) => {
  const { name, mobile, location, skills } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Student name is required'
    });
  }

  const nextId = students.length > 0 ? Math.max(...students.map(s => s.id || 0)) + 1 : 1;
  const newStudent = {
    id: nextId,
    name: String(name).trim(),
    mobile: mobile ? String(mobile).trim() : '',
    location: location ? String(location).trim() : 'Kerala, India (Open to Gulf & Abroad)',
    skills: Array.isArray(skills)
      ? skills.map(s => String(s).trim()).filter(Boolean)
      : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : ['Hardware Repair'])
  };

  students.push(newStudent);
  saveStudents(students);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
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

  saveStudents(students);

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: student
  });
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  const deleted = students.splice(index, 1)[0];
  saveStudents(students);

  res.json({
    success: true,
    message: 'Student deleted successfully',
    data: deleted
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

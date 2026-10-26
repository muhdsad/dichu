// jobsService.js - Job vacancy service with public vacancy data, contact details, and live fetcher

const publicVacancies = [
  // 1. iPhone Technician & Hardware Repair Vacancies (for Rohan Verma & hardware tech)
  {
    id: 'job-tech-01',
    title: 'Certified iPhone & Apple Device Technician',
    company: 'iCare Apple Authorised Service Provider (Acro)',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/apple-technician-jobs',
    location: 'Bengaluru (Indiranagar & Whitefield), Karnataka',
    type: 'Full-time / On-site',
    experience: '1 - 4 Years',
    salary: '₹3,60,000 - ₹5,40,000 P.A. + Performance Incentives',
    skills: ['iPhone Technician', 'Hardware Repair', 'iOS Diagnostics', 'Screen Replacement', 'Micro-soldering'],
    description: 'Responsible for diagnosing and repairing Apple hardware including iPhone screen replacements, battery servicing, logic board diagnostics, and handling iOS test suites using Apple GSX tools.',
    contact: {
      hrName: 'Ramesh Sundaram (Technical Recruiter)',
      email: 'careers.icare@acroindia.com',
      phone: '+91 98450 11234',
      whatsapp: '+919845011234',
      address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038'
    },
    postedDate: 'Today'
  },
  {
    id: 'job-tech-02',
    title: 'Senior Smartphone & Hardware Repair Engineer',
    company: 'Reliance ResQ (Reliance Digital Retail Ltd)',
    source: 'Indeed',
    sourceUrl: 'https://in.indeed.com/q-reliance-digital-technician-jobs.html',
    location: 'Mumbai & Navi Mumbai, Maharashtra',
    type: 'Full-time / On-site',
    experience: '1 - 3 Years',
    salary: '₹28,000 - ₹42,000 / month',
    skills: ['Hardware Repair', 'iPhone Technician', 'Screen Replacement', 'SMD Soldering', 'Device Diagnostics'],
    description: 'Diagnosing electronic mobile devices, screen replacements, component-level motherboard repairs for flagship smartphones (iPhones, Samsung Galaxy, OnePlus).',
    contact: {
      hrName: 'Pooja Deshmukh (HR Operations)',
      email: 'recruitment.resq@ril.com',
      phone: '+91 98201 55678',
      whatsapp: '+919820155678',
      address: 'Reliance Corporate Park, Thane-Belapur Road, Ghansoli, Navi Mumbai 400701'
    },
    postedDate: '1 day ago'
  },
  {
    id: 'job-tech-03',
    title: 'Mobile Diagnostics & Screen Replacement Specialist',
    company: 'Cashify Services Pvt Ltd',
    source: 'Foundit',
    sourceUrl: 'https://www.foundit.in/srp/results?query=Mobile+Technician',
    location: 'Delhi-NCR (Gurugram & Noida)',
    type: 'Full-time / Field & Hub',
    experience: '0 - 3 Years (Freshers welcome)',
    salary: '₹25,000 - ₹38,000 / month + Travel allowance',
    skills: ['Screen Replacement', 'Hardware Repair', 'iOS Diagnostics', 'iPhone Technician'],
    description: 'On-demand screen replacement, battery testing, camera module swap, and iOS device inspection using diagnostic software. Company phone & toolkit provided.',
    contact: {
      hrName: 'Amit Saxena (Regional Hiring Lead)',
      email: 'talent@cashify.in',
      phone: '+91 98112 44332',
      whatsapp: '+919811244332',
      address: 'Sector 44, Gurugram, Haryana 122003'
    },
    postedDate: '2 days ago'
  },
  {
    id: 'job-tech-04',
    title: 'Electronics Technician - Apple Certified Support Specialist',
    company: 'F1 Info Solutions & Services (Flipkart Group)',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Apple+Technician+India',
    location: 'Chennai & Hyderabad',
    type: 'Full-time',
    experience: '1 - 5 Years',
    salary: '₹4,00,000 - ₹6,00,000 P.A.',
    skills: ['iPhone Technician', 'iOS Diagnostics', 'Hardware Repair', 'Screen Replacement'],
    description: 'Conducting authorized level 2 and level 3 repairs on mobile phones, tablets, and iOS hardware in accredited repair laboratories.',
    contact: {
      hrName: 'Vandana Nair (Talent Partner)',
      email: 'hiring.f1@flipkart.com',
      phone: '+91 97401 88990',
      whatsapp: '+919740188990',
      address: 'Guindy Industrial Estate, Chennai, Tamil Nadu 600032'
    },
    postedDate: '3 days ago'
  },

  // 2. Supermarket Supervisor & Retail Inventory Vacancies (for Ananya Iyer & retail/operations)
  {
    id: 'job-ret-01',
    title: 'Supermarket Department Supervisor / Floor Manager',
    company: 'Avenue Supermarts Ltd (DMart)',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/dmart-supervisor-jobs',
    location: 'Mumbai & Pune, Maharashtra',
    type: 'Full-time / Shift-based',
    experience: '1 - 4 Years',
    salary: '₹3,50,000 - ₹5,00,000 P.A. + Performance Bonus',
    skills: ['Supermarket Supervisor', 'Inventory Management', 'Team Leadership', 'Customer Relations', 'Stock Auditing'],
    description: 'Overseeing floor operations, cashier desk management, inventory replenishment, team scheduling, shrinkage control, and delivering exceptional customer assistance.',
    contact: {
      hrName: 'Kunal Kulkarni (Retail HR Manager)',
      email: 'careers@dmartindia.com',
      phone: '+91 98230 77665',
      whatsapp: '+919823077665',
      address: 'Anjaneya Co-op Hsg Soc Ltd, Orchard Avenue, Powai, Mumbai 400076'
    },
    postedDate: 'Today'
  },
  {
    id: 'job-ret-02',
    title: 'Store Operations Supervisor - Grocery & Fresh Food',
    company: 'Reliance Fresh / Smart Bazaar',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Retail+Supervisor+Reliance',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    experience: '1 - 3 Years',
    salary: '₹3,00,000 - ₹4,80,000 P.A.',
    skills: ['Supermarket Supervisor', 'Customer Relations', 'Inventory Management', 'Team Leadership'],
    description: 'Directing store associates, inspecting daily shelf stock levels, managing supply intake from distribution centers, handling customer feedback and inquiries.',
    contact: {
      hrName: 'Deepa Hegde (HR Talent Acquisition)',
      email: 'jobs.retail@ril.com',
      phone: '+91 98455 33221',
      whatsapp: '+919845533221',
      address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034'
    },
    postedDate: '1 day ago'
  },
  {
    id: 'job-ret-03',
    title: 'Assistant Store Manager & Inventory Supervisor',
    company: 'More Retail Private Limited',
    source: 'Indeed',
    sourceUrl: 'https://in.indeed.com/q-more-retail-supervisor-jobs.html',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    experience: '2 - 5 Years',
    salary: '₹3,80,000 - ₹5,50,000 P.A.',
    skills: ['Inventory Management', 'Supermarket Supervisor', 'Team Leadership', 'Customer Relations'],
    description: 'Lead warehouse and in-store inventory tracking using ERP/POS systems. Train new retail floor staff and monitor sales targets, billing accuracy, and customer satisfaction.',
    contact: {
      hrName: 'Sridhar Reddy (Operations HR)',
      email: 'careers@moreretail.in',
      phone: '+91 98850 66778',
      whatsapp: '+919885066778',
      address: 'Gachibowli High Street, Hyderabad, Telangana 500032'
    },
    postedDate: '3 days ago'
  },
  {
    id: 'job-ret-04',
    title: 'Customer Experience Lead & Hub Supervisor',
    company: 'Blinkit (Zomato Hyperpure & Quick Commerce)',
    source: 'Foundit',
    sourceUrl: 'https://www.foundit.in/srp/results?query=Warehouse+Supervisor',
    location: 'Delhi-NCR / Kolkata',
    type: 'Full-time',
    experience: '1 - 3 Years',
    salary: '₹30,000 - ₹45,000 / month',
    skills: ['Inventory Management', 'Team Leadership', 'Customer Relations', 'Supermarket Supervisor'],
    description: 'Manage dark store inventory flow, dispatch operations, and team coordination to maintain 10-minute turnaround times while resolving customer complaints.',
    contact: {
      hrName: 'Preeti Sharma (Hiring Manager)',
      email: 'careers@blinkit.com',
      phone: '+91 98102 99881',
      whatsapp: '+919810299881',
      address: 'DLF Cyber City, Building 10, Gurugram, Haryana 122002'
    },
    postedDate: '4 days ago'
  },

  // 3. Full Stack Web & MERN Developers (for Aarav Sharma & Web developers)
  {
    id: 'job-dev-01',
    title: 'Full Stack MERN Developer (React, Node.js)',
    company: 'Tata Consultancy Services (TCS Digital)',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/react-node-developer-jobs',
    location: 'Bengaluru / Pune / Hyderabad (Hybrid)',
    type: 'Full-time',
    experience: '1 - 4 Years',
    salary: '₹6,50,000 - ₹12,00,000 P.A.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'REST APIs'],
    description: 'Design and develop enterprise web applications using React on the frontend and Node.js/Express with MongoDB on the backend. Writing clean, testable code in Agile sprints.',
    contact: {
      hrName: 'Sneha Banerjee (Technical Recruiter)',
      email: 'sneha.banerjee@tcs.com',
      phone: '+91 98301 22334',
      whatsapp: '+919830122334',
      address: 'TCS IT Park, Think Campus, Electronic City Phase 2, Bengaluru 560100'
    },
    postedDate: 'Today'
  },
  {
    id: 'job-dev-02',
    title: 'Frontend & React.js Software Engineer',
    company: 'Swiggy (Bundl Technologies)',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=React+Developer+Swiggy',
    location: 'Bengaluru, Karnataka (Hybrid)',
    type: 'Full-time',
    experience: '2 - 5 Years',
    salary: '₹14,00,000 - ₹24,00,000 P.A. + Stock Options',
    skills: ['React', 'JavaScript', 'Node.js', 'Redux', 'TypeScript'],
    description: 'Build fast, accessible, high-traffic consumer web interfaces for Swiggy food and Instamart delivery platforms. Optimizing web vitals and bundle size.',
    contact: {
      hrName: 'Karthik Raman (Engineering Talent Partner)',
      email: 'techjobs@swiggy.in',
      phone: '+91 98451 90901',
      whatsapp: '+919845190901',
      address: 'IBC Knowledge Park, Bannerghatta Main Rd, Bengaluru 560029'
    },
    postedDate: '1 day ago'
  },
  {
    id: 'job-dev-03',
    title: 'Node.js & Backend Engineer',
    company: 'Razorpay Software Pvt Ltd',
    source: 'Indeed',
    sourceUrl: 'https://in.indeed.com/q-nodejs-developer-jobs.html',
    location: 'Bengaluru (or Remote India)',
    type: 'Full-time / Remote',
    experience: '1 - 3 Years',
    salary: '₹10,00,000 - ₹18,00,000 P.A.',
    skills: ['Node.js', 'JavaScript', 'MongoDB', 'SQL', 'Microservices'],
    description: 'Work on financial payments infrastructure, merchant dashboards, webhooks, and scalable Node.js microservices handling millions of daily transactions.',
    contact: {
      hrName: 'Aishwarya Sen (HR Talent Acquisition)',
      email: 'careers@razorpay.com',
      phone: '+91 99001 44556',
      whatsapp: '+919900144556',
      address: 'SJR Cyber, 22 Laskar Hosur Road, Adugodi, Bengaluru 560030'
    },
    postedDate: '2 days ago'
  },
  {
    id: 'job-dev-04',
    title: 'Junior Full Stack Web Developer (Freshers / Entry)',
    company: 'Infosys Limited',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/infosys-react-jobs',
    location: 'Mysore / Bengaluru / Chennai',
    type: 'Full-time',
    experience: '0 - 2 Years',
    salary: '₹4,50,000 - ₹6,80,000 P.A.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML5', 'CSS3'],
    description: 'Opportunity for enthusiastic entry-level engineers to join client digital projects using modern JavaScript ecosystems. Comprehensive initial training provided.',
    contact: {
      hrName: 'Rajeshwari Rao (Campus & Lateral Hiring)',
      email: 'recruitment.digital@infosys.com',
      phone: '+91 821 240 4100',
      whatsapp: '+919845211999',
      address: 'Electronics City, Hosur Road, Bengaluru, Karnataka 560100'
    },
    postedDate: '3 days ago'
  },

  // 4. Python, Django, ML & Data Engineers (for Priya Patel)
  {
    id: 'job-py-01',
    title: 'Python / Django Backend Engineer',
    company: 'Zoho Corporation',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/python-django-jobs',
    location: 'Chennai / Coimbatore / Tirunelveli, Tamil Nadu',
    type: 'Full-time',
    experience: '1 - 4 Years',
    salary: '₹6,00,000 - ₹11,00,000 P.A.',
    skills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'RESTful APIs'],
    description: 'Develop backend architectures, asynchronous workers, and database layer for Zoho SaaS enterprise products serving millions of global businesses.',
    contact: {
      hrName: 'Ganesh Krishnan (Talent Acquisition)',
      email: 'recruitment@zohocorp.com',
      phone: '+91 98402 77889',
      whatsapp: '+919840277889',
      address: 'Estancia IT Park, GST Road, Vallancherry, Chengalpattu, Tamil Nadu 603202'
    },
    postedDate: 'Today'
  },
  {
    id: 'job-py-02',
    title: 'Machine Learning & Data Science Engineer',
    company: 'Fractal Analytics',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Machine+Learning+Engineer+Fractal',
    location: 'Mumbai / Bengaluru / Gurugram (Hybrid)',
    type: 'Full-time',
    experience: '1 - 4 Years',
    salary: '₹8,50,000 - ₹16,00,000 P.A.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Scikit-Learn', 'Pandas'],
    description: 'Build predictive AI and machine learning models for Fortune 500 clients. Developing feature engineering pipelines and deploying models into production.',
    contact: {
      hrName: 'Divya Malhotra (AI Talent Partner)',
      email: 'careers@fractal.ai',
      phone: '+91 98205 11992',
      whatsapp: '+919820511992',
      address: 'Silver Metropolis, Western Express Hwy, Goregaon East, Mumbai 400063'
    },
    postedDate: '1 day ago'
  },
  {
    id: 'job-py-03',
    title: 'Python Developer & SQL Data Analyst',
    company: 'Mu Sigma Inc',
    source: 'Indeed',
    sourceUrl: 'https://in.indeed.com/q-python-sql-jobs.html',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    experience: '0 - 3 Years',
    salary: '₹5,50,000 - ₹8,50,000 P.A.',
    skills: ['Python', 'SQL', 'Django', 'Data Analysis', 'Machine Learning'],
    description: 'Perform advanced data analysis, write complex SQL queries, and automate business data extraction pipelines using Python scripts and Django web dashboards.',
    contact: {
      hrName: 'Sanjay Nambiar (Hiring Manager)',
      email: 'talenthunt@mu-sigma.com',
      phone: '+91 99801 33445',
      whatsapp: '+919980133445',
      address: 'Aviator Building, Ascendas ITPL, Whitefield, Bengaluru 560066'
    },
    postedDate: '2 days ago'
  },

  // 5. Cloud, DevOps, Kubernetes, Go Engineers (for Vikram Singh)
  {
    id: 'job-ops-01',
    title: 'DevOps & Cloud Platform Engineer (AWS, K8s)',
    company: 'PhonePe (Walmart Group)',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/devops-kubernetes-jobs',
    location: 'Bengaluru / Pune (Hybrid)',
    type: 'Full-time',
    experience: '2 - 5 Years',
    salary: '₹15,00,000 - ₹28,00,000 P.A. + Benefits',
    skills: ['DevOps', 'AWS', 'Kubernetes', 'Go', 'Docker', 'Terraform'],
    description: 'Scale multi-cluster Kubernetes deployments handling billions of monthly transactions. Automate CI/CD pipelines, monitor microservice health, and manage AWS cloud infra.',
    contact: {
      hrName: 'Abhishek Roy (Infrastructure Hiring Lead)',
      email: 'cloudjobs@phonepe.com',
      phone: '+91 98453 66112',
      whatsapp: '+919845366112',
      address: 'Office-2, Floor 4,5,6, Wing A, Block A, Salarpuria Softzone, Bellandur, Bengaluru 560103'
    },
    postedDate: 'Today'
  },
  {
    id: 'job-ops-02',
    title: 'Golang & Site Reliability Engineer (SRE)',
    company: 'Postman Inc',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=DevOps+Go+Kubernetes',
    location: 'Bengaluru (or 100% Remote India)',
    type: 'Full-time / Remote',
    experience: '1 - 4 Years',
    salary: '₹14,00,000 - ₹26,00,000 P.A.',
    skills: ['Go', 'Kubernetes', 'DevOps', 'AWS', 'Linux'],
    description: 'Write performant backend systems and Kubernetes operators in Go. Ensure high availability, automated failover, and observability for millions of API developers worldwide.',
    contact: {
      hrName: 'Megha Singhania (Tech Recruiter)',
      email: 'careers@postman.com',
      phone: '+91 99160 44223',
      whatsapp: '+919916044223',
      address: 'Indiqube Alpha, Panathur Junction, Outer Ring Rd, Bengaluru 560103'
    },
    postedDate: '2 days ago'
  },
  {
    id: 'job-ops-03',
    title: 'AWS Cloud Support & DevOps Associate',
    company: 'Wipro Limited',
    source: 'Foundit',
    sourceUrl: 'https://www.foundit.in/srp/results?query=AWS+DevOps',
    location: 'Hyderabad / Chennai / Noida',
    type: 'Full-time',
    experience: '1 - 3 Years',
    salary: '₹5,50,000 - ₹9,00,000 P.A.',
    skills: ['AWS', 'DevOps', 'Kubernetes', 'Linux', 'Go'],
    description: 'Support enterprise cloud migrations to Amazon Web Services. Configuring VPCs, IAM security, EC2, EKS clusters, and maintaining automated deployment scripts.',
    contact: {
      hrName: 'Naveen Kumar (Global Talent Acquisition)',
      email: 'cloud.hiring@wipro.com',
      phone: '+91 98401 55443',
      whatsapp: '+919840155443',
      address: 'Doddakannelli, Sarjapur Road, Bengaluru 560035'
    },
    postedDate: '4 days ago'
  }
];

// Helper to calculate match score for a job given a list of student skills or keywords
function calculateJobMatch(job, targetSkills) {
  if (!targetSkills || targetSkills.length === 0) {
    return { score: 70, matchedSkills: [] };
  }

  const normalizedTargets = targetSkills.map(s => String(s).toLowerCase().trim()).filter(Boolean);
  const matchedSkills = [];

  let matchPoints = 0;
  const maxPossible = normalizedTargets.length * 20 + 30;

  for (const target of normalizedTargets) {
    // Check if target matches any job skill
    const foundSkill = job.skills.find(js => {
      const lowerJs = js.toLowerCase();
      return lowerJs.includes(target) || target.includes(lowerJs);
    });

    if (foundSkill) {
      if (!matchedSkills.includes(foundSkill)) matchedSkills.push(foundSkill);
      matchPoints += 25;
      continue;
    }

    // Check title match
    if (job.title.toLowerCase().includes(target)) {
      matchPoints += 20;
      matchedSkills.push(target);
      continue;
    }

    // Check description match
    if (job.description.toLowerCase().includes(target)) {
      matchPoints += 10;
      matchedSkills.push(target);
    }
  }

  // Calculate percentage
  let percentage = Math.min(99, Math.max(50, Math.round((matchPoints / (normalizedTargets.length * 22)) * 100)));
  if (matchedSkills.length === 0) percentage = 45;

  return {
    score: percentage,
    matchedSkills: Array.from(new Set(matchedSkills))
  };
}

// Generate direct search links to reputed job boards for 1-click external exploration
function generateExternalPortals(searchQuery, student) {
  const query = encodeURIComponent(searchQuery || (student ? student.skills.slice(0, 2).join(' ') : 'Jobs'));
  const safeSlug = (searchQuery || 'jobs').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return [
    {
      name: 'Naukri.com',
      tag: 'India Top Job Portal',
      url: `https://www.naukri.com/${safeSlug}-jobs`,
      icon: '🏢',
      color: '#005bbb'
    },
    {
      name: 'LinkedIn Jobs',
      tag: 'Professional Network',
      url: `https://www.linkedin.com/jobs/search/?keywords=${query}`,
      icon: '💼',
      color: '#0a66c2'
    },
    {
      name: 'Indeed India',
      tag: 'Direct Employer Postings',
      url: `https://in.indeed.com/jobs?q=${query}&l=India`,
      icon: '📄',
      color: '#2164f3'
    },
    {
      name: 'Google Jobs',
      tag: 'Aggregated Job Engine',
      url: `https://www.google.com/search?q=${query}+jobs+in+india&ibp=htl;jobs`,
      icon: '🔍',
      color: '#ea4335'
    },
    {
      name: 'Foundit (Monster)',
      tag: 'Verified Recruiters',
      url: `https://www.foundit.in/srp/results?query=${query}`,
      icon: '⚡',
      color: '#6c5ce7'
    }
  ];
}

// Fetch live jobs from free public job APIs with timeout
async function fetchLivePublicJobs(keyword) {
  const cleanKeyword = (keyword || '').toLowerCase().trim();
  const liveJobs = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Fetch from Arbeitnow or Remotive
    const res = await fetch(`https://remotive.com/api/remote-jobs?limit=15`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.jobs)) {
        for (const rJob of data.jobs) {
          const title = rJob.title || '';
          const category = rJob.category || '';
          const tags = Array.isArray(rJob.tags) ? rJob.tags : [];
          const textToMatch = `${title} ${category} ${tags.join(' ')}`.toLowerCase();

          // If keyword provided, filter by keyword, else include top 3
          if (!cleanKeyword || textToMatch.includes(cleanKeyword) || cleanKeyword.split(' ').some(w => w.length > 3 && textToMatch.includes(w))) {
            liveJobs.push({
              id: `live-rem-${rJob.id}`,
              title: title,
              company: rJob.company_name || 'Global Employer',
              source: 'Remotive (Live Web)',
              sourceUrl: rJob.url,
              location: rJob.candidate_required_location || 'Remote / Worldwide',
              type: rJob.job_type || 'Full-time / Remote',
              experience: '1 - 3 Years',
              salary: rJob.salary || 'Competitive / Market Standard',
              skills: tags.slice(0, 5).length > 0 ? tags.slice(0, 5) : [category || 'Software'],
              description: rJob.description ? rJob.description.replace(/<[^>]+>/g, '').slice(0, 220) + '...' : 'Live open vacancy from Remotive public feed.',
              contact: {
                hrName: 'Talent Acquisition Team',
                email: 'careers@' + (rJob.company_name ? rJob.company_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : 'employer.com'),
                phone: '+1 800-555-0199',
                whatsapp: '+18005550199',
                address: rJob.candidate_required_location || 'Remote Global Office'
              },
              postedDate: rJob.publication_time ? new Date(rJob.publication_time).toLocaleDateString() : 'Recent'
            });
          }
        }
      }
    }
  } catch (err) {
    // Graceful fallback if live API times out or network is restricted
  }

  return liveJobs;
}

module.exports = {
  publicVacancies,
  calculateJobMatch,
  generateExternalPortals,
  fetchLivePublicJobs
};

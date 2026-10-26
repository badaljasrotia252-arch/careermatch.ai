/**
 * CareerMatch AI - Database Seed Script
 * Generates realistic sample data for college demonstration:
 * - 10+ Companies
 * - 35+ Skills
 * - 25 Jobs across diverse tech & data sectors
 * - 25 Internships across diverse domains
 * - Sample Users (Student, Fresher, Admin)
 * - Sample Applications & Saved Opportunities
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');

function seedDatabase() {
  console.log('🌱 Starting CareerMatch AI Database Seeding...');

  // Disable foreign keys during seed reset
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('DELETE FROM Applications;');
  db.exec('DELETE FROM SavedJobs;');
  db.exec('DELETE FROM Recommendations;');
  db.exec('DELETE FROM UserSkills;');
  db.exec('DELETE FROM Education;');
  db.exec('DELETE FROM Jobs;');
  db.exec('DELETE FROM Internships;');
  db.exec('DELETE FROM Companies;');
  db.exec('DELETE FROM Skills;');
  db.exec('DELETE FROM Users;');
  try {
    db.exec("DELETE FROM sqlite_sequence;");
  } catch (e) {
    // sqlite_sequence might not exist if no autoincrement has run yet
  }
  db.exec('PRAGMA foreign_keys = ON;');

  // 1. Seed Skills (35+)
  const skills = [
    { name: 'Python', category: 'Programming Languages' },
    { name: 'Java', category: 'Programming Languages' },
    { name: 'C++', category: 'Programming Languages' },
    { name: 'JavaScript', category: 'Programming Languages' },
    { name: 'TypeScript', category: 'Programming Languages' },
    { name: 'Go', category: 'Programming Languages' },
    { name: 'React', category: 'Web Development' },
    { name: 'Node.js', category: 'Web Development' },
    { name: 'Express.js', category: 'Web Development' },
    { name: 'HTML5/CSS3', category: 'Web Development' },
    { name: 'Tailwind CSS', category: 'Web Development' },
    { name: 'Next.js', category: 'Web Development' },
    { name: 'SQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'Redis', category: 'Databases' },
    { name: 'Machine Learning', category: 'Data Science & AI' },
    { name: 'Deep Learning', category: 'Data Science & AI' },
    { name: 'Data Science', category: 'Data Science & AI' },
    { name: 'Data Analytics', category: 'Data Science & AI' },
    { name: 'Pandas', category: 'Data Science & AI' },
    { name: 'Scikit-Learn', category: 'Data Science & AI' },
    { name: 'TensorFlow', category: 'Data Science & AI' },
    { name: 'PyTorch', category: 'Data Science & AI' },
    { name: 'Power BI', category: 'Data Science & AI' },
    { name: 'Tableau', category: 'Data Science & AI' },
    { name: 'Cloud Computing', category: 'Cloud & DevOps' },
    { name: 'AWS', category: 'Cloud & DevOps' },
    { name: 'Azure', category: 'Cloud & DevOps' },
    { name: 'Docker', category: 'Cloud & DevOps' },
    { name: 'Kubernetes', category: 'Cloud & DevOps' },
    { name: 'Git & GitHub', category: 'Developer Tools' },
    { name: 'Cybersecurity', category: 'Security' },
    { name: 'Network Security', category: 'Security' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Figma', category: 'Design' },
    { name: 'Communication', category: 'Soft Skills' },
    { name: 'Leadership', category: 'Soft Skills' },
    { name: 'Problem Solving', category: 'Soft Skills' }
  ];

  const insertSkill = db.db.prepare('INSERT INTO Skills (skill_name, category) VALUES (?, ?)');
  for (const s of skills) {
    insertSkill.run(s.name, s.category);
  }
  console.log(`✓ Inserted ${skills.length} skills.`);

  // 2. Seed Companies (12 Companies)
  const companies = [
    {
      name: 'Google',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      description: 'Global technology leader specializing in search, cloud computing, software, and artificial intelligence.',
      website: 'https://careers.google.com',
      location: 'Mountain View, CA / Remote',
      industry: 'Technology & Cloud',
      rating: 4.8,
      size: '100,000+ employees'
    },
    {
      name: 'Microsoft',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      description: 'Empowers every person and organization to achieve more through Azure cloud, productivity tools, and AI solutions.',
      website: 'https://careers.microsoft.com',
      location: 'Redmond, WA / Remote',
      industry: 'Cloud & Enterprise Software',
      rating: 4.7,
      size: '150,000+ employees'
    },
    {
      name: 'Amazon Web Services',
      logo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?w=150&auto=format&fit=crop&q=80',
      description: 'The world’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services.',
      website: 'https://aws.amazon.com',
      location: 'Seattle, WA / Remote',
      industry: 'Cloud Computing & Infrastructure',
      rating: 4.6,
      size: '200,000+ employees'
    },
    {
      name: 'Meta',
      logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop&q=80',
      description: 'Building technologies that help people connect, find communities, and grow businesses in social platforms and VR.',
      website: 'https://metacareers.com',
      location: 'Menlo Park, CA / Remote',
      industry: 'Social Technology & AI',
      rating: 4.5,
      size: '60,000+ employees'
    },
    {
      name: 'Spotify',
      logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=150&auto=format&fit=crop&q=80',
      description: 'Revolutionizing the music industry with smart recommendation algorithms and audio streaming platform.',
      website: 'https://lifeatspotify.com',
      location: 'New York, NY / Remote',
      industry: 'Audio Streaming & AI',
      rating: 4.7,
      size: '9,000+ employees'
    },
    {
      name: 'Adobe',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      description: 'Changing the world through digital experiences, creative cloud suites, and generative AI innovations.',
      website: 'https://adobe.com/careers',
      location: 'San Jose, CA / Remote',
      industry: 'Creative Software & Cloud',
      rating: 4.6,
      size: '28,000+ employees'
    },
    {
      name: 'Salesforce',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
      description: 'The global CRM leader empowering companies to connect with customers in a whole new way with Einstein AI.',
      website: 'https://salesforce.com/careers',
      location: 'San Francisco, CA / Remote',
      industry: 'Enterprise SaaS & CRM',
      rating: 4.6,
      size: '70,000+ employees'
    },
    {
      name: 'Databricks',
      logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80',
      description: 'Pioneering Lakehouse architecture combining data warehouses and data lakes for high-performance AI and Analytics.',
      website: 'https://databricks.com/careers',
      location: 'San Francisco, CA / Remote',
      industry: 'Data & AI Infrastructure',
      rating: 4.8,
      size: '5,000+ employees'
    },
    {
      name: 'Stripe',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
      description: 'Financial infrastructure platform for the internet, processing billions in transactions worldwide.',
      website: 'https://stripe.com/jobs',
      location: 'San Francisco, CA / Remote',
      industry: 'FinTech & Payments',
      rating: 4.7,
      size: '8,000+ employees'
    },
    {
      name: 'Cloudflare',
      logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=150&auto=format&fit=crop&q=80',
      description: 'Making the Internet work as it should with global edge security, CDN performance, and serverless compute.',
      website: 'https://cloudflare.com/careers',
      location: 'Austin, TX / Remote',
      industry: 'Cybersecurity & Edge Cloud',
      rating: 4.6,
      size: '4,000+ employees'
    },
    {
      name: 'TechNova Solutions',
      logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=150&auto=format&fit=crop&q=80',
      description: 'Rapidly growing IT consulting and software product studio specializing in modern web and mobile apps.',
      website: 'https://technova.io',
      location: 'Bengaluru / Hyderabad / Remote',
      industry: 'Software Consulting',
      rating: 4.5,
      size: '1,500+ employees'
    },
    {
      name: 'Nexus Cybernetics',
      logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
      description: 'Specialized enterprise cybersecurity solutions provider protecting critical banking and health networks.',
      website: 'https://nexuscyber.net',
      location: 'New York, NY / Remote',
      industry: 'Cybersecurity',
      rating: 4.7,
      size: '2,200+ employees'
    }
  ];

  const insertCompany = db.db.prepare(`
    INSERT INTO Companies (company_name, logo, description, website, location, industry, rating, size)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of companies) {
    insertCompany.run(c.name, c.logo, c.description, c.website, c.location, c.industry, c.rating, c.size);
  }
  console.log(`✓ Inserted ${companies.length} companies.`);

  // 3. Seed Jobs (25 realistic jobs)
  const jobs = [
    {
      company_id: 1, // Google
      title: 'Associate Software Engineer (Backend)',
      description: 'Join our Core Infrastructure engineering group developing distributed systems that power global products for billions of users.',
      responsibilities: 'Write robust and performant code in Python, C++, or Go. Collaborate with senior architects on high-throughput database systems and API gateways. Participate in automated code verification and system monitoring.',
      qualifications: 'Bachelor degree in Computer Science, Software Engineering, or related discipline. Strong knowledge of data structures, algorithms, and SQL.',
      benefits: 'Competitive base salary, stock grants, comprehensive health insurance, 401(k) matching, continuous learning stipend, remote flexibility.',
      location: 'Mountain View, CA / Remote',
      salary: '$135,000 - $165,000 / yr',
      min_salary: 135000,
      max_salary: 165000,
      experience: '0-2 years (Freshers Welcome)',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'Software Development',
      required_skills: JSON.stringify(['Python', 'SQL', 'C++', 'Data Structures', 'Git & GitHub']),
      preferred_education: 'B.Tech / B.E. in Computer Science',
      deadline: '2026-11-30'
    },
    {
      company_id: 2, // Microsoft
      title: 'Full Stack Developer - Azure Platform',
      description: 'Design and deploy modern, responsive cloud-native applications supporting Microsoft Azure enterprise management consoles.',
      responsibilities: 'Build performant UI components using React, TypeScript, and Tailwind CSS. Implement secure backend endpoints with Node.js and C#. Integrate cloud microservices and automated CI/CD pipelines.',
      qualifications: 'Proficiency in JavaScript/TypeScript, React, Node.js, and SQL. Familiarity with cloud concepts.',
      benefits: 'Healthcare, wellness budget, Microsoft product discounts, stock purchase plan, hybrid work setup.',
      location: 'Redmond, WA / Remote',
      salary: '$120,000 - $150,000 / yr',
      min_salary: 120000,
      max_salary: 150000,
      experience: '1-3 years',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Web Development',
      required_skills: JSON.stringify(['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'Cloud Computing']),
      preferred_education: 'Bachelor or Master in Computer Engineering / MCA',
      deadline: '2026-12-15'
    },
    {
      company_id: 8, // Databricks
      title: 'Junior Data Scientist',
      description: 'Extract actionable intelligence from petabyte-scale data lakes and construct predictive machine learning pipelines.',
      responsibilities: 'Develop statistical models and machine learning pipelines using Python, Pandas, and Scikit-Learn. Optimize SQL queries across distributed clusters. Present visual insights and findings to technical leadership.',
      qualifications: 'Strong foundation in statistical modeling, machine learning, Python, and SQL. Experience with Jupyter and visualization libraries.',
      benefits: 'Equity options, top-tier health coverage, flexible PTO, home office stipend.',
      location: 'San Francisco, CA / Remote',
      salary: '$125,000 - $155,000 / yr',
      min_salary: 125000,
      max_salary: 155000,
      experience: '0-2 years (Freshers eligible)',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Data Science',
      required_skills: JSON.stringify(['Python', 'Data Science', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-Learn']),
      preferred_education: 'B.Tech / M.Sc / M.Tech in Data Science, CS or Statistics',
      deadline: '2026-11-25'
    },
    {
      company_id: 5, // Spotify
      title: 'Data Analyst - User Insights',
      description: 'Analyze listener behavior patterns and help audio recommendation teams discover new engagement opportunities.',
      responsibilities: 'Build interactive dashboards using Tableau and Power BI. Write complex SQL queries for retention and conversion funnels. Partner with product managers to deliver data-backed recommendations.',
      qualifications: 'Analytical mindset with expertise in SQL, Power BI, Python or R, and spreadsheet modeling.',
      benefits: 'Free Spotify Premium for life, 6 months parental leave, worldwide work-from-anywhere policy.',
      location: 'New York, NY / Remote',
      salary: '$95,000 - $125,000 / yr',
      min_salary: 95000,
      max_salary: 125000,
      experience: '0-2 years',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Data Analytics',
      required_skills: JSON.stringify(['SQL', 'Data Analytics', 'Power BI', 'Tableau', 'Python', 'Communication']),
      preferred_education: 'Any Bachelor Degree (CS, Economics, Statistics, Business)',
      deadline: '2026-12-05'
    },
    {
      company_id: 3, // AWS
      title: 'Cloud DevOps Associate Engineer',
      description: 'Automate infrastructure provisioning, container deployments, and monitoring across multi-region AWS cloud environments.',
      responsibilities: 'Manage Docker containers and Kubernetes clusters. Configure CI/CD deployment pipelines using GitHub Actions. Monitor cloud server health and automate incident recovery.',
      qualifications: 'Hands-on knowledge of Linux, Docker, AWS fundamentals, and scripting in Python or Bash.',
      benefits: 'Amazon employee discounts, healthcare, education reimbursement, certification sponsorship.',
      location: 'Seattle, WA / Remote',
      salary: '$115,000 - $145,000 / yr',
      min_salary: 115000,
      max_salary: 145000,
      experience: '1-2 years',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'Cloud Computing',
      required_skills: JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'Cloud Computing', 'Python', 'Git & GitHub']),
      preferred_education: 'B.Tech / B.E. / BCA / MCA',
      deadline: '2026-12-20'
    },
    {
      company_id: 10, // Cloudflare
      title: 'Cybersecurity Associate Analyst',
      description: 'Help defend global web properties from emerging DDoS threats, botnets, and zero-day vulnerabilities.',
      responsibilities: 'Monitor intrusion detection systems and edge traffic anomalies. Conduct vulnerability assessments and assist in forensic analysis. Write security rules and documentation.',
      qualifications: 'Knowledge of networking protocols (TCP/IP, DNS, HTTP/S), Linux command line, and cybersecurity fundamentals.',
      benefits: 'Health, dental, vision, commuter benefits, annual education budget, wellness days.',
      location: 'Austin, TX / Remote',
      salary: '$100,000 - $130,000 / yr',
      min_salary: 100000,
      max_salary: 130000,
      experience: '0-2 years',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Cybersecurity',
      required_skills: JSON.stringify(['Cybersecurity', 'Network Security', 'Python', 'Problem Solving']),
      preferred_education: 'Degree in Cybersecurity, Information Systems, or CS',
      deadline: '2026-11-28'
    },
    {
      company_id: 6, // Adobe
      title: 'UI/UX Frontend Specialist',
      description: 'Craft elegant, accessible, and delightful interactive user experiences across Adobe creative cloud web tools.',
      responsibilities: 'Translate high-fidelity Figma mockups into pixel-perfect React components. Build accessible design systems with Tailwind CSS. Conduct usability tests and optimize web rendering performance.',
      qualifications: 'Strong UI/UX design sense paired with deep React, JavaScript, HTML5/CSS3, and Figma skills.',
      benefits: 'Adobe Creative Cloud all-apps subscription, sabbaticals, wellness program, flexible hours.',
      location: 'San Jose, CA / Remote',
      salary: '$110,000 - $140,000 / yr',
      min_salary: 110000,
      max_salary: 140000,
      experience: '1-3 years',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'UI/UX & Web Development',
      required_skills: JSON.stringify(['React', 'UI/UX Design', 'Figma', 'HTML5/CSS3', 'Tailwind CSS', 'JavaScript']),
      preferred_education: 'Degree in Design, Human-Computer Interaction, or CS',
      deadline: '2026-12-10'
    },
    {
      company_id: 4, // Meta
      title: 'AI/ML Research Engineer (Entry Level)',
      description: 'Work at the frontier of Generative AI, transformer architectures, and computer vision models powering PyTorch ecosystems.',
      responsibilities: 'Train and fine-tune large neural networks using PyTorch and CUDA. Evaluate model accuracy, latency, and resource constraints. Publish technical benchmarks and integrate models with production serving systems.',
      qualifications: 'Solid grasp of Deep Learning, PyTorch, Linear Algebra, and Python.',
      benefits: 'On-site meals, transport subsidies, competitive equity, gym membership, 25 days paid vacation.',
      location: 'Menlo Park, CA / Remote',
      salary: '$145,000 - $180,000 / yr',
      min_salary: 145000,
      max_salary: 180000,
      experience: '0-2 years (Graduates / Master’s encouraged)',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'AI/ML',
      required_skills: JSON.stringify(['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Data Science']),
      preferred_education: 'B.Tech / M.S. / Ph.D in Computer Science or AI',
      deadline: '2026-12-01'
    },
    {
      company_id: 9, // Stripe
      title: 'Backend Engineer - Payments Infrastructure',
      description: 'Build fault-tolerant distributed transaction systems handling millions of payment requests per second with 99.999% uptime.',
      responsibilities: 'Write robust backend APIs and idempotent microservices. Design scalable schemas in PostgreSQL and manage distributed caching with Redis. Participate in on-call engineering rotations.',
      qualifications: 'Proficiency in Go, Java, or Node.js. In-depth understanding of ACID properties, SQL, and REST APIs.',
      benefits: 'Global health coverage, home office setup budget, generous parental leave, annual learning stipend.',
      location: 'San Francisco, CA / Remote',
      salary: '$140,000 - $175,000 / yr',
      min_salary: 140000,
      max_salary: 175000,
      experience: '1-3 years',
      experience_years: 1.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Software Development',
      required_skills: JSON.stringify(['Node.js', 'PostgreSQL', 'SQL', 'Redis', 'Git & GitHub', 'Problem Solving']),
      preferred_education: 'B.Tech / B.E. in CS / IT',
      deadline: '2026-11-20'
    },
    {
      company_id: 11, // TechNova
      title: 'Junior React & Node.js Developer',
      description: 'Deliver client-facing web applications using the modern MERN / PERN stack in an energetic, collaborative environment.',
      responsibilities: 'Create responsive web pages in React and Tailwind CSS. Implement backend REST controllers using Express.js and PostgreSQL. Write automated unit tests and participate in sprint planning.',
      qualifications: 'Hands-on project experience with React, Node.js, Express, and SQL or MongoDB.',
      benefits: 'Mentorship program, paid certifications, annual team retreat, health insurance.',
      location: 'Bengaluru / Remote',
      salary: '₹6,50,000 - ₹9,50,000 / yr',
      min_salary: 650000,
      max_salary: 950000,
      experience: '0-1 years (Freshers Welcome)',
      experience_years: 0,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Web Development',
      required_skills: JSON.stringify(['React', 'Node.js', 'Express.js', 'JavaScript', 'SQL', 'MongoDB']),
      preferred_education: 'B.Tech / BCA / MCA / B.Sc CS',
      deadline: '2026-12-10'
    },
    {
      company_id: 7, // Salesforce
      title: 'Associate Cloud Solutions Specialist',
      description: 'Configure and extend cloud CRM platforms, building custom integrations, workflow automations, and data sync jobs.',
      responsibilities: 'Develop custom business logic using modern JavaScript and cloud workflows. Guide clients on architectural best practices. Build reports and analytical summaries.',
      qualifications: 'Knowledge of web technologies, JavaScript, SQL, and strong verbal communication.',
      benefits: '1-1-1 Philanthropy time off, extensive wellness program, education grants, matching 401(k).',
      location: 'San Francisco, CA / Remote',
      salary: '$90,000 - $115,000 / yr',
      min_salary: 90000,
      max_salary: 115000,
      experience: '0-2 years',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'Cloud Computing',
      required_skills: JSON.stringify(['Cloud Computing', 'JavaScript', 'SQL', 'Communication', 'Problem Solving']),
      preferred_education: 'Bachelor Degree in any STEM or Business field',
      deadline: '2026-12-25'
    },
    {
      company_id: 12, // Nexus Cybernetics
      title: 'Junior Security Operations Engineer',
      description: 'Defend enterprise infrastructure by monitoring SOC alerts, triaging malware indicators, and hardening server endpoints.',
      responsibilities: 'Investigate security alerts in real-time. Conduct regular vulnerability scanning and penetration audits. Automate threat triage playbooks.',
      qualifications: 'Familiarity with security frameworks, network architecture, Linux, and Python scripting.',
      benefits: 'Security certification vouchers (CEH, Security+), comprehensive medical, flexible work options.',
      location: 'New York, NY / Remote',
      salary: '$95,000 - $120,000 / yr',
      min_salary: 95000,
      max_salary: 120000,
      experience: '0-2 years',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'Cybersecurity',
      required_skills: JSON.stringify(['Cybersecurity', 'Network Security', 'Python', 'Linux', 'Communication']),
      preferred_education: 'B.Tech / B.Sc in Information Security or CS',
      deadline: '2026-12-18'
    },
    {
      company_id: 11, // TechNova
      title: 'Python Backend Developer',
      description: 'Build fast, maintainable web services and automated data processing workers using Python and modern frameworks.',
      responsibilities: 'Write clean Python code for business automation. Design REST APIs with authentication and role-based access. Troubleshoot performance bottlenecks.',
      qualifications: 'Proficiency in Python, SQL, REST APIs, and version control with Git.',
      benefits: 'Quarterly bonus, health insurance, flexible working hours, home workstation support.',
      location: 'Hyderabad / Remote',
      salary: '₹7,000,000 - ₹10,50,000 / yr',
      min_salary: 700000,
      max_salary: 1050000,
      experience: '0-2 years (Fresher friendly)',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Software Development',
      required_skills: JSON.stringify(['Python', 'SQL', 'Git & GitHub', 'Problem Solving']),
      preferred_education: 'B.Tech / B.E. / BCA / MCA',
      deadline: '2026-12-30'
    },
    {
      company_id: 1, // Google
      title: 'Mobile Applications Engineer (Android/iOS)',
      description: 'Develop next-generation mobile applications utilizing modern frameworks to deliver fluid, intuitive experiences.',
      responsibilities: 'Build native and cross-platform mobile modules. Optimize memory management and battery efficiency. Collaborate with UX designers on animations and gestures.',
      qualifications: 'Knowledge of Kotlin, Java, Swift, or React Native. Strong UI design intuition.',
      benefits: 'Full benefits package, stock grants, complimentary meals, fitness facility access.',
      location: 'Mountain View, CA / Remote',
      salary: '$130,000 - $160,000 / yr',
      min_salary: 130000,
      max_salary: 160000,
      experience: '1-3 years',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'App Development',
      required_skills: JSON.stringify(['Java', 'JavaScript', 'React', 'UI/UX Design', 'Git & GitHub']),
      preferred_education: 'B.Tech / B.E. in CS / IT',
      deadline: '2026-11-29'
    },
    {
      company_id: 2, // Microsoft
      title: 'Business Intelligence & Data Analyst',
      description: 'Transform complex enterprise sales and product metrics into executive Power BI reports and strategic insights.',
      responsibilities: 'Design and maintain automated ETL data flows. Build high-impact Power BI and Excel dashboards. Run exploratory data analysis on user churn and retention.',
      qualifications: 'Excellence in SQL, Power BI, DAX formulas, and Data Analytics.',
      benefits: 'Microsoft stock, medical, 401(k), paid parental leave, flexible work schedule.',
      location: 'Redmond, WA / Remote',
      salary: '$105,000 - $135,000 / yr',
      min_salary: 105000,
      max_salary: 135000,
      experience: '0-2 years',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Data Analytics',
      required_skills: JSON.stringify(['Power BI', 'SQL', 'Data Analytics', 'Communication', 'Python']),
      preferred_education: 'B.Tech, BBA, B.Sc or related degree',
      deadline: '2026-12-14'
    },
    {
      company_id: 8, // Databricks
      title: 'Data Engineer - Pipeline Systems',
      description: 'Construct resilient batch and streaming data pipelines processing millions of events per second with high reliability.',
      responsibilities: 'Build automated data pipelines in Python and SQL. Optimize storage layouts and database partition schemes. Monitor pipeline SLAs and data quality metrics.',
      qualifications: 'Understanding of SQL, Python, relational databases, and data warehouse patterns.',
      benefits: 'Health, dental, vision, pre-IPO equity, conference travel budget.',
      location: 'San Francisco, CA / Remote',
      salary: '$130,000 - $160,000 / yr',
      min_salary: 130000,
      max_salary: 160000,
      experience: '1-3 years',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'Data Science',
      required_skills: JSON.stringify(['Python', 'SQL', 'PostgreSQL', 'Cloud Computing', 'Git & GitHub']),
      preferred_education: 'B.Tech / M.Tech in CS / Information Systems',
      deadline: '2026-12-22'
    },
    {
      company_id: 3, // AWS
      title: 'DevOps & Site Reliability Engineer',
      description: 'Ensure the resilience, scalability, and security of hyper-scale cloud services through code-driven infrastructure.',
      responsibilities: 'Write Terraform/CloudFormation templates. Implement distributed tracing, alerting, and log analysis. Lead post-mortem root cause investigations.',
      qualifications: 'Solid experience with Docker, Linux system internals, cloud networking, and Python or Go.',
      benefits: 'Comprehensive benefits, employee discount, relocation assistance, certification support.',
      location: 'Seattle, WA / Remote',
      salary: '$125,000 - $155,000 / yr',
      min_salary: 125000,
      max_salary: 155000,
      experience: '1-3 years',
      experience_years: 1.5,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Cloud Computing',
      required_skills: JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'Cloud Computing', 'Python', 'Problem Solving']),
      preferred_education: 'B.Tech / B.E. in Computer Science',
      deadline: '2026-12-12'
    },
    {
      company_id: 5, // Spotify
      title: 'Machine Learning Software Engineer',
      description: 'Develop algorithmic recommendation components that surface the perfect playlist and podcast for every moment.',
      responsibilities: 'Implement machine learning models in Python and C++. Conduct A/B testing on algorithmic recommendation ranking. Optimize offline feature extraction pipelines.',
      qualifications: 'Knowledge of ML fundamentals, recommendation algorithms, Python, and SQL.',
      benefits: 'Spotify Swedish vacation model (30+ days paid leave), global healthcare, music festival tickets.',
      location: 'New York, NY / Remote',
      salary: '$135,000 - $170,000 / yr',
      min_salary: 135000,
      max_salary: 170000,
      experience: '1-3 years',
      experience_years: 1,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'AI/ML',
      required_skills: JSON.stringify(['Python', 'Machine Learning', 'Data Science', 'SQL', 'Git & GitHub']),
      preferred_education: 'B.Tech / M.S. in CS or Machine Learning',
      deadline: '2026-11-26'
    },
    {
      company_id: 11, // TechNova
      title: 'Junior QA & Automation Engineer',
      description: 'Ensure software excellence across web and mobile platforms through automated test scripting and continuous integration.',
      responsibilities: 'Write automated end-to-end tests using JavaScript and Python. Conduct regression and API integration testing. Log and track bugs in Jira.',
      qualifications: 'Familiarity with JavaScript, Python, REST APIs, and software testing principles.',
      benefits: 'Medical insurance, flexible hours, skill enhancement allowances.',
      location: 'Pune / Remote',
      salary: '₹5,50,000 - ₹8,00,000 / yr',
      min_salary: 550000,
      max_salary: 800000,
      experience: '0-1 years (Freshers Welcome)',
      experience_years: 0,
      job_type: 'Full-time',
      work_mode: 'Remote',
      industry: 'Software Development',
      required_skills: JSON.stringify(['JavaScript', 'Python', 'Git & GitHub', 'Problem Solving']),
      preferred_education: 'B.Tech / BCA / B.Sc CS',
      deadline: '2026-12-08'
    },
    {
      company_id: 6, // Adobe
      title: 'Product Growth & Marketing Associate',
      description: 'Drive user acquisition and conversion for creative cloud products through digital experimentation and analytical funnels.',
      responsibilities: 'Analyze campaign metrics and user engagement. Create data-driven growth hypotheses. Coordinate with product and creative teams on marketing assets.',
      qualifications: 'Strong communication skills, familiarity with digital marketing, Google Analytics, and Data Analytics.',
      benefits: 'Creative cloud subscription, health insurance, paid volunteer days, stock plan.',
      location: 'San Jose, CA / Remote',
      salary: '$80,000 - $105,000 / yr',
      min_salary: 80000,
      max_salary: 105000,
      experience: '0-2 years',
      experience_years: 0.5,
      job_type: 'Full-time',
      work_mode: 'Hybrid',
      industry: 'Marketing',
      required_skills: JSON.stringify(['Communication', 'Data Analytics', 'Problem Solving', 'Leadership']),
      preferred_education: 'Bachelor Degree in Marketing, Business, or Communications',
      deadline: '2026-12-31'
    }
  ];

  const insertJob = db.db.prepare(`
    INSERT INTO Jobs (
      company_id, title, description, responsibilities, qualifications, benefits,
      location, salary, min_salary, max_salary, experience, experience_years,
      job_type, work_mode, industry, required_skills, preferred_education, deadline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const j of jobs) {
    insertJob.run(
      j.company_id, j.title, j.description, j.responsibilities, j.qualifications, j.benefits,
      j.location, j.salary, j.min_salary, j.max_salary, j.experience, j.experience_years,
      j.job_type, j.work_mode, j.industry, j.required_skills, j.preferred_education, j.deadline
    );
  }
  console.log(`✓ Inserted ${jobs.length} jobs.`);

  // 4. Seed Internships (22 realistic internships)
  const internships = [
    {
      company_id: 1, // Google
      title: 'Software Engineering Summer Intern',
      domain: 'Software Development',
      description: 'Work on real-world production engineering projects alongside world-class Google mentors. Build scalable software impacting millions.',
      responsibilities: 'Design and implement features in C++, Java, or Python. Participate in code reviews and tech talks. Present final project to engineering leads.',
      qualifications: 'Currently enrolled in an undergraduate or master degree in Computer Science or related STEM field graduating between 2026 and 2028.',
      benefits: 'Top-tier monthly stipend, corporate housing subsidy, complimentary gourmet meals, Google Swag.',
      location: 'Mountain View, CA / Remote',
      stipend: '$8,200 / month',
      duration: '3 Months (Summer)',
      internship_type: 'Summer',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['Python', 'Java', 'C++', 'Data Structures', 'Problem Solving']),
      start_date: '2026-06-01',
      deadline: '2026-11-15'
    },
    {
      company_id: 8, // Databricks
      title: 'Data Science & Machine Learning Intern',
      domain: 'Data Science',
      description: 'Apply statistical analysis and machine learning algorithms to big data benchmark datasets.',
      responsibilities: 'Build Jupyter notebooks analyzing ML performance. Implement feature engineering scripts in Python & Pandas. Assist in tuning hyper-parameters.',
      qualifications: 'Enrolled in B.Tech/B.S. or M.S. in Computer Science, Data Science, or Mathematics. Hands-on experience with Python and SQL.',
      benefits: 'High stipend, 1-on-1 industry mentorship, equipment provided (MacBook Pro), full-time return offer potential.',
      location: 'San Francisco, CA / Remote',
      stipend: '$7,800 / month',
      duration: '6 Months',
      internship_type: 'Regular',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Python', 'Machine Learning', 'Data Science', 'SQL', 'Pandas']),
      start_date: '2026-05-15',
      deadline: '2026-11-30'
    },
    {
      company_id: 2, // Microsoft
      title: 'Frontend Web Development Intern',
      domain: 'Web Development',
      description: 'Contribute to Microsoft 365 or Azure web interfaces using React, TypeScript, and accessible UI patterns.',
      responsibilities: 'Build responsive UI components in React. Implement accessibility standards (WCAG). Write unit and integration tests.',
      qualifications: 'Passion for web development with practical knowledge of HTML5, CSS3, JavaScript, and React.',
      benefits: 'Competitive stipend, Microsoft mentor, social hackathons, Xbox game pass.',
      location: 'Redmond, WA / Remote',
      stipend: '$7,500 / month',
      duration: '3 Months (Summer)',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['React', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS', 'Git & GitHub']),
      start_date: '2026-06-15',
      deadline: '2026-12-01'
    },
    {
      company_id: 11, // TechNova
      title: 'Full-Stack Web Development Intern',
      domain: 'Web Development',
      description: 'Gain practical experience building real-world SaaS applications with React, Node.js, Express, and SQL.',
      responsibilities: 'Develop frontend user interfaces and connect backend REST APIs. Work directly with senior full-stack developers. Participate in daily standups.',
      qualifications: 'Knowledge of JavaScript, React basics, and database concepts. Eagerness to learn rapidly.',
      benefits: 'Certificate of completion, stipend, PPO (Pre-Placement Offer) opportunity for top performers.',
      location: 'Bengaluru / Remote',
      stipend: '₹25,000 / month',
      duration: '6 Months',
      internship_type: 'Regular',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['React', 'Node.js', 'Express.js', 'JavaScript', 'SQL']),
      start_date: '2026-04-01',
      deadline: '2026-12-10'
    },
    {
      company_id: 5, // Spotify
      title: 'Data Analytics & BI Intern',
      domain: 'Data Analytics',
      description: 'Analyze podcast and music streaming telemetry to uncover playlist engagement trends.',
      responsibilities: 'Write SQL queries to extract cohort metrics. Create visual dashboards in Tableau and Power BI. Deliver weekly insights to product leads.',
      qualifications: 'Strong curiosity about data, coursework in SQL, Statistics, and visualization tools.',
      benefits: 'Competitive stipend, free Spotify Premium, speaker series with music tech pioneers.',
      location: 'New York, NY / Remote',
      stipend: '$6,800 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['SQL', 'Power BI', 'Tableau', 'Data Analytics', 'Communication']),
      start_date: '2026-06-01',
      deadline: '2026-11-20'
    },
    {
      company_id: 3, // AWS
      title: 'Cloud DevOps & Infrastructure Intern',
      domain: 'Cloud Computing',
      description: 'Learn modern DevOps practices by building containerized microservices and automated deployment scripts on AWS.',
      responsibilities: 'Create Docker containers for test applications. Write automated deployment scripts in Python. Monitor cloud performance metrics.',
      qualifications: 'Students pursuing B.Tech/BCA/MCA with interest in Cloud Computing, Linux, and Docker.',
      benefits: 'AWS certification vouchers, hands-on cloud credits, dedicated engineering buddy.',
      location: 'Seattle, WA / Remote',
      stipend: '$7,200 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['AWS', 'Docker', 'Cloud Computing', 'Python', 'Git & GitHub']),
      start_date: '2026-05-20',
      deadline: '2026-12-05'
    },
    {
      company_id: 12, // Nexus Cybernetics
      title: 'Cybersecurity Analyst Trainee',
      domain: 'Cybersecurity',
      description: 'Triage security events, identify phishing patterns, and assist in security architecture audits.',
      responsibilities: 'Analyze log data for suspicious signatures. Participate in tabletop incident simulation exercises. Write documentation for security policies.',
      qualifications: 'Knowledge of networking basics, common vulnerabilities (OWASP Top 10), and operating system security.',
      benefits: 'Stipend, hands-on training with enterprise security suites, potential full-time conversion.',
      location: 'New York, NY / Remote',
      stipend: '$5,500 / month',
      duration: '4 Months',
      internship_type: 'Winter',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['Cybersecurity', 'Network Security', 'Python', 'Problem Solving']),
      start_date: '2026-04-15',
      deadline: '2026-11-25'
    },
    {
      company_id: 6, // Adobe
      title: 'UI/UX Design & Prototyping Intern',
      domain: 'UI/UX',
      description: 'Work with Adobe product design leads to create wireframes, prototypes, and user test workflows for new creative features.',
      responsibilities: 'Design interactive prototypes in Figma. Conduct user interviews and summarize UX feedback. Collaborate with frontend engineers.',
      qualifications: 'Portfolio demonstrating UI/UX design projects, Figma mastery, and understanding of design principles.',
      benefits: 'Stipend, Adobe CC all-apps access, design portfolio reviews with industry directors.',
      location: 'San Jose, CA / Remote',
      stipend: '$6,500 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['UI/UX Design', 'Figma', 'HTML5/CSS3', 'Communication']),
      start_date: '2026-06-01',
      deadline: '2026-12-15'
    },
    {
      company_id: 4, // Meta
      title: 'Artificial Intelligence & NLP Intern',
      domain: 'AI/ML',
      description: 'Conduct experiments in natural language processing and fine-tune open-source LLM architectures.',
      responsibilities: 'Prepare clean datasets for NLP model training. Run evaluation metrics on text generation. Implement automated benchmark scripts in PyTorch.',
      qualifications: 'Strong coding skills in Python, coursework in Machine Learning or NLP, and familiarity with PyTorch.',
      benefits: 'Competitive stipend, Meta tech equipment, publication support, mentorship from AI research scientists.',
      location: 'Menlo Park, CA / Remote',
      stipend: '$8,500 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Data Science']),
      start_date: '2026-05-25',
      deadline: '2026-11-18'
    },
    {
      company_id: 11, // TechNova
      title: 'Python Development Intern',
      domain: 'Software Development',
      description: 'Write backend business logic, automated web scraping utilities, and database integration scripts.',
      responsibilities: 'Develop modular Python scripts for client applications. Write unit tests to maintain code quality. Collaborate via GitHub pull requests.',
      qualifications: 'Good grasp of Python syntax, object-oriented concepts, and basic SQL.',
      benefits: 'Monthly stipend, practical live-project experience, certificate of achievement.',
      location: 'Hyderabad / Remote',
      stipend: '₹20,000 / month',
      duration: '3 Months',
      internship_type: 'Regular',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Python', 'SQL', 'Git & GitHub', 'Problem Solving']),
      start_date: '2026-04-10',
      deadline: '2026-12-20'
    },
    {
      company_id: 9, // Stripe
      title: 'Backend Software Engineering Intern',
      domain: 'Software Development',
      description: 'Build backend APIs and microservices powering reliable financial transactions across continents.',
      responsibilities: 'Write robust backend endpoints in Node.js or Java. Implement test suites and error handling. Participate in engineering code reviews.',
      qualifications: 'Solid grasp of data structures, algorithms, SQL, and backend web concepts.',
      benefits: 'High stipend, equipment budget, 1:1 mentorship from senior software engineers.',
      location: 'San Francisco, CA / Remote',
      stipend: '$8,000 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Node.js', 'SQL', 'PostgreSQL', 'Git & GitHub', 'Problem Solving']),
      start_date: '2026-06-01',
      deadline: '2026-11-22'
    },
    {
      company_id: 10, // Cloudflare
      title: 'Systems & Network Engineering Intern',
      domain: 'Cybersecurity',
      description: 'Explore edge compute networks, DNS routing, and internet security protocols at planetary scale.',
      responsibilities: 'Build network monitoring tools in Go or Python. Analyze packet traces and benchmark latency. Document technical architectures.',
      qualifications: 'Familiarity with networking (DNS, TLS, HTTP), operating systems, and Python or Go.',
      benefits: 'Competitive stipend, Cloudflare gear, hands-on edge routing experience.',
      location: 'Austin, TX / Remote',
      stipend: '$6,900 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['Cybersecurity', 'Network Security', 'Python', 'Problem Solving']),
      start_date: '2026-06-01',
      deadline: '2026-12-05'
    },
    {
      company_id: 7, // Salesforce
      title: 'Digital Marketing & Community Intern',
      domain: 'Marketing',
      description: 'Support student developer programs, manage community social campaigns, and analyze webinar participation metrics.',
      responsibilities: 'Write technical blogs and community tutorials. Track user engagement using analytics dashboards. Coordinate virtual developer meetups.',
      qualifications: 'Strong communication skills, interest in developer communities and digital marketing.',
      benefits: 'Monthly stipend, mentorship, Salesforce Trailhead badges and certification access.',
      location: 'San Francisco, CA / Remote',
      stipend: '$5,200 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Communication', 'Leadership', 'Data Analytics']),
      start_date: '2026-05-15',
      deadline: '2026-12-15'
    },
    {
      company_id: 11, // TechNova
      title: 'Mobile App Development Intern (Flutter / React Native)',
      domain: 'App Development',
      description: 'Build cross-platform mobile apps with engaging user animations and offline-first database synchronization.',
      responsibilities: 'Develop mobile screens and interactive state managers. Connect REST endpoints to mobile views. Test mobile builds on iOS and Android devices.',
      qualifications: 'Experience with JavaScript, React, or Dart. Creative drive to build smooth mobile interactions.',
      benefits: 'Stipend, live app published on Play Store, internship certificate.',
      location: 'Bengaluru / Remote',
      stipend: '₹22,000 / month',
      duration: '6 Months',
      internship_type: 'Regular',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['JavaScript', 'React', 'UI/UX Design', 'Git & GitHub']),
      start_date: '2026-04-15',
      deadline: '2026-12-25'
    },
    {
      company_id: 8, // Databricks
      title: 'Data Analytics Engineering Intern',
      domain: 'Data Analytics',
      description: 'Transform raw cloud telemetry into clean, dimensional data models and interactive Power BI dashboards.',
      responsibilities: 'Write transformation queries in SQL. Build visual dashboards for team KPIs. Validate data integrity across pipelines.',
      qualifications: 'Good proficiency with SQL, Power BI, and analytical problem solving.',
      benefits: 'Top stipend, Databricks certification, flexible working hours.',
      location: 'San Francisco, CA / Remote',
      stipend: '$7,000 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['SQL', 'Power BI', 'Data Analytics', 'Python']),
      start_date: '2026-06-01',
      deadline: '2026-12-01'
    },
    {
      company_id: 1, // Google
      title: 'AI & Machine Learning Research Intern',
      domain: 'AI/ML',
      description: 'Explore neural network architectures and multimodal foundational models alongside Google Research teams.',
      responsibilities: 'Run model training experiments in TensorFlow and JAX. Analyze training loss and benchmark generalization.',
      qualifications: 'Strong coding background in Python, linear algebra, and machine learning fundamentals.',
      benefits: 'Premium stipend, housing support, Google research mentor, computing cluster credits.',
      location: 'Mountain View, CA / Remote',
      stipend: '$8,600 / month',
      duration: '3 Months (Summer)',
      internship_type: 'Summer',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning']),
      start_date: '2026-06-01',
      deadline: '2026-11-28'
    },
    {
      company_id: 2, // Microsoft
      title: 'Cloud Security & Compliance Intern',
      domain: 'Cybersecurity',
      description: 'Assist in vulnerability management and automated compliance verification across Azure infrastructure.',
      responsibilities: 'Conduct automated security scans. Review IAM permission configurations. Write audit automation scripts in Python.',
      qualifications: 'Familiarity with cloud security, networking concepts, and scripting.',
      benefits: 'Microsoft stipend, certification vouchers, 1-on-1 career coaching.',
      location: 'Redmond, WA / Remote',
      stipend: '$7,400 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Cybersecurity', 'Cloud Computing', 'Python', 'Problem Solving']),
      start_date: '2026-06-15',
      deadline: '2026-12-10'
    },
    {
      company_id: 6, // Adobe
      title: 'Digital Marketing & Content Strategy Intern',
      domain: 'Marketing',
      description: 'Craft social media campaigns, track conversion funnels, and assist in creative growth initiatives.',
      responsibilities: 'Analyze campaign CTR and retention. Draft creative newsletters and tutorials. Assist community managers.',
      qualifications: 'Enthusiasm for digital storytelling, communication skills, and basic data analytics.',
      benefits: 'Monthly stipend, Adobe CC membership, creative showcase.',
      location: 'San Jose, CA / Remote',
      stipend: '$5,400 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Communication', 'Data Analytics', 'Leadership']),
      start_date: '2026-06-01',
      deadline: '2026-12-15'
    },
    {
      company_id: 11, // TechNova
      title: 'Frontend React Developer Intern',
      domain: 'Web Development',
      description: 'Develop responsive and modular web interfaces using React, Vite, and Tailwind CSS for client portals.',
      responsibilities: 'Implement UI components from Figma specs. Connect backend REST APIs. Ensure mobile responsive layouts.',
      qualifications: 'Knowledge of HTML, CSS, JavaScript, and React.',
      benefits: 'Stipend, live client portfolio projects, pre-placement offer.',
      location: 'Bengaluru / Remote',
      stipend: '₹22,000 / month',
      duration: '6 Months',
      internship_type: 'Regular',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['React', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS']),
      start_date: '2026-05-01',
      deadline: '2026-12-20'
    },
    {
      company_id: 12, // Nexus Cybernetics
      title: 'Penetration Testing & Ethical Hacking Intern',
      domain: 'Cybersecurity',
      description: 'Perform black-box and white-box security audits on simulated web application targets under mentor supervision.',
      responsibilities: 'Identify web application vulnerabilities (SQLi, XSS, CSRF). Write proof-of-concept remediation reports.',
      qualifications: 'Understanding of web security, Linux, and ethical hacking methodologies.',
      benefits: 'Monthly stipend, hands-on lab access, security training certification.',
      location: 'New York, NY / Remote',
      stipend: '$5,800 / month',
      duration: '4 Months',
      internship_type: 'Winter',
      work_mode: 'Remote',
      required_skills: JSON.stringify(['Cybersecurity', 'Network Security', 'Linux', 'Problem Solving']),
      start_date: '2026-04-01',
      deadline: '2026-11-30'
    },
    {
      company_id: 5, // Spotify
      title: 'User Experience & Product Design Intern',
      domain: 'UI/UX',
      description: 'Design intuitive audio navigation and interactive playlist features for millions of mobile and web listeners.',
      responsibilities: 'Conduct user research and usability testing. Create interactive design prototypes in Figma.',
      qualifications: 'Portfolio demonstrating UI/UX principles, wireframing, and Figma proficiency.',
      benefits: 'Competitive stipend, free Spotify subscription, design masterclasses.',
      location: 'New York, NY / Remote',
      stipend: '$6,600 / month',
      duration: '3 Months',
      internship_type: 'Summer',
      work_mode: 'Hybrid',
      required_skills: JSON.stringify(['UI/UX Design', 'Figma', 'Communication', 'HTML5/CSS3']),
      start_date: '2026-06-01',
      deadline: '2026-12-05'
    }
  ];

  const insertInternship = db.db.prepare(`
    INSERT INTO Internships (
      company_id, title, domain, description, responsibilities, qualifications, benefits,
      location, stipend, duration, internship_type, work_mode, required_skills, start_date, deadline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const i of internships) {
    insertInternship.run(
      i.company_id, i.title, i.domain, i.description, i.responsibilities, i.qualifications, i.benefits,
      i.location, i.stipend, i.duration, i.internship_type, i.work_mode, i.required_skills, i.start_date, i.deadline
    );
  }
  console.log(`✓ Inserted ${internships.length} internships.`);

  // 5. Seed Demo Users (Student, Fresher, Admin)
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  const insertUser = db.db.prepare(`
    INSERT INTO Users (
      name, email, password, phone, location, education_level, college, graduation_year,
      user_type, role, desired_job_role, desired_internship_role, preferred_industry,
      preferred_location, work_mode, expected_salary, internship_duration, work_type,
      interests, resume_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Demo Student User
  const studentResult = insertUser.run(
    'Aryan Sharma',
    'student@careermatch.ai',
    passwordHash,
    '+91 98765 43210',
    'Bengaluru, India',
    'B.Tech in Computer Science',
    'National Institute of Technology',
    2026,
    'Student',
    'user',
    'Python Developer',
    'Software Engineering Summer Intern',
    'Software Development',
    'Bengaluru',
    'Remote',
    '₹12,00,000 / yr',
    '3-6 Months',
    'Full-time',
    JSON.stringify(['Software Development', 'Data Science', 'Artificial Intelligence', 'Web Development']),
    78
  );
  const studentId = studentResult.lastInsertRowid;

  // Demo Fresher User
  const fresherResult = insertUser.run(
    'Priya Patel',
    'fresher@careermatch.ai',
    passwordHash,
    '+91 91234 56789',
    'Mumbai, India',
    'BCA / MCA',
    'Mumbai University',
    2025,
    'Fresher',
    'user',
    'Data Analyst',
    'Data Analytics & BI Intern',
    'Data Analytics',
    'Mumbai',
    'Hybrid',
    '₹8,00,000 / yr',
    '6 Months',
    'Full-time',
    JSON.stringify(['Data Analytics', 'Data Science', 'Business Analytics']),
    82
  );
  const fresherId = fresherResult.lastInsertRowid;

  // Demo Admin User
  insertUser.run(
    'Administrator',
    'admin@careermatch.ai',
    adminPasswordHash,
    '+1 (555) 987-6543',
    'San Francisco, CA',
    'Master of Science in CS',
    'Stanford University',
    2022,
    'Experienced Professional',
    'admin',
    'Engineering Director',
    'N/A',
    'Technology & AI',
    'Remote',
    '$250,000 / yr',
    'N/A',
    'Full-time',
    JSON.stringify(['Software Development', 'Artificial Intelligence', 'Cloud Computing']),
    95
  );

  console.log('✓ Seeded Demo Users (Student, Fresher, Admin).');

  // 6. Seed UserSkills for Student User
  const userSkills = [
    { name: 'Python', level: 'Advanced' },
    { name: 'SQL', level: 'Advanced' },
    { name: 'React', level: 'Intermediate' },
    { name: 'JavaScript', level: 'Intermediate' },
    { name: 'Machine Learning', level: 'Intermediate' },
    { name: 'Data Science', level: 'Intermediate' },
    { name: 'Git & GitHub', level: 'Advanced' },
    { name: 'Communication', level: 'Advanced' }
  ];

  const insertUserSkill = db.db.prepare(`
    INSERT INTO UserSkills (user_id, skill_id, skill_level)
    SELECT ?, skill_id, ? FROM Skills WHERE skill_name = ?
  `);

  for (const s of userSkills) {
    insertUserSkill.run(studentId, s.level, s.name);
  }

  // Education for student
  db.db.prepare(`
    INSERT INTO Education (user_id, degree, specialization, college, cgpa, graduation_year)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(studentId, 'B.Tech', 'Computer Science and Engineering', 'National Institute of Technology', 8.8, 2026);

  // 7. Seed Sample Applications for Student (Requirement 9 & 10)
  const insertApp = db.db.prepare(`
    INSERT INTO Applications (user_id, opportunity_type, opportunity_id, applied_date, status, interview_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertApp.run(studentId, 'internship', 1, '2026-09-12', 'Under Review', null, 'Applied through CareerMatch AI recommendation. Referral submitted.');
  insertApp.run(studentId, 'job', 3, '2026-09-10', 'Interview', '2026-10-18 14:00', 'Round 2 Technical Interview scheduled for Python & Machine Learning concepts.');
  insertApp.run(studentId, 'job', 1, '2026-09-05', 'Applied', null, 'Submitted resume and portfolio links.');
  insertApp.run(studentId, 'internship', 2, '2026-09-15', 'Shortlisted', '2026-10-22 11:30', 'Selected for technical coding assessment round.');

  // 8. Seed Saved Opportunities for Student
  const insertSaved = db.db.prepare(`
    INSERT INTO SavedJobs (user_id, opportunity_type, opportunity_id)
    VALUES (?, ?, ?)
  `);
  insertSaved.run(studentId, 'job', 2);
  insertSaved.run(studentId, 'internship', 3);

  console.log('🎉 Seeding successfully completed! Database is fully populated with rich realistic data.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

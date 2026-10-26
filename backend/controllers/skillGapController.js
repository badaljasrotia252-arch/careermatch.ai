const db = require('../config/db');

// Standard industry roles taxonomy with required skills and curated learning pathways
const ROLE_TAXONOMY = {
  'Data Analyst': {
    required_skills: ['SQL', 'Python', 'Power BI', 'Tableau', 'Data Analytics', 'Statistics', 'Communication'],
    learning_path: [
      { step: 1, title: 'Advanced SQL Mastery', desc: 'Master window functions, CTEs, self-joins, and complex subqueries.' },
      { step: 2, title: 'Statistical Methods & Probability', desc: 'Understand hypothesis testing, distributions, A/B test analysis.' },
      { step: 3, title: 'Power BI / Tableau Visualizations', desc: 'Create executive dashboards, DAX measures, and drill-through reports.' },
      { step: 4, title: 'Data Cleaning & Wrangling with Pandas', desc: 'Manipulate messy real-world datasets and automate ETL scripts.' },
      { step: 5, title: 'Business Storytelling & Communication', desc: 'Translate quantitative findings into executive summaries and recommendations.' },
      { step: 6, title: 'Build 2 Production Data Analytics Projects', desc: 'Publish interactive Tableau/Power BI portfolios with real Kaggle data.' }
    ]
  },
  'Full Stack Developer': {
    required_skills: ['React', 'JavaScript', 'Node.js', 'Express.js', 'SQL', 'MongoDB', 'Git & GitHub', 'HTML5/CSS3'],
    learning_path: [
      { step: 1, title: 'Modern React & State Architecture', desc: 'Hooks, Context API, component modularity, and client-side routing.' },
      { step: 2, title: 'RESTful API Engineering with Express.js', desc: 'Idempotent endpoints, middleware authentication, and error propagation.' },
      { step: 3, title: 'Relational Database Schema Design', desc: 'Normalization, foreign key constraints, indexes, and ACID guarantees.' },
      { step: 4, title: 'Full-Stack Security & JWT Auth', desc: 'Bcrypt hashing, protected routes, CORS, and token refresh patterns.' },
      { step: 5, title: 'Containerization & Docker Basics', desc: 'Write multi-stage Dockerfiles and containerize client-server stacks.' },
      { step: 6, title: 'Deploy Live Cloud Application', desc: 'Ship a responsive full-stack platform to Render/Vercel with CI/CD.' }
    ]
  },
  'Python Developer': {
    required_skills: ['Python', 'SQL', 'Git & GitHub', 'REST API', 'Data Structures', 'Problem Solving'],
    learning_path: [
      { step: 1, title: 'Object-Oriented & Functional Python', desc: 'Decorators, generators, context managers, and memory management.' },
      { step: 2, title: 'Web Frameworks (FastAPI / Django)', desc: 'Async endpoints, ORM modeling, Pydantic validation, and API specs.' },
      { step: 3, title: 'Data Structures & Algorithmic Complexity', desc: 'Graphs, trees, hashing, binary search, and LeetCode problem solving.' },
      { step: 4, title: 'Database Optimization in SQL', desc: 'Query plans, connection pooling, indexing, and schema migrations.' },
      { step: 5, title: 'Automated Unit & Integration Testing', desc: 'PyTest fixtures, mocking external APIs, and test coverage.' },
      { step: 6, title: 'Build Scalable Microservices System', desc: 'Deploy an event-driven worker with Redis queue and background tasks.' }
    ]
  },
  'Machine Learning Engineer': {
    required_skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Data Science', 'SQL'],
    learning_path: [
      { step: 1, title: 'Mathematics for Machine Learning', desc: 'Linear algebra, multivariable calculus, and probability distributions.' },
      { step: 2, title: 'Classical ML Algorithms with Scikit-Learn', desc: 'Ensemble methods, Random Forests, XGBoost, and hyperparameter tuning.' },
      { step: 3, title: 'Deep Learning with PyTorch', desc: 'CNNs, RNNs, Attention Mechanisms, and Transformer foundations.' },
      { step: 4, title: 'Feature Engineering & ML Pipelines', desc: 'Handling missing data, one-hot encoding, normalization, and data drift.' },
      { step: 5, title: 'Model Serving & Inference API', desc: 'Serve models via FastAPI, Docker, and evaluate latency vs batching.' },
      { step: 6, title: 'Deploy End-to-End ML System', desc: 'Implement automated model retraining with MLflow and cloud registry.' }
    ]
  },
  'Cloud & DevOps Engineer': {
    required_skills: ['AWS', 'Docker', 'Kubernetes', 'Cloud Computing', 'Linux', 'Git & GitHub', 'Python'],
    learning_path: [
      { step: 1, title: 'Linux Fundamentals & Shell Scripting', desc: 'Process management, bash automation, network ports, and permissions.' },
      { step: 2, title: 'Containerization with Docker', desc: 'Writing minimal container images, volumes, bridge networks, and compose.' },
      { step: 3, title: 'AWS Core Services Mastery', desc: 'EC2, S3, RDS, VPC networking, IAM security policies, and Lambda.' },
      { step: 4, title: 'Kubernetes Cluster Orchestration', desc: 'Deployments, services, ingress controllers, config maps, and autoscaling.' },
      { step: 5, title: 'CI/CD Automation with GitHub Actions', desc: 'Linting, testing, Docker image build, and zero-downtime deployment.' },
      { step: 6, title: 'Infrastructure as Code (Terraform)', desc: 'Declarative cloud provisioning, state management, and modular infrastructure.' }
    ]
  },
  'Cybersecurity Analyst': {
    required_skills: ['Cybersecurity', 'Network Security', 'Python', 'Linux', 'Problem Solving', 'Communication'],
    learning_path: [
      { step: 1, title: 'Networking Architecture (TCP/IP & OSI)', desc: 'Packet inspection with Wireshark, DNS, subnetting, and SSL/TLS.' },
      { step: 2, title: 'Operating Systems & Linux Hardening', desc: 'System log inspection, auditd, firewall rules, and SSH security.' },
      { step: 3, title: 'Web Application Security (OWASP Top 10)', desc: 'SQL injection, XSS, CSRF, broken access control, and sanitization.' },
      { step: 4, title: 'Security Information & Event Management (SIEM)', desc: 'Splunk, Elastic SIEM, alert triage, and threat signature rule creation.' },
      { step: 5, title: 'Python for Security Automation', desc: 'Port scanners, vulnerability scrapers, and automated threat feeds.' },
      { step: 6, title: 'Hands-on Labs on TryHackMe / HackTheBox', desc: 'Solve 20+ CTF challenges and write remediation incident reports.' }
    ]
  },
  'UI/UX Designer': {
    required_skills: ['UI/UX Design', 'Figma', 'HTML5/CSS3', 'Tailwind CSS', 'Communication', 'JavaScript'],
    learning_path: [
      { step: 1, title: 'Design Principles & Visual Hierarchy', desc: 'Typography, grid systems, color psychology, and white space mastery.' },
      { step: 2, title: 'Figma Mastery & Component Systems', desc: 'Auto layout, variables, component variants, and interactive prototyping.' },
      { step: 3, title: 'User Research & Journey Mapping', desc: 'Conducting user interviews, empathy maps, and usability testing.' },
      { step: 4, title: 'Frontend Basics (HTML5 & Tailwind CSS)', desc: 'Understanding CSS flexbox, grid, and how engineers implement designs.' },
      { step: 5, title: 'Design System Documentation', desc: 'Building enterprise design tokens, accessibility specs, and icon kits.' },
      { step: 6, title: 'Case Study Portfolio Development', desc: 'Publish 2 comprehensive product case studies with problem-solution framing.' }
    ]
  }
};

exports.getSkillGap = (req, res) => {
  try {
    let targetRole = req.query.role || '';
    const userId = req.user ? req.user.user_id : null;

    let userSkillsList = [];
    if (userId) {
      const user = db.get('SELECT desired_job_role, desired_internship_role FROM Users WHERE user_id = ?', [userId]);
      if (!targetRole && user) {
        targetRole = user.desired_job_role || user.desired_internship_role || 'Full Stack Developer';
      }

      const skills = db.all(`
        SELECT s.skill_name, us.skill_level
        FROM UserSkills us
        JOIN Skills s ON us.skill_id = s.skill_id
        WHERE us.user_id = ?
      `, [userId]);
      userSkillsList = skills;
    }

    if (!targetRole) {
      targetRole = 'Full Stack Developer';
    }

    // Find closest role in taxonomy
    let matchedRoleKey = Object.keys(ROLE_TAXONOMY).find(
      k => k.toLowerCase() === targetRole.toLowerCase() ||
           targetRole.toLowerCase().includes(k.toLowerCase()) ||
           k.toLowerCase().includes(targetRole.toLowerCase())
    );

    if (!matchedRoleKey) {
      matchedRoleKey = 'Full Stack Developer';
    }

    const roleData = ROLE_TAXONOMY[matchedRoleKey];
    const userSkillNames = new Set(userSkillsList.map(s => s.skill_name.toLowerCase()));

    const currentSkills = [];
    const missingSkills = [];

    roleData.required_skills.forEach(reqSkill => {
      const reqLower = reqSkill.toLowerCase();
      let hasIt = false;
      for (const uSkill of userSkillNames) {
        if (uSkill.includes(reqLower) || reqLower.includes(uSkill)) {
          hasIt = true;
          break;
        }
      }
      if (hasIt) {
        currentSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const total = roleData.required_skills.length;
    const progressScore = Math.round((currentSkills.length / (total || 1)) * 100);

    return res.json({
      target_role: matchedRoleKey,
      available_roles: Object.keys(ROLE_TAXONOMY),
      current_skills: currentSkills,
      missing_skills: missingSkills,
      progress_score: progressScore,
      total_required: total,
      learning_path: roleData.learning_path
    });
  } catch (error) {
    console.error('getSkillGap error:', error);
    return res.status(500).json({ error: 'Failed to compute skill gap analysis.' });
  }
};

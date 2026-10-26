/**
 * CareerMatch AI - AI Career Assistant (CareerMate AI)
 * Context-aware advisory assistant with deep career guidance,
 * tailored role roadmaps, and profile-based recommendations.
 */

function generateCareerAdvice(userMessage, userProfile = {}, currentSkills = [], availableJobs = [], availableInternships = []) {
  const query = (userMessage || '').toLowerCase().trim();
  const userName = userProfile.name ? userProfile.name.split(' ')[0] : 'there';
  const userSkillNames = currentSkills.map(s => (s.skill_name || s).toLowerCase());
  const userRole = userProfile.desired_job_role || 'Software Engineer';

  // 1. "Which jobs are suitable for my skills?" / "What jobs should I apply for?"
  if (query.includes('which jobs') || query.includes('suitable for my skills') || query.includes('what jobs should i apply') || query.includes('job suggestions')) {
    if (userSkillNames.length === 0) {
      return {
        reply: `Hello ${userName}! 👋 To give you exact matching jobs, please add your skills in your **Profile Setup** (like Python, React, SQL, or Java). 

Based on current high-demand market trends, here are 3 hot roles suitable for tech freshers:
1. **Full-Stack Developer** (React, Node.js, SQL, REST APIs)
2. **Data Analyst / BI Associate** (Python, SQL, Power BI, Excel)
3. **Cloud & DevOps Associate** (Docker, Linux, AWS, CI/CD)

Head over to the **Recommendations** tab anytime to view your live AI compatibility score for each open position!`,
        suggestions: ['What internships should I apply for?', 'What skills should I learn for Data Science?', 'How can I improve my resume?']
      };
    }

    // Find top matching jobs from availableJobs
    const matchingJobs = availableJobs.slice(0, 3).map(j => `• **${j.title}** at **${j.company_name}** (${j.location} • ${j.work_mode})`);
    return {
      reply: `Based on your skillset (${userSkillNames.slice(0, 5).join(', ')}), here are the top opportunities aligned with your profile:

${matchingJobs.length > 0 ? matchingJobs.join('\n') : '• Full-Stack Engineer\n• Python & Cloud Developer\n• Associate Data Scientist'}

💡 **Strategic Advice**: You have a strong core in **${userSkillNames[0] || 'programming'}**. Pairing it with **Cloud (AWS/Docker)** and **System Design basics** will put you in the top 10% of applicants!`,
      suggestions: ['Why am I not getting shortlisted?', 'How can I improve my resume?', 'What skills should I learn for Data Science?']
    };
  }

  // 2. "What skills should I learn for Data Science / Data Analytics / AI?"
  if (query.includes('data science') || query.includes('data analytics') || query.includes('machine learning') || query.includes('ai')) {
    return {
      reply: `To excel in **Data Science & AI**, follow this structured industry skill progression:

### 1. Foundational Core
- **Python** (NumPy, Pandas, Vectorized operations)
- **Advanced SQL** (Window functions, CTEs, Joins, Query profiling)
- **Applied Statistics & Probability** (Hypothesis testing, distributions, A/B testing)

### 2. Machine Learning & Modeling
- **Scikit-learn** (Regression, Classification, Random Forests, XGBoost)
- **Model Evaluation** (ROC-AUC, Precision/Recall, Cross-Validation)

### 3. Modern AI & Deep Learning (Bonus)
- **PyTorch or TensorFlow** (Neural Networks, Transformers)
- **LLM Prompt Engineering & RAG** (LangChain, Vector DBs)

### 4. Production Deployment & Dashboards
- **Power BI / Tableau** for executive stakeholder reporting
- **FastAPI / Docker** to deploy models as live microservices!

📌 Check out our **Skill Gap Analysis** tab to see your exact personalized roadmap for Data Science!`,
      suggestions: ['What should I learn to become a Data Engineer?', 'Which jobs are suitable for my skills?', 'How can I improve my resume?']
    };
  }

  // 3. "What should I learn to become a Data Engineer?"
  if (query.includes('data engineer') || query.includes('data engineering')) {
    return {
      reply: `Here is the comprehensive **Data Engineer Career Roadmap**:

1. **Database Mastery**: PostgreSQL, MySQL, Data Warehousing (Snowflake / BigQuery).
2. **Distributed Computing**: Apache Spark (PySpark), Hadoop ecosystem basics.
3. **Data Pipelines & Orchestration**: Apache Airflow, dbt (data build tool), Kafka for event streaming.
4. **Cloud Infrastructure**: AWS S3/Glue/Redshift or Google Cloud BigQuery.
5. **Data Modeling**: Star schema, Snowflake schema, Slowly Changing Dimensions (SCD).

Would you like to analyze your current skill gap for a Data Engineer role?`,
      suggestions: ['What skills should I learn for Data Science?', 'Why am I not getting shortlisted?', 'How can I improve my resume?']
    };
  }

  // 4. "How can I improve my resume?"
  if (query.includes('improve my resume') || query.includes('resume') || query.includes('cv') || query.includes('ats score')) {
    return {
      reply: `Here are the top 5 high-impact strategies to elevate your resume:

1. **Use the STAR Formula with Metrics**:
   - *Weak*: "Worked on backend APIs for project."
   - *Strong*: "Engineered 12 RESTful microservices using Node.js & Redis, cutting p95 response time by 42% for 5,000+ daily requests."

2. **Pass ATS Screeners**:
   - Keep formatting clean (single column, standard headings: Education, Skills, Experience, Projects).
   - Avoid graphics, multi-column tables, or text within image headers.

3. **Categorize Your Skills**:
   - Group them into: *Languages*, *Frameworks*, *Databases*, and *Developer Tools*.

4. **Live Links**:
   - Provide working GitHub repos and deployed demo URLs for your top 2 projects.

5. **Run our Automated Analyzer**:
   - Head over to the **Resume Analyzer** page right now! You can upload your PDF/DOCX to get your 0–100 ATS score and download an improved, ATS-optimized version with 1 click!`,
      suggestions: ['Why am I not getting shortlisted?', 'Which jobs are suitable for my skills?', 'What internships should I apply for?']
    };
  }

  // 5. "What internships should I apply for?"
  if (query.includes('internship') || query.includes('internships') || query.includes('stipend')) {
    const matchingInternships = availableInternships.slice(0, 3).map(i => `• **${i.title}** at **${i.company_name}** (Stipend: ${i.stipend} • ${i.work_mode})`);
    return {
      reply: `For students and freshers, internships are the #1 catalyst for landing full-time offers! 🚀

Here are top internship openings tailored for you:
${matchingInternships.length > 0 ? matchingInternships.join('\n') : '• Python Development Intern\n• Frontend Developer Intern\n• Data Analyst Intern'}

🔍 **Application Tip**:
- Apply within the first 48 hours of posting.
- Tailor your project highlights to match the internship's required skills.
- Visit the **Find Internships** tab to filter by domain, stipend, and remote status!`,
      suggestions: ['Which jobs are suitable for my skills?', 'How can I improve my resume?', 'Why am I not getting shortlisted?']
    };
  }

  // 6. "Why am I not getting shortlisted?"
  if (query.includes('not getting shortlisted') || query.includes('rejected') || query.includes('no calls') || query.includes('shortlisted')) {
    return {
      reply: `It's common for candidates to feel discouraged, but 85% of rejections come down to 4 fixable factors:

1. **ATS Keyword Mismatch (Primary Filter)**:
   - ATS filters out resumes missing exact keywords from the job description.
   - *Fix*: Tailor your resume summary and skills for every major role you target.

2. **Lack of Verifiable Proof**:
   - Recruiters spend 6–8 seconds per resume. If they don't see clickable GitHub links or deployed live demos, they move on.
   - *Fix*: Pin your top 2 functional projects at the top of your GitHub.

3. **Applying Too Late**:
   - The majority of interview interview slots are filled from candidates who apply in the first 3 days.

4. **Applying to High-Seniority Roles**:
   - Freshers often apply to roles requiring "3+ years". Target Entry-Level, Graduate Engineer Trainee (GET), and Internships.

💡 Use our **Skill Gap Analysis** to bridge missing skills and the **Application Tracker** to monitor your conversion rates!`,
      suggestions: ['How can I improve my resume?', 'Which jobs are suitable for my skills?', 'What skills should I learn for Data Science?']
    };
  }

  // General default fallback
  return {
    reply: `I am **CareerMate AI**, your personal career strategist! 🤖

I can help you with:
- **Opportunity Recommendations**: Matching jobs & internships based on your profile
- **Skill Gap Roadmaps**: What to learn next to reach your dream role
- **ATS Resume Optimization**: How to get past automated screeners and land interviews
- **Interview Preparation**: Key concepts tested in technical and HR rounds

How can I assist you right now, ${userName}?`,
    suggestions: [
      'Which jobs are suitable for my skills?',
      'What skills should I learn for Data Science?',
      'How can I improve my resume?',
      'What internships should I apply for?',
      'Why am I not getting shortlisted?'
    ]
  };
}

module.exports = {
  generateCareerAdvice
};

/**
 * CareerMatch AI - Recommendation Engine
 * Weighted matching algorithm implementing:
 * Match Score =
 *   Skills Match * 40%
 * + Education Match * 15%
 * + Experience Match * 10%
 * + Location Match * 10%
 * + Interest Match * 10%
 * + Job Role Match * 10%
 * + Work Preference Match * 5%
 *
 * Fully modular architecture ready for ML model enhancement (TF-IDF / Cosine Similarity / Embeddings).
 */

const SKILL_LEVEL_WEIGHTS = {
  expert: 1.0,
  advanced: 0.95,
  intermediate: 0.8,
  beginner: 0.6,
  default: 0.75
};

function normalizeText(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9+#]/g, ' ').trim();
}

function tokenize(str) {
  return normalizeText(str).split(/\s+/).filter(Boolean);
}

/**
 * Calculates cosine or Jaccard token overlap between two strings
 */
function tokenSimilarity(str1, str2) {
  const tokens1 = new Set(tokenize(str1));
  const tokens2 = new Set(tokenize(str2));
  if (tokens1.size === 0 || tokens2.size === 0) return 0;
  
  let intersection = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) intersection++;
  }
  const union = new Set([...tokens1, ...tokens2]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Calculates skill compatibility score and lists matching & missing skills
 */
function calculateSkillsMatch(userSkills = [], requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { score: 85, matching: userSkills.map(s => s.skill_name || s), missing: [] };
  }

  const userSkillMap = new Map();
  userSkills.forEach(s => {
    const name = (typeof s === 'string' ? s : s.skill_name || '').toLowerCase().trim();
    const level = (typeof s === 'object' && s.skill_level ? s.skill_level.toLowerCase() : 'intermediate');
    const weight = SKILL_LEVEL_WEIGHTS[level] || SKILL_LEVEL_WEIGHTS.default;
    userSkillMap.set(name, { original: typeof s === 'string' ? s : s.skill_name, weight, level });
  });

  const matching = [];
  const missing = [];
  let totalScoreWeight = 0;

  for (const req of requiredSkills) {
    const reqNormalized = (req || '').toLowerCase().trim();
    let matched = false;
    let matchWeight = 0;
    let matchedName = req;

    // Check exact match
    if (userSkillMap.has(reqNormalized)) {
      matched = true;
      matchWeight = userSkillMap.get(reqNormalized).weight;
      matchedName = userSkillMap.get(reqNormalized).original;
    } else {
      // Check partial/sub-token matches (e.g. "React.js" <-> "React", "Node" <-> "Node.js", "ML" <-> "Machine Learning")
      for (const [userSkillNorm, data] of userSkillMap.entries()) {
        if (
          userSkillNorm.includes(reqNormalized) || 
          reqNormalized.includes(userSkillNorm) ||
          (userSkillNorm === 'ml' && reqNormalized.includes('machine learning')) ||
          (reqNormalized === 'ml' && userSkillNorm.includes('machine learning')) ||
          (userSkillNorm === 'ai' && reqNormalized.includes('artificial intelligence')) ||
          (reqNormalized === 'ai' && userSkillNorm.includes('artificial intelligence'))
        ) {
          matched = true;
          matchWeight = data.weight * 0.9; // slight discount for partial match
          matchedName = req;
          break;
        }
      }
    }

    if (matched) {
      matching.push(matchedName);
      totalScoreWeight += matchWeight;
    } else {
      missing.push(req);
    }
  }

  // Base score from required skills ratio
  const ratio = totalScoreWeight / requiredSkills.length;
  // Scale between 20 (base floor) and 100
  let score = Math.round(ratio * 100);
  if (score > 100) score = 100;
  if (score < 15 && matching.length > 0) score = 25;

  return { score, matching, missing };
}

/**
 * Calculates Education compatibility (15%)
 */
function calculateEducationMatch(user, opp) {
  let score = 75; // baseline
  const eduLevel = (user.education_level || '').toLowerCase();
  const college = (user.college || '').toLowerCase();
  const reqEdu = (opp.preferred_education || opp.qualifications || '').toLowerCase();

  // If user has relevant tech degree
  if (
    eduLevel.includes('bachelor') || 
    eduLevel.includes('b.tech') || 
    eduLevel.includes('be') || 
    eduLevel.includes('master') || 
    eduLevel.includes('mca') || 
    eduLevel.includes('bca') || 
    eduLevel.includes('computer') ||
    eduLevel.includes('engineering')
  ) {
    score = 90;
  }

  // If specific qualification matches
  if (reqEdu && eduLevel) {
    if (reqEdu.includes('bachelor') && eduLevel.includes('bachelor')) score = Math.min(100, score + 10);
    if (reqEdu.includes('master') && eduLevel.includes('master')) score = Math.min(100, score + 10);
  }

  // If user has high CGPA (if user.cgpa provided)
  if (user.cgpa && user.cgpa >= 8.0) {
    score = Math.min(100, score + 5);
  }

  return Math.min(100, Math.max(30, score));
}

/**
 * Calculates Experience compatibility (10%)
 */
function calculateExperienceMatch(user, opp) {
  const userType = (user.user_type || 'Student').toLowerCase();
  const oppExp = (opp.experience || '').toLowerCase();
  const isInternship = !!opp.internship_id || !!opp.duration;

  if (isInternship) {
    if (userType === 'student' || userType === 'fresher') return 100;
    return 85;
  }

  // For jobs:
  if (userType === 'experienced professional') {
    return 95;
  }
  if (userType === 'fresher') {
    if (oppExp.includes('0-1') || oppExp.includes('fresher') || oppExp.includes('entry') || oppExp.includes('0 year')) {
      return 100;
    }
    if (oppExp.includes('1-2') || oppExp.includes('1-3')) {
      return 75;
    }
    return 55;
  }
  // Student looking for jobs:
  if (oppExp.includes('entry') || oppExp.includes('0-1') || oppExp.includes('fresher')) {
    return 90;
  }
  return 60;
}

/**
 * Calculates Location compatibility (10%)
 */
function calculateLocationMatch(user, opp) {
  const oppMode = (opp.work_mode || '').toLowerCase();
  const oppLoc = (opp.location || '').toLowerCase();
  const userLoc = (user.location || '').toLowerCase();
  const userPrefLoc = (user.preferred_location || '').toLowerCase();
  const userWorkMode = (user.work_mode || '').toLowerCase();

  // If remote, it's virtually 100% accessible to everyone
  if (oppMode.includes('remote') || oppLoc.includes('remote') || userWorkMode.includes('remote')) {
    return 100;
  }

  if (userPrefLoc && (oppLoc.includes(userPrefLoc) || userPrefLoc.includes(oppLoc))) {
    return 100;
  }

  if (userLoc && (oppLoc.includes(userLoc) || userLoc.includes(oppLoc))) {
    return 95;
  }

  if (oppMode.includes('hybrid')) {
    return 75;
  }

  return 50;
}

/**
 * Calculates Career Interests compatibility (10%)
 */
function calculateInterestMatch(user, opp) {
  let userInterests = [];
  if (Array.isArray(user.interests)) {
    userInterests = user.interests;
  } else if (typeof user.interests === 'string') {
    try {
      userInterests = JSON.parse(user.interests);
    } catch {
      userInterests = user.interests.split(',').map(s => s.trim());
    }
  }

  if (userInterests.length === 0) return 75;

  const oppContent = `${opp.title || ''} ${opp.domain || ''} ${opp.industry || ''} ${opp.description || ''}`.toLowerCase();

  let matches = 0;
  for (const interest of userInterests) {
    const intNorm = interest.toLowerCase().trim();
    if (oppContent.includes(intNorm)) {
      matches++;
    } else {
      const sim = tokenSimilarity(interest, oppContent);
      if (sim > 0.15) matches += 0.8;
    }
  }

  if (matches >= 2) return 100;
  if (matches >= 1) return 90;
  if (matches > 0) return 75;
  return 45;
}

/**
 * Calculates Desired Job/Internship Role compatibility (10%)
 */
function calculateJobRoleMatch(user, opp) {
  const desiredRole = (opp.internship_id ? user.desired_internship_role : user.desired_job_role) || user.desired_job_role || '';
  if (!desiredRole) return 75;

  const oppTitle = opp.title || '';
  const sim = tokenSimilarity(desiredRole, oppTitle);

  if (sim >= 0.5) return 100;
  if (sim >= 0.3) return 90;
  if (sim > 0.1) return 75;

  // Check substring
  if (oppTitle.toLowerCase().includes(desiredRole.toLowerCase()) || desiredRole.toLowerCase().includes(oppTitle.toLowerCase())) {
    return 95;
  }

  return 55;
}

/**
 * Calculates Work Preference compatibility (5%)
 */
function calculateWorkPreferenceMatch(user, opp) {
  let score = 70;
  const userMode = (user.work_mode || '').toLowerCase();
  const oppMode = (opp.work_mode || '').toLowerCase();
  const userType = (user.work_type || '').toLowerCase();
  const oppType = (opp.job_type || (opp.internship_id ? 'internship' : '')).toLowerCase();

  if (userMode && oppMode && (userMode === oppMode || oppMode.includes(userMode))) {
    score += 15;
  }
  if (userType && oppType && (userType === oppType || oppType.includes(userType))) {
    score += 15;
  }

  return Math.min(100, score);
}

/**
 * Generates an intuitive human-readable explanation of why this match was recommended
 */
function generateRecommendationReason(matchingSkills, missingSkills, opp, user, totalScore) {
  const reasons = [];

  if (matchingSkills.length > 0) {
    const topSkills = matchingSkills.slice(0, 3).join(', ');
    reasons.push(`You match ${matchingSkills.length} required skill${matchingSkills.length > 1 ? 's' : ''} (${topSkills})`);
  }

  if (user.desired_job_role && opp.title && tokenSimilarity(user.desired_job_role, opp.title) > 0.2) {
    reasons.push(`aligns directly with your target role of "${user.desired_job_role}"`);
  }

  if (opp.work_mode === 'Remote') {
    reasons.push('offers flexible 100% remote working options');
  } else if (user.preferred_location && opp.location && opp.location.toLowerCase().includes(user.preferred_location.toLowerCase())) {
    reasons.push(`located in your preferred hub of ${opp.location}`);
  }

  if (reasons.length === 0) {
    reasons.push(`High profile suitability in ${opp.industry || opp.domain || 'technology'}`);
  }

  return `Recommended because: ${reasons.join(' and ')}.`;
}

/**
 * Main recommendation scoring function
 */
function computeOpportunityMatch(user, userSkills, opp) {
  let requiredSkills = [];
  if (Array.isArray(opp.required_skills)) {
    requiredSkills = opp.required_skills;
  } else if (typeof opp.required_skills === 'string') {
    try {
      requiredSkills = JSON.parse(opp.required_skills);
    } catch {
      requiredSkills = opp.required_skills.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  const skillsMatch = calculateSkillsMatch(userSkills, requiredSkills);
  const educationMatch = calculateEducationMatch(user, opp);
  const experienceMatch = calculateExperienceMatch(user, opp);
  const locationMatch = calculateLocationMatch(user, opp);
  const interestMatch = calculateInterestMatch(user, opp);
  const jobRoleMatch = calculateJobRoleMatch(user, opp);
  const workPreferenceMatch = calculateWorkPreferenceMatch(user, opp);

  // Weighted sum formula as per project requirements:
  // Skills Match: 40%
  // Education Match: 15%
  // Experience Match: 10%
  // Location Match: 10%
  // Interest Match: 10%
  // Job Role Match: 10%
  // Work Preference Match: 5%
  const weightedScore = (
    skillsMatch.score * 0.40 +
    educationMatch * 0.15 +
    experienceMatch * 0.10 +
    locationMatch * 0.10 +
    interestMatch * 0.10 +
    jobRoleMatch * 0.10 +
    workPreferenceMatch * 0.05
  );

  const finalScore = Math.min(100, Math.max(15, Math.round(weightedScore)));
  const reason = generateRecommendationReason(skillsMatch.matching, skillsMatch.missing, opp, user, finalScore);

  return {
    match_score: finalScore,
    breakdown: {
      skills_match: skillsMatch.score,
      education_match: educationMatch,
      experience_match: experienceMatch,
      location_match: locationMatch,
      interest_match: interestMatch,
      job_role_match: jobRoleMatch,
      work_preference_match: workPreferenceMatch
    },
    matching_skills: skillsMatch.matching,
    missing_skills: skillsMatch.missing,
    recommendation_reason: reason
  };
}

module.exports = {
  computeOpportunityMatch,
  calculateSkillsMatch,
  tokenSimilarity
};

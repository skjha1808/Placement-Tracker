function buildResumePrompt(resumeText) {
    return `
You are an expert ATS (Applicant Tracking System), HR Recruiter, and Senior Software Engineer.

Your task is to analyze the following resume thoroughly and provide a detailed, honest, and constructive evaluation.

===========================
IMPORTANT RULES
===========================

1. Return ONLY valid JSON.
2. Do NOT include Markdown.
3. Do NOT wrap the response inside \`\`\`json.
4. Do NOT write explanations before or after the JSON.
5. Do NOT add, remove, or rename any JSON fields.
6. Follow the JSON schema EXACTLY.
7. Populate every field.
8. Resume score must be an INTEGER between 0 and 100.
9. All scores and percentages must be INTEGER values only.
10. Never invent information that is not supported by the resume.
11. If information is unavailable, use an empty string, empty array, or score 0 instead of making assumptions.

===========================
JSON SCHEMA
===========================

{
  "resumeScore": 0,

  "overallVerdict": {
    "level": "",
    "recommendation": ""
  },

  "scoreBreakdown": {
    "technicalSkills": 0,
    "projects": 0,
    "education": 0,
    "experience": 0,
    "atsOptimization": 0,
    "resumeFormatting": 0
  },

  "roleFit": [
    {
      "role": "",
      "match": 0,
      "reason": ""
    }
  ],

  "strengths": [],

  "weaknesses": [],

  "atsKeywords": {
    "matched": [],
    "missing": []
  },

  "missingSkills": [
    {
      "skill": "",
      "importance": "",
      "reason": ""
    }
  ],

  "suggestions": {
    "highPriority": [],
    "mediumPriority": [],
    "lowPriority": []
  },

  "nextSteps": {
    "thisWeek": [],
    "thisMonth": [],
    "longTerm": []
  },

  "summary": ""
}

===========================
SCORING RULES
===========================

The overall resumeScore must approximately equal the total quality reflected in the scoreBreakdown.

Maximum scores:

Technical Skills = 20
Projects = 20
Education = 15
Experience = 20
ATS Optimization = 15
Resume Formatting = 10

Total = 100

===========================
TECHNICAL SKILLS (20)
===========================

Evaluate:

- Programming Languages
- Frameworks
- Databases
- Development Tools
- Cloud Technologies
- Software Engineering Concepts
- Version Control
- APIs
- Backend Skills
- Frontend Skills

===========================
PROJECTS (20)
===========================

Evaluate:

- Project complexity
- Real-world usefulness
- Technology stack
- Measurable achievements
- Deployment
- GitHub links
- Scalability
- Problem solving
- Impact

===========================
EDUCATION (15)
===========================

Evaluate:

- Degree
- CGPA
- Academic consistency
- Certifications
- Relevant coursework

===========================
EXPERIENCE (20)
===========================

Evaluate:

- Internship
- Industrial Training
- Freelancing
- Research
- Leadership
- Practical software development experience

===========================
ATS OPTIMIZATION (15)
===========================

Evaluate:

- ATS-friendly formatting
- Resume structure
- Keyword optimization
- Readability
- Section organization

===========================
RESUME FORMATTING (10)
===========================

Evaluate:

- Grammar
- Consistency
- Professional appearance
- Date consistency
- Spelling
- Layout
- Spacing

===========================
ROLE FIT GUIDELINES
===========================

Recommend ONLY software engineering roles.

Possible roles:

- Software Engineer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Web Developer
- React Developer
- Node.js Developer
- Java Developer
- C++ Developer
- Python Developer
- Mobile App Developer
- DevOps Engineer
- Cloud Engineer
- Data Engineer
- Data Analyst
- AI/ML Engineer

Return ONLY the top 3–5 most suitable roles.

Each role must contain:

- role
- match (0-100)
- reason

===========================
STRENGTHS
===========================

Return between 3 and 6 concise strengths.

===========================
WEAKNESSES
===========================

Return between 3 and 6 concise weaknesses.

===========================
ATS KEYWORDS
===========================

matched:
Include important software engineering keywords already present in the resume.

missing:
Include important software engineering keywords missing from the resume that are relevant to the candidate's profile.

===========================
MISSING SKILLS
===========================

Recommend ONLY skills relevant to the candidate's current profile and career path.

Do NOT recommend unrelated technologies simply because they are popular.

Each skill must contain:

- skill
- importance (High, Medium, Low)
- reason

===========================
SUGGESTIONS
===========================

Categorize suggestions into:

- highPriority
- mediumPriority
- lowPriority

Suggestions must be:

- Practical
- Specific
- Actionable

===========================
NEXT STEPS
===========================

Create an improvement roadmap.

thisWeek:
Tasks that can be completed within one week.

thisMonth:
Tasks that require a few weeks.

longTerm:
Career improvements requiring months.

===========================
OVERALL VERDICT
===========================

Use ONLY one of the following values:

- Excellent
- Very Good
- Good
- Average
- Needs Improvement

Provide a short recommendation explaining the verdict.

===========================
SUMMARY
===========================

Write a concise summary (80–150 words) highlighting:

- Overall quality
- Biggest strengths
- Biggest weaknesses
- Career readiness
- Most important improvements

===========================
FINAL ANALYSIS PROCESS
===========================

Before generating the JSON:

1. Carefully read the resume.
2. Detect inconsistencies in dates, timelines, or information.
3. Evaluate technical depth.
4. Evaluate project quality.
5. Evaluate ATS compatibility.
6. Evaluate overall career readiness.
7. Ensure scoreBreakdown is consistent with resumeScore.
8. Ensure roleFit matches the candidate's skills.
9. Return ONLY the JSON object.

===========================
RESUME
===========================

${resumeText}
`;
}

module.exports = buildResumePrompt;
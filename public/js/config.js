/**
 * Portfolio Configuration
 * ========================
 * Edit these values to personalize your portfolio.
 * All other files will pull from this config automatically.
 */

// ========================================
// SKILLS - Edit percentages here
// ========================================
export const SKILLS = {
  Development: {
    PHP: 70,
    "MySQL/MariaDB": 65,
    JavaScript: 75,
    HTML: 85,
    CSS: 80,
  },
  "Systems & Security": {
    "Kali Linux": 70,
    "Linux Administration": 65,
    "Networking Basics": 60,
    "Web Security Fundamentals": 60,
  },
  Tools: {
    Git: 70,
    "LAMP Stack": 65,
    "Terminal Workflows": 80,
  },
};

// ========================================
// SKILL EVIDENCE - Proof points per category (used in Skills section)
// ========================================
export const SKILL_EVIDENCE = {
  Development: [
    "Built OTP email verification flow with rate limiting",
    "Designed MySQL schema for school management system",
  ],
  "Systems & Security": [
    "Configured LAMP stack on multiple Linux distributions",
    "Practiced web vulnerability testing in controlled labs",
  ],
  Tools: [
    "Git workflow with branches, rebasing, and clean commits",
    "Terminal-first development: vim, tmux, shell scripting",
  ],
};

// ========================================
// EVIDENCE - Detailed proof of work per category
// ========================================
export const EVIDENCE = {
  Development: [
    "Built PHP + MySQL modules with structured backend logic",
    "Implemented authentication flows and database integration",
    "Investigated OTP/email delivery issues using logs and config",
  ],
  "Systems & Security": [
    "Daily Kali Linux usage with hands-on troubleshooting",
    "Linux administration: packages, services, permissions",
    "Practical exposure to web security fundamentals in projects",
  ],
  Tools: [
    "Worked in LAMP dev environments",
    "Git-based workflow for code versioning",
    "Terminal-first setup and diagnostics",
  ],
};

// ========================================
// CASE STUDIES - Recruiter-friendly project breakdowns
// ========================================
export const CASE_STUDIES = [
  {
    title: "Secure Auth Starter Kit",
    status: "IN PROGRESS",
    summary: "Security-first authentication foundation for web apps.",
    problem: [
      "Need a reusable auth base with secure defaults.",
      "Prevent common attacks (brute-force, weak passwords, poor logging).",
    ],
    approach: [
      "Password hashing + validation rules.",
      "Rate limiting and lockout logic.",
      "Audit logs for auth events.",
    ],
    stack: ["PHP", "MySQL/MariaDB", "JavaScript", "Linux"],
    outcome: [
      "Reusable auth module structure ready for integration.",
      "Improved security posture with logging and rate limits.",
    ],
    next: [
      "Add email verification + OTP delivery.",
      "Add session hardening and CSRF protections.",
    ],
    links: { repo: null, demo: null },
  },
  {
    title: "Linux Automation Toolkit",
    status: "IN PROGRESS",
    summary:
      "Practical scripts to speed up setup, diagnostics, and maintenance.",
    problem: [
      "Repeated manual Linux setup and troubleshooting is slow.",
      "Need consistent commands and checks.",
    ],
    approach: [
      "Create scripts for installs, cleanup, and diagnostics.",
      "Standardize outputs and logging.",
    ],
    stack: ["Bash", "Linux", "Git"],
    outcome: [
      "Toolkit structure established with reusable script templates.",
      "Faster troubleshooting workflow.",
    ],
    next: [
      "Add interactive flags and safe defaults.",
      "Write documentation and usage examples.",
    ],
    links: { repo: null, demo: null },
  },
];

// ========================================
// MAIN CONFIG OBJECT
// ========================================
export const CONFIG = {
  // Personal Information
  NAME: "Christopher Olabiyi",
  HANDLES: {
    primary: "CODEX",
    secondary: "Michris",
  },
  TITLE:
    "Web Developer | Cybersecurity Student | Cybersecurity Student (BSc track)",
  TAGLINE: "I build secure, practical systems with web tech and Linux.",

  // Contact Information
  EMAIL: "christolabiyi35@gmail.com",
  GITHUB_URL: "https://github.com/Chrinux-AI/",
  LINKEDIN_URL: "https://www.linkedin.com/in/christopher-olabiyi-6662a0383/",
  TWITTER_URL: "https://x.com/christolabiyi35",

  // Assets
  HEADSHOT: "./assets/images/headshot.png",
  TYPING_SVG: "./assets/icons/typing-name.svg",

  // CV Download filename
  CV_FILENAME: "Christopher_Olabiyi_CV.pdf",

  // Typing Animation Phrases (loops forever)
  TYPING_PHRASES: [
    "Christopher Olabiyi",
    "CODEX",
    "Michris",
    "Cybersecurity Student",
    "LAUTECH • BSc (In progress)",
  ],

  // Typing Animation Speeds (ms)
  TYPE_SPEED: 70,
  BACK_SPEED: 40,
  HOLD_FULL: 900,
  HOLD_EMPTY: 250,

  // Contact Email Subject Line
  EMAIL_SUBJECT: "Portfolio Inquiry — Christopher Olabiyi",

  // Education
  UNIVERSITY: "Ladoke Akintola University of Technology (LAUTECH)",
  DEGREE: "BSc (In progress)",
  TRACK: "Cybersecurity Student (Not yet certified)",

  // Terminal commands (for visual effect only)
  TERMINAL_COMMANDS: [
    { cmd: "whoami", output: "codex@cyberdeck" },
    { cmd: "uname -a", output: "Linux cyberdeck 6.1.0-kali #1 SMP x86_64" },
    {
      cmd: "git status",
      output: "On branch main\nnothing to commit, working tree clean",
    },
    {
      cmd: "cat skills.txt",
      output: "PHP | MySQL | JavaScript | Linux | Security",
    },
  ],

  // Reference to SKILLS for backward compatibility
  SKILLS: SKILLS,

  // ========================================
  // PROJECTS DATA
  // Update project repo/demo links after pushing to GitHub.
  // Status options: "PLANNED", "IN PROGRESS", "SHIPPED"
  // Only polished projects appear here. Everything else stays in Roadmap.
  // ========================================
  PROJECTS: [
    {
      title: "Secure Auth Starter Kit",
      subtitle: "Security-First Web Authentication",
      status: "IN PROGRESS",
      problem:
        "Many web applications lack proper security foundations—weak authentication, no rate limiting, and inadequate logging.",
      solution:
        "Building a reusable authentication boilerplate with OTP verification, rate limiting, session management, and comprehensive security logging.",
      stack: ["PHP", "MySQL", "AJAX", "Email API", "Security"],
      github: "",
      demo: "",
    },
    {
      title: "Linux Automation Toolkit",
      subtitle: "System Setup & Workflow Scripts",
      status: "IN PROGRESS",
      problem:
        "Repetitive system configuration and maintenance tasks consume valuable development time.",
      solution:
        "Practical Bash scripts for automated environment setup, system monitoring, and daily workflow automation.",
      stack: ["Bash", "Linux", "Cron", "Shell"],
      github: "",
      demo: "",
    },
    {
      title: "Portfolio Cyberpunk UI",
      subtitle: "This Website",
      status: "SHIPPED",
      problem:
        "Needed a professional portfolio that stands out through clarity and structure, not excessive effects.",
      solution:
        "Built a responsive, accessible portfolio with cyberpunk aesthetics, clean layout, and optimized performance.",
      stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      github: "https://github.com/Chrinux-AI/Portfolio",
      demo: "",
    },
  ],

  // ========================================
  // LEGACY / EARLY WORK
  // Projects being refactored to meet current quality standards
  // ========================================
  LEGACY_PROJECTS: [
    {
      title: "EduSynch",
      subtitle: "School Management System",
      status: "REFACTORING",
      problem:
        "Schools need a unified platform for managing student data, grades, and administrative tasks efficiently.",
      solution:
        "PHP-based school management system. Currently being refactored to improve security patterns and code structure.",
      stack: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
      github: "",
      demo: "",
    },
  ],

  // Education
  EDUCATION: {
    degree: "BSc (In progress)",
    status: "In progress",
    institution: "Ladoke Akintola University of Technology (LAUTECH)",
    track: "Cybersecurity Student (Not yet certified)",
    expectedGraduation: "Expected Graduation Year",
  },
};

// Tools & Environment
export const ENVIRONMENT = {
  "Operating Systems": {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    items: ["Kali Linux", "Ubuntu", "Windows 11"],
  },
  "Development Tools": {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    items: ["VS Code", "Git", "GitHub", "Postman"],
  },
  "Workflow & Automation": {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    items: ["Terminal/Bash", "LAMP Stack", "Docker", "Cron Jobs"],
  },
  "Security Tools": {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    items: ["Wireshark", "Nmap", "Burp Suite", "Metasploit"],
  },
};

// Security Mindset - Principles and approach
export const SECURITY_MINDSET = {
  intro:
    "Security isn't an afterthought—it's built into how I design and develop systems from the start.",
  principles: [
    {
      title: "Defense in Depth",
      description:
        "Layer multiple security controls. If one fails, others remain.",
      icon: "layers",
    },
    {
      title: "Least Privilege",
      description:
        "Grant only the minimum access needed for each role or process.",
      icon: "lock",
    },
    {
      title: "Fail Secure",
      description:
        "When systems fail, they should default to a secure state, not open.",
      icon: "shield",
    },
    {
      title: "Input Validation",
      description:
        "Never trust user input. Validate, sanitize, and escape everything.",
      icon: "filter",
    },
    {
      title: "Audit Everything",
      description:
        "Log security events. You can't respond to what you can't see.",
      icon: "eye",
    },
    {
      title: "Keep It Simple",
      description:
        "Complex systems have more attack surface. Simplicity aids security.",
      icon: "target",
    },
  ],
};

// Make CONFIG available globally for backward compatibility
window.CONFIG = CONFIG;
window.SKILLS = SKILLS;
window.SKILL_EVIDENCE = SKILL_EVIDENCE;
window.EVIDENCE = EVIDENCE;
window.CASE_STUDIES = CASE_STUDIES;
window.ENVIRONMENT = ENVIRONMENT;
window.SECURITY_MINDSET = SECURITY_MINDSET;

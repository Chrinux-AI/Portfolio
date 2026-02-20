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
  "Software / Web": {
    "HTML / CSS": 90,
    JavaScript: 80,
    PHP: 75,
    "Git & GitHub": 85,
  },
  "Systems / Linux": {
    "Linux Administration": 80,
    "Bash / CLI": 85,
    "Networking Fundamentals": 70,
  },
  Cybersecurity: {
    "Web Security Basics": 70,
    "Linux Security": 75,
    "Threat Awareness": 65,
  },
  Tools: {
    "VS Code": 90,
    "Docker (basic)": 60,
    "LAMP Stack": 70,
    "Terminal Workflows": 85,
  },
};

// ========================================
// SKILL EVIDENCE - Proof points per category (used in Skills section)
// ========================================
export const SKILL_EVIDENCE = {
  "Software / Web": [
    "Built OTP email verification flow with rate limiting",
    "Designed MySQL schema for school management system",
    "Built responsive cyberpunk portfolio with vanilla JS",
  ],
  "Systems / Linux": [
    "Configured LAMP stack on multiple Linux distributions",
    "Daily Kali Linux usage with hands-on troubleshooting",
    "Shell scripting for automation and system diagnostics",
  ],
  Cybersecurity: [
    "Practiced web vulnerability testing in controlled labs",
    "Input validation and secure authentication patterns",
  ],
  Tools: [
    "Git workflow with branches, rebasing, and clean commits",
    "Terminal-first development: vim, tmux, shell scripting",
    "Docker basics for containerized dev environments",
  ],
};

// ========================================
// EVIDENCE - Detailed proof of work per category
// ========================================
export const EVIDENCE = {
  "Software / Web": [
    "Built PHP + MySQL modules with structured backend logic",
    "Implemented authentication flows and database integration",
    "Investigated OTP/email delivery issues using logs and config",
  ],
  "Systems / Linux": [
    "Daily Kali Linux usage with hands-on troubleshooting",
    "Linux administration: packages, services, permissions",
    "Shell scripting for automated environment setup",
  ],
  Cybersecurity: [
    "Practical exposure to web security fundamentals in projects",
    "Secure authentication patterns with input validation",
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
    "Software & Hardware Engineer | Cybersecurity Student | Linux Enthusiast",
  TAGLINE: "Building secure, engineered systems across software and hardware.",

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
    "Software Engineer",
    "Hardware Engineer",
    "Cybersecurity Student",
    "Linux Enthusiast",
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

// CIA Triad - Core security model
export const CIA_TRIAD = {
  intro:
    "The CIA Triad is the foundation of information security. Every security decision maps back to protecting one or more of these three pillars.",
  pillars: [
    {
      title: "Confidentiality",
      icon: "lock",
      color: "#00d4ff",
      summary: "Only authorized users can access sensitive data.",
      methods: [
        "Encryption (AES-256, TLS/SSL)",
        "Access control lists (ACL)",
        "Multi-factor authentication (MFA)",
        "Data classification & handling policies",
      ],
      realWorld:
        "Encrypting database credentials in .env files instead of hardcoding them. Using bcrypt for password hashing.",
    },
    {
      title: "Integrity",
      icon: "shield-check",
      color: "#a855f7",
      summary:
        "Data remains accurate, complete, and unaltered by unauthorized parties.",
      methods: [
        "Hashing (SHA-256, MD5 checksums)",
        "Digital signatures",
        "Input validation & sanitization",
        "Version control (Git commit signing)",
      ],
      realWorld:
        "Validating and sanitizing all user input server-side. Using prepared statements to prevent SQL injection.",
    },
    {
      title: "Availability",
      icon: "server",
      color: "#ec4899",
      summary:
        "Systems and data are accessible when needed by authorized users.",
      methods: [
        "Redundancy & backups",
        "DDoS protection",
        "Load balancing",
        "Disaster recovery planning",
      ],
      realWorld:
        "Implementing rate limiting to prevent service abuse. Setting up automated backups and monitoring uptime.",
    },
  ],
};

// Linux Permissions - File security fundamentals
export const LINUX_PERMISSIONS = {
  intro:
    "Linux file permissions are the first line of defense in system security. Understanding chmod, ownership, and permission bits is essential for any developer working with servers.",
  permissionBits: [
    {
      symbol: "r",
      value: 4,
      meaning: "Read",
      desc: "View file contents or list directory",
    },
    {
      symbol: "w",
      value: 2,
      meaning: "Write",
      desc: "Modify file or create/delete in directory",
    },
    {
      symbol: "x",
      value: 1,
      meaning: "Execute",
      desc: "Run file as program or enter directory",
    },
  ],
  commonPermissions: [
    {
      chmod: "755",
      symbolic: "rwxr-xr-x",
      useCase: "Web directories, scripts",
      breakdown: "Owner: full access | Group & Others: read + execute",
      tip: "Standard for public web folders and executable scripts.",
    },
    {
      chmod: "644",
      symbolic: "rw-r--r--",
      useCase: "Config files, HTML/CSS/JS",
      breakdown: "Owner: read + write | Group & Others: read only",
      tip: "Default for most web files. Others can read but not modify.",
    },
    {
      chmod: "700",
      symbolic: "rwx------",
      useCase: "Private scripts, SSH keys dir",
      breakdown: "Owner: full access | Group & Others: no access",
      tip: "Use for sensitive scripts and ~/.ssh directory.",
    },
    {
      chmod: "600",
      symbolic: "rw-------",
      useCase: ".env files, private keys",
      breakdown: "Owner: read + write | Group & Others: no access",
      tip: "Critical for SSH private keys and environment files with secrets.",
    },
    {
      chmod: "444",
      symbolic: "r--r--r--",
      useCase: "Read-only configs, logs",
      breakdown: "Everyone: read only",
      tip: "Prevents accidental modification. Good for production configs.",
    },
    {
      chmod: "000",
      symbolic: "----------",
      useCase: "Locked files",
      breakdown: "No access for anyone (except root)",
      tip: "Nuclear option — only root can access. Use sparingly.",
    },
  ],
  ownershipExamples: [
    {
      command: "chown www-data:www-data /var/www/html",
      desc: "Set web server as owner of web root",
    },
    {
      command: "chown -R $USER:$USER ~/projects",
      desc: "Recursively own your project directory",
    },
    { command: "chmod +x script.sh", desc: "Make a script executable" },
    {
      command: "chmod -R 755 public/",
      desc: "Set standard web permissions recursively",
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
window.CIA_TRIAD = CIA_TRIAD;
window.LINUX_PERMISSIONS = LINUX_PERMISSIONS;

// ========================================
// ENGINEERING DOMAINS — 3 discipline cards
// ========================================
export const ENGINEERING_DOMAINS = [
  {
    id: "software",
    title: "Software Engineering",
    icon: "code",
    animation: "cursor-blink",
    points: [
      "Web Applications",
      "Backend Logic",
      "Systems Programming (Linux-based)",
      "Automation & Tooling",
    ],
  },
  {
    id: "hardware",
    title: "Hardware / Systems Engineering",
    icon: "chip",
    animation: "circuit-trace",
    points: [
      "Embedded Systems (conceptual)",
      "Hardware–Software Interaction",
      "System Diagnostics",
      "Low-level System Understanding",
    ],
  },
  {
    id: "security",
    title: "Cybersecurity & Systems Security",
    icon: "shield",
    animation: "shield-pulse",
    points: [
      "Linux Security",
      "Networking Fundamentals",
      "Threat Awareness",
      "Defensive Security Concepts",
    ],
  },
];
window.ENGINEERING_DOMAINS = ENGINEERING_DOMAINS;

// ========================================
// ENGINEERING ENVIRONMENT — terminal credential blocks
// ========================================
export const ENGINEERING_ENV = {
  system: [
    { label: "OS", value: "Kali Linux / Linux" },
    { label: "Shell", value: "zsh / bash" },
    { label: "Editor", value: "VS Code + Vim" },
  ],
  commands: [
    "python -m venv cyber_venv",
    "source cyber_venv/bin/activate",
    "pip install -r requirements.txt",
  ],
};
window.ENGINEERING_ENV = ENGINEERING_ENV;

# CODEX Portfolio

**🔗 Live Site:** [https://codex-portfolio.vercel.app](https://codex-portfolio.vercel.app)

A modern cyberpunk-themed portfolio website for **Christopher Olabiyi** (CODEX / Michris).

Built with vanilla HTML, CSS, and JavaScript — optimized for Vercel deployment.

---

## 🚀 Quick Start

### Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel Dashboard](https://vercel.com/new)
3. Configure:
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** `public`
4. Deploy!

### Local Development

```bash
# Serve locally (any static server)
npx serve public

# Or use Python
cd public && python -m http.server 3000
```

### Generate PNG Icons (optional)

```bash
# Install librsvg2-bin if needed
sudo apt install librsvg2-bin

# Generate all PNG sizes
./generate-icons.sh
```

---

## ⚙️ Configuration

Edit `public/js/config.js` to update your personal information:

```javascript
const CONFIG = {
  // Personal Information
  NAME: "Christopher Olabiyi",
  HANDLES: { primary: "CODEX", secondary: "Michris" },

  // Contact Information
  EMAIL: "christolabiyi35@gmail.com",
  GITHUB_URL: "https://github.com/Chrinux-AI/",
  LINKEDIN_URL: "https://www.linkedin.com/in/christopher-olabiyi-6662a0383/",

  // Skills with percentage meters (edit these values!)
  SKILLS: {
    development: {
      name: "Development",
      items: [
        { name: "PHP", percent: 70 },
        { name: "JavaScript", percent: 75 },
        // ... add more
      ],
    },
    // ... more categories
  },

  // Projects (UPDATE AFTER PUSHING TO GITHUB!)
  PROJECTS: [
    {
      title: "EduSynch",
      status: "PLANNED", // Options: "PLANNED", "IN PROGRESS", "SHIPPED"
      github: "", // Add repo URL after pushing
      demo: "",
      // ...
    },
  ],
};
```

### 2. Update Projects After Pushing to GitHub

**IMPORTANT**: The project cards have placeholder links. After you push your project repositories:

1. Open `js/config.js`
2. Find the `PROJECTS` array
3. Update each project's `github` and `demo` fields:

```javascript
{
  title: "EduSynch",
  status: "SHIPPED",  // Change from "PLANNED" when complete
  github: "https://github.com/Chrinux-AI/EduSynch",
  demo: "https://chrinux-ai.github.io/EduSynch",
  // ...
}
```

### 3. Add Your Photo

1. Add your photo to `assets/images/headshot.jpg`
2. Recommended size: 400x400px, square format
3. The image will automatically display in the Hero section

### 4. Preview Locally

```bash
# Using Python
python3 -m http.server 8000

# Using PHP
php -S localhost:8000

# Using Node.js (npx)
npx serve
```

Then visit `http://localhost:8000`

## 📁 Project Structure

```text
/
├── index.html              # Main portfolio page
├── cv.html                 # Printable CV/Resume page
├── css/
│   ├── style.css           # Main stylesheet (cyberpunk theme)
│   └── print.css           # Print stylesheet for CV export
├── js/
│   ├── config.js           # Configuration file (EDIT THIS!)
│   ├── script.js           # Main functionality + skill meters
│   └── effects.js          # Cyberpunk animations & canvas
├── assets/
│   ├── images/
│   │   └── headshot.jpg    # Your profile photo
│   └── icons/
│       └── typing-name.svg # Animated typing SVG header
└── README.md               # This file
```

## 🎨 Features

- **Cyberpunk Design**: Dark theme with neon cyan/magenta accents
- **Animated Typing SVG**: Stroke-animated name header with cursor
- **Animated Background**: Canvas-based cyber grid with floating particles
- **Glitch Effect**: Subtle text glitch animation on CODEX handle
- **Skill Percentage Meters**: Animated progress bars with counting numbers
- **3D Tilt Cards**: Interactive project cards with perspective
- **Scanline Overlay**: Retro CRT effect on project cards
- **Project Status Badges**: PLANNED, IN PROGRESS, SHIPPED indicators
- **Terminal Section**: Visual command-line interface
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessible**: ARIA labels, keyboard navigation, reduced motion support
- **Print-Ready CV**: Export to PDF with ATS-friendly formatting

## 🖨️ Exporting CV to PDF

1. Navigate to `cv.html` (or click "View Full CV" on the main page)
2. Click "Print / Export PDF" button
3. In the print dialog:
   - Select "Save as PDF" as destination
   - Use A4 paper size
   - Disable headers and footers
4. Save the file

## 🚀 Deploy to GitHub Pages

### Option 1: User/Organization Site

1. Create a repository named `username.github.io`
2. Push your portfolio files to the `main` branch
3. Your site will be live at `https://username.github.io`

### Option 2: Project Site

1. Create any repository (e.g., `portfolio`)
2. Push your portfolio files
3. Go to **Settings** → **Pages**
4. Under "Source", select `main` branch
5. Click **Save**
6. Your site will be at `https://username.github.io/portfolio`

### GitHub Actions (Optional)

For automatic deployment, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## ✏️ Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --cyan: #00f0ff;
  --magenta: #ff00ff;
  --bg-dark: #0a0a0f;
  /* ... */
}
```

### Skill Percentages

Edit skill meters in `js/config.js`:

```javascript
SKILLS: {
  development: {
    name: "Development",
    icon: "code",
    items: [
      { name: "PHP", percent: 70 },
      { name: "JavaScript", percent: 75 },
      { name: "HTML", percent: 85 },
      // Add or modify skills
    ]
  },
  security: {
    name: "Systems & Security",
    icon: "shield",
    items: [
      { name: "Kali Linux", percent: 70 },
      // ...
    ]
  },
  // Add more categories
}
```

### Terminal Commands

Edit in `js/config.js`:

```javascript
TERMINAL_COMMANDS: [
  { cmd: "whoami", output: "codex@cyberdeck" },
  { cmd: "uname -a", output: "Linux cyberdeck 6.1.0-kali #1 SMP x86_64" },
  // Add your own commands
];
```

### Projects

Edit in `js/config.js`. After pushing repos to GitHub, update the links:

```javascript
PROJECTS: [
  {
    title: "Project Name",
    subtitle: "Project Type",
    status: "PLANNED", // "PLANNED", "IN PROGRESS", or "SHIPPED"
    problem: "What problem does it solve?",
    solution: "How did you solve it?",
    stack: ["Tech1", "Tech2"],
    github: "", // Add repo URL after pushing
    demo: "", // Add demo URL after deployment
  },
  // Add more projects
];
```

## 🔧 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## ✅ QA Checklist

Before deploying, verify the following:

- [ ] **Headshot visible** — Photo loads from `./assets/images/headshot.png`
- [ ] **Typing SVG loops properly** — Text types forward, backspaces, repeats continuously
- [ ] **Skills bars animate once** — Percentages animate on first scroll into view; values match `config.js`
- [ ] **CV prints to PDF correctly** — Uses `print.css`; page breaks respected, no cut-off text
- [ ] **Contact buttons work** — Gmail compose opens, copy email shows toast notification
- [ ] **Mobile nav works** — Hamburger opens/closes, nav closes after link click
- [ ] **`prefers-reduced-motion` respected** — Heavy animations disabled when user preference set

## 📄 License

MIT License - Feel free to use and modify for your own portfolio.

---

Made with ❤️ by Christopher Olabiyi (CODEX)

/**
 * CV PDF Export — Programmatic jsPDF Renderer
 * =============================================
 * Builds the PDF entirely via jsPDF drawing API.
 * NO html2canvas. NO print dialog. NO blank pages. Ever.
 *
 * Draws dark cyberpunk-themed rectangles, text, and accent lines
 * directly onto the PDF canvas. 100% reliable.
 */

(function () {
  "use strict";

  /* ── DOM refs ───────────────────────────────────────────── */
  var downloadBtn = document.getElementById("downloadCvBtn");
  var printBtn = document.getElementById("printCvBtn");
  var toast = document.getElementById("cv-toast");
  var toastMsg = document.getElementById("toast-message");

  if (!downloadBtn) {
    console.warn("CV Export: #downloadCvBtn not found");
    return;
  }

  /* ── Toast ──────────────────────────────────────────────── */
  var toastTimer;
  function showToast(msg, type) {
    if (!toast || !toastMsg) return;
    var icons = {
      success:
        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      error:
        '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    };
    var svgEl = toast.querySelector("svg");
    if (svgEl) svgEl.innerHTML = icons[type] || icons.info;
    toast.className = "cv-toast " + (type || "info");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 4500);
  }

  /* ── Lazy-load jsPDF (standalone — NO html2canvas) ──────── */
  function addScript(url) {
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = url;
      s.onload = function () {
        setTimeout(ok, 200);
      };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function ensureJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve();
    if (window.jsPDF) return Promise.resolve();
    return addScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    ).catch(function () {
      return addScript(
        "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
      );
    });
  }

  /* ── Color palette ──────────────────────────────────────── */
  var C = {
    bg: [11, 15, 23],
    surface: [17, 24, 39],
    card: [26, 34, 52],
    border: [40, 50, 70],
    white: [255, 255, 255],
    text: [229, 231, 235],
    muted: [156, 163, 175],
    dim: [107, 114, 128],
    cyan: [0, 212, 255],
    purple: [168, 85, 247],
    pink: [236, 72, 153],
  };

  /* ── PDF Builder ────────────────────────────────────────── */
  function buildPDF() {
    var JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    var doc = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    var pw = 210,
      ph = 297;
    var mx = 12,
      mt = 12,
      mb = 14;
    var cw = pw - mx * 2;
    var y = mt;

    /* — helpers — */
    function setColor(c) {
      doc.setTextColor(c[0], c[1], c[2]);
    }
    function setFill(c) {
      doc.setFillColor(c[0], c[1], c[2]);
    }
    function setStroke(c) {
      doc.setDrawColor(c[0], c[1], c[2]);
    }

    function pageBg() {
      setFill(C.bg);
      doc.rect(0, 0, pw, ph, "F");
    }

    function needSpace(h) {
      if (y + h > ph - mb) {
        doc.addPage();
        pageBg();
        drawDocCard();
        y = mt + 6;
        return true;
      }
      return false;
    }

    function drawDocCard() {
      setFill(C.surface);
      doc.rect(mx, mt, cw, ph - mt - mb, "F");
      setStroke(C.border);
      doc.setLineWidth(0.3);
      doc.rect(mx, mt, cw, ph - mt - mb, "S");
      // Gradient bar
      var third = cw / 3;
      setFill(C.cyan);
      doc.rect(mx, mt, third + 0.5, 1.5, "F");
      setFill(C.purple);
      doc.rect(mx + third, mt, third + 0.5, 1.5, "F");
      setFill(C.pink);
      doc.rect(mx + third * 2, mt, third + 0.5, 1.5, "F");
    }

    function card(cx, cy, w, h) {
      setFill(C.card);
      doc.rect(cx, cy, w, h, "F");
      setStroke(C.border);
      doc.setLineWidth(0.25);
      doc.rect(cx, cy, w, h, "S");
    }

    function sectionTitle(title) {
      needSpace(14);
      y += 3;
      setFill(C.cyan);
      doc.rect(ix, y, iw, 0.5, "F");
      y += 4;
      setColor(C.cyan);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), ix, y);
      y += 5;
    }

    function wrappedText(text, x, size, color, style, maxW) {
      setColor(color);
      doc.setFontSize(size);
      doc.setFont("helvetica", style || "normal");
      var lines = doc.splitTextToSize(text, maxW);
      var lineH = size * 0.42;
      for (var i = 0; i < lines.length; i++) {
        needSpace(lineH + 1);
        doc.text(lines[i], x, y);
        y += lineH;
      }
    }

    /* — inner bounds — */
    var ix = mx + 8;
    var iw = cw - 16;

    /* ═══════ Page 1 ═══════ */
    pageBg();
    drawDocCard();
    y = mt + 7;

    /* ── Header ── */
    setColor(C.white);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Christopher Olabiyi", pw / 2, y, { align: "center" });
    y += 9;

    setColor(C.cyan);
    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text("CODEX  |  Michris", pw / 2, y, { align: "center" });
    y += 6;

    setColor(C.muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Software & Hardware Engineer  \u00B7  Cybersecurity Student  \u00B7  Linux Enthusiast",
      pw / 2,
      y,
      { align: "center" },
    );
    y += 7;

    /* Contact info */
    setColor(C.dim);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      "christolabiyi35@gmail.com   \u00B7   github.com/Chrinux-AI   \u00B7   LinkedIn   \u00B7   @christolabiyi35",
      pw / 2,
      y,
      { align: "center" },
    );
    y += 5;

    /* Separator */
    setFill(C.border);
    doc.rect(ix, y, iw, 0.3, "F");
    y += 6;

    /* ── Summary ── */
    sectionTitle("Summary");
    wrappedText(
      "Software & hardware engineer with hands-on experience in Linux systems, full-stack web development, " +
        "and cybersecurity fundamentals. Building production applications with PHP, JavaScript, Python, " +
        "and MySQL while managing Linux-based development environments. Focused on secure systems " +
        "engineering, automation, and practical tooling \u2014 with deployed projects and active open-source contributions.",
      ix,
      9,
      C.text,
      "normal",
      iw,
    );
    y += 4;

    /* ── Skills ── */
    sectionTitle("Skills");

    var skills = [
      {
        title: "Software / Web",
        items: "HTML/CSS \u00B7 JavaScript \u00B7 Python \u00B7 PHP \u00B7 Git & GitHub",
      },
      {
        title: "Systems / Linux",
        items: "Linux Admin \u00B7 Bash/CLI \u00B7 Networking \u00B7 Docker",
      },
      {
        title: "Cybersecurity",
        items: "Web Security \u00B7 Linux Security \u00B7 Network Analysis \u00B7 Threat Assessment",
      },
      {
        title: "Tools & Workflow",
        items: "VS Code \u00B7 LAMP Stack \u00B7 Terminal Workflows \u00B7 Postman",
      },
    ];

    var skW = (iw - 4) / 2;
    var skH = 22;
    needSpace(skH * 2 + 8);

    for (var si = 0; si < skills.length; si++) {
      var row = Math.floor(si / 2);
      var col = si % 2;
      var sx = ix + col * (skW + 4);
      var sy = y + row * (skH + 4);
      card(sx, sy, skW, skH);

      // Cyan dot
      setFill(C.cyan);
      doc.circle(sx + 4.5, sy + 6, 1, "F");

      // Title
      setColor(C.white);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(skills[si].title, sx + 8, sy + 7);

      // Items
      setColor(C.muted);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      var sLines = doc.splitTextToSize(skills[si].items, skW - 8);
      for (var sli = 0; sli < sLines.length; sli++) {
        doc.text(sLines[sli], sx + 4.5, sy + 13 + sli * 3.2);
      }
    }
    y += skH * 2 + 10;

    /* ── Projects ── */
    sectionTitle("Projects");

    var projects = [
      {
        title: "Secure Auth Starter Kit",
        tech: "PHP, MySQL, AJAX, Email API",
        bullets: [
          "Building a security-first authentication boilerplate with OTP verification, rate limiting, and session management",
          "Implemented email-based two-factor authentication with comprehensive backend logging",
          "Designing reusable patterns for secure credential handling and audit trails",
        ],
      },
      {
        title: "Portfolio \u2014 Engineering UI",
        tech: "HTML, CSS, JS, Vercel",
        bullets: [
          "Designed and built a responsive cyberpunk-themed portfolio with accessible dark UI and config-driven architecture",
          "Implemented serverless email API using Vercel functions and Nodemailer for contact form delivery",
          "Built programmatic PDF export with jsPDF for reliable CV generation",
        ],
      },
      {
        title: "Linux Automation Toolkit",
        tech: "Bash, Linux, Shell",
        bullets: [
          "Creating practical scripts for automated system setup, environment configuration, and diagnostics",
          "Standardized logging, output formatting, and maintenance workflows for Linux environments",
          "Building reusable templates for common system administration tasks",
        ],
      },
      {
        title: "EduSynch \u2013 School Management System",
        tech: "PHP, MySQL, JavaScript",
        bullets: [
          "Developed a PHP-based school management system for student data, grades, and administrative workflows",
          "Currently being refactored to improve security patterns and code architecture",
        ],
      },
    ];

    for (var pi = 0; pi < projects.length; pi++) {
      var proj = projects[pi];

      // Pre-calculate card height
      var bh = 0;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      for (var bi = 0; bi < proj.bullets.length; bi++) {
        var bl = doc.splitTextToSize(proj.bullets[bi], iw - 16);
        bh += bl.length * 3.3 + 1.2;
      }
      var pCardH = 13 + bh + 3;

      needSpace(pCardH + 4);
      card(ix, y, iw, pCardH);

      // Project title
      setColor(C.white);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(proj.title, ix + 5, y + 7);

      // Tech badge
      doc.setFontSize(6.5);
      doc.setFont("courier", "normal");
      var techTextW = doc.getTextWidth(proj.tech);
      var badgeW = techTextW + 6;
      var badgeX = ix + iw - badgeW - 4;
      setFill([35, 25, 55]);
      doc.rect(badgeX, y + 2.5, badgeW, 6, "F");
      setColor(C.purple);
      doc.text(proj.tech, badgeX + 3, y + 6.5);

      // Bullets
      var by = y + 13;
      for (var bj = 0; bj < proj.bullets.length; bj++) {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        var bLines = doc.splitTextToSize(proj.bullets[bj], iw - 16);

        // Cyan bullet
        setFill(C.cyan);
        doc.circle(ix + 6, by - 0.6, 0.7, "F");

        setColor(C.muted);
        for (var bk = 0; bk < bLines.length; bk++) {
          doc.text(bLines[bk], ix + 10, by);
          by += 3.3;
        }
        by += 1.2;
      }

      y += pCardH + 4;
    }

    /* ── Engineering Exposure ── */
    sectionTitle("Engineering Exposure");

    var engPoints = [
      "Full-stack web development with PHP, JavaScript, Python, and MySQL \u2014 REST APIs and server-side logic",
      "Linux system administration, shell scripting (Bash), and cron-based automation",
      "Security tooling: Wireshark, Nmap, Burp Suite \u2014 network analysis and vulnerability assessment",
      "Hardware\u2013software interaction concepts and embedded systems fundamentals",
      "Deployment and CI/CD: Git workflows, Vercel serverless functions, Docker basics",
    ];

    for (var ei = 0; ei < engPoints.length; ei++) {
      needSpace(6);
      setFill(C.cyan);
      doc.circle(ix + 4, y - 0.6, 0.7, "F");
      setColor(C.text);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      var eLine = doc.splitTextToSize(engPoints[ei], iw - 12);
      for (var ek = 0; ek < eLine.length; ek++) {
        doc.text(eLine[ek], ix + 8, y);
        y += 3.5;
      }
      y += 1;
    }
    y += 3;

    /* ── Education ── */
    sectionTitle("Education");

    var eduH = 22;
    needSpace(eduH + 4);
    card(ix, y, iw, eduH);

    setColor(C.white);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("BSc (In Progress)", ix + 5, y + 7);

    setColor(C.muted);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Ladoke Akintola University of Technology (LAUTECH)",
      ix + 5,
      y + 12,
    );

    setColor(C.dim);
    doc.setFontSize(7);
    doc.text("Cybersecurity Student (Not yet certified)", ix + 5, y + 16.5);

    // Status badge
    doc.setFontSize(6.5);
    doc.setFont("courier", "normal");
    var stText = "In Progress";
    var stW = doc.getTextWidth(stText) + 6;
    setFill([10, 30, 40]);
    doc.rect(ix + iw - stW - 4, y + 3, stW, 6, "F");
    setColor(C.cyan);
    doc.text(stText, ix + iw - stW - 1, y + 7);

    y += eduH + 6;

    /* ── Interests ── */
    sectionTitle("Interests");

    var interests = [
      "Cybersecurity",
      "Embedded Systems",
      "Linux Systems",
      "Cloud & DevOps",
      "Secure Backend Dev",
      "Open Source",
    ];

    needSpace(12);
    var tagX = ix;
    var tagH = 7;

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    for (var ti = 0; ti < interests.length; ti++) {
      var tw = doc.getTextWidth(interests[ti]) + 8;
      if (tagX + tw > ix + iw) {
        tagX = ix;
        y += tagH + 3;
        needSpace(tagH + 3);
      }
      card(tagX, y, tw, tagH);
      setColor(C.muted);
      doc.text(interests[ti], tagX + 4, y + 4.8);
      tagX += tw + 3;
    }
    y += tagH + 8;

    /* ── Footer ── */
    // Bottom gradient bar
    var third = cw / 3;
    setFill(C.cyan);
    doc.rect(mx, ph - mb - 2, third + 0.5, 1, "F");
    setFill(C.purple);
    doc.rect(mx + third, ph - mb - 2, third + 0.5, 1, "F");
    setFill(C.pink);
    doc.rect(mx + third * 2, ph - mb - 2, third + 0.5, 1, "F");

    setColor(C.dim);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Generated from portfolio  \u00B7  christolabiyi35@gmail.com  \u00B7  github.com/Chrinux-AI",
      pw / 2,
      ph - mb + 2,
      { align: "center" },
    );

    return doc;
  }

  /* ── Download handler ───────────────────────────────────── */
  var busy = false;

  function downloadPDF() {
    if (busy) return;
    busy = true;
    downloadBtn.classList.add("loading");
    downloadBtn.disabled = true;
    showToast("Generating your CV\u2026", "info");

    ensureJsPDF()
      .then(function () {
        var JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!JsPDF) throw new Error("jsPDF library did not load");
        var doc = buildPDF();
        doc.save("Christopher_Olabiyi_CV.pdf");
        showToast("CV downloaded successfully!", "success");
      })
      .catch(function (err) {
        console.error("PDF export failed:", err);
        showToast("PDF generation failed \u2014 " + err.message, "error");
      })
      .finally(function () {
        downloadBtn.classList.remove("loading");
        downloadBtn.disabled = false;
        busy = false;
      });
  }

  /* ── Wire up buttons ────────────────────────────────────── */
  downloadBtn.addEventListener("click", downloadPDF);

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();

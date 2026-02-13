/**
 * Portfolio Main Script
 * =====================
 * Handles: Config injection, form validation, dynamic content, skill meters, utilities
 */

(function () {
  "use strict";

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Wait for config to be available
  function waitForConfig(callback) {
    if (window.CONFIG) {
      callback(window.CONFIG);
    } else {
      setTimeout(() => waitForConfig(callback), 50);
    }
  }

  // ========================================
  // CONFIG INJECTION
  // ========================================
  function injectConfig(config) {
    // Inject name
    document.querySelectorAll('[data-config="name"]').forEach((el) => {
      el.textContent = config.NAME;
    });

    // Inject handles
    document
      .querySelectorAll('[data-config="handle-primary"]')
      .forEach((el) => {
        el.textContent = config.HANDLES.primary;
      });

    document
      .querySelectorAll('[data-config="handle-secondary"]')
      .forEach((el) => {
        el.textContent = config.HANDLES.secondary;
      });

    // Inject title
    document.querySelectorAll('[data-config="title"]').forEach((el) => {
      el.textContent = config.TITLE;
    });

    // Inject tagline
    document.querySelectorAll('[data-config="tagline"]').forEach((el) => {
      el.textContent = config.TAGLINE;
    });

    // Inject email
    document.querySelectorAll('[data-config="email"]').forEach((el) => {
      if (el.tagName === "A") {
        el.href = `mailto:${config.EMAIL}`;
        const span = el.querySelector("span");
        if (span) {
          span.textContent = config.EMAIL;
        } else {
          el.textContent = config.EMAIL;
        }
      } else {
        el.textContent = config.EMAIL;
      }
    });

    // Inject GitHub URL
    document.querySelectorAll('[data-config="github"]').forEach((el) => {
      if (el.tagName === "A") {
        el.href = config.GITHUB_URL;
        const span = el.querySelector("span");
        if (span) {
          span.textContent = config.GITHUB_URL.replace("https://", "");
        }
      } else {
        el.textContent = config.GITHUB_URL;
      }
    });

    // Inject LinkedIn URL
    document.querySelectorAll('[data-config="linkedin"]').forEach((el) => {
      if (el.tagName === "A") {
        el.href = config.LINKEDIN_URL;
        const span = el.querySelector("span");
        if (span) {
          span.textContent = "linkedin.com/in/christopher-olabiyi";
        }
      } else {
        el.textContent = config.LINKEDIN_URL;
      }
    });

    // Inject headshot
    document.querySelectorAll('[data-config="headshot"]').forEach((el) => {
      if (el.tagName === "IMG") {
        el.src = config.HEADSHOT;
        el.alt = `${config.NAME} - ${config.HANDLES.primary}`;
      }
    });

    // Inject education
    document
      .querySelectorAll('[data-config="education-degree"]')
      .forEach((el) => {
        el.textContent = config.EDUCATION.degree;
      });

    document
      .querySelectorAll('[data-config="education-status"]')
      .forEach((el) => {
        el.textContent = config.EDUCATION.status;
      });

    document
      .querySelectorAll('[data-config="education-institution"]')
      .forEach((el) => {
        el.textContent = config.EDUCATION.institution;
      });

    document
      .querySelectorAll('[data-config="education-graduation"]')
      .forEach((el) => {
        el.textContent = config.EDUCATION.expectedGraduation;
      });

    // Inject education track if available
    document
      .querySelectorAll('[data-config="education-track"]')
      .forEach((el) => {
        el.textContent = config.EDUCATION.track || "";
      });
  }

  // ========================================
  // TYPING SVG ANIMATION (Continuous Typewriter)
  // Types forward, pauses, backspaces, pauses, loops forever
  // ========================================
  function initTypingAnimation(config) {
    const typeText = document.getElementById("typeText");
    const cursor = document.getElementById("cursor");

    if (!typeText || !cursor) return;

    // Get phrases and timing from config
    const phrases = config.TYPING_PHRASES || [
      config.NAME || "Christopher Olabiyi",
    ];
    const typeSpeed = config.TYPE_SPEED || 70;
    const backSpeed = config.BACK_SPEED || 40;
    const holdFull = config.HOLD_FULL || 900;
    const holdEmpty = config.HOLD_EMPTY || 250;

    // State machine
    let phraseIndex = 0;
    let charIndex = 0;
    let direction = "forward"; // "forward" | "back"
    let currentText = "";
    let timeoutId = null;

    // Base X position (left-aligned)
    const baseX = 0;

    // Update cursor position based on text width
    function updateCursorPosition() {
      try {
        const textLength = typeText.getComputedTextLength();
        // Text is left-aligned, cursor goes after the text
        const cursorX = baseX + textLength + 6;
        cursor.setAttribute("x", cursorX);
      } catch (e) {
        // Fallback if getComputedTextLength fails
        cursor.setAttribute("x", baseX + currentText.length * 22 + 6);
      }
    }

    // Main tick function
    function tick() {
      if (direction === "forward") {
        // Typing forward
        if (charIndex < phrases[phraseIndex].length) {
          charIndex++;
          currentText = phrases[phraseIndex].substring(0, charIndex);
          typeText.textContent = currentText;
          updateCursorPosition();

          // Add slight variation for realism
          const variation = Math.random() * 30 - 15;
          timeoutId = setTimeout(tick, typeSpeed + variation);
        } else {
          // Finished typing - pause then backspace
          timeoutId = setTimeout(() => {
            direction = "back";
            tick();
          }, holdFull);
        }
      } else {
        // Backspacing
        if (charIndex > 0) {
          charIndex--;
          currentText = phrases[phraseIndex].substring(0, charIndex);
          typeText.textContent = currentText;
          updateCursorPosition();

          timeoutId = setTimeout(tick, backSpeed);
        } else {
          // Finished backspacing - pause then next phrase
          timeoutId = setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            direction = "forward";
            tick();
          }, holdEmpty);
        }
      }
    }

    // Respect reduced motion preference
    if (prefersReducedMotion) {
      // Show first phrase statically
      typeText.textContent = phrases[0];
      updateCursorPosition();
      // Hide cursor for static display
      cursor.style.display = "none";
      return;
    }

    // Start the animation after a short delay
    setTimeout(() => {
      tick();
    }, 500);
  }

  // ========================================
  // PREMIUM SKILLS SECTION
  // ========================================
  function generateSkills(config) {
    const summaryContainer = document.getElementById("skillsSummary");
    const gridContainer =
      document.getElementById("skillsGrid") ||
      document.getElementById("skills-container");
    const evidenceContainer = document.getElementById("skillsEvidence");
    const evidenceToggle = document.getElementById("toggleEvidence");

    if (!gridContainer) return;

    const skillsData = window.SKILLS || config.SKILLS;
    const evidenceData = window.SKILL_EVIDENCE || {};
    if (!skillsData) return;

    // Category icons (SVG paths)
    const icons = {
      Development: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
      "Systems & Security": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      Tools: `<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
    };

    // Compute category data with averages
    const categories = Object.entries(skillsData).map(([name, skills]) => {
      const items = Object.entries(skills).map(([skillName, percent]) => ({
        name: skillName,
        percent,
      }));
      const avg = Math.round(
        items.reduce((sum, s) => sum + s.percent, 0) / items.length,
      );
      return { name, items, avg, icon: icons[name] || icons.Development };
    });

    // 1. Render Summary Strip
    if (summaryContainer) {
      summaryContainer.innerHTML = categories
        .map(
          (cat, i) => `
        <div class="summary-card glass-panel reveal" style="--delay: ${i * 0.1}s">
          <div class="summary-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${cat.icon}</svg>
          </div>
          <div class="summary-content">
            <h4 class="summary-title">${cat.name}</h4>
            <div class="summary-meter">
              <div class="summary-ring" data-percent="${cat.avg}">
                <svg viewBox="0 0 36 36">
                  <circle class="ring-bg" cx="18" cy="18" r="15.91549430918954" fill="none" stroke-width="3"/>
                  <circle class="ring-fill" cx="18" cy="18" r="15.91549430918954" fill="none" stroke-width="3"
                    stroke-dasharray="${cat.avg} ${100 - cat.avg}" stroke-dashoffset="25"
                    style="--target-dash: ${cat.avg}"/>
                </svg>
                <span class="ring-value" data-target="${cat.avg}">0%</span>
              </div>
              <span class="summary-label">avg proficiency</span>
            </div>
          </div>
        </div>
      `,
        )
        .join("");
    }

    // 2. Render Category Panels with Segmented Meters
    gridContainer.innerHTML = categories
      .map((cat, catIndex) => {
        const safeKey = cat.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

        // Generate radar/sparkline SVG
        const radarSvg = generateRadarChart(cat.items);

        return `
        <article class="skill-panel glass-panel reveal" style="--delay: ${catIndex * 0.15}s" data-category="${safeKey}">
          <header class="panel-header">
            <div class="panel-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${cat.icon}</svg>
            </div>
            <h3 class="panel-title">${cat.name}</h3>
            <span class="panel-avg">${cat.avg}%</span>
          </header>

          <div class="panel-chart">${radarSvg}</div>

          <ul class="skill-list" role="list">
            ${cat.items
              .map((skill, idx) => {
                const litSegments = Math.round(skill.percent / 10);
                const skillId = `skill-${safeKey}-${idx}`;
                return `
                <li class="skill-row" data-percent="${skill.percent}">
                  <span class="skill-name" id="${skillId}">${skill.name}</span>
                  <div class="skill-meter-wrap">
                    <div class="segmented-meter"
                         role="progressbar"
                         aria-labelledby="${skillId}"
                         aria-valuenow="0"
                         aria-valuemin="0"
                         aria-valuemax="100">
                      ${Array.from(
                        { length: 10 },
                        (_, i) => `
                        <span class="segment ${i < litSegments ? "lit" : ""}" data-index="${i}"></span>
                      `,
                      ).join("")}
                      <span class="meter-marker" style="--marker-pos: ${skill.percent}%"></span>
                    </div>
                    <span class="skill-value" data-target="${skill.percent}">0%</span>
                  </div>
                  <span class="skill-tooltip">Self-assessed from hands-on use</span>
                </li>
              `;
              })
              .join("")}
          </ul>
        </article>
      `;
      })
      .join("");

    // 3. Render Evidence Panel
    if (evidenceContainer) {
      evidenceContainer.innerHTML = `
        <div class="evidence-grid">
          ${categories
            .map((cat) => {
              const proofs = evidenceData[cat.name] || [];
              if (!proofs.length) return "";
              return `
              <div class="evidence-category">
                <h4 class="evidence-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${cat.icon}</svg>
                  ${cat.name}
                </h4>
                <ul class="evidence-list">
                  ${proofs.map((p) => `<li>${p}</li>`).join("")}
                </ul>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
    }

    // 4. Evidence Toggle Handler
    if (evidenceToggle && evidenceContainer) {
      evidenceToggle.addEventListener("click", () => {
        const expanded =
          evidenceToggle.getAttribute("aria-expanded") === "true";
        evidenceToggle.setAttribute("aria-expanded", !expanded);
        evidenceContainer.setAttribute("aria-hidden", expanded);
        evidenceContainer.classList.toggle("open", !expanded);
        evidenceToggle.querySelector("span").textContent = expanded
          ? "Show Skill Evidence"
          : "Hide Skill Evidence";
      });
    }

    // Initialize animations
    initPremiumSkillMeters();
  }

  // Generate a simple radar/polygon chart SVG
  function generateRadarChart(items) {
    const size = 80;
    const center = size / 2;
    const maxRadius = size / 2 - 8;
    const count = items.length;
    const angleStep = (2 * Math.PI) / count;

    // Generate polygon points
    const points = items
      .map((item, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const radius = (item.percent / 100) * maxRadius;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    // Generate axis lines
    const axes = items
      .map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x2 = center + maxRadius * Math.cos(angle);
        const y2 = center + maxRadius * Math.sin(angle);
        return `<line x1="${center}" y1="${center}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="radar-axis"/>`;
      })
      .join("");

    return `
      <svg viewBox="0 0 ${size} ${size}" class="radar-chart">
        <circle cx="${center}" cy="${center}" r="${maxRadius}" class="radar-bg"/>
        <circle cx="${center}" cy="${center}" r="${maxRadius * 0.66}" class="radar-ring"/>
        <circle cx="${center}" cy="${center}" r="${maxRadius * 0.33}" class="radar-ring"/>
        ${axes}
        <polygon points="${points}" class="radar-fill"/>
        <polygon points="${points}" class="radar-stroke"/>
      </svg>
    `;
  }

  // ========================================
  // PREMIUM SKILL METER ANIMATIONS
  // ========================================
  function initPremiumSkillMeters() {
    const skillRows = document.querySelectorAll(".skill-row");
    const summaryRings = document.querySelectorAll(".summary-ring");
    if (!skillRows.length && !summaryRings.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.2,
    };

    // Observe skill rows
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillRow(entry.target);
          rowObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    skillRows.forEach((row) => rowObserver.observe(row));

    // Observe summary rings
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSummaryRing(entry.target);
          ringObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    summaryRings.forEach((ring) => ringObserver.observe(ring));
  }

  function animateSkillRow(row) {
    const segments = row.querySelectorAll(".segment");
    const valueEl = row.querySelector(".skill-value");
    const meter = row.querySelector(".segmented-meter");
    const targetPercent = parseInt(row.dataset.percent, 10);
    const litCount = Math.round(targetPercent / 10);

    if (prefersReducedMotion) {
      // Instant state for reduced motion
      segments.forEach((seg, i) => {
        if (i < litCount) seg.classList.add("lit", "animate");
      });
      if (valueEl) valueEl.textContent = `${targetPercent}%`;
      if (meter) meter.setAttribute("aria-valuenow", targetPercent);
      return;
    }

    // Animate segments sequentially
    segments.forEach((seg, i) => {
      if (i < litCount) {
        setTimeout(() => {
          seg.classList.add("lit", "animate");
        }, i * 80);
      }
    });

    // Animate counter
    animateCounter(valueEl, targetPercent, 1200, meter);
  }

  function animateSummaryRing(ringEl) {
    const valueEl = ringEl.querySelector(".ring-value");
    const fillCircle = ringEl.querySelector(".ring-fill");
    const targetPercent = parseInt(ringEl.dataset.percent, 10);

    if (prefersReducedMotion) {
      if (valueEl) valueEl.textContent = `${targetPercent}%`;
      if (fillCircle)
        fillCircle.style.strokeDasharray = `${targetPercent} ${100 - targetPercent}`;
      return;
    }

    // Animate the ring
    if (fillCircle) {
      fillCircle.style.transition = "stroke-dasharray 1.5s ease-out";
      fillCircle.style.strokeDasharray = `${targetPercent} ${100 - targetPercent}`;
    }

    // Animate counter
    animateCounter(valueEl, targetPercent, 1500);
  }

  function animateCounter(el, target, duration, ariaEl = null) {
    if (!el) return;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);

      el.textContent = `${value}%`;
      if (ariaEl) ariaEl.setAttribute("aria-valuenow", value);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Legacy function kept for CV page compatibility
  function initSkillMeters() {
    const skillMeters = document.querySelectorAll(".skill-meter");
    if (!skillMeters.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const meter = entry.target;
          animateSkillMeter(meter);
          observer.unobserve(meter);
        }
      });
    }, observerOptions);

    skillMeters.forEach((meter) => observer.observe(meter));
  }

  function animateSkillMeter(meter) {
    const progress = meter.querySelector(".skill-progress");
    const percentEl = meter.querySelector(".skill-percent");
    const skillBar = meter.querySelector(".skill-bar");
    const targetPercent = parseInt(meter.dataset.percent, 10);

    if (prefersReducedMotion) {
      // No animation for reduced motion
      if (progress) progress.style.width = `${targetPercent}%`;
      if (percentEl) percentEl.textContent = `${targetPercent}%`;
      if (skillBar) skillBar.setAttribute("aria-valuenow", targetPercent);
      return;
    }

    // Animate progress bar
    if (progress) progress.style.width = `${targetPercent}%`;

    // Animate counter
    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      const currentValue = Math.round(eased * targetPercent);

      if (percentEl) percentEl.textContent = `${currentValue}%`;
      if (skillBar) skillBar.setAttribute("aria-valuenow", currentValue);

      if (progressRatio < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // ========================================
  // PROOF OF WORK SECTION
  // ========================================
  function generateProofOfWork() {
    const proofGrid = document.getElementById("proofGrid");
    if (!proofGrid) return;

    const evidenceData = window.EVIDENCE || {};
    if (!Object.keys(evidenceData).length) return;

    // Category icons
    const icons = {
      Development: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
      "Systems & Security": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      Tools: `<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
    };

    // Render proof cards
    proofGrid.innerHTML = Object.entries(evidenceData)
      .map(([category, bullets], index) => {
        const safeId = category.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        const icon = icons[category] || icons.Development;

        return `
        <article class="proof-card glass-panel reveal" style="--delay: ${index * 0.1}s" data-category="${safeId}">
          <header class="proof-header">
            <div class="proof-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg>
            </div>
            <h3 class="proof-title">${category}</h3>
            <button
              type="button"
              class="proof-toggle btn btn-sm"
              aria-expanded="false"
              aria-controls="proof-content-${safeId}"
            >
              <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <span class="toggle-text">Show evidence</span>
            </button>
          </header>
          <div
            id="proof-content-${safeId}"
            class="proof-content"
            aria-hidden="true"
          >
            <ul class="proof-list">
              ${bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
            </ul>
          </div>
        </article>
      `;
      })
      .join("");

    // Initialize accordion behavior
    initProofAccordion();
  }

  function initProofAccordion() {
    const proofCards = document.querySelectorAll(".proof-card");
    if (!proofCards.length) return;

    proofCards.forEach((card) => {
      const toggle = card.querySelector(".proof-toggle");
      const content = card.querySelector(".proof-content");
      const toggleText = toggle.querySelector(".toggle-text");

      toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        // Accordion: close all others first
        proofCards.forEach((otherCard) => {
          if (otherCard !== card) {
            const otherToggle = otherCard.querySelector(".proof-toggle");
            const otherContent = otherCard.querySelector(".proof-content");
            const otherText = otherToggle.querySelector(".toggle-text");

            otherToggle.setAttribute("aria-expanded", "false");
            otherContent.setAttribute("aria-hidden", "true");
            otherCard.classList.remove("expanded");
            otherText.textContent = "Show evidence";

            if (!prefersReducedMotion) {
              otherContent.style.maxHeight = "0";
            }
          }
        });

        // Toggle current card
        const newState = !isExpanded;
        toggle.setAttribute("aria-expanded", newState);
        content.setAttribute("aria-hidden", !newState);
        card.classList.toggle("expanded", newState);
        toggleText.textContent = newState ? "Hide evidence" : "Show evidence";

        // Animate height
        if (prefersReducedMotion) {
          // No animation, just show/hide
          content.style.maxHeight = newState ? "none" : "0";
        } else {
          if (newState) {
            content.style.maxHeight = content.scrollHeight + "px";
          } else {
            content.style.maxHeight = "0";
          }
        }
      });
    });
  }

  // ========================================
  // CASE STUDIES SECTION
  // ========================================
  function generateCaseStudies() {
    const caseGrid = document.getElementById("caseStudiesGrid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (!caseGrid) return;

    const caseStudies = window.CASE_STUDIES || [];
    if (!caseStudies.length) return;

    // Section icons
    const sectionIcons = {
      problem: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
      approach: `<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
      outcome: `<polyline points="20 6 9 17 4 12"/>`,
      next: `<circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/>`,
    };

    // Render case study cards
    caseGrid.innerHTML = caseStudies
      .map((study, index) => {
        const statusClass = study.status.toLowerCase().replace(/ /g, "-");
        const safeId = `case-${index}`;
        const hasRepo = study.links?.repo;
        const hasDemo = study.links?.demo;

        return `
        <article class="case-card reveal" style="--delay: ${index * 0.1}s" data-status="${statusClass}" data-id="${safeId}">
          <header class="case-header" role="button" tabindex="0" aria-expanded="false" aria-controls="${safeId}-content">
            <button type="button" class="case-toggle" aria-label="Toggle case study details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <div class="case-info">
              <div class="case-title-row">
                <h3 class="case-title">${study.title}</h3>
                <span class="case-status ${statusClass}">${study.status}</span>
              </div>
              <p class="case-summary">${study.summary}</p>
            </div>
          </header>

          <div id="${safeId}-content" class="case-content" aria-hidden="true">
            <div class="case-body">
              <div class="case-section">
                <h4 class="case-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${sectionIcons.problem}</svg>
                  Problem
                </h4>
                <ul class="case-list">
                  ${study.problem.map((p) => `<li>${p}</li>`).join("")}
                </ul>
              </div>
              <div class="case-section">
                <h4 class="case-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${sectionIcons.approach}</svg>
                  Approach
                </h4>
                <ul class="case-list">
                  ${study.approach.map((a) => `<li>${a}</li>`).join("")}
                </ul>
              </div>
              <div class="case-section">
                <h4 class="case-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${sectionIcons.outcome}</svg>
                  Outcome
                </h4>
                <ul class="case-list">
                  ${study.outcome.map((o) => `<li>${o}</li>`).join("")}
                </ul>
              </div>
              <div class="case-section">
                <h4 class="case-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${sectionIcons.next}</svg>
                  Next Steps
                </h4>
                <ul class="case-list">
                  ${study.next.map((n) => `<li>${n}</li>`).join("")}
                </ul>
              </div>
            </div>
            <footer class="case-footer">
              <div class="case-stack">
                ${study.stack.map((tech) => `<span class="stack-pill">${tech}</span>`).join("")}
              </div>
              <div class="case-links">
                ${
                  hasRepo
                    ? `<a href="${study.links.repo}" class="case-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                      </svg>
                      Repository
                    </a>`
                    : `<span class="case-link disabled" data-tooltip="Link after push">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                      </svg>
                      Repository
                    </span>`
                }
                ${
                  hasDemo
                    ? `<a href="${study.links.demo}" class="case-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </a>`
                    : `<span class="case-link disabled" data-tooltip="Link after push">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </span>`
                }
              </div>
            </footer>
          </div>
        </article>
      `;
      })
      .join("");

    // Initialize accordion and filter behavior
    initCaseStudyAccordion();
    initCaseStudyFilters(filterBtns);
  }

  function initCaseStudyAccordion() {
    const caseCards = document.querySelectorAll(".case-card");
    if (!caseCards.length) return;

    caseCards.forEach((card) => {
      const header = card.querySelector(".case-header");
      const toggle = card.querySelector(".case-toggle");
      const content = card.querySelector(".case-content");

      const handleToggle = () => {
        const isExpanded = header.getAttribute("aria-expanded") === "true";

        // Accordion: close all others first
        caseCards.forEach((otherCard) => {
          if (otherCard !== card && !otherCard.classList.contains("hidden")) {
            const otherHeader = otherCard.querySelector(".case-header");
            const otherContent = otherCard.querySelector(".case-content");

            otherHeader.setAttribute("aria-expanded", "false");
            otherContent.setAttribute("aria-hidden", "true");
            otherCard.classList.remove("expanded");

            if (!prefersReducedMotion) {
              otherContent.style.maxHeight = "0";
            } else {
              otherContent.style.maxHeight = "0";
            }
          }
        });

        // Toggle current card
        const newState = !isExpanded;
        header.setAttribute("aria-expanded", newState);
        content.setAttribute("aria-hidden", !newState);
        card.classList.toggle("expanded", newState);

        // Animate height
        if (prefersReducedMotion) {
          content.style.maxHeight = newState ? "none" : "0";
        } else {
          if (newState) {
            content.style.maxHeight = content.scrollHeight + "px";
          } else {
            content.style.maxHeight = "0";
          }
        }
      };

      // Click on header or toggle button
      header.addEventListener("click", handleToggle);

      // Keyboard support for header
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      });
    });
  }

  function initCaseStudyFilters(filterBtns) {
    if (!filterBtns.length) return;

    const caseCards = document.querySelectorAll(".case-card");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        // Filter cards
        caseCards.forEach((card) => {
          const status = card.dataset.status;

          // Close expanded cards when filtering
          const header = card.querySelector(".case-header");
          const content = card.querySelector(".case-content");
          header.setAttribute("aria-expanded", "false");
          content.setAttribute("aria-hidden", "true");
          card.classList.remove("expanded");
          content.style.maxHeight = "0";

          if (filter === "all") {
            card.classList.remove("hidden");
          } else if (filter === status) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  // ========================================
  // ENVIRONMENT GENERATION
  // ========================================
  function generateEnvironment() {
    const grid = document.getElementById("envGrid");
    if (!grid || !window.ENVIRONMENT) return;

    const env = window.ENVIRONMENT;
    const categories = Object.keys(env);

    grid.innerHTML = categories
      .map((category, index) => {
        const { icon, items } = env[category];
        const delay = index * 80;

        return `
          <article
            class="env-card glass-panel reveal"
            role="listitem"
            style="--reveal-delay: ${delay}ms"
          >
            <header class="env-header">
              <span class="env-icon" aria-hidden="true">${icon}</span>
              <h3 class="env-title">${category}</h3>
            </header>
            <ul class="env-items" aria-label="${category} tools">
              ${items
                .map(
                  (item) => `
                <li class="env-item">${item}</li>
              `,
                )
                .join("")}
            </ul>
          </article>
        `;
      })
      .join("");

    // Add staggered reveal animation
    const cards = grid.querySelectorAll(".env-card");
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay =
                entry.target.style.getPropertyValue("--reveal-delay");
              setTimeout(
                () => {
                  entry.target.classList.add("revealed");
                },
                parseInt(delay) || 0,
              );
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
      );

      cards.forEach((card) => observer.observe(card));
    } else {
      cards.forEach((card) => card.classList.add("revealed"));
    }
  }

  // ========================================
  // SECURITY MINDSET GENERATION
  // ========================================
  function generateSecurityMindset() {
    const introEl = document.getElementById("securityIntro");
    const grid = document.getElementById("securityGrid");
    if (!grid || !window.SECURITY_MINDSET) return;

    const mindset = window.SECURITY_MINDSET;

    // Set intro text
    if (introEl && mindset.intro) {
      introEl.textContent = mindset.intro;
    }

    // Icon SVG paths
    const icons = {
      layers: `<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>`,
      lock: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>`,
      shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      filter: `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`,
      eye: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
      target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
    };

    grid.innerHTML = mindset.principles
      .map((principle, index) => {
        const delay = index * 80;
        const iconSvg = icons[principle.icon] || icons.shield;

        return `
          <article
            class="security-card glass-panel reveal"
            role="listitem"
            style="--reveal-delay: ${delay}ms"
          >
            <div class="security-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                ${iconSvg}
              </svg>
            </div>
            <h3 class="security-title">${principle.title}</h3>
            <p class="security-desc">${principle.description}</p>
          </article>
        `;
      })
      .join("");

    // Add staggered reveal animation
    const cards = grid.querySelectorAll(".security-card");
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay =
                entry.target.style.getPropertyValue("--reveal-delay");
              setTimeout(
                () => {
                  entry.target.classList.add("revealed");
                },
                parseInt(delay) || 0,
              );
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
      );

      cards.forEach((card) => observer.observe(card));
    } else {
      cards.forEach((card) => card.classList.add("revealed"));
    }
  }

  // ========================================
  // CIA TRIAD GENERATION
  // ========================================
  function generateCIATriad() {
    const introEl = document.getElementById("ciaIntro");
    const grid = document.getElementById("ciaGrid");
    if (!grid || !window.CIA_TRIAD) return;

    const triad = window.CIA_TRIAD;

    if (introEl && triad.intro) {
      introEl.textContent = triad.intro;
    }

    const icons = {
      lock: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>`,
      "shield-check": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>`,
      server: `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`,
    };

    grid.innerHTML = triad.pillars
      .map((pillar) => {
        const iconSvg = icons[pillar.icon] || icons.lock;
        const methodsHtml = pillar.methods
          .map((m) => `<li>${m}</li>`)
          .join("");

        return `
          <article class="cia-card glass-panel" style="--cia-color: ${pillar.color}">
            <div class="cia-card-header">
              <div class="cia-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  ${iconSvg}
                </svg>
              </div>
              <h4 class="cia-card-title">${pillar.title}</h4>
            </div>
            <p class="cia-summary">${pillar.summary}</p>
            <ul class="cia-methods">${methodsHtml}</ul>
            <p class="cia-real-world"><strong>In Practice:</strong> ${pillar.realWorld}</p>
          </article>
        `;
      })
      .join("");
  }

  // ========================================
  // LINUX PERMISSIONS GENERATION
  // ========================================
  function generateLinuxPermissions() {
    const introEl = document.getElementById("permsIntro");
    const legendEl = document.getElementById("permsBitsLegend");
    const tbodyEl = document.getElementById("permsTableBody");
    const cmdGridEl = document.getElementById("permsCommandsGrid");

    if (!window.LINUX_PERMISSIONS) return;
    const perms = window.LINUX_PERMISSIONS;

    if (introEl && perms.intro) {
      introEl.textContent = perms.intro;
    }

    // Permission bits legend
    if (legendEl && perms.permissionBits) {
      const bitClasses = { r: "read", w: "write", x: "execute" };
      legendEl.innerHTML = perms.permissionBits
        .map(
          (bit) => `
          <div class="perm-bit">
            <span class="perm-bit-symbol ${bitClasses[bit.symbol] || ""}">${bit.symbol}</span>
            <div class="perm-bit-info">
              <span class="perm-bit-name">${bit.meaning}</span>
              <span class="perm-bit-value">Octal value: ${bit.value}</span>
              <span class="perm-bit-desc">${bit.desc}</span>
            </div>
          </div>
        `,
        )
        .join("");
    }

    // Permissions table
    if (tbodyEl && perms.commonPermissions) {
      tbodyEl.innerHTML = perms.commonPermissions
        .map(
          (p) => `
          <tr>
            <td><span class="chmod-code">${p.chmod}</span></td>
            <td><code class="symbolic-code">${p.symbolic}</code></td>
            <td>
              <span class="perm-usecase">${p.useCase}</span>
            </td>
            <td>
              <span>${p.breakdown}</span>
              <div class="perm-breakdown">${p.tip}</div>
            </td>
          </tr>
        `,
        )
        .join("");
    }

    // Quick commands
    if (cmdGridEl && perms.ownershipExamples) {
      cmdGridEl.innerHTML = perms.ownershipExamples
        .map(
          (ex) => `
          <div class="perm-cmd">
            <code class="perm-cmd-code">$ ${ex.command}</code>
            <p class="perm-cmd-desc">${ex.desc}</p>
          </div>
        `,
        )
        .join("");
    }
  }

  // ========================================
  // PROJECTS GENERATION (Simplified)
  // ========================================
  function generateProjects(config) {
    // New simplified grid (excludes featured project)
    const projectsGrid = document.getElementById("projects-grid");

    // Legacy grids (for backwards compatibility)
    const shippedGrid = document.getElementById("projects-shipped");
    const plannedGrid = document.getElementById("projects-planned");
    const shippedEmpty = document.getElementById("shipped-empty");

    if (!config.PROJECTS) return;

    // Generate project card HTML
    function generateCard(project, index) {
      const statusClass = project.status.toLowerCase().replace(" ", "-");
      const hasGithub = project.github && project.github.trim() !== "";
      const hasDemo = project.demo && project.demo.trim() !== "";

      return `
            <article class="project-card tilt-card reveal reveal-child" style="--delay: ${index * 0.1}s">
                <div class="card-shine"></div>
                <div class="scanline-overlay"></div>

                <!-- Status Badge -->
                <div class="project-status status-${statusClass}">${project.status}</div>

                <div class="project-header">
                    <div class="project-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                        </svg>
                    </div>
                    <div class="project-links">
                        ${
                          hasGithub
                            ? `
                            <a href="${project.github}" class="project-link" aria-label="View on GitHub" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                            </a>
                        `
                            : `
                            <span class="project-link disabled" title="Repo will be linked after push">
                                <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                            </span>
                        `
                        }
                        ${
                          hasDemo
                            ? `
                            <a href="${project.demo}" class="project-link" aria-label="View Live Demo" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                    <polyline points="15 3 21 3 21 9"/>
                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                            </a>
                        `
                            : ``
                        }
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-subtitle">${project.subtitle}</p>
                    <ul class="project-stack">
                        ${project.stack.map((tech) => `<li>${tech}</li>`).join("")}
                    </ul>
                </div>
            </article>
        `;
    }

    // New simplified structure - single grid excluding featured (EduSynch)
    if (projectsGrid) {
      const otherProjects = config.PROJECTS.filter(
        (p) => p.title !== "EduSynch",
      );
      projectsGrid.innerHTML = otherProjects.map(generateCard).join("");
    }

    // Legacy structure support
    if (shippedGrid || plannedGrid) {
      const shippedProjects = config.PROJECTS.filter(
        (p) => p.status.toUpperCase() === "SHIPPED",
      );
      const plannedProjects = config.PROJECTS.filter(
        (p) => p.status.toUpperCase() !== "SHIPPED",
      );

      if (shippedGrid) {
        if (shippedProjects.length > 0) {
          shippedGrid.innerHTML = shippedProjects.map(generateCard).join("");
          if (shippedEmpty) shippedEmpty.style.display = "none";
        } else {
          shippedGrid.innerHTML = "";
          if (shippedEmpty) shippedEmpty.style.display = "flex";
        }
      }

      if (plannedGrid) {
        plannedGrid.innerHTML = plannedProjects.map(generateCard).join("");
      }
    }
  }

  // ========================================
  // SIMPLE CONTACT BUTTONS
  // ========================================
  function initSimpleContact(config) {
    const gmailBtn = document.getElementById("gmail-btn");
    const copyBtn = document.getElementById("copy-email-btn");
    const email = config.EMAIL || "christolabiyi35@gmail.com";
    const subject = encodeURIComponent(
      config.EMAIL_SUBJECT || "Portfolio Inquiry — Christopher Olabiyi",
    );

    if (gmailBtn) {
      gmailBtn.addEventListener("click", () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
        window.open(gmailUrl, "_blank");
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(email).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2000);
        });
      });
    }
  }

  // ========================================
  // CONTACT COMPOSER (Gmail, Mailto, Copy)
  // ========================================
  function initContactComposer(config) {
    // If simple contact exists, use that instead
    if (document.getElementById("gmail-btn")) {
      initSimpleContact(config);
      return;
    }

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");
    const previewBody = document.getElementById("preview-body");
    const feedbackEl = document.getElementById("composer-feedback");
    const gmailBtn = document.getElementById("send-gmail");
    const mailtoBtn = document.getElementById("send-mailto");
    const copyBtn = document.getElementById("copy-email");

    if (!nameInput || !gmailBtn) return;

    const recipientEmail = config.EMAIL || "christolabiyi35@gmail.com";
    const emailSubject =
      config.EMAIL_SUBJECT || "Portfolio Inquiry — Christopher Olabiyi";

    // Update preview as user types
    function updatePreview() {
      const name = nameInput.value.trim() || "[Your Name]";
      const email = emailInput.value.trim() || "[Your Email]";
      const message = messageInput.value.trim() || "[Your message...]";

      const previewText = `From: ${name} <${email}>\n\n${message}`;

      if (nameInput.value || emailInput.value || messageInput.value) {
        previewBody.innerHTML = `<pre style="font-family: inherit; margin: 0; white-space: pre-wrap;">${escapeHTML(previewText)}</pre>`;
      } else {
        previewBody.innerHTML =
          '<p class="preview-placeholder">Fill in the fields above to preview your message...</p>';
      }
    }

    // Escape HTML for security
    function escapeHTML(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    // Validate form fields
    function validateFields() {
      const errors = [];
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || name.length < 2) {
        errors.push("Name must be at least 2 characters");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        errors.push("Please enter a valid email address");
      }

      if (!message || message.length < 10) {
        errors.push("Message must be at least 10 characters");
      }

      return errors;
    }

    // Show feedback message
    function showFeedback(message, type) {
      feedbackEl.innerHTML = `
        <div class="feedback-message feedback-${type}">
          ${type === "error" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' : ""}
          <span>${message}</span>
        </div>
      `;

      // Auto-clear after 4 seconds
      setTimeout(() => {
        feedbackEl.innerHTML = "";
      }, 4000);
    }

    // Build email body template
    function buildEmailBody() {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      return `Hi Christopher,

My name is ${name} and I'm reaching out via your portfolio website.

${message}

---
Reply to: ${email}`;
    }

    // Open Gmail Compose
    function openGmailCompose() {
      const errors = validateFields();
      if (errors.length > 0) {
        showFeedback(errors.join(". "), "error");
        return;
      }

      const body = buildEmailBody();
      const gmailURL = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;

      window.open(gmailURL, "_blank");
    }

    // Open Mailto
    function openMailto() {
      const errors = validateFields();
      if (errors.length > 0) {
        showFeedback(errors.join(". "), "error");
        return;
      }

      const body = buildEmailBody();
      const mailtoURL = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoURL;
    }

    // Copy email to clipboard
    async function copyEmail() {
      try {
        await navigator.clipboard.writeText(recipientEmail);
        showNeonToast("Email copied to clipboard!");
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = recipientEmail;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showNeonToast("Email copied to clipboard!");
      }
    }

    // Show neon toast notification
    function showNeonToast(message) {
      // Remove existing toast
      const existing = document.querySelector(".neon-toast");
      if (existing) existing.remove();

      const toast = document.createElement("div");
      toast.className = "neon-toast";
      toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>${message}</span>
      `;

      document.body.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.add("show");
      });

      // Remove after 3 seconds
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    }

    // Event listeners
    nameInput.addEventListener("input", updatePreview);
    emailInput.addEventListener("input", updatePreview);
    messageInput.addEventListener("input", updatePreview);

    gmailBtn.addEventListener("click", openGmailCompose);
    mailtoBtn.addEventListener("click", openMailto);
    copyBtn.addEventListener("click", copyEmail);
  }

  // Legacy contact form handler (kept for compatibility)
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Validation
      const errors = validateForm(data);

      if (errors.length > 0) {
        showFormFeedback(errors.join("<br>"), "error");
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span class="btn-loader"></span> Transmitting...';
      submitBtn.disabled = true;

      // Fake delay for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showFormFeedback("Message received. I'll respond soon.", "success");
      form.reset();

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }

  function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters");
    }

    return errors;
  }

  function showFormFeedback(message, type) {
    // Remove existing feedback
    const existing = document.querySelector(".form-feedback");
    if (existing) existing.remove();

    const feedback = document.createElement("div");
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.innerHTML = `
            <div class="feedback-icon">
                ${
                  type === "success"
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
                }
            </div>
            <div class="feedback-message">${message}</div>
            <button class="feedback-close" aria-label="Close">&times;</button>
        `;

    document.getElementById("contact-form").appendChild(feedback);

    // Close button
    feedback.querySelector(".feedback-close").addEventListener("click", () => {
      feedback.classList.add("feedback-closing");
      setTimeout(() => feedback.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (feedback.parentElement) {
        feedback.classList.add("feedback-closing");
        setTimeout(() => feedback.remove(), 300);
      }
    }, 5000);
  }

  // ========================================
  // CV PRINT HANDLER
  // ========================================
  function initCVPrint() {
    const printBtn = document.getElementById("print-cv");
    if (printBtn) {
      printBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.print();
      });
    }
  }

  // ========================================
  // UPDATE YEAR
  // ========================================
  function updateYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  // ========================================
  // ACTIVE NAV HIGHLIGHTING
  // ========================================
  function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ========================================
  // KEYBOARD ACCESSIBILITY
  // ========================================
  function initKeyboardNav() {
    // Add focus-visible polyfill behavior
    document.body.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-nav");
      }
    });

    document.body.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-nav");
    });
  }

  // ========================================
  // CV SKILLS GENERATOR (Data-driven from config)
  // ========================================
  function generateCVSkills(config) {
    const cvSkillsContainer = document.getElementById("cv-skills-container");
    if (!cvSkillsContainer) return;

    const skillsData = window.SKILLS || config.SKILLS;
    if (!skillsData) return;

    let html = "";

    Object.entries(skillsData).forEach(([categoryKey, categoryData]) => {
      let categoryName, skillNames;

      if (categoryData.items && Array.isArray(categoryData.items)) {
        // Old nested format
        categoryName = categoryData.name || categoryKey;
        skillNames = categoryData.items.map((skill) => skill.name).join(", ");
      } else {
        // New flat format: { "Skill": percent }
        categoryName = categoryKey;
        skillNames = Object.keys(categoryData).join(", ");
      }

      html += `
        <div class="cv-skill-group">
          <h4>${categoryName}</h4>
          <p class="cv-skill-list">${skillNames}</p>
        </div>
      `;
    });

    cvSkillsContainer.innerHTML = html;
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  function init() {
    waitForConfig((config) => {
      injectConfig(config);
      generateSkills(config);
      generateProofOfWork();
      generateCaseStudies();
      generateEnvironment();
      generateSecurityMindset();
      generateCIATriad();
      generateLinuxPermissions();
      generateCVSkills(config);
      generateProjects(config);
      initTypingAnimation(config);
      initContactComposer(config);
    });

    initContactForm();
    initCVPrint();
    updateYear();
    initActiveNav();
    initKeyboardNav();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

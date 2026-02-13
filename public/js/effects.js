/**
 * Cyberpunk Effects Engine
 * ========================
 * Handles: Canvas animations, glitch effects, scroll reveals, 3D tilt, mobile nav
 */

(function () {
  "use strict";

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ========================================
  // CANVAS CYBER GRID + PARTICLES
  // ========================================
  class CyberCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.gridLines = [];
      this.mouse = { x: 0, y: 0 };
      this.animationId = null;
      this.isRunning = false;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());

      if (!prefersReducedMotion) {
        this.createParticles();
        this.createGrid();
        document.addEventListener("mousemove", (e) => {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
        });
        this.start();
      } else {
        // Static fallback for reduced motion
        this.drawStaticGrid();
      }
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createParticles() {
      const count = Math.min(
        50,
        Math.floor((this.width * this.height) / 20000),
      );
      this.particles = [];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.5 ? "#00f0ff" : "#ff00ff",
        });
      }
    }

    createGrid() {
      this.gridSpacing = 60;
      this.gridLines = [];

      // Horizontal lines
      for (
        let y = 0;
        y < this.height + this.gridSpacing;
        y += this.gridSpacing
      ) {
        this.gridLines.push({ type: "h", y: y, offset: 0 });
      }

      // Vertical lines
      for (
        let x = 0;
        x < this.width + this.gridSpacing;
        x += this.gridSpacing
      ) {
        this.gridLines.push({ type: "v", x: x, offset: 0 });
      }
    }

    drawStaticGrid() {
      this.ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      this.ctx.lineWidth = 1;

      const spacing = 60;

      for (let x = 0; x < this.width; x += spacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }

      for (let y = 0; y < this.height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }
    }

    drawGrid(time) {
      this.ctx.strokeStyle = "rgba(0, 240, 255, 0.03)";
      this.ctx.lineWidth = 1;

      const spacing = this.gridSpacing;
      const wave = Math.sin(time * 0.001) * 2;

      // Horizontal lines with subtle wave
      for (let y = 0; y < this.height + spacing; y += spacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y + wave);
        this.ctx.lineTo(this.width, y + wave);
        this.ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < this.width + spacing; x += spacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }

      // Perspective grid effect at bottom
      this.ctx.save();
      this.ctx.globalAlpha = 0.05;
      const horizonY = this.height * 0.7;
      const vanishX = this.width / 2;

      for (let i = -10; i <= 10; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(vanishX, horizonY);
        this.ctx.lineTo(vanishX + i * 200, this.height);
        this.ctx.strokeStyle = "#00f0ff";
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    drawParticles() {
      this.particles.forEach((p) => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        // Mouse interaction
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        // Draw connections
        this.particles.forEach((p2) => {
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = p.color;
            this.ctx.globalAlpha = ((100 - dist2) / 100) * 0.1;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
          }
        });
      });
    }

    animate(time) {
      if (!this.isRunning) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      this.drawGrid(time);
      this.drawParticles();

      this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.animate(0);
    }

    stop() {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  // ========================================
  // GLITCH TEXT EFFECT
  // ========================================
  class GlitchText {
    constructor(selector) {
      this.elements = document.querySelectorAll(selector);
      if (prefersReducedMotion) return;
      this.init();
    }

    init() {
      this.elements.forEach((el) => {
        // Occasional subtle glitch - every 3-6 seconds
        this.scheduleGlitch(el);
      });
    }

    scheduleGlitch(el) {
      // Random delay between 3-6 seconds
      const delay = 3000 + Math.random() * 3000;
      setTimeout(() => {
        this.triggerGlitch(el);
        this.scheduleGlitch(el);
      }, delay);
    }

    triggerGlitch(el) {
      el.classList.add("glitching");
      setTimeout(() => el.classList.remove("glitching"), 150);
    }
  }

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================
  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll(".reveal");
      if (this.elements.length === 0) return;
      this.init();
    }

    init() {
      const options = {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            // Stagger children if present
            const children = entry.target.querySelectorAll(".reveal-child");
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("revealed");
              }, index * 100);
            });
          }
        });
      }, options);

      this.elements.forEach((el) => observer.observe(el));
    }
  }

  // ========================================
  // 3D TILT CARD EFFECT
  // ========================================
  class TiltCard {
    constructor(selector) {
      this.cards = document.querySelectorAll(selector);
      if (prefersReducedMotion || this.cards.length === 0) return;
      this.init();
    }

    init() {
      this.cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => this.handleMove(e, card));
        card.addEventListener("mouseleave", (e) => this.handleLeave(e, card));
        card.addEventListener("mouseenter", (e) => this.handleEnter(e, card));
      });
    }

    handleMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Move shine effect
      const shine = card.querySelector(".card-shine");
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 80%)`;
      }
    }

    handleLeave(e, card) {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s ease";
    }

    handleEnter(e, card) {
      card.style.transition = "none";
    }
  }

  // ========================================
  // MOBILE NAVIGATION
  // ========================================
  class MobileNav {
    constructor() {
      this.toggle = document.getElementById("nav-toggle");
      this.menu = document.getElementById("nav-menu");
      this.body = document.body;

      if (!this.toggle || !this.menu) return;
      this.init();
    }

    init() {
      this.toggle.addEventListener("click", () => this.toggleMenu());

      // Close on link click
      const links = this.menu.querySelectorAll(".nav-link");
      links.forEach((link) => {
        link.addEventListener("click", () => this.closeMenu());
      });

      // Close on outside click
      document.addEventListener("click", (e) => {
        if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
          this.closeMenu();
        }
      });

      // Close on escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeMenu();
      });
    }

    toggleMenu() {
      const isOpen = this.menu.classList.toggle("active");
      this.toggle.classList.toggle("active");
      this.toggle.setAttribute("aria-expanded", isOpen);
      this.body.style.overflow = isOpen ? "hidden" : "";
    }

    closeMenu() {
      this.menu.classList.remove("active");
      this.toggle.classList.remove("active");
      this.toggle.setAttribute("aria-expanded", "false");
      this.body.style.overflow = "";
    }
  }

  // ========================================
  // TERMINAL TYPING EFFECT
  // ========================================
  class TerminalTyping {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container || prefersReducedMotion) return;

      this.commands = window.CONFIG?.TERMINAL_COMMANDS || [];
      this.currentLine = 0;
      this.init();
    }

    init() {
      // Check if terminal is in viewport before starting
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.startTyping();
            observer.disconnect();
          }
        },
        { threshold: 0.5 },
      );

      observer.observe(this.container);
    }

    async startTyping() {
      for (const cmd of this.commands) {
        await this.typeCommand(cmd.cmd);
        await this.wait(300);
        await this.showOutput(cmd.output);
        await this.wait(800);
      }

      // Add blinking cursor at end
      this.addCursor();
    }

    async typeCommand(text) {
      const line = document.createElement("div");
      line.className = "terminal-line";
      line.innerHTML =
        '<span class="terminal-prompt">codex@cyberdeck:~$</span> <span class="terminal-cmd"></span>';
      this.container.appendChild(line);

      const cmdSpan = line.querySelector(".terminal-cmd");

      for (const char of text) {
        cmdSpan.textContent += char;
        await this.wait(50 + Math.random() * 50);
      }
    }

    async showOutput(text) {
      const lines = text.split("\n");
      for (const line of lines) {
        const outputEl = document.createElement("div");
        outputEl.className = "terminal-output";
        outputEl.textContent = line;
        this.container.appendChild(outputEl);
        await this.wait(100);
      }
    }

    addCursor() {
      const cursor = document.createElement("div");
      cursor.className = "terminal-line";
      cursor.innerHTML =
        '<span class="terminal-prompt">codex@cyberdeck:~$</span> <span class="terminal-cursor">▊</span>';
      this.container.appendChild(cursor);
    }

    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  // ========================================
  // SCANLINE EFFECT (for project cards)
  // ========================================
  class ScanlineEffect {
    constructor(selector) {
      this.elements = document.querySelectorAll(selector);
      if (prefersReducedMotion) return;
      this.init();
    }

    init() {
      this.elements.forEach((el) => {
        const scanline = document.createElement("div");
        scanline.className = "scanline-overlay";
        el.appendChild(scanline);
      });
    }
  }

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  class SmoothScroll {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const href = anchor.getAttribute("href");
          if (href === "#") return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerHeight =
              document.querySelector(".header")?.offsetHeight || 80;
            const targetPos =
              target.getBoundingClientRect().top +
              window.pageYOffset -
              headerHeight;

            window.scrollTo({
              top: targetPos,
              behavior: prefersReducedMotion ? "auto" : "smooth",
            });
          }
        });
      });
    }
  }

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  class HeaderScroll {
    constructor() {
      this.header = document.getElementById("header");
      if (!this.header) return;
      this.init();
    }

    init() {
      let ticking = false;

      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (window.pageYOffset > 50) {
              this.header.classList.add("scrolled");
            } else {
              this.header.classList.remove("scrolled");
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  // ========================================
  // INITIALIZE ALL EFFECTS
  // ========================================
  function initEffects() {
    // Canvas background
    new CyberCanvas("cyber-canvas");

    // Glitch text
    new GlitchText(".glitch-text");

    // Scroll reveals
    new ScrollReveal();

    // 3D tilt cards
    new TiltCard(".tilt-card");

    // Mobile navigation
    new MobileNav();

    // Terminal typing
    new TerminalTyping("terminal-content");

    // Scanline effect
    new ScanlineEffect(".project-card");

    // Smooth scrolling
    new SmoothScroll();

    // Header scroll
    new HeaderScroll();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEffects);
  } else {
    initEffects();
  }

  // Export for external use
  window.CyberEffects = {
    CyberCanvas,
    GlitchText,
    ScrollReveal,
    TiltCard,
    TerminalTyping,
  };
})();

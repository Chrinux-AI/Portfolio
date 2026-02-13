/**
 * CV PDF Export
 * =============
 * Automatic PDF download with dark theme preservation
 * Uses html2pdf.js (lazy-loaded for performance)
 *
 * Strategy: Clone the CV DOM, strip all SVGs from the clone,
 * render the clone off-screen — original page untouched.
 */

(function () {
  "use strict";

  // ── DOM refs ──────────────────────────────────────────────
  var downloadBtn = document.getElementById("downloadCvBtn");
  var printBtn = document.getElementById("printCvBtn");
  var cvRoot = document.getElementById("cvRoot");
  var toast = document.getElementById("cv-toast");
  var toastMsg = document.getElementById("toast-message");

  if (!downloadBtn || !cvRoot) {
    console.warn("CV Export: Required elements (#downloadCvBtn, #cvRoot) not found.");
    return;
  }

  // ── Toast helper ──────────────────────────────────────────
  function showToast(msg, type) {
    if (!toast || !toastMsg) return;
    var icons = {
      success:
        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      error:
        '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    };
    var svg = toast.querySelector("svg");
    if (svg) svg.innerHTML = icons[type] || icons.info;
    toast.className = "cv-toast " + (type || "info");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("show");
    }, 4500);
  }

  // ── Lazy-load html2pdf.js ─────────────────────────────────
  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = url;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureLib() {
    if (window.html2pdf) return Promise.resolve();
    return loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    ).catch(function () {
      return loadScript(
        "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js"
      );
    });
  }

  // ── Build a clean clone for rendering ─────────────────────
  function buildExportClone() {
    var clone = cvRoot.cloneNode(true);

    // 1. Remove ALL SVGs (the root cause of "Unsupported image type")
    var svgs = clone.querySelectorAll("svg");
    for (var i = 0; i < svgs.length; i++) {
      svgs[i].parentNode.removeChild(svgs[i]);
    }

    // 2. Remove any images that could be cross-origin or broken
    var imgs = clone.querySelectorAll("img");
    for (var j = 0; j < imgs.length; j++) {
      var src = imgs[j].getAttribute("src") || "";
      if (src.indexOf("data:") !== 0 && src.indexOf("blob:") !== 0) {
        // External image — could cause taint; remove if not local
        if (src.indexOf("http") === 0) {
          imgs[j].parentNode.removeChild(imgs[j]);
        }
      }
    }

    // 3. Force dark background on clone root
    clone.style.background = "#0b0f17";
    clone.style.color = "#e9f1ff";
    clone.style.padding = "24px";
    clone.style.width = cvRoot.offsetWidth + "px";

    // 4. Kill every animation / transition inside
    var all = clone.querySelectorAll("*");
    for (var k = 0; k < all.length; k++) {
      all[k].style.animation = "none";
      all[k].style.transition = "none";
    }

    return clone;
  }

  // ── Copy computed styles into clone ───────────────────────
  // html2canvas only reads inline styles on off-screen nodes, so we
  // need to bake the important computed styles into the clone.
  function bakeStyles(source, clone) {
    var srcChildren = source.querySelectorAll("*");
    var clnChildren = clone.querySelectorAll("*");
    var len = Math.min(srcChildren.length, clnChildren.length);
    var props = [
      "color",
      "background",
      "backgroundColor",
      "backgroundImage",
      "borderColor",
      "borderRadius",
      "fontSize",
      "fontWeight",
      "fontFamily",
      "lineHeight",
      "letterSpacing",
      "padding",
      "margin",
      "display",
      "flexDirection",
      "gap",
      "gridTemplateColumns",
      "textAlign",
      "textDecoration",
      "opacity",
      "boxShadow",
      "borderBottom",
      "borderTop",
      "maxWidth",
      "width",
    ];
    for (var i = 0; i < len; i++) {
      var cs = window.getComputedStyle(srcChildren[i]);
      for (var p = 0; p < props.length; p++) {
        try {
          clnChildren[i].style[props[p]] = cs.getPropertyValue(props[p]);
        } catch (_) {}
      }
    }
  }

  // ── Main download handler ─────────────────────────────────
  function downloadPDF() {
    downloadBtn.classList.add("loading");
    downloadBtn.disabled = true;
    showToast("Generating PDF…", "info");

    ensureLib()
      .then(function () {
        if (!window.html2pdf) throw new Error("html2pdf failed to load");

        // Build a disposable clone — original page stays untouched
        var clone = buildExportClone();

        // Copy computed styles so the clone looks correct off-screen
        bakeStyles(cvRoot, clone);

        // Mount off-screen for html2canvas to measure
        clone.style.position = "fixed";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.zIndex = "-1";
        document.body.appendChild(clone);

        var opt = {
          margin: [6, 6, 6, 6],
          filename: "Christopher_Olabiyi_CV.pdf",
          image: { type: "jpeg", quality: 0.92 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#0b0f17",
            letterRendering: true,
            foreignObjectRendering: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
            avoid: [
              ".cv-project",
              ".cv-skill-group",
              ".cv-education-card",
              ".cv-section",
            ],
          },
        };

        return window
          .html2pdf()
          .set(opt)
          .from(clone)
          .save()
          .then(function () {
            // Clean up clone
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            showToast("CV downloaded successfully!", "success");
          })
          .catch(function (err) {
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            throw err;
          });
      })
      .catch(function (err) {
        console.error("PDF export failed:", err);
        showToast("PDF export failed. Try the Print option instead.", "error");
      })
      .finally(function () {
        downloadBtn.classList.remove("loading");
        downloadBtn.disabled = false;
      });
  }

  // ── Wire up buttons ───────────────────────────────────────
  downloadBtn.addEventListener("click", downloadPDF);

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.classList.toggle("open", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Active section indicator ---------------- */
  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = Array.prototype.slice
    .call(navLinks)
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + id;
              link.classList.toggle("active", match);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(
    ".skill-group, .project-card, .timeline-item, .roadmap-stage, .education-card, .values, .focus-panel"
  );
  revealTargets.forEach(function (el) {
    el.setAttribute("data-reveal", "");
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      revealObserver.observe(el);
    });

    var focusBars = document.querySelectorAll(".focus-bar");
    var barObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    focusBars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("in-view");
    });
    document.querySelectorAll(".focus-bar").forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------------- Hero terminal typing effect ---------------- */
  var terminalBody = document.getElementById("terminalBody");
  var terminalLines = [
    { text: "$ python pipeline.py", delay: 0 },
    { text: "", delay: 300 },
    { text: "[INFO] Extracting data...", delay: 500 },
    { text: "[INFO] Transforming records...", delay: 900 },
    { text: "[INFO] Validating data...", delay: 900 },
    { text: "[SUCCESS] Pipeline completed.", delay: 700 }
  ];

  function renderTerminalInstantly() {
    terminalBody.textContent = terminalLines.map(function (l) { return l.text; }).join("\n");
  }

  function typeTerminal() {
    var lineIndex = 0;
    var charIndex = 0;
    var output = "";

    function typeNextChar() {
      if (lineIndex >= terminalLines.length) return;
      var line = terminalLines[lineIndex];

      if (charIndex === 0 && lineIndex > 0) {
        output += "\n";
      }

      if (charIndex < line.text.length) {
        output += line.text.charAt(charIndex);
        terminalBody.textContent = output;
        charIndex++;
        setTimeout(typeNextChar, 14);
      } else {
        lineIndex++;
        charIndex = 0;
        var nextDelay = lineIndex < terminalLines.length ? terminalLines[lineIndex].delay : 0;
        setTimeout(typeNextChar, nextDelay);
      }
    }

    typeNextChar();
  }

  if (terminalBody) {
    if (prefersReducedMotion) {
      renderTerminalInstantly();
    } else {
      typeTerminal();
    }
  }

  /* ---------------- Close mobile menu on resize to desktop ---------------- */
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860 && mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
})();

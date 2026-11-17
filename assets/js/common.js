$(document).ready(function () {
  // Toggle abstract, award, and bibtex drawers with accessible aria-expanded state
  function toggleDrawer(trigger, targetSelector) {
    const container = $(trigger).closest(".links").parent();
    const target = container.find(targetSelector);
    const willOpen = !target.hasClass("open");

    container.find(".abstract.hidden.open, .award.hidden.open, .bibtex.hidden.open").removeClass("open");
    container.find(".links .abstract, .links .award, .links .bibtex").attr("aria-expanded", "false");

    if (willOpen) {
      target.addClass("open");
      $(trigger).attr("aria-expanded", "true");
    }
  }

  $("button.abstract, a.abstract").on("click", function () {
    toggleDrawer(this, ".abstract.hidden");
  });
  $("button.award, a.award").on("click", function () {
    toggleDrawer(this, ".award.hidden");
  });
  $("button.bibtex, a.bibtex").on("click", function () {
    toggleDrawer(this, ".bibtex.hidden");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    $(".publications h2, .cv h3").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });

  // Fallback scroll-reveal animation only when native CSS view timelines are unsupported
  if (
    !CSS.supports("(animation-timeline: view()) and (animation-range: entry)") &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  ) {
    const targets = document.querySelectorAll(".bento-card, .publications ol.bibliography > li, .cv .card");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" }
    );
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add("reveal-pending");
        observer.observe(el);
      }
    });
  }
});

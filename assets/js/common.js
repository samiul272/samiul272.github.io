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
});

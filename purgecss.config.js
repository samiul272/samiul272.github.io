module.exports = {
  content: ["_site/**/*.html", "_site/**/*.js"],
  css: ["_site/assets/css/*.css"],
  output: "_site/assets/css/",
  skippedContentGlobs: ["_site/assets/**/*.html"],
  safelist: {
    standard: [
      "open",
      "active",
      "unloaded",
      "dark",
      "table-dark",
      "copied",
      "collapsing",
      "show",
      "is-loaded",
      "has-citations",
      "reveal-pending",
      "is-revealed",
    ],
    greedy: [/^ninja-/, /^medium-zoom/],
  },
};

// Check if the user is on a Mac and update the shortcut key for search accordingly
const updateSearchShortcutLabel = () => {
  const isMac = /mac/i.test(navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform || "");
  const shortcutKeyElement = document.querySelector("#search-toggle .search-kbd");
  if (shortcutKeyElement && isMac) {
    shortcutKeyElement.innerHTML = "&#x2318;K";
  }
};

if (document.readyState !== "loading") {
  updateSearchShortcutLabel();
} else {
  document.addEventListener("DOMContentLoaded", updateSearchShortcutLabel);
}

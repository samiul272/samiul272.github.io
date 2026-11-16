import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("bibsearch");
  const filterButtons = Array.from(document.querySelectorAll(".pub-pill"));
  const countEl = document.getElementById("pub-count");
  const emptyEl = document.getElementById("pub-empty");
  let activeFilter = "all";

  if (!searchInput) return;

  const updateCounts = () => {
    const allItems = document.querySelectorAll(".bibliography > li");
    const visibleItems = document.querySelectorAll(".bibliography > li:not(.unloaded)");
    if (countEl) {
      countEl.textContent = `Showing ${visibleItems.length} of ${allItems.length} publications`;
    }
    if (emptyEl) {
      emptyEl.classList.toggle("unloaded", visibleItems.length > 0);
    }
  };

  const filterItems = (searchTerm) => {
    const normalizedTerm = (searchTerm || "").trim().toLowerCase();
    document.querySelectorAll(".bibliography, .unloaded").forEach((element) => {
      if (element.id !== "pub-empty") {
        element.classList.remove("unloaded");
      }
    });

    // Apply search query highlighting & matching
    let nonMatchingBySearch = new Set();
    if (normalizedTerm.length > 0) {
      if (CSS.highlights) {
        const nonMatchingElements = highlightSearchTerm({ search: normalizedTerm, selector: ".bibliography > li" });
        if (nonMatchingElements) {
          nonMatchingElements.forEach((el) => nonMatchingBySearch.add(el));
        }
      } else {
        document.querySelectorAll(".bibliography > li").forEach((element) => {
          const text = element.innerText.toLowerCase();
          if (!text.includes(normalizedTerm)) {
            nonMatchingBySearch.add(element);
          }
        });
      }
    } else if (CSS.highlights) {
      CSS.highlights.delete("search");
    }

    // Apply topic/selected filter combined with search term
    document.querySelectorAll(".bibliography > li").forEach((li) => {
      const entry = li.querySelector(".bib-entry");
      const topic = entry ? entry.getAttribute("data-topic") || "" : "";
      const isSelected = entry ? entry.getAttribute("data-selected") === "true" : false;

      let matchesFilter = true;
      if (activeFilter === "selected") {
        matchesFilter = isSelected;
      } else if (activeFilter !== "all") {
        matchesFilter = topic === activeFilter;
      }

      if (!matchesFilter || nonMatchingBySearch.has(li)) {
        li.classList.add("unloaded");
      }
    });

    // Hide empty year headings and lists
    document.querySelectorAll("h2.bibliography").forEach(function (element) {
      let iterator = element.nextElementSibling;
      let hideFirstGroupingElement = true;
      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");

          if (unloadedSiblings.length === totalSiblings.length) {
            ol.classList.add("unloaded");
          } else {
            hideFirstGroupingElement = false;
          }
        }
        iterator = iterator.nextElementSibling;
      }
      if (hideFirstGroupingElement) {
        element.classList.add("unloaded");
      }
    });

    updateCounts();
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-filter") || "all";
      filterButtons.forEach((other) => {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      filterItems(searchInput.value);
    });
  });

  const updateInputField = () => {
    const hashValue = decodeURIComponent(window.location.hash.substring(1));
    searchInput.value = hashValue;
    filterItems(hashValue);
  };

  let timeoutId;
  searchInput.addEventListener("input", function () {
    clearTimeout(timeoutId);
    const searchTerm = this.value;
    timeoutId = setTimeout(() => filterItems(searchTerm), 180);
  });

  window.addEventListener("hashchange", updateInputField);

  updateInputField();
});

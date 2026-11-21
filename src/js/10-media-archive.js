// <!-- MEDIA_ARCHIVE_DATA_START -->
window.MEDIA_ARCHIVE_DATA = {
  "news": [
    {
      "title": "Airlines Face New Flight Deck Audio Rules",
      "url": "https://www.bbc.com/news/articles/cm9wz01dx8xro"
    },
    {
      "title": "The Peruvian Hotel with a Terrifying Check-In",
      "url": "https://www.bbc.com/travel/article/20261028-the-peruvian-hotel-with-a-terrifying-check-in"
    }
  ],
  "films": [
    {
      "title": "Primetime (2026) • Dir. Lance Oppenheim",
      "url": "https://www.imdb.com/title/tt34206385/"
    },
    {
      "title": "Hope (호프) (2026) • Dir. Na Hong-jin",
      "url": "https://www.imdb.com/title/tt27369017/"
    },
    {
      "title": "Anatomy of a Fall (2023) • Dir. Justine Triet",
      "url": "https://www.imdb.com/title/tt17009710/"
    },
    {
      "title": "Perfect Days (2023) • Dir. Wim Wenders",
      "url": "https://www.imdb.com/title/tt27503884/"
    },
    {
      "title": "Past Lives (2023) • Dir. Celine Song",
      "url": "https://www.imdb.com/title/tt13238346/"
    }
  ]
};
// <!-- MEDIA_ARCHIVE_DATA_END -->

    function openMediaArchiveModal(type) {
      const modal = document.getElementById("media-archive-modal");
      const titleEl = document.getElementById("archive-modal-title");
      const iconEl = document.getElementById("archive-modal-icon");
      const listEl = document.getElementById("archive-modal-list");
      if (!modal || !listEl) return;

      const isNews = type === "news";
      if (iconEl) iconEl.textContent = isNews ? "📰" : "🎬";
      if (titleEl) titleEl.textContent = isNews ? "Previous News Articles" : "Previous Film Recommendations";

      const items = isNews ? (window.MEDIA_ARCHIVE_DATA?.news || []) : (window.MEDIA_ARCHIVE_DATA?.films || []);
      if (!items || items.length === 0) {
        listEl.innerHTML = '<p class="py-6 text-xs text-slate-400 italic text-center">No previous items archived yet.</p>';
      } else {
        listEl.innerHTML = items.map(item => `
          <a 
            href="${item.url}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer text-xs"
            title="Open link in new tab ↗"
          >
            <span class="text-slate-800 font-medium group-hover:text-amber-600 transition-colors line-clamp-1 pr-3">
              ${item.title}
            </span>
            <span class="text-slate-400 group-hover:text-amber-600 shrink-0 text-xs font-mono font-bold">↗</span>
          </a>
        `).join("");
      }

      modal.classList.remove("hidden");
    }

    function closeMediaArchiveModal() {
      const modal = document.getElementById("media-archive-modal");
      if (modal) modal.classList.add("hidden");
    }

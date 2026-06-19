function pagesLoadComponent(elementId, filePath) {
  return fetch(filePath)
    .then(function (response) { return response.text(); })
    .then(function (html) {
      var target = document.getElementById(elementId);
      if (target) target.innerHTML = html;
    })
    .catch(function (error) {
      console.error("Error loading component:", error);
    });
}

function pagesEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pagesSvgDataUri(title, subtitle, colors, initials) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 780">' +
    '<defs>' +
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="' + colors[0] + '"/>' +
    '<stop offset="100%" stop-color="' + colors[1] + '"/>' +
    '</linearGradient>' +
    '<radialGradient id="r" cx="32%" cy="22%" r="70%">' +
    '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>' +
    '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
    '</radialGradient>' +
    '</defs>' +
    '<rect width="560" height="780" fill="url(#g)"/>' +
    '<circle cx="125" cy="120" r="210" fill="url(#r)"/>' +
    '<circle cx="500" cy="675" r="180" fill="rgba(255,255,255,0.08)"/>' +
    '<path d="M0 610 C120 540, 205 708, 340 628 C440 570, 490 586, 560 540 L560 780 L0 780 Z" fill="rgba(255,255,255,0.08)"/>' +
    '<text x="56" y="84" fill="rgba(255,255,255,0.82)" font-family="Rubik, Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="4">' + pagesEscape(initials) + '</text>' +
    '<text x="56" y="570" fill="#fff7f0" font-family="Rubik, Arial, sans-serif" font-size="44" font-weight="800">' + pagesEscape(title) + '</text>' +
    '<text x="56" y="622" fill="rgba(255,255,255,0.9)" font-family="Rubik, Arial, sans-serif" font-size="24" font-style="italic">' + pagesEscape(subtitle) + '</text>' +
    '</svg>';

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function pagesSetText(root, selector, value) {
  var element = root.querySelector(selector);
  if (element) element.textContent = value || "";
}

function pagesFindBook(slug) {
  var books = (window.PagesCoData && window.PagesCoData.allBooks) || [];
  var match = null;

  for (var i = 0; i < books.length; i += 1) {
    if (books[i].slug === slug) {
      match = books[i];
      break;
    }
  }

  return match || books[0] || null;
}

function pagesRenderBookGrid(containerId, books, options) {
  var container = document.getElementById(containerId);
  var template = document.getElementById("book-card-template");
  var linkBase = options && options.linkBase ? options.linkBase : "../page/booksDetail.html";

  if (!container || !template) return;

  container.innerHTML = "";

  books.forEach(function (book) {
    var node = template.content.cloneNode(true);
    var card = node.querySelector(".book-card");
    var cover = node.querySelector("[data-role='cover']");
    var link = node.querySelector("[data-role='link']");

    pagesSetText(node, "[data-role='badge']", book.badge);
    pagesSetText(node, "[data-role='cover-title']", book.title);
    pagesSetText(node, "[data-role='cover-author']", book.author);
    pagesSetText(node, "[data-role='title']", book.title);
    pagesSetText(node, "[data-role='author']", book.author);
    pagesSetText(node, "[data-role='summary']", book.summary);
    pagesSetText(node, "[data-role='price']", book.price);
    pagesSetText(node, "[data-role='old-price']", book.oldPrice);
    pagesSetText(node, "[data-role='rating']", book.rating);

    if (card) {
      card.setAttribute("aria-label", book.title + " by " + book.author);
    }

    if (cover) {
      cover.classList.add(book.coverClass);
    }

    if (!book.oldPrice) {
      var oldPrice = node.querySelector("[data-role='old-price']");
      if (oldPrice) oldPrice.remove();
    }

    if (link) {
      link.href = linkBase + "?book=" + encodeURIComponent(book.slug);
      link.setAttribute("aria-label", "Open " + book.title);
    }

    container.appendChild(node);
  });
}

function pagesRenderCategoryChips(containerId, categories, activeCategory) {
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  categories.forEach(function (category) {
    var item = document.createElement("a");
    item.className = "chip" + (category === activeCategory ? " is-active" : "");
    item.href = "../page/books.html" + (category === "All" ? "" : "?category=" + encodeURIComponent(category));
    item.textContent = category;
    item.addEventListener("click", function (event) {
      event.preventDefault();
    });
    container.appendChild(item);
  });
}

function pagesRenderPagination(containerId, currentPage, totalPages) {
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  for (var i = 1; i <= totalPages; i += 1) {
    var link = document.createElement("a");
    link.className = "pagination__link" + (i === currentPage ? " is-active" : "");
    link.href = "#books-page-" + i;
    link.textContent = String(i);
    container.appendChild(link);
  }
}

function pagesScrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pagesActivateNav() {
  var currentPath = window.location.pathname.toLowerCase();
  var currentHash = window.location.hash.toLowerCase();
  var isHome = currentPath.indexOf("home.html") !== -1 || currentPath.endsWith("/");
  var isShop = currentPath.indexOf("books.html") !== -1;
  var isDetail = currentPath.indexOf("booksdetail.html") !== -1;

  var homeLinks = document.querySelectorAll("[data-nav='home']");
  var shopLinks = document.querySelectorAll("[data-nav='shop']");
  var genreLinks = document.querySelectorAll("[data-nav='genres']");
  var newLinks = document.querySelectorAll("[data-nav='new']");
  var aboutLinks = document.querySelectorAll("[data-nav='about']");

  for (var i = 0; i < homeLinks.length; i += 1) {
    homeLinks[i].classList.toggle("is-active", isHome);
  }

  for (var j = 0; j < shopLinks.length; j += 1) {
    shopLinks[j].classList.toggle("is-active", isShop || isDetail);
  }

  for (var k = 0; k < genreLinks.length; k += 1) {
    genreLinks[k].classList.toggle("is-active", isHome && currentHash === "#genres");
  }

  for (var l = 0; l < newLinks.length; l += 1) {
    newLinks[l].classList.toggle("is-active", isHome && currentHash === "#new-arrivals");
  }

  for (var m = 0; m < aboutLinks.length; m += 1) {
    aboutLinks[m].classList.toggle("is-active", isHome && currentHash === "#featured-section");
  }
}

function pagesSetupMobileMenu() {
  var toggle = document.querySelector("[data-mobile-menu-toggle]");
  var menu = document.getElementById("site-mobile-menu");
  if (!toggle || !menu) return;

  var items = menu.querySelectorAll("a, button");
  var isOpen = false;

  function setOpen(nextOpen) {
    isOpen = nextOpen;
    toggle.setAttribute("aria-expanded", String(nextOpen));
    menu.hidden = !nextOpen;
    menu.classList.toggle("is-open", nextOpen);
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen);
  });

  for (var i = 0; i < items.length; i += 1) {
    items[i].addEventListener("click", function () {
      setOpen(false);
    });
  }

  document.addEventListener("click", function (event) {
    if (!isOpen) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) {
      setOpen(false);
    }
  });
}

function pagesSetupLoginModal() {
  var modal = document.getElementById("signin-modal");
  if (!modal) return;

  var openButtons = document.querySelectorAll("[data-open-signin]");
  var closeButtons = modal.querySelectorAll("[data-close-signin]");
  var firstField = modal.querySelector("input");
  var panels = modal.querySelectorAll("[data-auth-panel]");
  var switchLinks = modal.querySelectorAll("[data-switch-auth]");
  var forms = modal.querySelectorAll("form");
  var activePanel = "signin";

  function setPanel(name) {
    activePanel = name;

    for (var i = 0; i < panels.length; i += 1) {
      var panel = panels[i];
      var matches = panel.getAttribute("data-auth-panel") === name;
      panel.hidden = !matches;
      panel.classList.toggle("is-active", matches);
    }

    modal.setAttribute("aria-labelledby", name === "signup" ? "signup-title" : "signin-title");
    modal.setAttribute("aria-describedby", name === "signup" ? "signup-description" : "signin-description");

    if (name === "signup") {
      firstField = modal.querySelector("#signup-name");
    } else {
      firstField = modal.querySelector("#signin-email");
    }
  }

  function openModal(event) {
    if (event) event.preventDefault();
    setPanel("signin");
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    if (firstField) {
      window.setTimeout(function () {
        firstField.focus();
      }, 0);
    }
  }

  function closeModal(event) {
    if (event) event.preventDefault();
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  for (var i = 0; i < openButtons.length; i += 1) {
    openButtons[i].addEventListener("click", openModal);
  }

  for (var j = 0; j < closeButtons.length; j += 1) {
    closeButtons[j].addEventListener("click", closeModal);
  }

  for (var k = 0; k < switchLinks.length; k += 1) {
    switchLinks[k].addEventListener("click", function (event) {
      event.preventDefault();
      var target = event.currentTarget && event.currentTarget.getAttribute("data-switch-auth");
      if (target) {
        setPanel(target);
        if (firstField) {
          window.setTimeout(function () {
            firstField.focus();
          }, 0);
        }
      }
    });
  }

  for (var l = 0; l < forms.length; l += 1) {
    forms[l].addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }

  modal.addEventListener("click", function (event) {
    if (event.target && event.target.hasAttribute("data-close-signin")) {
      closeModal(event);
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

window.PagesCo = {
  loadComponent: pagesLoadComponent,
  setText: pagesSetText,
  renderBookGrid: pagesRenderBookGrid,
  renderCategoryChips: pagesRenderCategoryChips,
  renderPagination: pagesRenderPagination,
  findBook: pagesFindBook,
  activateNav: pagesActivateNav,
  setupLoginModal: pagesSetupLoginModal,
  setupMobileMenu: pagesSetupMobileMenu,
  scrollToTop: pagesScrollToTop,
  svgDataUri: pagesSvgDataUri
};

window.PagesCoData = {
  heroSlides: [
    {
      eyebrow: "Staff favourites",
      title: "The shelves we keep coming back to",
      text: "Our booksellers pick the titles they can't stop pressing into customers' hands.",
      cta: "Browse bestsellers",
      href: "../page/books.html"
    },
    {
      eyebrow: "Fresh picks",
      title: "New voices, bright covers, easy to love",
      text: "A lively corner of the shop with recent releases and standout debuts.",
      cta: "Explore arrivals",
      href: "../page/books.html"
    },
    {
      eyebrow: "Weekend reading",
      title: "Stories to keep by the bed and reread later",
      text: "Quiet, warm, and a little unexpected, just like the best handpicked books.",
      cta: "See the edit",
      href: "../page/books.html"
    }
  ],
  categories: ["All", "Fiction", "Mystery", "Sci-Fi", "Non-fiction", "Poetry", "Children", "Biography"],
  allBooks: [
    {
      slug: "the-lighthouse-keeper",
      badge: "Bestseller",
      title: "The Lighthouse Keeper",
      author: "Mara Ellison",
      summary: "A foggy-coast mystery with warm prose and a steady emotional pull.",
      price: "$18.00",
      oldPrice: "$24.00",
      rating: "4.6",
      coverClass: "cover--green",
      colors: ["#365844", "#83a48a"],
      initials: "TLK",
      category: "Fiction",
      pages: 312,
      year: 2023,
      format: "Paperback",
      publisher: "Harbor & Vale",
      isbn: "978-1-23456-001-2"
    },
    {
      slug: "ashes-in-the-archive",
      badge: "New",
      title: "Ashes in the Archive",
      author: "J. P. Crowe",
      summary: "Quiet tension, paper trails, and one archivist who notices everything.",
      price: "$15.50",
      oldPrice: "",
      rating: "4.4",
      coverClass: "cover--blue",
      colors: ["#51658f", "#91a4cf"],
      initials: "AIA",
      category: "Mystery",
      pages: 288,
      year: 2024,
      format: "Paperback",
      publisher: "Northline Press",
      isbn: "978-1-23456-002-9"
    },
    {
      slug: "salt-and-other-small-gods",
      badge: "New",
      title: "Salt & Other Small Gods",
      author: "Imani Okafor",
      summary: "Lyrical short fiction with bright rhythms and a strong sense of place.",
      price: "$13.00",
      oldPrice: "",
      rating: "4.8",
      coverClass: "cover--rose",
      colors: ["#8d335f", "#cc7196"],
      initials: "SOS",
      category: "Poetry",
      pages: 176,
      year: 2024,
      format: "Hardcover",
      publisher: "Moonbeam House",
      isbn: "978-1-23456-003-6"
    },
    {
      slug: "a-house-of-borrowed-light",
      badge: "Bestseller",
      title: "A House of Borrowed Light",
      author: "Sofia Marchetti",
      summary: "A family saga with luminous interiors, long winters, and soft suspense.",
      price: "$17.25",
      oldPrice: "$22.00",
      rating: "4.5",
      coverClass: "cover--violet",
      colors: ["#675283", "#9d87c4"],
      initials: "HOL",
      category: "Fiction",
      pages: 352,
      year: 2023,
      format: "Hardcover",
      publisher: "Linen & Ink",
      isbn: "978-1-23456-004-3"
    },
    {
      slug: "everything-the-river-took",
      badge: "Bestseller",
      title: "Everything the River Took",
      author: "Ada Fenwick",
      summary: "A river-town story where grief, memory, and home keep crossing paths.",
      price: "$18.75",
      oldPrice: "",
      rating: "4.6",
      coverClass: "cover--brown",
      colors: ["#845539", "#c48b62"],
      initials: "ERT",
      category: "Mystery",
      pages: 304,
      year: 2024,
      format: "Paperback",
      publisher: "Harbor & Vale",
      isbn: "978-1-23456-005-0"
    },
    {
      slug: "orbital-driftwood",
      badge: "Bestseller",
      title: "Orbital Driftwood",
      author: "Nadia Vance",
      summary: "A thoughtful sci-fi pick for readers who want atmosphere over noise.",
      price: "$21.00",
      oldPrice: "",
      rating: "4.7",
      coverClass: "cover--teal",
      colors: ["#3f7a82", "#7eb6b8"],
      initials: "ODW",
      category: "Sci-Fi",
      pages: 336,
      year: 2024,
      format: "Paperback",
      publisher: "Northline Press",
      isbn: "978-1-23456-006-7"
    },
    {
      slug: "pip-and-the-paper-moon",
      badge: "Bestseller",
      title: "Pip and the Paper Moon",
      author: "Lena Hart",
      summary: "A cozy illustrated-style read with a playful, youthful tone.",
      price: "$11.50",
      oldPrice: "",
      rating: "4.9",
      coverClass: "cover--amber",
      colors: ["#a06a21", "#e0b45c"],
      initials: "PPM",
      category: "Children",
      pages: 148,
      year: 2023,
      format: "Hardcover",
      publisher: "Little Lantern",
      isbn: "978-1-23456-007-4"
    },
    {
      slug: "threads-of-the-void",
      badge: "New",
      title: "Threads of the Void",
      author: "Kai Tanaka",
      summary: "A sleek speculative novel with a clean, vivid visual identity.",
      price: "$20.50",
      oldPrice: "",
      rating: "4.6",
      coverClass: "cover--blue",
      colors: ["#51658f", "#91a4cf"],
      initials: "TOV",
      category: "Sci-Fi",
      pages: 368,
      year: 2024,
      format: "Paperback",
      publisher: "Moonbeam House",
      isbn: "978-1-23456-008-1"
    },
    {
      slug: "the-button-thief",
      badge: "New",
      title: "The Button Thief",
      author: "Marco Diaz",
      summary: "A charming, slightly mischievous story with a bright hook.",
      price: "$10.99",
      oldPrice: "",
      rating: "4.7",
      coverClass: "cover--amber",
      colors: ["#a06a21", "#e0b45c"],
      initials: "TBT",
      category: "Children",
      pages: 96,
      year: 2024,
      format: "Paperback",
      publisher: "Little Lantern",
      isbn: "978-1-23456-009-8"
    },
    {
      slug: "the-quiet-economy",
      badge: "Bestseller",
      title: "The Quiet Economy",
      author: "Daniel Roth",
      summary: "An intimate non-fiction book about work, scale, and making a life.",
      price: "$19.99",
      oldPrice: "",
      rating: "4.2",
      coverClass: "cover--brown",
      colors: ["#845539", "#c48b62"],
      initials: "TQE",
      category: "Non-fiction",
      pages: 240,
      year: 2022,
      format: "Hardcover",
      publisher: "Northline Press",
      isbn: "978-1-23456-010-4"
    },
    {
      slug: "hands-in-the-soil",
      badge: "Bestseller",
      title: "Hands in the Soil",
      author: "Greta Lindqvist",
      summary: "Part memoir, part field guide, with a grounded and generous voice.",
      price: "$23.00",
      oldPrice: "",
      rating: "4.3",
      coverClass: "cover--green",
      colors: ["#42664d", "#6a9379"],
      initials: "HIS",
      category: "Non-fiction",
      pages: 272,
      year: 2023,
      format: "Hardcover",
      publisher: "Harbor & Vale",
      isbn: "978-1-23456-011-1"
    },
    {
      slug: "the-saltmarsh-murders",
      badge: "New",
      title: "The Saltmarsh Murders",
      author: "Edmund Pryce",
      summary: "A fog-soaked mystery with sharp pacing and a very readable hook.",
      price: "$16.00",
      oldPrice: "",
      rating: "4.1",
      coverClass: "cover--red",
      colors: ["#8a3f39", "#c26b61"],
      initials: "TSM",
      category: "Mystery",
      pages: 324,
      year: 2024,
      format: "Paperback",
      publisher: "Linen & Ink",
      isbn: "978-1-23456-012-8"
    },
    {
      slug: "the-window-atlas",
      badge: "Bestseller",
      title: "The Window Atlas",
      author: "Clara Voss",
      summary: "A quiet biography about noticing the world from the edge of a city.",
      price: "$24.00",
      oldPrice: "",
      rating: "4.8",
      coverClass: "cover--plum",
      colors: ["#7b3f66", "#b56a99"],
      initials: "TWA",
      category: "Biography",
      pages: 384,
      year: 2022,
      format: "Hardcover",
      publisher: "Moonbeam House",
      isbn: "978-1-23456-013-5"
    },
    {
      slug: "lanterns-for-rain",
      badge: "New",
      title: "Lanterns for Rain",
      author: "Elio Park",
      summary: "Poems that move softly, then leave a bright mark.",
      price: "$14.50",
      oldPrice: "",
      rating: "4.7",
      coverClass: "cover--red",
      colors: ["#95443a", "#c36a5d"],
      initials: "LFR",
      category: "Poetry",
      pages: 112,
      year: 2024,
      format: "Paperback",
      publisher: "Little Lantern",
      isbn: "978-1-23456-014-2"
    }
  ]
};

window.PagesCoData.allBooks.forEach(function (book) {
  book.imageSrc = pagesSvgDataUri(book.title, book.author, book.colors, book.initials);
});

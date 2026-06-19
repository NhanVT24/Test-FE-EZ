function homeBuildDots(count, activeIndex) {
  var dots = document.getElementById("hero-dots");
  if (!dots) return;

  dots.innerHTML = "";
  for (var i = 0; i < count; i += 1) {
    var dot = document.createElement("span");
    if (i === activeIndex) dot.className = "is-active";
    dots.appendChild(dot);
  }
}

function homeSetHeroArt(book, offset) {
  var target = document.getElementById(offset);
  if (!target || !book) return;
  target.src = book.imageSrc || "";
  target.alt = book.title + " cover art";
}

function homeStartHeroCarousel() {
  var slides = (window.PagesCoData && window.PagesCoData.heroSlides) || [];
  var books = (window.PagesCoData && window.PagesCoData.allBooks) || [];

  if (!slides.length || !books.length) return;

  var activeIndex = 0;
  var eyebrow = document.getElementById("hero-eyebrow");
  var title = document.getElementById("hero-title");
  var text = document.getElementById("hero-text");
  var cta = document.getElementById("hero-cta");
  var prev = document.querySelector(".hero__nav--prev");
  var next = document.querySelector(".hero__nav--next");
  var artTitle = document.getElementById("hero-art-title");
  var artAuthor = document.getElementById("hero-art-author");

  function applySlide(index) {
    activeIndex = index;
    var slide = slides[index];
    var frontBook = books[index % books.length];
    var leftBook = books[(index + 3) % books.length];
    var rightBook = books[(index + 4) % books.length];

    if (eyebrow) eyebrow.textContent = slide.eyebrow;
    if (title) title.textContent = slide.title;
    if (text) text.textContent = slide.text;
    if (cta) {
      cta.textContent = slide.cta;
      cta.href = slide.href;
    }

    homeSetHeroArt(leftBook, "hero-art-left");
    homeSetHeroArt(rightBook, "hero-art-right");
    homeSetHeroArt(frontBook, "hero-art-front");

    if (artTitle) artTitle.textContent = frontBook.title;
    if (artAuthor) artAuthor.textContent = frontBook.author;

    homeBuildDots(slides.length, index);
  }

  if (prev) {
    prev.addEventListener("click", function () {
      applySlide((activeIndex + slides.length - 1) % slides.length);
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      applySlide((activeIndex + 1) % slides.length);
    });
  }

  applySlide(0);
  window.setInterval(function () {
    applySlide((activeIndex + 1) % slides.length);
  }, 7000);
}

document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    window.PagesCo.loadComponent("header-component", "../component/header.html"),
    window.PagesCo.loadComponent("footer-component", "../component/footer.html"),
    window.PagesCo.loadComponent("book-card-component", "../component/book-card.html")
  ]).then(function () {
    window.PagesCo.activateNav();
    window.PagesCo.setupLoginModal();
    window.PagesCo.setupMobileMenu();

    var data = window.PagesCoData;
    var featuredBooks = data.allBooks.slice(0, 5);
    var bestsellers = data.allBooks.filter(function (book) {
      return book.badge === "Bestseller";
    }).slice(0, 5);
    var newArrivals = data.allBooks.filter(function (book) {
      return book.badge === "New";
    }).slice(0, 5);

    window.PagesCo.renderBookGrid("featured-grid", featuredBooks, { linkBase: "../page/booksDetail.html" });
    window.PagesCo.renderBookGrid("bestsellers-grid", bestsellers, { linkBase: "../page/booksDetail.html" });
    window.PagesCo.renderBookGrid("new-arrivals-grid", newArrivals, { linkBase: "../page/booksDetail.html" });
    homeStartHeroCarousel();
  });
});

function detailGetQueryBook() {
  var params = new URLSearchParams(window.location.search);
  return params.get("book") || "the-lighthouse-keeper";
}

function detailSetText(id, value) {
  var node = document.getElementById(id);
  if (node) node.textContent = value;
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

    var book = window.PagesCo.findBook(detailGetQueryBook());
    var related = window.PagesCoData.allBooks.filter(function (item) {
      return item.slug !== book.slug && item.category === book.category;
    }).slice(0, 4);

    if (!related.length) {
      related = window.PagesCoData.allBooks.filter(function (item) {
        return item.slug !== book.slug;
      }).slice(0, 4);
    }

    detailSetText("detail-breadcrumb-title", book.title);
    detailSetText("detail-cover-title", book.title);
    detailSetText("detail-cover-author", book.author);
    detailSetText("detail-category", book.category);
    detailSetText("detail-title", book.title);
    detailSetText("detail-author", "by " + book.author);
    detailSetText("detail-rating", book.rating);
    detailSetText("detail-pages", book.pages + " pages");
    detailSetText("detail-year", String(book.year));
    detailSetText("detail-price", book.price);
    detailSetText("detail-old-price", book.oldPrice || "");
    detailSetText("detail-summary", book.summary);
    detailSetText("detail-format", book.format);
    detailSetText("detail-pages-full", String(book.pages));
    detailSetText("detail-published", String(book.year));
    detailSetText("detail-publisher", book.publisher);
    detailSetText("detail-isbn", book.isbn);

    var cover = document.getElementById("detail-cover");
    if (cover) {
      cover.className = "detail-cover " + (book.coverClass || "cover--green");
    }

    var oldPrice = document.getElementById("detail-old-price");
    if (oldPrice) {
      oldPrice.style.display = book.oldPrice ? "" : "none";
    }

    window.PagesCo.renderBookGrid("detail-related-grid", related, { linkBase: "../page/booksDetail.html" });
  });
});

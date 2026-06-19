function booksSortCollection(books, sortValue) {
  var sorted = books.slice();

  if (sortValue === "price-asc") {
    sorted.sort(function (a, b) { return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", "")); });
  } else if (sortValue === "price-desc") {
    sorted.sort(function (a, b) { return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", "")); });
  } else if (sortValue === "rating-desc") {
    sorted.sort(function (a, b) { return parseFloat(b.rating) - parseFloat(a.rating); });
  } else if (sortValue === "newest") {
    sorted.sort(function (a, b) { return b.year - a.year; });
  }

  return sorted;
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

    var allBooks = window.PagesCoData.allBooks.slice();
    var categories = window.PagesCoData.categories;
    var params = new URLSearchParams(window.location.search);
    var categoryParam = params.get("category");
    var activeCategory = categories.indexOf(categoryParam) !== -1 ? categoryParam : "All";
    var sortValue = "featured";
    var currentPage = 1;
    var pageSize = 8;
    var chips = document.getElementById("category-chips");
    var sortSelect = document.getElementById("books-sort");
    var grid = document.getElementById("books-grid");
    var pagination = document.getElementById("books-pagination");
    var count = document.getElementById("books-count");

    function render() {
      var filtered = allBooks.filter(function (book) {
        return activeCategory === "All" || book.category === activeCategory;
      });

      filtered = booksSortCollection(filtered, sortValue);

      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;

      var start = (currentPage - 1) * pageSize;
      var pageBooks = filtered.slice(start, start + pageSize);

      window.PagesCo.renderBookGrid("books-grid", pageBooks, { linkBase: "../page/booksDetail.html" });
      window.PagesCo.renderPagination("books-pagination", currentPage, totalPages);
      window.PagesCo.renderCategoryChips("category-chips", categories, activeCategory);

      if (count) {
        count.textContent = filtered.length + " titles in the collection";
      }

      var chipButtons = chips ? chips.querySelectorAll(".chip") : [];
      for (var i = 0; i < chipButtons.length; i += 1) {
        chipButtons[i].onclick = (function (category) {
          return function (event) {
            event.preventDefault();
            activeCategory = category;
            currentPage = 1;
            var nextUrl = new URL(window.location.href);
            if (category === "All") {
              nextUrl.searchParams.delete("category");
            } else {
              nextUrl.searchParams.set("category", category);
            }
            window.history.replaceState({}, "", nextUrl.toString());
            render();
          };
        })(categories[i]);
      }

      var paginationButtons = pagination ? pagination.querySelectorAll(".pagination__link") : [];
      for (var j = 0; j < paginationButtons.length; j += 1) {
        paginationButtons[j].onclick = (function (pageNumber) {
          return function (event) {
            event.preventDefault();
            currentPage = pageNumber;
            render();
            window.PagesCo.scrollToTop();
          };
        })(j + 1);
      }
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        sortValue = sortSelect.value;
        render();
      });
    }

    window.PagesCo.renderCategoryChips("category-chips", categories, activeCategory);
    window.PagesCo.renderPagination("books-pagination", currentPage, 1);
    render();
  });
});

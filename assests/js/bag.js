document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    window.PagesCo.loadComponent("header-component", "../component/header.html"),
    window.PagesCo.loadComponent("footer-component", "../component/footer.html"),
    window.PagesCo.loadComponent("book-card-component", "../component/book-card.html")
  ]).then(function () {
    window.PagesCo.activateNav();
    window.PagesCo.setupLoginModal();
    window.PagesCo.setupMobileMenu();

    var items = [
      window.PagesCoData.allBooks[0],
      window.PagesCoData.allBooks[4]
    ];
    var container = document.getElementById("bag-items");

    if (!container) return;

    container.innerHTML = "";

    items.forEach(function (book, index) {
      var article = document.createElement("article");
      article.className = "bag-item";
      article.innerHTML =
        '<a class="bag-item__cover" href="../page/booksDetail.html?book=' + encodeURIComponent(book.slug) + '">' +
          '<img src="' + book.imageSrc + '" alt="' + book.title + ' cover art" />' +
        '</a>' +
        '<div class="bag-item__details">' +
          '<h3 class="bag-item__title">' + book.title + '</h3>' +
          '<p class="bag-item__author">' + book.author + '</p>' +
          '<div class="bag-item__actions">' +
            '<div class="bag-qty" aria-label="Quantity controls">' +
              '<button type="button" aria-label="Decrease quantity">−</button>' +
              '<strong>1</strong>' +
              '<button type="button" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<a href="../page/booksDetail.html?book=' + encodeURIComponent(book.slug) + '">Remove</a>' +
          '</div>' +
        '</div>' +
        '<strong class="bag-item__price">' + book.price + '</strong>';

      container.appendChild(article);
    });
  });
});

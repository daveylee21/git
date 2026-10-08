/* Shared carousel initialization for the six current-template pages. */
(function () {
  function start() {
    if (!window.jQuery || !window.jQuery.fn.owlCarousel) return;
    window.jQuery(function ($) {
      var isHome = !!document.getElementById("home-nav");
      var hero = $("#owl-demo");
      if (hero.length) {
        var options = {slideSpeed: 300, autoPlay: true, navigation: isHome, pagination: isHome, singleItem: true};
        if (isHome) options.navigationText = ["", ""];
        hero.owlCarousel(options);
      }
      var details = $("#owl-demo2");
      if (details.length) details.owlCarousel({slideSpeed: 300, autoPlay: true, navigation: false, pagination: true, singleItem: true});
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
}());

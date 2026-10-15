/* Lightkiller V2 native homepage interactions.
   Replaces jQuery, Responsee JS and Owl Carousel on index-v2.html only. */
(function () {
  "use strict";

  function createCarousel(root, options) {
    if (!root) return;
    var slides = Array.prototype.filter.call(root.children, function (el) {
      return el.classList.contains("item");
    });
    if (!slides.length) return;

    var current = 0;
    var timer = null;
    var interval = options.interval || 5000;
    var controls = document.createElement("div");
    controls.className = "owl-controls clickable";

    var buttons = null;
    if (options.navigation) {
      buttons = document.createElement("div");
      buttons.className = "owl-buttons";

      var prev = document.createElement("div");
      prev.className = "owl-prev";
      prev.setAttribute("role", "button");
      prev.setAttribute("tabindex", "0");
      prev.setAttribute("aria-label", "上一張");

      var next = document.createElement("div");
      next.className = "owl-next";
      next.setAttribute("role", "button");
      next.setAttribute("tabindex", "0");
      next.setAttribute("aria-label", "下一張");

      buttons.appendChild(prev);
      buttons.appendChild(next);
      controls.appendChild(buttons);

      function activateButton(el, fn) {
        el.addEventListener("click", fn);
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fn();
          }
        });
      }
      activateButton(prev, function () { show(current - 1, true); });
      activateButton(next, function () { show(current + 1, true); });
    }

    var pagination = null;
    var dots = [];
    if (options.pagination) {
      pagination = document.createElement("div");
      pagination.className = "owl-pagination";
      slides.forEach(function (_, index) {
        var page = document.createElement("div");
        page.className = "owl-page";
        page.setAttribute("role", "button");
        page.setAttribute("tabindex", "0");
        page.setAttribute("aria-label", "第 " + (index + 1) + " 張");
        var dot = document.createElement("span");
        page.appendChild(dot);
        page.addEventListener("click", function () { show(index, true); });
        page.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            show(index, true);
          }
        });
        pagination.appendChild(page);
        dots.push(page);
      });
      controls.appendChild(pagination);
    }

    root.appendChild(controls);

    function show(index, restart) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle("v2-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
        dot.setAttribute("aria-current", i === current ? "true" : "false");
      });
      if (restart) startAuto();
    }

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    function startAuto() {
      stopAuto();
      if (options.autoPlay && slides.length > 1) {
        timer = window.setInterval(function () { show(current + 1, false); }, interval);
      }
    }

    var startX = null;
    root.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches.length === 1) startX = e.touches[0].clientX;
    }, {passive:true});
    root.addEventListener("touchend", function (e) {
      if (startX === null || !e.changedTouches || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1), true);
    }, {passive:true});

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);
    root.addEventListener("focusout", startAuto);

    show(0, false);
    root.classList.add("v2-ready");
    startAuto();
  }

  function setupMenu() {
    var trigger = document.querySelector("#home-nav .nav-text");
    if (!trigger) return;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-expanded", "false");

    function toggle() {
      var lists = document.querySelectorAll("#home-nav .top-nav > ul");
      var open = trigger.getAttribute("aria-expanded") !== "true";
      lists.forEach(function (list) { list.classList.toggle("show-menu", open); });
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    trigger.addEventListener("click", toggle);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

  function init() {
    setupMenu();
    createCarousel(document.getElementById("owl-demo"), {
      navigation:true, pagination:true, autoPlay:true, interval:5000
    });
    createCarousel(document.getElementById("owl-demo2"), {
      navigation:false, pagination:true, autoPlay:true, interval:5000
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
}());

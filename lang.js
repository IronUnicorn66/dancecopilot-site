(function () {
  var key = "dc-lang";
  var html = document.documentElement;

  function apply(lang) {
    var next = lang === "en" ? "en" : "zh-CN";
    html.lang = next;
    try {
      localStorage.setItem(key, next === "en" ? "en" : "zh");
    } catch (e) {}

    document.querySelectorAll("[lang]").forEach(function (el) {
      if (el === html) return;
      var value = el.getAttribute("lang");
      var isEn = value === "en";
      var isZh = value === "zh-CN" || value === "zh";
      if (!isEn && !isZh) return;
      if (next === "en" ? isZh : isEn) {
        el.setAttribute("hidden", "");
      } else {
        el.removeAttribute("hidden");
      }
    });

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute(
        "aria-pressed",
        btn.getAttribute("data-lang") === (next === "en" ? "en" : "zh")
          ? "true"
          : "false"
      );
    });
  }

  var saved = null;
  try {
    saved = localStorage.getItem(key);
  } catch (e) {}
  apply(saved === "en" ? "en" : "zh");

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.getAttribute("data-lang"));
    });
  });
})();

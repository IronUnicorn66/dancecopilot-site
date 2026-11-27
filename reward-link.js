(function () {
  "use strict";
  var invite = location.pathname.indexOf("/invite") === 0;
  var code = new URLSearchParams(location.search).get(invite ? "code" : "campaign");
  var valid = code && /^[A-Za-z0-9_-]{1,128}$/.test(code);
  document.getElementById("invalid").hidden = !!valid;
  if (!valid) return;
  document.getElementById("code").textContent = code;
  var link = document.getElementById("open-app");
  var route = invite ? "invite" : "rewards";
  var query = (invite ? "code=" : "campaign=") + encodeURIComponent(code);
  if (invite) {
    var nickname = new URLSearchParams(location.search).get("nickname") || "";
    nickname = Array.from(nickname.replace(/[\x00-\x1F\x7F]/g, "").trim()).slice(0, 80).join("");
    if (nickname) query += "&nickname=" + encodeURIComponent(nickname);
  }
  link.href = /Android/i.test(navigator.userAgent)
    ? "intent://dancecopilot.cn/" + route + "/?" + query + "#Intent;scheme=https;package=cn.dancecopilot.app;end"
    : "dancecopilot://" + route + "?" + query;
  link.hidden = false;
})();

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(__dirname + "/reward-link.js", "utf8");

function render(pathname, search) {
  const nodes = { invalid: { hidden: true }, code: {}, "open-app": { hidden: true } };
  vm.runInNewContext(source, {
    location: { pathname, search }, URLSearchParams,
    document: { getElementById: id => nodes[id] },
  });
  return nodes;
}

test("invitation preserves the selected nickname through the web fallback", () => {
  const nodes = render("/invite/", "?code=public-code&nickname=" + encodeURIComponent(" 小舞 & 好友\n "));
  const link = new URL(nodes["open-app"].href);
  assert.equal(link.protocol, "dancecopilot:");
  assert.equal(link.host, "invite");
  assert.equal(link.searchParams.get("code"), "public-code");
  assert.equal(link.searchParams.get("nickname"), "小舞 & 好友");
  assert.equal(nodes["open-app"].hidden, false);
});

test("invalid invitations never expose an app link", () => {
  for (const query of ["", "?code=", "?code=%3Cscript%3E", "?code=" + "a".repeat(129)]) {
    const nodes = render("/invite/", query);
    assert.equal(nodes.invalid.hidden, false);
    assert.equal(nodes["open-app"].href, undefined);
    assert.equal(nodes["open-app"].hidden, true);
  }
});

test("nickname is bounded by Unicode characters and excluded from campaigns", () => {
  const search = "?code=abc&nickname=" + encodeURIComponent("💃".repeat(90));
  assert.equal(Array.from(new URL(render("/invite/", search)["open-app"].href).searchParams.get("nickname")).length, 80);
  const campaign = new URL(render("/rewards/", "?campaign=hello&nickname=ignored")["open-app"].href);
  assert.equal(campaign.host, "rewards");
  assert.equal(campaign.searchParams.get("campaign"), "hello");
  assert.equal(campaign.searchParams.has("nickname"), false);
});

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(__dirname + "/reward-link.js", "utf8");

function render(pathname, search) {
  const nodes = { invalid: { hidden: true }, code: {}, "open-app": { hidden: true, addEventListener(type, fn) { this[type] = fn; } }, "open-help": { hidden: true } };
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

test("browsers in mobile and desktop mode use the app scheme and get confirmation guidance", () => {
  const nodes = render("/invite/", "?code=public-code&nickname=%E5%B0%8F%E8%88%9E%23Intent&package=other");
  assert.equal(nodes["open-app"].href, "dancecopilot://invite?code=public-code&nickname=%E5%B0%8F%E8%88%9E%23Intent");
  assert.equal(nodes["open-help"].hidden, true);
  nodes["open-app"].click();
  assert.equal(nodes["open-help"].hidden, false);
  assert.equal(render("/rewards/", "?campaign=hello")["open-app"].href, "dancecopilot://rewards?campaign=hello");
});

test("Android App Links identify only the production app", () => {
  const statements = JSON.parse(fs.readFileSync(__dirname + "/.well-known/assetlinks.json", "utf8"));
  assert.equal(statements.length, 1);
  const [{relation, target}] = statements;
  assert.deepEqual(relation, ["delegate_permission/common.handle_all_urls"]);
  assert.equal(target.package_name, "cn.dancecopilot.app");
  assert.match(target.sha256_cert_fingerprints[0], /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/);
});

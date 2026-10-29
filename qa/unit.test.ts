// Unit checks for the shared engine (search + request list). Run: node --experimental-strip-types qa/unit.test.ts
import assert from "node:assert/strict";
import { key, score, addItem, lineId, requestText, sanitize, clampQ, type Item } from "../src/engine/core.ts";

// search: Latin look-alikes, dashes, spaces
assert.equal(key("cb525-01-13"), "СБ525-01-13");
assert.equal(score(["СБ525-12-104"], "Насос масляный", "сб 525 12 104"), 100);
assert.equal(score(["525-16-110"], "Полумуфта ведомая", "52516110"), 100);
assert.equal(score(["525-16-110"], "Полумуфта ведомая", "525-16"), 60);
assert.equal(score(["525-16-110"], "Полумуфта ведомая", "16-110"), 40);
assert.equal(score(["БЧ"], "Подшипник 313АК ГОСТ8338-75", "подшипник 313"), 20);
assert.equal(score(["525-16-110"], "Полумуфта ведомая", "насос"), 0);
assert.equal(score(["x"], "y", "  "), 1);

// request list: same designation in another variant or place is a separate line; same line adds up
const base: Item = { k: "rr300:525-16-110", d: "525-16-110", n: "Полумуфта ведомая", m: "РР-300", at: "рис. 5, поз. 4", isp: "СБ525-01-13", per: 1, q: 1 };
let l = addItem([], base);
l = addItem(l, { ...base, isp: "СБ525-01-13-010" });
assert.equal(l.length, 2);
l = addItem(l, { ...base, q: 3 });
assert.equal(l.length, 2);
assert.equal(l[0].q, 4);
assert.notEqual(lineId(l[0]), lineId(l[1]));
assert.equal(clampQ("abc"), 1);
assert.equal(clampQ(0), 1);
assert.equal(clampQ(1e9), 99999);
assert.deepEqual(sanitize("nope"), []);
assert.deepEqual(sanitize([{ k: 1 }]), []);
assert.equal(sanitize([{ k: "a", d: "b", q: -5 }])[0].q, 1);

// request text keeps the factory designation verbatim and names both quantities
const t = requestText([{ ...base, q: 12 }], { name: "Иванов", tel: "+7 900 000-00-00" });
assert.match(t, /525-16-110  Полумуфта ведомая/);
assert.match(t, /Исполнение: СБ525-01-13/);
assert.match(t, /Количество на одно изделие по спецификации: 1 шт\./);
assert.match(t, /Запрашиваемое количество: 12 шт\./);
assert.match(t, /Телефон: \+7 900 000-00-00/);
assert.doesNotMatch(t, /E-mail:/);
console.log("unit: all checks passed");

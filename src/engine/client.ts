// Browser behaviour shared by both designs, wired through data-* attributes only (designs own markup and CSS).
// Nothing here talks to a server: the request leaves the site only as copied text, a downloaded file or an explicit mailto: click.
import { score, addItem, sanitize, lineId, clampQ, requestText, mailtoHref, MAILTO_LIMIT, type Item } from "./core";

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
document.documentElement.classList.add("js");

// ------------------------------------------------------------------ storage (falls back to memory when blocked)
const STORE = "rr5-request", DRAFT = "rr5-request-draft", ISP = "rr5-isp";
const mem: Record<string, string> = {};
const read = (k: string) => { try { return localStorage.getItem(k); } catch { return mem[k] ?? null; } };
const write = (k: string, v: string | null) => {
  try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { if (v == null) delete mem[k]; else mem[k] = v; }
};
export const rfq = {
  get(): Item[] { try { return sanitize(JSON.parse(read(STORE) || "[]")); } catch { return []; } },
  set(v: Item[]) { write(STORE, v.length ? JSON.stringify(v) : null); paint(); },
};

function announce(t: string) {
  const live = $("#live");
  if (live) { live.textContent = ""; setTimeout(() => (live.textContent = t), 30); }
}
let toastTimer = 0;
function toast(t: string) {
  const el = $("[data-toast]");
  announce(t);
  if (!el) return;
  $("[data-toast-text]", el)!.textContent = t;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (el.hidden = true), 5000);
}

// ------------------------------------------------------------------ add buttons
const itemOf = (b: HTMLElement): Item => {
  const d = b.dataset;
  const per = d.per ? Number(d.per) : null;
  return { k: d.k!, d: d.d!, n: d.n!, m: d.m || "", at: d.at || "", isp: d.isp || "", per, q: per ?? 1, href: d.href };
};
function paint() {
  const list = rfq.get();
  const ids = new Set(list.map(lineId));
  $$("[data-rfq-count]").forEach((el) => (el.textContent = String(list.length)));
  $$("[data-rfq-count-wrap]").forEach((el) => el.classList.toggle("has", list.length > 0));
  $$("[data-rfq-panel]").forEach((panel) => {
    const ol = $("[data-rfq-panel-list]", panel)!;
    $("[data-rfq-panel-empty]", panel)!.hidden = list.length > 0;
    ol.hidden = list.length === 0;
    ol.replaceChildren(...list.slice(-4).reverse().map((x) => {
      const li = document.createElement("li");
      const d = document.createElement("span"); d.className = "sku"; d.textContent = x.d;
      const n = document.createElement("span"); n.textContent = ` ${x.n}`;
      const q = document.createElement("span"); q.className = "q"; q.textContent = `${x.q} шт.`;
      li.append(d, n, q);
      return li;
    }));
    if (list.length > 4) { const li = document.createElement("li"); li.className = "more"; li.textContent = `и ещё ${list.length - 4}`; ol.append(li); }
  });
  $$<HTMLButtonElement>("[data-rfq-add]").forEach((b) => {
    const on = ids.has(lineId(itemOf(b)));
    b.setAttribute("aria-pressed", String(on));
    const lbl = $("[data-lbl]", b) ?? b;
    lbl.textContent = on ? "В запросе" : b.dataset.label || "В запрос";
  });
}
document.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>("[data-rfq-add]");
  if (!b) return;
  const it = itemOf(b);
  const list = rfq.get();
  if (list.some((i) => lineId(i) === lineId(it))) {
    rfq.set(list.filter((i) => lineId(i) !== lineId(it)));
    toast(`Убрано из запроса: ${it.d}`);
    return;
  }
  rfq.set(addItem(list, it));
  toast(`${it.d} в запросе: ${it.q} шт.${it.per != null ? " (как на одно изделие)" : ""}. Количество меняется в списке.`);
});

// ------------------------------------------------------------------ menu
const menuBtn = $<HTMLButtonElement>("[data-menu]");
const nav = menuBtn ? document.getElementById(menuBtn.getAttribute("aria-controls")!) : null;
const setMenu = (open: boolean) => { menuBtn?.setAttribute("aria-expanded", String(open)); nav?.classList.toggle("open", open); document.body.classList.toggle("menu-open", open); };
menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav?.classList.contains("open")) { setMenu(false); menuBtn?.focus(); } });
matchMedia("(min-width: 1180px)").addEventListener("change", (m) => m.matches && setMenu(false));

// ------------------------------------------------------------------ drawing viewer: explicit zoom only
const dlg = $<HTMLDialogElement>("[data-viewer]");
if (dlg) {
  const img = $<HTMLImageElement>("[data-viewer-img]", dlg)!;
  const title = $("[data-viewer-title]", dlg)!;
  const open = $<HTMLAnchorElement>("[data-viewer-open]", dlg)!;
  const setZoom = (z: "fit" | "1") => {
    dlg.dataset.zoom = z;
    $$<HTMLButtonElement>("[data-zoom-set]", dlg).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.zoomSet === z)));
  };
  document.addEventListener("click", (e) => {
    const z = (e.target as Element).closest<HTMLAnchorElement>("a[data-zoom]");
    if (!z || typeof dlg.showModal !== "function" || (e as MouseEvent).metaKey || (e as MouseEvent).ctrlKey || (e as MouseEvent).shiftKey) return;
    e.preventDefault();
    img.src = z.href; img.alt = z.dataset.alt || "";
    title.textContent = z.dataset.title || z.dataset.alt || "";
    open.href = z.href;
    setZoom("fit");
    dlg.showModal();
  });
  $$<HTMLButtonElement>("[data-zoom-set]", dlg).forEach((b) => b.addEventListener("click", () => setZoom(b.dataset.zoomSet as "fit" | "1")));
  $("[data-viewer-close]", dlg)?.addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", () => (img.src = ""));
}

// ------------------------------------------------------------------ factory variant selector (РР-300 node pages)
function variantTable(root: HTMLElement) {
  const sel = $<HTMLSelectElement>("[data-isp-select]", root)!;
  const table = $<HTMLTableElement>("table", root)!;
  const head = $("[data-sel-head]", root);
  const note = $("[data-isp-note]", root);
  const cmp = $<HTMLButtonElement>("[data-compare]", root);
  const codes = [...sel.options].map((o) => o.value);
  const fromUrl = new URLSearchParams(location.search).get("isp");
  const saved = read(ISP);
  sel.value = fromUrl && codes.includes(fromUrl) ? fromUrl : saved && codes.includes(saved) ? saved : codes[0];
  function apply(save: boolean) {
    const i = codes.indexOf(sel.value);
    const opt = sel.options[i];
    if (head) head.textContent = opt.dataset.short || sel.value;
    if (note) note.textContent = opt.dataset.full || "";
    $$<HTMLTableRowElement>("tbody tr", table).forEach((tr) => {
      const q = JSON.parse(tr.dataset.q || "[]") as (number | null)[];
      const v = q[i] ?? null;
      const cell = $("[data-sel]", tr)!;
      cell.textContent = v == null ? "–" : String(v);
      cell.setAttribute("aria-label", v == null ? "не входит в это исполнение" : `${v} шт. на изделие`);
      tr.classList.toggle("na", v == null);
      const b = $<HTMLButtonElement>("[data-rfq-add]", tr);
      if (b) { b.dataset.isp = opt.dataset.full || ""; if (v == null) delete b.dataset.per; else b.dataset.per = String(v); }
      $$("[data-vc]", tr).forEach((c, j) => c.classList.toggle("cur", j === i));
    });
    $$("thead [data-vc]", table).forEach((c, j) => c.classList.toggle("cur", j === i));
    if (save) {
      write(ISP, sel.value);
      const u = new URL(location.href); u.searchParams.set("isp", sel.value); history.replaceState(null, "", u);
      announce(`Исполнение ${opt.dataset.full}`);
    }
    paint();
  }
  sel.addEventListener("change", () => apply(true));
  cmp?.addEventListener("click", () => {
    const on = cmp.getAttribute("aria-pressed") !== "true";
    cmp.setAttribute("aria-pressed", String(on));
    root.classList.toggle("compare", on);
    $("[data-lbl]", cmp)!.textContent = on ? "Скрыть сравнение исполнений" : "Сравнить все исполнения";
  });
  apply(false);
}
$$("[data-isp-root]").forEach(variantTable);
$$<HTMLButtonElement>("[data-opt-toggle]").forEach((b) => b.addEventListener("click", () => {
  const on = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", String(on));
  b.closest(".spec")!.classList.toggle("show-opt", on);
  $("[data-lbl]", b)!.textContent = on ? "Скрыть массу и материал" : "Показать массу и материал";
}));

// keep the chosen variant on links to other nodes
$$<HTMLAnchorElement>("a[data-keep-isp]").forEach((a) => a.addEventListener("click", () => {
  const v = read(ISP); if (!v) return;
  const u = new URL(a.href); u.searchParams.set("isp", v); a.href = u.href;
}));

// ------------------------------------------------------------------ parts finder (search + model + node filters, URL state)
function finder(root: HTMLElement) {
  const form = $<HTMLFormElement>("form", root)!;
  const q = $<HTMLInputElement>('[name="q"]', form)!;
  const m = $<HTMLSelectElement>('[name="m"]', form);
  const f = $<HTMLSelectElement>('[name="uzel"]', form);
  const tbody = $("tbody", root)!;
  const rows = $$<HTMLTableRowElement>("tbody tr", root).map((el, i) => ({
    el, i, keys: el.dataset.k!.split("|"), name: el.dataset.n!, model: el.dataset.m!, figs: (el.dataset.f || "").split(" ").filter(Boolean),
  }));
  const count = $("[data-count]", root)!, empty = $("[data-empty]", root)!, wrap = $("[data-table]", root)!;
  const p = new URLSearchParams(location.search);
  q.value = p.get("q") || "";
  if (m && p.get("m")) m.value = p.get("m")!;
  if (f && p.get("uzel")) f.value = p.get("uzel")!;
  function apply(push: boolean) {
    const qs = q.value.trim(), ms = m?.value || "";
    if (f) { f.disabled = !!ms && ms !== "rr300"; if (f.disabled) f.value = ""; }
    const shown = rows.map((r) => ({ r, s: score(r.keys, r.name, qs) }))
      .filter((x) => x.s > 0 && (!ms || x.r.model === ms) && (!(f?.value) || x.r.figs.includes(f.value)));
    shown.sort((a, b) => (qs ? b.s - a.s : 0) || a.r.i - b.r.i);
    const vis = new Set(shown.map((x) => x.r));
    rows.forEach((r) => (r.el.hidden = !vis.has(r)));
    shown.forEach((x) => tbody.appendChild(x.r.el));
    const filtered = qs || ms || f?.value;
    count.textContent = filtered ? `Найдено позиций: ${shown.length} из ${rows.length}` : `Позиций в перечне: ${rows.length}`;
    empty.hidden = shown.length > 0; wrap.hidden = shown.length === 0;
    $$("[data-empty-q]", root).forEach((el) => (el.textContent = qs));
    if (push) {
      const u = new URL(location.href);
      for (const [k, v] of [["q", qs], ["m", ms], ["uzel", f?.value || ""]]) v ? u.searchParams.set(k, v) : u.searchParams.delete(k);
      history.replaceState(null, "", u);
    }
  }
  let deb = 0;
  q.addEventListener("input", () => { clearTimeout(deb); deb = window.setTimeout(() => apply(true), 120); });
  m?.addEventListener("change", () => apply(true));
  f?.addEventListener("change", () => apply(true));
  form.addEventListener("submit", (e) => { e.preventDefault(); apply(true); announce(count.textContent || ""); });
  $$("[data-reset]", root).forEach((b) => b.addEventListener("click", () => { q.value = ""; if (m) m.value = ""; if (f) f.value = ""; apply(true); q.focus(); }));
  apply(false);
}
$$("[data-finder]").forEach(finder);

// ------------------------------------------------------------------ live search on the B home page (results under the field, not a popover)
function live(root: HTMLElement) {
  const data = JSON.parse(document.getElementById("parts-index")?.textContent || "[]") as [string, string, string, string, string, string, string, string, number][];
  const base = root.dataset.base!;
  const input = $<HTMLInputElement>("input", root)!;
  const ol = $("[data-live-list]", root)!, count = $("[data-live-count]", root)!, ex = $("[data-live-ex]", root)!, all = $("[data-live-all]", root)!;
  const idle = count.textContent;
  const render = () => {
    const q = input.value.trim();
    if (!q) { ol.hidden = true; all.hidden = true; ex.hidden = false; count.textContent = idle; return; }
    const hits = data.map((r) => ({ r, s: score([r[1], ...r[7].split("|").filter(Boolean)], r[2], q) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
    ex.hidden = true;
    count.textContent = hits.length ? `Найдено: ${hits.length}` : `По запросу «${q}» ничего не найдено. Проверьте обозначение или впишите позицию в список запроса вручную.`;
    ol.hidden = hits.length === 0;
    all.hidden = hits.length <= 8;
    $("a", all)!.setAttribute("href", `${base}zapchasti/?q=${encodeURIComponent(q)}`);
    ol.replaceChildren(...hits.slice(0, 8).map(({ r }) => {
      const [k, d, n, , mname, at, href, , uses] = r;
      const li = document.createElement("li");
      const a = document.createElement("a"); a.href = href ? base + href : `${base}zapchasti/?q=${encodeURIComponent(d)}`;
      const sd = document.createElement("span"); sd.className = "sku"; sd.textContent = d;
      const sn = document.createElement("span"); sn.className = "b-live-n"; sn.textContent = n;
      const sm = document.createElement("span"); sm.className = "b-live-m"; sm.textContent = [mname, at, uses > 1 ? `ещё ${uses - 1}` : ""].filter(Boolean).join(" · ");
      a.append(sd, sn, sm);
      const b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm";
      Object.assign(b.dataset, { rfqAdd: "", k, d, n, m: mname, at: uses === 1 ? at : uses ? `${uses} места на чертежах` : "", href: a.href });
      const lbl = document.createElement("span"); lbl.dataset.lbl = ""; lbl.textContent = "В запрос";
      const sr = document.createElement("span"); sr.className = "sr"; sr.textContent = `: ${d} ${n}`;
      b.append(lbl, sr);
      li.append(a, b);
      return li;
    }));
    paint();
  };
  let deb = 0;
  input.addEventListener("input", () => { clearTimeout(deb); deb = window.setTimeout(render, 90); });
  $$<HTMLAnchorElement>("[data-live-try]", root).forEach((t) => t.addEventListener("click", (e) => { e.preventDefault(); input.value = t.dataset.liveTry!; render(); input.focus(); }));
  if (input.value) render();
}
$$("[data-live]").forEach(live);

// ------------------------------------------------------------------ request page
function rfqPage(root: HTMLElement) {
  const email = root.dataset.email!;
  const tbody = $("[data-rows]", root)!;
  const tpl = $<HTMLTemplateElement>("template", root)!;
  const fields = ["name", "org", "tel", "email", "note"].map((n) => $<HTMLInputElement>(`[name="${n}"]`, root)!);
  const preview = $("[data-preview]", root)!;
  const mail = $<HTMLAnchorElement>("[data-mail]", root)!;
  const status = $("[data-status]", root)!;
  const errBox = $("[data-err]", root)!;
  const longNote = $("[data-long]", root)!;
  try { const d = JSON.parse(read(DRAFT) || "{}"); fields.forEach((f) => (f.value = d[f.name] || "")); } catch { /* no draft */ }
  const values = () => Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));

  function refresh() {
    const list = rfq.get();
    const text = requestText(list, values());
    preview.textContent = text;
    const href = mailtoHref(email, list, text);
    mail.href = href;
    longNote.hidden = href.length <= MAILTO_LIMIT;
    const v = values();
    write(DRAFT, Object.values(v).some(Boolean) ? JSON.stringify(v) : null);
  }
  function render() {
    const list = rfq.get();
    $("[data-empty-list]", root)!.hidden = list.length > 0;
    $("[data-has-list]", root)!.hidden = list.length === 0;
    tbody.replaceChildren(...list.map((x) => {
      const tr = tpl.content.firstElementChild!.cloneNode(true) as HTMLTableRowElement;
      const id = lineId(x);
      $("[data-d]", tr)!.textContent = x.d;
      const a = $<HTMLAnchorElement>("[data-link]", tr)!;
      if (x.href) { a.href = x.href; a.textContent = x.n; } else a.replaceWith(document.createTextNode(x.n));
      $("[data-at]", tr)!.textContent = [x.m, x.at].filter(Boolean).join(", ") || "–";
      $("[data-isp]", tr)!.textContent = x.isp || "–";
      $("[data-per]", tr)!.textContent = x.per == null ? "–" : String(x.per);
      const inp = $<HTMLInputElement>("input", tr)!;
      inp.id = `q-${list.indexOf(x)}`; inp.value = String(x.q);
      const lab = $<HTMLLabelElement>("label", tr)!; lab.htmlFor = inp.id; lab.textContent = `Запрашиваемое количество, ${x.d}`;
      inp.addEventListener("change", () => {
        const q = clampQ(inp.value); inp.value = String(q);
        rfq.set(rfq.get().map((i) => (lineId(i) === id ? { ...i, q } : i))); refresh(); total(); announce(`${x.d}: ${q} шт.`);
      });
      const del = $<HTMLButtonElement>("[data-del]", tr)!;
      del.setAttribute("aria-label", `Удалить ${x.d} из запроса`);
      del.addEventListener("click", () => { rfq.set(rfq.get().filter((i) => lineId(i) !== id)); render(); announce(`Удалено: ${x.d}`); $("h1")?.focus(); });
      return tr;
    }));
    total(); refresh();
  }
  const total = () => { const l = rfq.get(); $("[data-total]", root)!.textContent = `Строк: ${l.length}, всего запрашивается: ${l.reduce((s, x) => s + x.q, 0)} шт.`; };
  fields.forEach((f) => f.addEventListener("input", refresh));
  // Enter in a field must not submit the form: contact data would land in the URL
  $("[data-rfq-form]", root)?.addEventListener("submit", (e) => e.preventDefault());

  function valid(): boolean {
    const tel = $<HTMLInputElement>('[name="tel"]', root)!, em = $<HTMLInputElement>('[name="email"]', root)!;
    const has = !!(tel.value.trim() || em.value.trim()), emOk = !em.value.trim() || em.checkValidity();
    const ok = has && emOk;
    tel.setAttribute("aria-invalid", String(!has)); em.setAttribute("aria-invalid", String(!ok));
    errBox.hidden = ok;
    errBox.textContent = ok ? "" : !emOk ? "Проверьте e-mail: в адресе должны быть знак @ и домен." : "Укажите телефон или e-mail, чтобы предприятие могло ответить на запрос.";
    if (!ok) { (!emOk ? em : tel).focus(); announce(errBox.textContent); }
    return ok;
  }
  mail.addEventListener("click", (e) => {
    if (!valid()) { e.preventDefault(); return; }
    refresh();
    status.textContent = "Открываем вашу почтовую программу с текстом запроса. Сайт ничего не отправляет сам: проверьте письмо и отправьте его из почты. Если программа не открылась, скопируйте текст или скачайте файл.";
  });
  $("[data-copy]", root)!.addEventListener("click", async () => {
    refresh();
    try { await navigator.clipboard.writeText(preview.textContent || ""); status.textContent = `Текст запроса скопирован. Вставьте его в письмо на ${email}.`; }
    catch {
      const r = document.createRange(); r.selectNodeContents(preview); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r);
      status.textContent = "Автоматически скопировать не удалось: текст выделен, нажмите Ctrl+C (на Mac Cmd+C).";
    }
    announce(status.textContent);
  });
  $("[data-download]", root)!.addEventListener("click", () => {
    refresh();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([preview.textContent || ""], { type: "text/plain;charset=utf-8" }));
    a.download = "zapros-kp.txt"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    status.textContent = `Файл zapros-kp.txt сохранён. Приложите его к письму на ${email}.`;
    announce(status.textContent);
  });
  const clear = $<HTMLButtonElement>("[data-clear]", root)!;
  clear.addEventListener("click", () => {
    if (clear.dataset.armed !== "1") { clear.dataset.armed = "1"; $("[data-lbl]", clear)!.textContent = "Нажмите ещё раз, чтобы очистить"; return; }
    clear.dataset.armed = ""; $("[data-lbl]", clear)!.textContent = "Очистить список";
    rfq.set([]); render(); status.textContent = "Список запроса очищен."; announce(status.textContent);
  });
  const manual = $<HTMLFormElement>("[data-manual]", root);
  manual?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(manual);
    const d = String(fd.get("md") || "").trim();
    if (!d) return;
    rfq.set(addItem(rfq.get(), { k: `free:${d}`, d, n: String(fd.get("mn") || "").trim(), m: "", at: "", isp: "", per: null, q: clampQ(fd.get("mq")) }));
    manual.reset(); render(); announce(`Добавлено: ${d}`); $<HTMLInputElement>('[name="md"]', manual)!.focus();
  });
  render();
  addEventListener("storage", (e) => { if (e.key === STORE) render(); });
}
$$("[data-rfq-page]").forEach(rfqPage);

// ------------------------------------------------------------------ cross-section legend: mark callouts
$$("[data-cutaway]").forEach((root) => {
  const pts = $$("[data-n]", root);
  const btns = $$<HTMLButtonElement>("[data-cut]", root);
  let pinned: HTMLButtonElement | null = null;
  const show = (b: HTMLButtonElement | null) => {
    const on = new Set((b?.dataset.cut || "").split(" ").filter(Boolean));
    pts.forEach((p) => p.classList.toggle("on", on.has(p.dataset.n!)));
    root.classList.toggle("marking", on.size > 0);
  };
  btns.forEach((b) => {
    b.addEventListener("mouseenter", () => show(b));
    b.addEventListener("focus", () => show(b));
    b.addEventListener("mouseleave", () => show(pinned));
    b.addEventListener("blur", () => show(pinned));
    b.addEventListener("click", () => {
      pinned = pinned === b ? null : b;
      btns.forEach((x) => x.setAttribute("aria-pressed", String(x === pinned)));
      show(pinned);
    });
  });
});

// ------------------------------------------------------------------ small actions
document.addEventListener("click", async (e) => {
  const c = (e.target as Element).closest<HTMLButtonElement>("[data-copy-from]");
  if (c) {
    const src = document.getElementById(c.dataset.copyFrom!);
    const text = src?.dataset.text || src?.innerText || "";
    try { await navigator.clipboard.writeText(text); toast("Реквизиты скопированы."); }
    catch { const r = document.createRange(); r.selectNodeContents(src!); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); toast("Текст выделен: нажмите Ctrl+C."); }
  }
  if ((e.target as Element).closest("[data-print]")) print();
  if ((e.target as Element).closest("[data-clear-storage]")) {
    [STORE, DRAFT, ISP].forEach((k) => write(k, null)); paint();
    const s = $("[data-storage-status]"); if (s) s.textContent = "Сохранённые на этом устройстве данные сайта удалены.";
    announce("Данные удалены");
  }
});

paint();
addEventListener("storage", (e) => { if (e.key === STORE) paint(); });
addEventListener("pageshow", paint);

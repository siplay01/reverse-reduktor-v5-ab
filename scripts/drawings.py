"""Render the vector drawings of the owner's manual (Руководство РР300 А4.pdf) for V5 and extract callouts + legend.
Run: python3 -I scripts/drawings.py  (needs poppler: pdftoppm, pdftotext; cwebp)
Output: public/img/v5/*.webp, src/data/cutaway.json"""
import json, re, subprocess, tempfile, os, sys
PDF = os.path.expanduser("~/Documents/Projects/Reductor/site/docs/rr300-re.pdf")
OUT = "public/img/v5"
# page, crop in PDF points (x, y, w, h), name
CROPS = [(6, (25, 48, 552, 515), "rr300-section"), (8, (60, 70, 470, 520), "rr300-front"), (15, (100, 160, 420, 250), "rr300-side")]
tmp = tempfile.mkdtemp()
for page, (x, y, w, h), name in CROPS:
    for dpi, width in ((400, None),):
        base = f"{tmp}/{name}"
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-x", str(round(x * dpi / 72)), "-y", str(round(y * dpi / 72)),
                        "-W", str(round(w * dpi / 72)), "-H", str(round(h * dpi / 72)), "-gray", "-png", "-singlefile", PDF, base], check=True)
        for px in (1200, 2400):
            subprocess.run(["cwebp", "-quiet", "-q", "82", "-resize", str(px), "0", f"{base}.png", "-o", f"{OUT}/{name}-{px}.webp"], check=True)
# callouts of fig. 1: numbers inside the crop, in % of the crop
page, (cx, cy, cw, ch), _ = CROPS[0]
xml = subprocess.run(["pdftotext", "-f", "6", "-l", "6", "-bbox", PDF, "-"], capture_output=True, text=True).stdout
calls = []
for m in re.finditer(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(\d{1,2})<', xml):
    x0, y0, x1, y1, n = float(m[1]), float(m[2]), float(m[3]), float(m[4]), int(m[5])
    if 1 <= n <= 47 and cy < y0 < cy + ch and cx < x0 < cx + cw:
        calls.append({"n": n, "x": round(((x0 + x1) / 2 - cx) / cw * 100, 2), "y": round(((y0 + y1) / 2 - cy) / ch * 100, 2)})
# legend: «1 – фланец соединительный; 2, 11, 24, 39, 42 – крышки; …» (Arabic numbers only; letters/Roman stay in the image)
text = subprocess.run(["pdftotext", "-f", "6", "-l", "6", PDF, "-"], capture_output=True, text=True).stdout
leg = " ".join(text.split("\n"))
leg = leg[leg.index("1 – фланец"): leg.index("Рисунок 1")]
items = []
for part in leg.split(";"):
    part = part.strip()
    m = re.match(r"^([\d,\s]+)\s*–\s*(.+)$", part)
    if not m: continue
    nums = [int(s) for s in re.findall(r"\d+", m[1])]
    name = re.sub(r"\s+", " ", m[2]).strip().replace("реверсредуктор", "реверс-редуктор")
    name = re.split(r"\s+(?:I|II|А|Б)\s+–", name)[0]
    # the last item of a line may carry the Roman-numeral entries; split them off
    items.append({"nums": nums, "name": name})
roman = [{"key": "I", "name": "муфта сцепления переднего хода"}, {"key": "II", "name": "муфта сцепления заднего хода"}]
found = {c["n"] for c in calls}
json.dump({"source": "Руководство по эксплуатации РР-300.РЭ, рисунок 1 (продольный разрез)", "crop": CROPS[0][1],
           "callouts": sorted(calls, key=lambda c: c["n"]), "legend": items, "groups": roman,
           "missingOnDrawing": sorted({n for i in items for n in i["nums"]} - found)}, open("src/data/cutaway.json", "w"), ensure_ascii=False, indent=1)
print(len(calls), "callouts;", len(items), "legend items;", "not on drawing:", sorted({n for i in items for n in i["nums"]} - found))

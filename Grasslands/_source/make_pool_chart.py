"""Bar chart of the three grassland carbon pools, for Part 1.

Reads the numbers out of the recalculated worked-example workbook rather than
carrying them as literals, so the chart cannot drift from the data. Writes
Grasslands/01_Background/images/carbon_pools.svg.

Only the two PRAIRIE sites are used (S1 grazed, S2 ungrazed exclosure, 6 plots).
S3 is Black Oak savannah and most of its vegetation carbon is TREE carbon, which
would make the shoot bar describe something other than grassland.

Design notes, from the dataviz skill:
  - One measure across three named categories, so ONE hue, not a categorical
    palette. The categories are labelled directly; colour would carry no
    information and three hues would invite a CVD problem for nothing.
  - #6E8B3D passes the contrast check against both the light and the dark
    surface (>= 3:1 for graphical objects), so one file serves both GitHub
    themes. Text sits at #7a7a7a, the near-maximum a single grey can reach on
    both white and #0d1117 (~4.3:1 each way), so labels are set large.
  - No hover layer: GitHub strips scripts from SVG. Every bar is direct-labelled
    instead, which is the full substitute at n = 3.
"""
import os, statistics, openpyxl

GRASS = "/home/user/Terrestrial_Carbon_Workshops_V1/Grasslands"
WB = f"{GRASS}/Worked_Example/Grassland_Carbon_Calculator_WorkedExample.xlsx"
OUT = f"{GRASS}/01_Background/images/carbon_pools.svg"

BAR = "#6E8B3D"     # validated against both surfaces
INK = "#7a7a7a"     # readable on white and on #0d1117
FAINT = "#9a9a9a"

wb = openpyxl.load_workbook(WB, data_only=True)
ps = wb["5. Plot Summary"]
rows = []
for r in range(5, 20):
    if not ps.cell(r, 1).value:
        continue
    rows.append(dict(site=ps.cell(r, 2).value, soil=ps.cell(r, 4).value,
                     root=ps.cell(r, 7).value, veg=ps.cell(r, 8).value))
prairie = [x for x in rows if x["site"] in ("S1", "S2")]
if len(prairie) != 6:
    raise SystemExit(f"expected 6 prairie plots, found {len(prairie)}")

pools = [
    ("Soil, 0–30 cm", statistics.mean(p["soil"] for p in prairie)),
    ("Roots",              statistics.mean(p["root"] for p in prairie)),
    ("Shoots",             statistics.mean(p["veg"]  for p in prairie)),
]
total = sum(v for _, v in pools)

W, H = 760, 258
X0, MAXW = 172, 420
Y0, BARH, GAP = 54, 32, 24
scale = MAXW / max(v for _, v in pools)


def bar_path(x, y, w, h):
    """Square at the baseline, rounded at the data end."""
    r = min(4.0, w / 2)
    if w <= 0.5:
        return ""
    return (f"M{x:.1f} {y:.1f} H{x + w - r:.1f} A{r:.1f} {r:.1f} 0 0 1 "
            f"{x + w:.1f} {y + r:.1f} V{y + h - r:.1f} A{r:.1f} {r:.1f} 0 0 1 "
            f"{x + w - r:.1f} {y + h:.1f} H{x:.1f} Z")


parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
    f'viewBox="0 0 {W} {H}" role="img" '
    f'aria-labelledby="t d" font-family="Helvetica, Arial, sans-serif">',
    '<title id="t">Grassland carbon by pool</title>',
    f'<desc id="d">Horizontal bar chart of mean carbon stock in three pools across six '
    f'prairie plots: soil to 30 cm {pools[0][1]:.2f}, roots {pools[1][1]:.2f} and shoots '
    f'{pools[2][1]:.2f} kilograms of carbon per square metre. Soil holds '
    f'{100*pools[0][1]/total:.0f} per cent of the total and shoots '
    f'{100*pools[2][1]/total:.0f} per cent.</desc>',
    f'<text x="0" y="20" font-size="15" font-weight="600" fill="{INK}">'
    f'Where the carbon is — mean of six prairie plots</text>',
    f'<text x="0" y="38" font-size="12.5" fill="{FAINT}">'
    f'kg C per m² · soil to 30 cm · share of the three-pool total in brackets</text>',
]

for i, (label, val) in enumerate(pools):
    y = Y0 + i * (BARH + GAP)
    w = val * scale
    parts.append(f'<text x="{X0 - 14}" y="{y + BARH/2 + 5.5:.1f}" font-size="14.5" '
                 f'text-anchor="end" fill="{INK}">{label}</text>')
    p = bar_path(X0, y, w, BARH)
    if p:
        parts.append(f'<path d="{p}" fill="{BAR}"/>')
    else:   # too thin to round; keep a visible minimum so the sliver still reads
        parts.append(f'<rect x="{X0}" y="{y}" width="2" height="{BARH}" fill="{BAR}"/>')
    parts.append(
        f'<text x="{X0 + max(w, 2) + 12:.1f}" y="{y + BARH/2 + 5.5:.1f}" font-size="14.5" '
        f'fill="{INK}"><tspan font-weight="600">{val:.2f}</tspan>'
        f'<tspan fill="{FAINT}">  ({100*val/total:.1f}%)</tspan></text>')

parts.append(
    f'<text x="0" y="{H - 10}" font-size="12" fill="{FAINT}">'
    f'Soil holds {pools[0][1]/pools[2][1]:.0f}× the carbon of the shoots you can see; '
    f'roots hold {pools[1][1]/pools[2][1]:.1f}×. '
    f'Constructed teaching data — see the Worked Example.</text>')
parts.append("</svg>")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write("\n".join(parts))
print("wrote", OUT)
for label, val in pools:
    print(f"  {label:<16} {val:6.3f} kg C/m2   {100*val/total:5.1f}%")

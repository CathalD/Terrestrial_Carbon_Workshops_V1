"""The Part 2 planning diagrams.

Seven schematic SVGs, written to Grasslands/02_Project_Planning/images/.

One file has to read on both GitHub themes, so every figure uses a transparent
background, the muted ink `#898781` that the dataviz reference palette uses in
both light and dark mode, and a categorical set validated against BOTH the light
and the dark surface:

    node scripts/validate_palette.js "#3987e5,#d95926,#199e70,#c98500" --mode light
    node scripts/validate_palette.js "#3987e5,#d95926,#199e70,#c98500" --mode dark

Both pass all six checks. Every category is also directly labelled, so identity
never rests on colour alone.

Run:  python3 make_planning_figures.py
"""
import os, math, random

OUT = ("/home/user/Terrestrial_Carbon_Workshops_V1/Grasslands/"
       "02_Project_Planning/images")

C1, C2, C3, C4 = "#3987e5", "#d95926", "#199e70", "#c98500"
INK = "#898781"          # muted ink, identical in both modes
FAINT = "#a5a49e"
LINE = "#b9b8b1"
FONT = 'font-family="Helvetica, Arial, sans-serif"'


def svg(w, h, title, desc, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d" {FONT}>\n'
            f'<title id="t">{esc(title)}</title>\n<desc id="d">{esc(desc)}</desc>\n'
            f'{body}\n</svg>\n')


def esc(s):
    """XML-escape text content. '<' in labels like 'veg < 0.5 m' is otherwise
    an unclosed tag, and the whole file fails to parse."""
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def txt(x, y, s, size=13, fill=INK, anchor="start", weight="normal"):
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" font-weight="{weight}">{esc(s)}</text>')


def write(name, content):
    os.makedirs(OUT, exist_ok=True)
    open(f"{OUT}/{name}", "w", encoding="utf-8").write(content)
    print("  wrote", name)


# ═══════════════════════════════════════════════════════════════════════════
# sampling_explainer.svg — why a sample stands in for the whole
# ═══════════════════════════════════════════════════════════════════════════
def sampling_explainer():
    random.seed(11)
    b = []
    gx, gy, cell, n = 30, 54, 26, 13
    # the true surface: a carbon field, shown as a faint value grid
    for i in range(n):
        for j in range(8):
            v = 0.32 + 0.5 * math.exp(-((i - 4) ** 2 + (j - 3) ** 2) / 26) \
                     + 0.28 * math.exp(-((i - 10) ** 2 + (j - 5) ** 2) / 16)
            b.append(f'<rect x="{gx+i*cell}" y="{gy+j*cell}" width="{cell-2}" '
                     f'height="{cell-2}" rx="2" fill="{C3}" opacity="{0.10+0.55*min(v,1):.2f}"/>')
    b.append(txt(gx, gy - 26, "The whole study area", 14, INK, weight="600"))
    b.append(txt(gx, gy - 9, "every square metre has a carbon value — you cannot measure them all", 11.5, FAINT))

    # the sample
    pts = [(1, 1), (4, 5), (7, 2), (10, 6), (3, 3), (11, 3), (6, 6), (9, 0)]
    for i, j in pts:
        cx, cy = gx + i * cell + cell / 2 - 1, gy + j * cell + cell / 2 - 1
        b.append(f'<circle cx="{cx}" cy="{cy}" r="7" fill="none" stroke="{C2}" stroke-width="2.5"/>')
    b.append(txt(gx, gy + 8 * cell + 22, f"{len(pts)} sampled plots (circled)", 12, INK))

    # the estimate
    ex = gx + n * cell + 40
    b.append(txt(ex, gy - 9, "What you report", 14, INK, weight="600"))
    b.append(f'<line x1="{ex}" y1="{gy+26}" x2="{ex+210}" y2="{gy+26}" stroke="{LINE}" stroke-width="2"/>')
    b.append(f'<rect x="{ex+52}" y="{gy+14}" width="106" height="24" rx="4" fill="{C2}" opacity="0.22"/>')
    b.append(f'<line x1="{ex+105}" y1="{gy+10}" x2="{ex+105}" y2="{gy+42}" stroke="{C2}" stroke-width="3"/>')
    b.append(txt(ex + 105, gy + 60, "estimate", 12, INK, anchor="middle"))
    b.append(txt(ex + 105, gy + 76, "± margin of error", 12, FAINT, anchor="middle"))
    b.append(txt(ex, gy + 110, "More samples usually means", 12, INK))
    b.append(txt(ex, gy + 128, "a narrower band — not a", 12, INK))
    b.append(txt(ex, gy + 146, "different true value.", 12, INK))
    b.append(f'<path d="M{gx+n*cell+8} {gy+26} h24" stroke="{LINE}" stroke-width="2" '
             f'marker-end="url(#a)"/>')
    b.insert(0, f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" '
                f'markerWidth="6" markerHeight="6" orient="auto">'
                f'<path d="M0 0 L10 5 L0 10 z" fill="{LINE}"/></marker></defs>')
    write("sampling_explainer.svg", svg(
        760, 300, "Probability-based sampling",
        "A grid representing carbon values across a study area, with eight sampled plots "
        "circled, and beside it the estimate and its margin of error that those samples produce.",
        "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# sample_size_explorer_static.svg — the static fallback, three frames
# ═══════════════════════════════════════════════════════════════════════════
def explorer_static():
    random.seed(4)
    frames = [(3, 0.42, "3 samples"), (9, 0.24, "9 samples"), (25, 0.14, "25 samples")]
    b, fw, x0, y0, h = [], 230, 24, 74, 120
    b.append(txt(x0, 28, "What more samples buy", 14, INK, weight="600"))
    b.append(txt(x0, 46, "Each panel: the running estimate (bar) and its interval (band) against the simulated true mean (dashed).",
                 11.5, FAINT))
    for k, (n, rel, lab) in enumerate(frames):
        ox = x0 + k * (fw + 16)
        true_y = y0 + h * 0.42
        b.append(f'<rect x="{ox}" y="{y0}" width="{fw}" height="{h}" rx="4" '
                 f'fill="none" stroke="{LINE}" stroke-width="1"/>')
        est = 0.46 if k == 0 else (0.43 if k == 1 else 0.42)
        ey = y0 + h * est
        band = h * rel
        b.append(f'<rect x="{ox+30}" y="{ey-band/2}" width="{fw-60}" height="{band}" '
                 f'rx="3" fill="{C1}" opacity="0.20"/>')
        b.append(f'<line x1="{ox+30}" y1="{ey}" x2="{ox+fw-30}" y2="{ey}" '
                 f'stroke="{C1}" stroke-width="2.5"/>')
        b.append(f'<line x1="{ox+12}" y1="{true_y}" x2="{ox+fw-12}" y2="{true_y}" '
                 f'stroke="{INK}" stroke-width="1.5" stroke-dasharray="5 4"/>')
        b.append(txt(ox + fw / 2, y0 + h + 20, lab, 12.5, INK, anchor="middle", weight="600"))
        b.append(txt(ox + fw / 2, y0 + h + 36, f"±{rel*100:.0f}% (illustrative)", 11.5, FAINT, anchor="middle"))
    b.append(txt(x0, y0 + h + 66,
                 "A more variable pool — roots rather than soil — needs more samples to reach the same relative precision.",
                 12, INK))
    write("sample_size_explorer_static.svg", svg(
        760, 268, "Sample size and precision",
        "Three panels showing an estimate and its confidence band at three, nine and "
        "twenty-five samples. The band narrows as sample size grows while the simulated "
        "true mean stays fixed.", "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# step1_grassland_boundary.svg
# ═══════════════════════════════════════════════════════════════════════════
def step1():
    b = []
    b.append(txt(24, 28, "Step 1 — the study area boundary", 14, INK, weight="600"))
    b.append(txt(24, 46, "The boundary turns a carbon density into a carbon total. Exclusions come out of the area.", 11.5, FAINT))
    b.append(f'<path d="M40 70 L430 62 L470 176 L392 268 L96 262 L36 168 Z" fill="{C3}" '
             f'opacity="0.16" stroke="{C3}" stroke-width="2.5"/>')
    b.append(txt(96, 92, "PROJECT BOUNDARY", 11.5, C3, weight="600"))
    # exclusions
    exc = [("wetland", "M150 120 q30 -22 62 -4 q20 30 -10 44 q-44 10 -52 -40 z"),
           ("rock outcrop", "M330 190 l40 -14 l24 30 l-30 26 l-36 -14 z")]
    for lab, d in exc:
        b.append(f'<path d="{d}" fill="{C2}" opacity="0.30" stroke="{C2}" stroke-width="1.8"/>')
    b.append(txt(182, 168, "wetland", 11, C2, anchor="middle"))
    b.append(txt(356, 236, "rock outcrop", 11, C2, anchor="middle"))
    b.append(f'<path d="M36 214 L470 198" stroke="{C2}" stroke-width="9" opacity="0.30"/>')
    b.append(txt(96, 192, "road", 11, C2))
    b.append(f'<path d="M58 78 L64 258" stroke="{C4}" stroke-width="2" stroke-dasharray="8 5"/>')
    b.append(txt(70, 256, "fence line", 11, C4))
    # area readout
    x = 510
    b.append(txt(x, 92, "Record", 13, INK, weight="600"))
    for i, (k, v) in enumerate([("gross area", "— m²"), ("less exclusions", "— m²"),
                                ("NET AREA", "— m²  /  — ha"),
                                ("inclusion rule", "one sentence")]):
        yy = 118 + i * 30
        b.append(txt(x, yy, k, 12, FAINT))
        b.append(txt(x + 208, yy, v, 12, INK, anchor="end",
                     weight="600" if k == "NET AREA" else "normal"))
        b.append(f'<line x1="{x}" y1="{yy+7}" x2="{x+208}" y2="{yy+7}" stroke="{LINE}" stroke-width="0.8"/>')
    write("step1_grassland_boundary.svg", svg(
        760, 300, "Defining the study area",
        "A project boundary polygon with a wetland inclusion, rock outcrop, road corridor and "
        "fence line marked as exclusions, beside a form recording gross area, exclusions, net "
        "area and the inclusion rule.", "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# step2_stratification.svg
# ═══════════════════════════════════════════════════════════════════════════
def step2():
    b = []
    b.append(txt(24, 28, "Step 2 — dividing the site into meaningfully distinct areas", 14, INK, weight="600"))
    b.append(txt(24, 46, "Strata must be mappable, and each needs an area, because the area is what weights it later.", 11.5, FAINT))
    strata = [
        ("Restored 20 yr", C3, "M40 70 L230 64 L242 176 L52 182 Z", 120, 128),
        ("Restored 10 yr", C1, "M230 64 L430 58 L446 168 L242 176 Z", 336, 122),
        ("Unrestored", C4, "M52 182 L242 176 L446 168 L412 268 L92 262 Z", 244, 228),
    ]
    for lab, col, d, lx, ly in strata:
        b.append(f'<path d="{d}" fill="{col}" opacity="0.20" stroke="{col}" stroke-width="2.5"/>')
        b.append(txt(lx, ly, lab, 12, col, anchor="middle", weight="600"))
        b.append(txt(lx, ly + 16, "— ha", 11, FAINT, anchor="middle"))
    b.append(f'<path d="M92 262 L412 268" stroke="{C2}" stroke-width="2" stroke-dasharray="7 5"/>')
    b.append(txt(252, 286, "burn unit boundary — a second layer, only if fire is part of the question",
                 11, C2, anchor="middle"))
    x = 510
    b.append(txt(x, 88, "A stratum earns its place if", 13, INK, weight="600"))
    for i, s in enumerate(["it relates to the project question",
                           "it can be drawn on a map",
                           "its area can be measured",
                           "it will still exist next visit"]):
        b.append(f'<circle cx="{x+6}" cy="{110+i*26-4}" r="3" fill="{C3}"/>')
        b.append(txt(x + 20, 110 + i * 26, s, 12, INK))
    b.append(txt(x, 232, "Each extra stratum adds a", 11.5, FAINT))
    b.append(txt(x, 248, "minimum sample count of its own.", 11.5, FAINT))
    write("step2_stratification.svg", svg(
        760, 306, "Stratifying the study area",
        "The study boundary divided into three restoration-age strata, each labelled and "
        "awaiting an area, with a burn-unit boundary shown as an optional second layer, and a "
        "checklist of what makes a stratum worth creating.", "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# step3_carbon_pools.svg
# ═══════════════════════════════════════════════════════════════════════════
def step3():
    b, g = [], 186     # ground line
    b.append(txt(24, 28, "Step 3 — the pools, and the plot each is measured in", 14, INK, weight="600"))
    b.append(f'<line x1="24" y1="{g}" x2="500" y2="{g}" stroke="{LINE}" stroke-width="2"/>')
    # tree
    b.append(f'<line x1="92" y1="{g}" x2="92" y2="{g-74}" stroke="{C4}" stroke-width="4"/>')
    b.append(f'<ellipse cx="92" cy="{g-88}" rx="40" ry="26" fill="{C3}" opacity="0.35"/>')
    b.append(txt(92, g - 126, "tree > 2 m", 11.5, INK, anchor="middle"))
    b.append(txt(92, g - 111, "400 m² plot", 10.5, FAINT, anchor="middle"))
    # shrub
    b.append(f'<path d="M210 {g} q-4 -32 14 -40 q22 4 16 40 z" fill="{C3}" opacity="0.45"/>')
    b.append(txt(220, g - 56, "shrub 0.5–2 m", 11.5, INK, anchor="middle"))
    b.append(txt(220, g - 41, "16–100 m² plot", 10.5, FAINT, anchor="middle"))
    # sward + quadrat
    for i in range(16):
        x = 300 + i * 7
        b.append(f'<path d="M{x} {g} q2 -12 5 -18" stroke="{C3}" stroke-width="1.6" fill="none" opacity="0.8"/>')
    b.append(f'<rect x="296" y="{g-30}" width="120" height="30" fill="none" stroke="{C2}" '
             f'stroke-width="2" stroke-dasharray="5 3"/>')
    b.append(txt(356, g - 56, "ground veg < 0.5 m", 11.5, INK, anchor="middle"))
    b.append(txt(356, g - 41, "0.25 m² quadrat", 10.5, C2, anchor="middle"))
    # core
    cx = 460
    b.append(f'<rect x="{cx}" y="{g}" width="30" height="128" fill="{C1}" opacity="0.16" stroke="{C1}" stroke-width="2"/>')
    for d, lab in [(0, "0–10"), (26, "10–20"), (52, "20–30"), (78, "30–60"), (104, "60–100")]:
        b.append(f'<line x1="{cx}" y1="{g+d}" x2="{cx+30}" y2="{g+d}" stroke="{C1}" stroke-width="1.2"/>')
        b.append(txt(cx + 38, g + d + 17, f"{lab} cm", 10.5, FAINT))
    b.append(txt(cx + 15, g - 12, "soil + roots", 11.5, INK, anchor="middle"))
    b.append(txt(cx + 15, g + 146, "to refusal", 10.5, C1, anchor="middle"))
    # right column
    x = 590
    b.append(txt(x, 104, "Each pool is divided by", 12, INK))
    b.append(txt(x, 122, "ITS OWN plot area, which", 12, INK))
    b.append(txt(x, 140, "is what makes them addable.", 12, INK))
    b.append(txt(x, 176, "A clipped sample is a", 12, FAINT))
    b.append(txt(x, 194, "standing crop at that", 12, FAINT))
    b.append(txt(x, 212, "moment — not a stock.", 12, FAINT))
    write("step3_carbon_pools.svg", svg(
        760, 360, "Carbon pools and the nested plot",
        "A nested grassland plot in cross-section: a tree over two metres in a 400 square metre "
        "plot, a shrub in the medium plot, ground vegetation in a 0.25 square metre quadrat, and "
        "a soil core with depth increments from 0 to 100 centimetres and on to refusal.",
        "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# step5_sampling_strategies.svg
# ═══════════════════════════════════════════════════════════════════════════
def step5_strategies():
    random.seed(7)
    b, fw, fh, x0, y0 = [], 168, 150, 24, 66
    b.append(txt(x0, 28, "Step 5 — four ways to place the samples", 14, INK, weight="600"))
    b.append(txt(x0, 46, "The design has to represent the area and support the comparison the project intends to make.", 11.5, FAINT))
    panels = []
    panels.append(("Random", [(random.uniform(.1, .9), random.uniform(.1, .9)) for _ in range(9)], None))
    grid = [(0.2 + 0.3 * i, 0.2 + 0.3 * j) for i in range(3) for j in range(3)]
    panels.append(("Systematic", grid, None))
    strat = []
    for k in range(3):
        for _ in range(3):
            strat.append((random.uniform(.08, .92), k / 3 + random.uniform(.05, .28)))
    panels.append(("Stratified random", strat, "bands"))
    paired = []
    for k in range(4):
        y = 0.16 + k * 0.22
        paired += [(0.3, y), (0.7, y)]
    panels.append(("Paired across a boundary", paired, "split"))

    for k, (lab, pts, deco) in enumerate(panels):
        ox = x0 + k * (fw + 16)
        b.append(f'<rect x="{ox}" y="{y0}" width="{fw}" height="{fh}" rx="4" fill="none" '
                 f'stroke="{LINE}" stroke-width="1"/>')
        if deco == "bands":
            for i, col in enumerate((C3, C1, C4)):
                b.append(f'<rect x="{ox+1}" y="{y0+1+i*(fh-2)/3}" width="{fw-2}" '
                         f'height="{(fh-2)/3}" fill="{col}" opacity="0.12"/>')
        if deco == "split":
            b.append(f'<line x1="{ox+fw/2}" y1="{y0}" x2="{ox+fw/2}" y2="{y0+fh}" '
                     f'stroke="{C2}" stroke-width="2" stroke-dasharray="6 4"/>')
        for px, py in pts:
            b.append(f'<circle cx="{ox+px*fw:.1f}" cy="{y0+py*fh:.1f}" r="4" fill="{C1}" opacity="0.85"/>')
        b.append(txt(ox + fw / 2, y0 + fh + 20, lab, 12, INK, anchor="middle", weight="600"))
    b.append(txt(x0, y0 + fh + 50,
                 "Stratified random is the default once strata exist.", 11.5, FAINT))
    b.append(txt(x0, y0 + fh + 68,
                 "Convenience sampling is not a probability design — if it is unavoidable for a pilot, label the limitation.",
                 11.5, FAINT))
    write("step5_sampling_strategies.svg", svg(
        760, 306, "Sampling strategies",
        "Four panels comparing random, systematic grid, stratified random and paired "
        "across-a-boundary sample placement.", "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# step5_nested_plot_layout.svg
# ═══════════════════════════════════════════════════════════════════════════
def nested_plot():
    b, cx, cy = [], 240, 176
    b.append(txt(24, 28, "The nested plot, in plan view", 14, INK, weight="600"))
    b.append(txt(24, 46, "One location, several plot sizes. Non-destructive work finishes before anything is cored or clipped.", 11.5, FAINT))
    b.append(f'<circle cx="{cx}" cy="{cy}" r="112" fill="{C3}" opacity="0.08" stroke="{C3}" stroke-width="2"/>')
    b.append(txt(cx, cy - 118, "large plot 400 m² — trees > 2 m", 11.5, C3, anchor="middle"))
    b.append(f'<rect x="{cx-56}" y="{cy-56}" width="112" height="112" fill="{C1}" opacity="0.10" stroke="{C1}" stroke-width="2"/>')
    b.append(txt(cx + 64, cy - 44, "medium plot 16–100 m²", 11.5, C1))
    b.append(txt(cx + 64, cy - 29, "shrubs 0.5–2 m", 10.5, FAINT))
    b.append(f'<rect x="{cx-44}" y="{cy+6}" width="34" height="34" fill="{C2}" opacity="0.22" stroke="{C2}" stroke-width="2"/>')
    b.append(txt(cx - 62, cy + 76, "0.25 m² quadrat", 11, C2, anchor="middle"))
    b.append(f'<circle cx="{cx+34}" cy="{cy+24}" r="6" fill="{C4}"/>')
    b.append(txt(cx + 48, cy + 28, "soil / root core", 11, C4))
    b.append(f'<path d="M{cx-27} {cy+23} h52" stroke="{C4}" stroke-width="1.2" stroke-dasharray="3 3"/>')
    b.append(txt(cx + 4, cy + 58, "offset", 10, FAINT, anchor="middle"))
    b.append(f'<circle cx="{cx}" cy="{cy}" r="3.5" fill="{INK}"/>')
    b.append(txt(cx, cy - 10, "plot centre", 10.5, INK, anchor="middle"))
    b.append(f'<path d="M96 292 L{cx-90} {cy+96}" stroke="{FAINT}" stroke-width="1.5" stroke-dasharray="6 4"/>')
    b.append(txt(40, 300, "approach path", 10.5, FAINT))
    x = 480
    b.append(txt(x, 92, "Order at the plot", 13, INK, weight="600"))
    for i, s in enumerate(["mark centre, GPS, photos", "trees > 2 m", "shrubs, medium plot",
                           "clip the quadrat", "THEN core, offset"]):
        col = C2 if i == 4 else INK
        b.append(txt(x, 118 + i * 26, f"{i+1}. {s}", 12, col,
                     weight="600" if i == 4 else "normal"))
    b.append(txt(x, 262, "In a PERMANENT plot the core", 11.5, FAINT))
    b.append(txt(x, 278, "goes outside the vegetation area.", 11.5, FAINT))
    write("step5_nested_plot_layout.svg", svg(
        760, 320, "Nested plot layout",
        "Plan view of a nested grassland plot: a 400 square metre circular tree plot, a medium "
        "shrub plot inside it, a 0.25 square metre clip quadrat, and a soil core offset from the "
        "quadrat, with the order of work listed alongside.", "\n".join(b)))


# ═══════════════════════════════════════════════════════════════════════════
# permanent_vs_single_use.svg
# ═══════════════════════════════════════════════════════════════════════════
def perm_vs_single():
    b, fw, fh, y0 = [], 344, 206, 74
    b.append(txt(24, 28, "Permanent or single-use?", 14, INK, weight="600"))
    b.append(txt(24, 46, "A planning decision. A campaign designed for a one-off stock is often unusable as a baseline.", 11.5, FAINT))
    for k, (lab, perm) in enumerate([("Single-use", False), ("Permanent", True)]):
        ox = 24 + k * (fw + 24)
        col = C2 if not perm else C3
        b.append(f'<rect x="{ox}" y="{y0}" width="{fw}" height="{fh}" rx="5" fill="none" '
                 f'stroke="{LINE}" stroke-width="1"/>')
        b.append(txt(ox + 14, y0 + 24, lab, 13.5, col, weight="600"))
        # the plot, kept in the left half so the caption column never meets it
        px, py, half = ox + 82, y0 + 118, 44
        b.append(f'<rect x="{px-half}" y="{py-half}" width="{2*half}" height="{2*half}" '
                 f'fill="{col}" opacity="0.10" stroke="{col}" stroke-width="2"/>')
        b.append(txt(px, py - half - 10, "vegetation plot", 10.5, FAINT, anchor="middle"))
        b.append(f'<rect x="{px-30}" y="{py-12}" width="24" height="24" fill="{C1}" '
                 f'opacity="0.28" stroke="{C1}" stroke-width="1.5"/>')
        b.append(txt(px - 18, py + 30, "quadrat", 9.5, C1, anchor="middle"))
        if perm:
            b.append(f'<circle cx="{px+half+22}" cy="{py+18}" r="6" fill="{C4}"/>')
            b.append(f'<path d="M{px+half+2} {py+18} h12" stroke="{C4}" stroke-width="1.2" '
                     f'stroke-dasharray="3 3"/>')
            b.append(txt(px + half + 22, py + 40, "core", 10, C4, anchor="middle"))
            b.append(txt(px + half + 22, py + 53, "OUTSIDE", 10, C4, anchor="middle"))
            b.append(f'<circle cx="{px-half}" cy="{py+half}" r="4.5" fill="{col}"/>')
            b.append(txt(px - half, py + half + 18, "marker", 9.5, col, anchor="middle"))
        else:
            b.append(f'<circle cx="{px+20}" cy="{py+24}" r="6" fill="{C4}"/>')
            b.append(txt(px + 20, py + 46, "core", 10, C4, anchor="middle"))
            b.append(txt(px + 20, py + 59, "INSIDE", 10, C4, anchor="middle"))
        tx = ox + 194
        lines = (["Sampled once.", "Destructive work", "inside the plot, after", "the survey is done."]
                 if not perm else
                 ["Re-measured over time.", "Destructive work", "OUTSIDE the plot.", "Offset recorded."])
        for i, ln in enumerate(lines):
            b.append(txt(tx, y0 + 62 + i * 20, ln, 12, INK))
        q = "\u201cHow much is here now?\u201d" if not perm else "\u201cIs this changing?\u201d"
        b.append(txt(tx, y0 + 162, q, 11.5, col))
    write("permanent_vs_single_use.svg", svg(
        760, 302, "Permanent versus single-use plots",
        "Two matched panels. In a single-use plot the core is taken inside the vegetation plot "
        "after the survey; in a permanent plot the core is offset outside it and the plot carries "
        "a relocatable marker.", "\n".join(b)))


if __name__ == "__main__":
    print("Part 2 figures →", OUT)
    sampling_explainer()
    explorer_static()
    step1()
    step2()
    step3()
    step5_strategies()
    nested_plot()
    perm_vs_single()

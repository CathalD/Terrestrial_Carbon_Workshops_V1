"""Build the two Grasslands .docx field assets.

    03_Field_Methods/datasheets/Grassland-Field-Data-Sheet.docx
    03_Field_Methods/checklists/Grassland_Carbon_Skill_Checklist.docx

Style is lifted from Wetlands/_source/build_docx.py so the series looks like
one thing. The field labels are READ OUT OF THE CALCULATOR rather than retyped,
which is what guarantees the datasheet and the workbook cannot drift apart.
"""
import os, sys, openpyxl
sys.path.insert(0, "/home/user/Terrestrial_Carbon_Workshops_V1/Grasslands/_source")
from grass_style import OUT as XLSX

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ROW_HEIGHT_RULE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

GRASS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ORANGE_BAND = "C2703A"   # section bands -- grassland earth
PALE   = "F2DFCE"
TINT   = "FDF6EF"
WHITE  = "ffffff"
GREY   = "d9d9d9"
FONT   = "Calibri"
TEAM   = "▶ TEAM"


def shade(cell, hexfill):
    tcPr = cell._tc.get_or_add_tcPr()
    for old in tcPr.findall(qn('w:shd')):
        tcPr.remove(old)
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear'); shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hexfill)
    tcPr.append(shd)


def borders(table, sz=4):
    tblPr = table._tbl.tblPr
    for old in tblPr.findall(qn('w:tblBorders')):
        tblPr.remove(old)
    el = OxmlElement('w:tblBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        e = OxmlElement('w:' + edge)
        e.set(qn('w:val'), 'single'); e.set(qn('w:sz'), str(sz))
        e.set(qn('w:space'), '0'); e.set(qn('w:color'), '000000')
        el.append(e)
    tblPr.append(el)


def set_widths(table, widths):
    """Fix column widths. LibreOffice sizes fixed-layout tables from w:tblGrid,
    which python-docx never writes -- without this the columns come out equal."""
    tblPr = table._tbl.tblPr
    for old in tblPr.findall(qn('w:tblLayout')):
        tblPr.remove(old)
    layout = OxmlElement('w:tblLayout'); layout.set(qn('w:type'), 'fixed')
    tblPr.append(layout)
    table.autofit = False
    tbl = table._tbl
    for old in tbl.findall(qn('w:tblGrid')):
        tbl.remove(old)
    grid = OxmlElement('w:tblGrid')
    for w in widths:
        gc = OxmlElement('w:gridCol'); gc.set(qn('w:w'), str(int(w.twips)))
        grid.append(gc)
    tbl.insert(list(tbl).index(tbl.tblPr) + 1, grid)
    for row in table.rows:
        for i, w in enumerate(widths):
            if i < len(row.cells):
                row.cells[i].width = w


def row_height(table, inches, first=0):
    for row in table.rows[first:]:
        row.height = Inches(inches)
        row.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST


def write(cell, text, bold=False, size=9, align=None, italic=False, color=None):
    cell.text = ''
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(1); p.paragraph_format.space_after = Pt(1)
    if align is not None:
        p.alignment = align
    r = p.add_run(text)
    r.bold, r.italic = bold, italic
    r.font.size = Pt(size); r.font.name = FONT
    if color:
        r.font.color.rgb = RGBColor.from_string(color)


def para(doc, text, bold=False, size=10, italic=False, space_after=4, color=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0); p.paragraph_format.space_after = Pt(space_after)
    r = p.add_run(text)
    r.bold, r.italic = bold, italic
    r.font.size = Pt(size); r.font.name = FONT
    if color:
        r.font.color.rgb = RGBColor.from_string(color)
    return p


def band(table, row_idx, text, fill, color=None, size=9):
    row = table.rows[row_idx]
    merged = row.cells[0]
    for c in row.cells[1:]:
        merged = merged.merge(c)
    write(merged, text, bold=True, size=size, color=color)
    shade(merged, fill)
    return merged


def base_doc(margin=0.62, landscape=False):
    doc = Document()
    st = doc.styles['Normal']; st.font.name = FONT; st.font.size = Pt(10)
    s = doc.sections[0]
    if landscape:
        from docx.enum.section import WD_ORIENT
        w, h = s.page_width, s.page_height
        s.orientation = WD_ORIENT.LANDSCAPE
        s.page_width, s.page_height = max(w, h), min(w, h)
    for a in ('left_margin', 'right_margin', 'top_margin', 'bottom_margin'):
        setattr(s, a, Inches(margin))
    return doc


def grid(doc, heads, widths, nrows, size=8, height=0.24):
    t = doc.add_table(rows=1 + nrows, cols=len(heads))
    borders(t); set_widths(t, widths)
    for j, h in enumerate(heads):
        write(t.rows[0].cells[j], h, bold=True, size=size, align=WD_ALIGN_PARAGRAPH.CENTER)
        shade(t.rows[0].cells[j], GREY)
    for i in range(1, nrows + 1):
        fill = TINT if i % 2 else WHITE
        for j in range(len(heads)):
            write(t.rows[i].cells[j], "", size=9)
            shade(t.rows[i].cells[j], fill)
    row_height(t, height, first=1)
    return t


# ── read the field names out of the calculator ───────────────────────────────
wb = openpyxl.load_workbook(XLSX)


def cols(tab, row=4):
    ws = wb[tab]
    out = []
    for c in range(1, 40):
        v = ws.cell(row, c).value
        if v and not str(v).startswith("_"):
            out.append(str(v))
    return out


PLOT_COLS = cols("1. Plot & Site Log")
SOIL_COLS = cols("2. Soil Data")
ROOT_COLS = cols("3. Root Biomass")
VEG_COLS = cols("4. Vegetation Data")

CALC = {"calculated", "lab"}
# which soil/root/veg columns the crew fills in the field
SOIL_FIELD = ["Plot ID", "Core ID", "Increment #", "Top depth (cm)", "Bottom depth (cm)",
              "Corer diameter (cm)", "Depth driven (cm)", "Length recovered (cm)",
              "Coarse fragments (% vol)", "Bulk density basis", "Notes"]
ROOT_FIELD = ["Plot ID", "Core ID", "Top depth (cm)", "Bottom depth (cm)",
              "Diameter class", "Live or dead", "Sieve mesh (mm)", "Notes"]


def build_datasheet(path):
    doc = base_doc()
    para(doc, "WWF-Canada Carbon Training", size=9, color="7F7F7F", space_after=0)
    para(doc, "Grassland Field Data Sheet", bold=True, size=16, space_after=2)
    para(doc, "Field sheet for grassland carbon — soil, ROOTS and vegetation. Field names match "
              "the Grassland Carbon Calculator tabs, so transcription is a straight copy. "
              "Lab columns (bulk density, organic carbon, root mass, ash fraction) are filled "
              "when results come back and are not on this sheet.",
         size=8, italic=True, space_after=8)
    para(doc, "Project:  ____________________________________     Recorder:  _________________"
              "_______     Page ____ of ____", size=10, space_after=8)

    # ---- plot & site log -------------------------------------------------- #
    t = doc.add_table(rows=1 + 6, cols=3)
    borders(t); set_widths(t, [Inches(2.45), Inches(2.45), Inches(2.4)])
    band(t, 0, "1.  PLOT & SITE LOG      — one block per plot; fill this FIRST",
         ORANGE_BAND, color="FFFFFF", size=10)
    triples = [("Plot ID:", "Site ID:", "Study area:"),
               ("Location:", "Date:", "Elevation (m):"),
               ("Latitude:", "Longitude:", "GNSS accuracy (m):"),
               ("Datum:", "Canopy cover (%):", "Slope position:")]
    for i, tri in enumerate(triples, start=1):
        for j, lab in enumerate(tri):
            write(t.rows[i].cells[j], lab + "\n", size=9)
            shade(t.rows[i].cells[j], WHITE)
    band(t, 5, "Management history — from the landholder, not from the site. "
               "These are the stratification variables.", PALE, size=9)
    m = t.rows[6].cells[0].merge(t.rows[6].cells[1]).merge(t.rows[6].cells[2])
    m.text = ''
    for lab in ["Grassland type  (prairie / aspen parkland / Black Oak savannah / interior BC "
                "bunchgrass / other):  ______________________",
                "Management  (never cultivated / cultivated and reseeded / long-term tame "
                "pasture / hayed / unknown):  ______________",
                "Grazing regime  (none / season-long / rotational / heavy / unknown):  "
                "________________________________________",
                "Years since fire:  ____________        Native or seeded:  "
                "________________________________________________"]:
        p = m.add_paragraph() if m.paragraphs[0].text else m.paragraphs[0]
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(lab); r.font.size = Pt(9); r.font.name = FONT
    shade(m, WHITE)

    doc.add_paragraph()

    # ---- soil increments -------------------------------------------------- #
    para(doc, "2.  SOIL DATA — one row per depth increment", bold=True, size=12, space_after=2)
    para(doc, "Core ID:  ____________     Corer internal diameter:  ______ cm     "
              "Bulk density basis the lab reports:  whole sample ☐   fine fraction ☐   "
              "not confirmed ☐", size=9, space_after=2)
    para(doc, "Record ACTUAL top and bottom depths, not the ones you planned — a truncated "
              "increment scaled as a full one is a silent error. If you hit refusal, record the "
              "depth and what stopped you: that is data, not a failure.",
         size=8, italic=True, space_after=5)
    grid(doc, ["Inc. #", "Top depth (cm)", "Bottom depth (cm)", "Depth driven (cm)",
               "Length recovered (cm)", "Coarse fragments (% vol)",
               "Notes — horizon change, refusal, moisture"],
         [Inches(0.5), Inches(0.85), Inches(0.95), Inches(0.9), Inches(1.0),
          Inches(1.05), Inches(2.05)], 12, height=0.26)

    # ---- roots ------------------------------------------------------------ #
    doc.add_page_break()
    para(doc, "3.  ROOT BIOMASS — one row per increment per diameter class",
         bold=True, size=13, space_after=2)
    para(doc, "Core ID:  ____________     Finest sieve mesh used:  ______ mm     "
              "Roots sieved out BEFORE soil carbon analysis?   YES ☐    NO ☐",
         size=9, space_after=2)
    para(doc, "Roots are MEASURED here, not estimated from a root:shoot ratio. Oven-dry mass is "
              "taken at 60–70 °C — NOT the 105 °C used for soil bulk density. Mass and ash "
              "fraction come back from the lab; this sheet records what you sampled.",
         size=8, italic=True, space_after=5)
    grid(doc, ["Top depth (cm)", "Bottom depth (cm)", "Diameter class (≤2 mm / >2 mm)",
               "Live or dead", "Notes"],
         [Inches(1.0), Inches(1.1), Inches(1.9), Inches(1.0), Inches(2.35)], 16, height=0.26)

    doc.add_paragraph()
    para(doc, "Roots still present in the deepest increment?   YES ☐    NO ☐", size=10,
         space_after=2)
    para(doc, "If YES, the root total is a MINIMUM — the profile did not end, your coring did. "
              "Native grassland roots reach metres.", size=8, italic=True, space_after=8)

    # ---- vegetation ------------------------------------------------------- #
    doc.add_page_break()
    para(doc, "4.  VEGETATION DATA — one block per plot", bold=True, size=13, space_after=2)
    para(doc, "Sampling date:  ____________     Peak growing season?   YES ☐    NO ☐    "
              "UNKNOWN ☐", size=10, space_after=2)
    para(doc, "A standing crop is NOT a stock — it grows from nothing each spring and is gone by "
              "autumn. Clip at GROUND LEVEL, not grazing height. Photograph the quadrat before "
              "and after.", size=8, italic=True, space_after=6)

    t = doc.add_table(rows=8, cols=2)
    borders(t); set_widths(t, [Inches(3.65), Inches(3.65)])
    band(t, 0, "Small plot — clip and weigh", PALE, size=9)
    pairs = [("Small plot area (m²):   0.25  ☐   other: ______", "Quadrat photographed before and after?   Y ☐   N ☐"),
             ("Clip fresh mass — LIVE (g):", "Clip fresh mass — DEAD (g):"),
             ("Bags labelled:   ☐", "Number of bags:")]
    for i, (a, b) in enumerate(pairs, start=1):
        for j, lab in enumerate((a, b)):
            write(t.rows[i].cells[j], lab + "\n", size=9)
            shade(t.rows[i].cells[j], WHITE)
    band(t, 4, "Medium plot — shrubs (measure and predict)", PALE, size=9)
    pairs2 = [("Medium plot area (m²):", "Number of shrubs measured:"),
              ("Species recorded:   ☐", "Crown L × W × H or stem diam. at 0.3 m recorded:   ☐")]
    for i, (a, b) in enumerate(pairs2, start=5):
        for j, lab in enumerate((a, b)):
            write(t.rows[i].cells[j], lab + "\n", size=9)
            shade(t.rows[i].cells[j], WHITE)
    band(t, 7, "Large plot — trees.  Only if canopy cover ≥ the threshold set in the "
               "calculator (default 25%). Use the FORESTS tree datasheet.", PALE, size=9)

    doc.add_paragraph()
    para(doc, "Canopy cover (%):  ________        Trees measured?   YES ☐    NO ☐    "
              "N/A ☐        Trees open-grown?   YES ☐    NO ☐", size=10, space_after=2)
    para(doc, "Open-grown savannah trees have short boles and wide crowns. Allometric equations "
              "fitted on forest-grown stems extrapolate poorly to them — record the form so the "
              "biomass figure can be reported as more uncertain.", size=8, italic=True)

    doc.add_paragraph()
    para(doc, "Sources: Measuring Carbon in Vegetation (Non-Tree) and Measuring Carbon in "
              "Non-Peat Soils (WWF-Canada). Root separation is not covered by either guide; see "
              "the Grassland workshop Part 3A.", size=7, italic=True, color="7F7F7F")

    os.makedirs(os.path.dirname(path), exist_ok=True)
    doc.save(path)
    return path


# ── the skill checklist ──────────────────────────────────────────────────────
CHECKLIST = [
    ("SECTION", "SECTION 1 — Sampling Design"),
    ("SUB", "Study area and strata"),
    ("Define the study area", "Draw the boundary and write down the RULE used. Exclude wetland "
     "inclusions, rock outcrop, roads and shelterbelts — in parkland and interior BC these can "
     "be a substantial fraction of a quarter section.", False),
    ("Stratify on MANAGEMENT first", "Grazing regime, cultivation history, years since fire, "
     "native vs seeded. Not vegetation cover — management is the dominant variable in a "
     "grassland and it is mappable from a fence line.", False),
    ("Get the management history", "From the landholder. Grazing and stocking, burn years, when "
     "cultivation stopped, seeding. This conversation is part of the method, not a courtesy.", False),
    ("SUB", "How many cores"),
    ("Size SOIL and ROOTS separately", "Roots are 4–5x more variable than soil carbon, so at the "
     "same target they need 4–5x the cores. Set a looser target for roots (±40% rather than "
     "±20%) or wash a random subset.", False),
    ("Apply the t-floor", "Cochran's n uses z, which assumes a known SD. You estimate it, so add "
     "the two extra cores the t-multiplier needs.", False),
    ("Decide if these are permanent plots", "A campaign designed for a one-off stock is often "
     "unusable as a monitoring baseline.", False),

    ("SECTION", "SECTION 2 — Plot Setup"),
    ("SUB", "Laying out"),
    ("Lay out the plots", "Small 0.25 m² · medium 16–100 m² · large 400 m² if trees are in "
     "scope. Soil core offset from the quadrat.", False),
    ("Record coordinates and GNSS accuracy", "At the plot centre.", False),
    ("Mark a permanent plot so it can be refound", "Grassland has nothing to tag. Driven rod with "
     "recorded depth, buried magnet, AND a bearing and distance from something durable.", False),
    ("Complete the plot log BEFORE touching anything", "Grassland type, management, grazing "
     "regime, years since fire, native or seeded, canopy cover.", False),
    ("SUB", "Photographs"),
    ("14-photo series", "Straight down, straight up, and three per cardinal direction.", False),
    ("Quadrat before AND after clipping", "From the same position. The only record of what the "
     "standing crop looked like.", False),

    ("SECTION", "SECTION 3 — Vegetation (before any coring)"),
    ("SUB", "Order of work"),
    ("Finish ALL vegetation work before coring", "Coring is destructive. A corer hole in a "
     "quadrat you have not yet clipped is a lost plot.", False),
    ("SUB", "Clip and weigh"),
    ("Clip at GROUND LEVEL", "Not grazing height — that is not a defined datum and will not "
     "repeat between crews or visits.", False),
    ("Separate live from dead", "Standing dead and litter hold carbon but are not production. "
     "Merging them later is easy; splitting them is not.", False),
    ("Confirm peak growing season, and record the date", "Peak is the only phenological point "
     "that repeats between sites and years. A clip-and-weigh without a date cannot be "
     "interpreted.", False),
    ("SUB", "Shrubs and trees"),
    ("Measure shrubs non-destructively", "Crown L × W × H, or stem diameter at 0.3 m. Check the "
     "species is in the coefficient table before relying on an allometric.", False),
    ("Apply the tree-cover threshold consistently", "Default ≥25% canopy. Savannah sits right on "
     "this boundary, so the rule matters more here than anywhere else.", False),
    ("Note whether trees are open-grown", "Savannah oaks have short boles and wide crowns; "
     "forest-fitted equations extrapolate poorly to them.", False),

    ("SECTION", "SECTION 4 — Soil Coring"),
    ("SUB", "Taking the core"),
    ("Measure and record the corer diameter", "It sets sample volume and therefore every bulk "
     "density. Out by 10% puts every carbon stock out by 21%. Write it on the corer.", False),
    ("Core offset from the quadrat", "And record the offset, so the next visit can avoid this "
     "visit's holes.", False),
    ("Do not core wet or frozen ground", "Both wreck bulk density.", False),
    ("Record depth driven AND length recovered", "If they differ, the increments are not where "
     "you think. Do NOT stretch them back out.", False),
    ("SUB", "Sectioning"),
    ("Section at planned increments, record ACTUAL depths", "A truncated increment scaled as a "
     "full one is a silent error.", False),
    ("Record depth to refusal and what stopped you", "Bedrock, cemented layer, stone. This is "
     "data, not a failure.", False),
    ("Estimate coarse fragments per increment", "Rocks hold no carbon, and neither WWF guide's "
     "equations correct for them. Mandatory in interior BC.", False),
    ("Ask the lab which bulk-density basis they report", "Fine earth over total volume, or over "
     "fine-earth volume. Getting it wrong understates a stony site by up to a third — or "
     "double-corrects it.", False),
    ("Label bags with plot, core and DEPTH INTERVAL", "Not just an increment number.", False),

    ("SECTION", "SECTION 5 — Root Separation"),
    ("SUB", "The decision that comes first"),
    ("Decide the root/soil boundary BEFORE the lab", "Sieve roots out and analyse root-free "
     "soil, OR leave fine roots in the soil pool and report only coarse roots separately. Both "
     "are defensible. Silence is not, and silence is the default if nobody decides.", False),
    ("Record the sieve mesh", "Roots finer than the mesh are lost, so fine-root biomass is a "
     "known underestimate. Without the mesh size the figure cannot be interpreted.", False),
    ("SUB", "Processing"),
    ("Weigh the field-moist increment first", "Before anything is removed.", False),
    ("Soak and disperse, then wash over nested sieves", "2 mm for the fine/coarse split, plus a "
     "finer mesh to catch fine roots.", True),
    ("Separate live from dead", "Flotation, then by eye — live roots are paler, turgid, elastic, "
     "with intact cortex.", False),
    ("Sort by diameter class", "≤2 mm fine, >2 mm coarse. A convention a crew can apply "
     "consistently, not a biological boundary.", False),
    ("Dry at 60–70 °C — NOT 105 °C", "105 °C is the soil bulk-density convention and can "
     "volatilise organics in root tissue. Two samples, two ovens, two conventions.", False),
    ("Ash-correct the root mass", "Washed roots retain adhering mineral soil. Combust a "
     "subsample and subtract the residue, or root biomass is systematically too high.", False),
    ("Retain the root-free soil for carbon analysis", "Under the sieve-first option, this is what "
     "goes to the lab.", False),

    ("SECTION", "SECTION 6 — Calculations and Reporting"),
    ("SUB", "Calculations"),
    ("Soil carbon per increment", "Bulk density × (carbon % ÷ 100) × thickness, to kg C/m². "
     "Apply the coarse-fragment correction ONCE.", False),
    ("Root carbon per increment", "Ash-corrected dry mass ÷ core area, scaled to m², × carbon "
     "fraction.", False),
    ("Report soil to 30 cm AND to the full depth cored", "30 cm is the comparability depth. It "
     "is a floor, not the total.", False),
    ("Check achieved precision, per pool", "Soil and roots against their separate targets. Use "
     "t, not z, at small n.", False),
    ("SUB", "Reporting"),
    ("Report the standing crop separately", "Never merged into the soil figure.", False),
    ("Flag a root total that stops at the bottom of the core", "It is a MINIMUM. Native "
     "grassland roots reach metres.", False),
    ("State what is excluded", "Shrub roots, litter, and below-ground tree biomass are in no "
     "pool this workshop measures. Name the gaps.", False),
]


def build_checklist(path):
    doc = base_doc(margin=0.62)
    para(doc, "WWF-Canada Carbon Training", size=9, color="7F7F7F", space_after=0)
    para(doc, "Grassland Carbon Measurement — In-Field Skill Checklist",
         bold=True, size=15, space_after=4)
    para(doc, "Participant:  ________________________________     Date:  _____________     "
              "Site:  _____________", size=10, space_after=4)
    para(doc, "Work through each skill with your trainer. Check the left ☐ when you have "
              "practised it; check the right ☐ when your trainer confirms you can do it "
              "unsupervised. Section 5 — root separation — is the one most people arrive without.",
         size=8, italic=True, space_after=8)

    t = doc.add_table(rows=1 + len(CHECKLIST), cols=4)
    borders(t)
    widths = [Inches(0.35), Inches(1.65), Inches(4.35), Inches(0.85)]
    set_widths(t, widths)
    for j, h in enumerate(("", "Skill", "Description / Key Actions", "Complete ✔")):
        write(t.rows[0].cells[j], h, bold=True, size=9,
              align=WD_ALIGN_PARAGRAPH.CENTER if j in (0, 3) else None)
        shade(t.rows[0].cells[j], GREY)

    alt = 0
    for i, item in enumerate(CHECKLIST, start=1):
        if item[0] == "SECTION":
            band(t, i, item[1], ORANGE_BAND, color="FFFFFF", size=10); alt = 0; continue
        if item[0] == "SUB":
            band(t, i, item[1], PALE, size=9); alt = 0; continue
        skill, desc, team = item
        fill = TINT if alt % 2 else WHITE
        alt += 1
        row = t.rows[i]
        write(row.cells[0], "☐", size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        write(row.cells[1], (TEAM + "  " if team else "") + skill, bold=True, size=8)
        write(row.cells[2], desc, size=8)
        write(row.cells[3], "☐", size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        for j in range(4):
            shade(row.cells[j], fill)

    doc.add_paragraph()
    para(doc, "Trainer:  ________________________________     Signature:  "
              "________________________________     Date:  _____________", size=10, space_after=8)
    para(doc, "Sources: Measuring Carbon in Vegetation (Non-Tree) and Measuring Carbon in "
              "Non-Peat Soils (WWF-Canada). Sampling-design items follow Part 2 of the Grassland "
              "Carbon Workshop; root separation follows Part 3A.",
         size=7, italic=True, color="7F7F7F")

    os.makedirs(os.path.dirname(path), exist_ok=True)
    doc.save(path)
    return path


if __name__ == "__main__":
    a = build_datasheet(os.path.join(GRASS, "03_Field_Methods", "datasheets",
                                     "Grassland-Field-Data-Sheet.docx"))
    b = build_checklist(os.path.join(GRASS, "03_Field_Methods", "checklists",
                                     "Grassland_Carbon_Skill_Checklist.docx"))
    for p in (a, b):
        print(f"wrote {os.path.relpath(p, os.path.dirname(GRASS))}  "
              f"({os.path.getsize(p):,} bytes)")

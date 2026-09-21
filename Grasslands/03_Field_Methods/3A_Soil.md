[← 3 — Field Methods](README.md) · [Back to main guide](../README.md) · Next: [3B — Vegetation →](3B_Vegetation.md)

---

# 3A — Soil and Roots

*The main event. Core the soil, then get the roots out of it — which is the step no other
workshop in this series asks of you.*

**Sources:** [*Measuring Carbon in Non-Peat Soils*](../../_Shared/Non-peat-FINAL-Eng-2026.pdf)
for the coring protocol, which transfers unchanged. **Root separation is not covered by any WWF
guide** — see the reference note below.

**Fills:** `2. Soil Data` · `3. Root Biomass`

> ⚠ **Read [the overview](README.md) first** — the ordering rule, the plot log, the photo series
> and the safety notes all apply here.

> 📚 **[REFERENCES NEEDED]** — everything below about root separation is written at the level the
> method itself supports, and **is not yet cited to the root-ecology literature**. Candidates are
> listed in [`TODO.md`](../TODO.md). Treat the procedure as sound and the *citations* as
> outstanding.

---

## The five stages

| | Stage | Output |
|---|---|---|
| **1** | [**Decide your depth increments**](#stage-1--decide-your-depth-increments) | A sampling plan you can repeat |
| **2** | [**Take the core**](#stage-2--take-the-core) | An intact column with known volume |
| **3** | [**Section it**](#stage-3--section-by-depth-increment) | One bag per increment |
| **4** | [**Separate the roots**](#stage-4--separate-the-roots) | Roots and root-free soil, bagged apart |
| **5** | [**Record it properly**](#stage-5--what-goes-on-the-sheet) | Rows the calculator can use |

---

## Stage 1 — Decide your depth increments

This was settled in [Part 2](../02_Project_Planning/), but it is executed here and getting it
wrong is unrecoverable.

### The default

| Increment | Why |
|---|---|
| **0–10 cm** | Where management effects show first, and where root density is highest |
| **10–20 cm** | |
| **20–30 cm** | Completes the **30 cm minimum** — the IPCC default and what makes your number comparable |
| **30–60 cm** | ⭐ **Go here if you can.** The first increment most surveys skip and the first that separates native from cultivated |
| **60–100 cm**, deeper | Where native grassland keeps going |

**Finer increments near the surface, coarser with depth.** That matches how both carbon and root
density actually change, and it keeps the sample count manageable.

> [!IMPORTANT]
> **30 cm is a floor, not an answer.** Native grassland roots reach metres and build carbon the
> whole way, so a 30 cm figure is a **lower bound**. The deeper you go the more accurate your
> estimate — and the gap you are closing is largest on exactly the intact native sites most worth
> protecting. [Part 1](../01_Background/) makes the full argument.

### When the soil is shallower than your plan

Common in **interior BC** and on thin Shield soils. This is **data, not a failure**:

- **Record the depth to refusal**, and what stopped you — bedrock, a cemented layer, a stone.
- **Record the actual increment depths**, not the ones you intended. A "20–30 cm" increment that
  was really 20–24 cm before bedrock will otherwise be scaled as though it were 10 cm thick.
- The calculator uses the **recorded** top and bottom depths for thickness, so a truncated
  increment is handled correctly — *if* you write down what actually happened.

---

## Stage 2 — Take the core

The [Non-peat guide](../../_Shared/Non-peat-FINAL-Eng-2026.pdf) covers three methods, in order of
preference. All three transfer to grassland unchanged.

<table>
<tr>
<td width="33%">

**A · Soil core** *(preferred)*

A corer driven in, recovering an intact column.

✅ Clean depth control
✅ **Known volume** for bulk density
✅ Roots come up with the soil
❌ Hard in stony or very dry ground

</td>
<td width="33%">

**B · Soil pit**

A pit exposing the profile face, sampled by horizon with a ring.

✅ You can see the horizons
✅ Works where a corer won't go
❌ Slow and very destructive
❌ **Poor for roots** — hard to get a defined volume

</td>
<td width="33%">

**C · Shallow soils**

A frame of known area excavated to bedrock.

✅ The only option on very thin soils
❌ Small volumes, higher relative error

</td>
</tr>
</table>

> [!TIP]
> **For roots, method A is strongly preferred.** Root biomass has to be expressed per unit volume
> or per unit area, which means you need a **defined volume**. A corer gives you that for free. A
> pit does not, unless you take a separate ring sample for every increment you want roots from.

### Three grassland-specific cautions

**1 · Bulk density is compaction-sensitive, so measure it — don't look it up.**

Grassland surface soils are compacted by **trampling and machinery**, and the effect is real and
local. A heavily stocked paddock and an ungrazed exclosure a fence apart can differ measurably in
surface bulk density. Since carbon stock is `depth × bulk density × carbon %`, taking bulk density
from a table erases exactly the management signal you are trying to measure.

**Measure it on every core, for every increment.**

**2 · Do not core a wet or frozen soil.**

Both wreck bulk density — wet soil compresses under the corer, frozen soil will not take one
evenly. Note the moisture condition on the sheet.

**3 · Coarse fragments are not optional in the dry interior.**

Rocks hold no carbon. A soil that is 30% stone by volume holds roughly 30% less carbon per unit
volume, and **neither WWF guide's scaling equations correct for it.** Estimate the coarse-fragment
volume per cent for each increment in the field and record it.

> [!WARNING]
> **The one way to get this badly wrong is to correct for stones twice.**
>
> | Lab's bulk-density basis | Meaning | Correction |
> |---|---|---|
> | **Fine earth ÷ total volume** | Mass of the <2 mm fraction over the whole sample volume | Stones **already accounted for**. No further correction |
> | **Fine earth ÷ fine-earth volume** | Mass of the <2 mm fraction over only the volume it occupies | Multiply by `(1 − coarse fragment %)` |
>
> The calculator has a **`Bulk density basis`** column with exactly these two options and applies
> the right arithmetic for each. **Ask your lab which they report.** Getting it wrong understates
> a stony site by as much as a third.
>
> 🟠 **[FILL ME IN]** — your lab's basis, in the `Fill Me In` tab.

---

## Stage 3 — Section by depth increment

1. Extrude the core onto a **depth-marked tray**, keeping it oriented.
2. Cut at your planned increment boundaries with a clean blade.
3. **Measure and record the actual top and bottom depth** of each increment — not the intended
   ones.
4. Note anything visible: a horizon change, a stone, an old cultivation layer, an abrupt change in
   root density.
5. Bag each increment **separately and labelled** with plot, core, and **top–bottom depth**.

> [!IMPORTANT]
> **Label with the depth interval, not just an increment number.** `GP-04-C1 · 10–20 cm` survives
> a smudged marker and a flooded cooler. `#2` does not.

### Compaction during coring

A driven corer can compress the column. If the recovered length is shorter than the depth you
drove to, the increments are not where you think they are.

| | |
|---|---|
| **Record** | Depth driven, and **length recovered** |
| **If they differ by more than a few per cent** | Note it. The calculator flags a low recovery ratio |
| **Do not** | Silently stretch the increments back out. Say what you measured |

---

## Stage 4 — Separate the roots

**This is the stage that makes this workshop different.** Neither WWF guide covers it, because
neither guide measures below-ground biomass at all.

### Why we do this rather than use a ratio

Most carbon accounting multiplies above-ground biomass by a published **root:shoot ratio**. In a
grassland that means multiplying your *largest* biomass pool by a number measured somewhere else,
under management you cannot check — and grassland root:shoot is both large and highly variable.

> **When you core the soil, the roots are already in your hand.** Separating and weighing them is
> a measurement.

### ⚠ Decide the boundary before you start

This is the central decision of the whole workshop, and it has to be made **before** the first
sample goes to the lab.

<table>
<tr>
<td width="55%">

**The problem.** Soil carbon analysis conventionally removes *visible* roots — but fine roots
inevitably stay in the sample. So a standard soil carbon number **already includes** fine-root
carbon.

Add separately-measured root carbon on top and **you have counted it twice**.

</td>
<td width="45%">

```
   ▓▓▓  coarse roots  > 2 mm      │ ROOTS
   ▓▓▓  fine roots   ≤ 2 mm       │ — sieved out
   ────────────────────────────── ┤ ← the mesh
   ███  root-free soil            │ SOIL
   ███                            │ — analysed after
```

</td>
</tr>
</table>

**Two defensible answers. Pick one, write it down, apply it to every sample.**

| | **Option 1 — Sieve first** ⭐ | **Option 2 — Fine roots stay in the soil** |
|---|---|---|
| **What you do** | Wash all roots out, analyse **root-free soil** for carbon, report root carbon separately | Remove only coarse (>2 mm) roots; analyse soil with fine roots still in it |
| **Report** | Soil C and root C as separate, addable pools | Soil C (includes fine roots) + coarse root C |
| **Pro** | Clean separation; root carbon is fully measured | Much less lab work |
| **Con** | The labour | Fine-root carbon is inside the soil number and cannot be broken out |

> 🟠 **[FILL ME IN]** — the calculator's `ROOTS_REMOVED_BEFORE_SOIL_C` setting. **Default is
> Option 1.** A QC flag fires if root carbon is added to a soil stock not confirmed root-free.
>
> **Being silent about which you did is the only wrong answer** — and silence is the default
> outcome if nobody decides in advance.

### The procedure

| # | Step | Detail |
|---|---|---|
| **1** | **Weigh the field-moist increment** | Before anything is removed |
| **2** | **Soak and disperse** | Water; a dispersant helps in clay soils. Long enough to break aggregates, not so long that fine roots start to decay |
| **3** | **Wash over nested sieves** | **2 mm** for the fine/coarse split, plus a finer mesh — **0.5 mm** or **0.2 mm** — to catch fine roots. **Record the finest mesh you used** |
| **4** | **Separate live from dead** | Flotation, then by eye: live roots are paler, turgid, elastic, with intact cortex; dead are dark, brittle, and the cortex sloughs |
| **5** | **Sort by diameter class** | **≤ 2 mm fine · > 2 mm coarse.** Calipers, or a sieve you trust |
| **6** | **Dry to constant mass at 60–70 °C** | ⚠ **Not 105 °C** — see below |
| **7** | **Weigh** | |
| **8** | **Ash-correct** | Combust a subsample and subtract the mineral residue — see below |
| **9** | **Retain the root-free soil** | This is what goes for bulk density and carbon, under Option 1 |

### Four details that change the number

> [!WARNING]
> **1 · Drying temperature: 60–70 °C for roots, 105 °C for soil bulk density.**
>
> Two samples, two ovens, two conventions, and they are easy to confuse. 105 °C can volatilise
> organic compounds and overstate mass loss in root tissue; 60–70 °C is the biomass convention.
> **Write the temperature on the sheet.**
>
> 🟠 **[FILL ME IN]** — `ROOT_DRY_TEMP_C` in the calculator.

> [!WARNING]
> **2 · Ash correction is not optional.**
>
> Washed roots **retain adhering mineral soil**, and oven-dry mass therefore overstates root
> biomass — materially so in clay-rich soils. Combust a subsample and subtract the residue:
>
> ```
> corrected root mass = oven-dry mass × (1 − ash fraction)
> ```
>
> Skip it and your root biomass is systematically too high, in a way nobody downstream can detect.
>
> 🟠 **[FILL ME IN]** — `ASH_CORRECTED` in the calculator. A flag fires while it reads `No`.

> [!NOTE]
> **3 · The finest roots are lost, and that is a known bias.**
>
> Roots finer than your mesh pass through it. Measured fine-root biomass is therefore a
> **systematic underestimate**, and the finer the mesh the less you lose — at the cost of more
> washing time.
>
> **State the mesh in your reporting.** A fine-root number without a mesh size is uninterpretable.

> [!NOTE]
> **4 · Live versus dead is a judgement, so make it consistently.**
>
> Standing root biomass includes necromass. For a **carbon stock** dead roots still hold carbon —
> but they are arguably already soil organic matter, which loops straight back to the
> double-counting decision above.
>
> **Record live and dead separately** and let the analysis decide. The calculator has columns for
> both.

### How many cores you actually wash

From [Part 2, A10](../02_Project_Planning/README.md#a10--why-roots-need-more-cores-than-soil):
roots are far more variable than soil carbon, so at the same precision target they need **four to
five times the cores**. Most projects should either **set a looser precision target for roots**
(±40% rather than ±20%) or **wash a random subset** of the cores taken.

**If you are subsampling, choose the subset at random before you look at the cores** — not by
which ones seemed interesting.

---

## Stage 5 — What goes on the sheet

### `2. Soil Data` — one row per depth increment

| Field | Notes |
|---|---|
| `Plot ID`, `Core ID` | Must match the plot log |
| `Top depth (cm)`, `Bottom depth (cm)` | **Actual**, not intended |
| `Corer diameter (cm)` | Sets the volume. Record every time |
| `Depth driven`, `Length recovered` | For the recovery ratio |
| `Coarse fragments (% vol)` | Field estimate |
| `Bulk density basis` | Which one your lab reports |
| `Bulk density (g/cm³)`, `Organic carbon (%)` | Lab |
| `Notes` | Refusal depth and cause, horizon changes, moisture condition |

### `3. Root Biomass` — one row per increment per diameter class

| Field | Notes |
|---|---|
| `Plot ID`, `Core ID`, `Top depth`, `Bottom depth` | Join to the soil row |
| `Diameter class` | `≤2 mm` or `>2 mm` |
| `Live or dead` | Recorded separately |
| `Oven-dry mass (g)` | At 60–70 °C |
| `Ash fraction` | For the correction |
| `Sieve mesh (mm)` | The finest used |
| `Notes` | |

> [!IMPORTANT]
> **Flag a root total whose deepest increment is simply the bottom of the core.** If roots were
> still present in your last increment, the profile did not end — your coring did. That total is
> a **minimum**, and the calculator marks it as one.

---

## Common failure modes

| Symptom | Cause | Do this |
|---|---|---|
| **Recovered length well short of depth driven** | Compaction, or a stone deflected the corer | Record both. Do not stretch the increments |
| **Corer will not penetrate** | Dry, stony, or compacted surface | Pre-wet, or switch to a pit. Record the method change |
| **Refusal well above the planned depth** | Bedrock or a cemented layer | **This is data.** Record depth and cause |
| **Root mass implausibly high** | Ash correction skipped, or soil still adhering | Re-wash a subsample and ash-correct |
| **Almost no fine roots recovered** | Mesh too coarse, or washing too aggressive | Record the mesh. Consider a finer one next time |
| **Soil carbon higher than expected on a root-free sample** | Fine roots not fully removed | Note it; the two pools are not cleanly separated |
| **Bulk density varies wildly between adjacent plots** | Real — trampling. Or a volume error | Check the corer diameter first, then believe it |

---

## ✅ Before you leave the plot

| | |
|---|---|
| ☐ | Plot log complete — **grassland type, management, grazing, fire, native/seeded** |
| ☐ | **14 photos**, plus quadrat before and after |
| ☐ | All **vegetation work finished** before coring started |
| ☐ | Core **offset from the quadrat**, and the offset recorded |
| ☐ | **Corer diameter** on the sheet |
| ☐ | **Actual** top and bottom depths for every increment |
| ☐ | **Depth driven and length recovered** |
| ☐ | **Coarse fragments** estimated per increment |
| ☐ | Refusal depth and cause, if you hit it |
| ☐ | Increments bagged and labelled with **plot · core · depth interval** |
| ☐ | Root/soil boundary decision **written on the sheet**, and the **mesh** you will use |
| ☐ | Everything in the cooler |

---

[← 3 — Field Methods](README.md) · [Back to main guide](../README.md) · Next: [3B — Vegetation →](3B_Vegetation.md)

<p align="center">
  <img src="01_Background/images/banner_grassland.svg" alt="Grassland Carbon Workshop banner" width="100%">
</p>

---

# Grassland Carbon Workshop

*Measuring carbon in Canadian grasslands — where almost all of it is underground, and most of the
living biomass is root.*

---

## Contents

| # | Section | What it covers |
|---|---------|----------------|
| 1 | [**Background**](01_Background/) | Where grassland carbon actually sits; the four grassland types; why roots, not shoots, are the biomass story. |
| 2 | [**Project Planning**](02_Project_Planning/) | How many cores and where: stratifying on **grazing, management and fire**, and sizing separately for soil and for roots. |
| 3 | [**Field Methods**](03_Field_Methods/) | [Soil coring with root separation](03_Field_Methods/3A_Soil.md), and [clip-and-weigh plus shrubs](03_Field_Methods/3B_Vegetation.md). |
| 4 | [**Data Interpretation**](04_Data_Interpretation/) | Lab results, root processing, the carbon calculator, scaling and reporting. |
| 5 | [**Monitoring Supplement**](05_Monitoring/) *(optional)* | Detecting **change**, not just measuring a stock — for restoration, fire management and soil-health baselines. |

### Useful links

- **WWF-Canada Carbon Measurement library** — [wwf.ca/carbon-measurement](https://wwf.ca/carbon-measurement/)
- **Measuring Carbon in Vegetation (Non-Tree)** — [PDF](../_Shared/Vegetation-FINAL-Eng-2026.pdf)
- **Measuring Carbon in Non-Peat Soils** — [PDF](../_Shared/Non-peat-FINAL-Eng-2026.pdf)
- **Carbon Measurement: Sampling Design** — [PDF](../_Shared/Sampling-Design-Eng-2026.pdf)
- **Laboratory Analysis guide** — [PDF](../_Shared/Lab-Guide-Eng-2026.pdf)
- **Trees** — the [Forests workshop](../Forests/), for savannah and parkland with tree cover

---

## Objectives

1. **Learn where grassland carbon is** — and why the part you can see is the smallest part.
2. **Learn field methods for measuring it** — soil coring, separating roots from soil, and
   clip-and-weigh at peak season.
3. **Turn measurements into outputs** — carbon stocks with honest intervals, and a baseline you
   can re-measure against.

---

## How to think about this workshop

Same spine as the rest of the series: **start from the data sheet and work backwards.**

[**Section 1 — Background**](01_Background/) is *why this matters*.
[**Section 2 — Project Planning**](02_Project_Planning/) is *making the data useful*.
[**Section 3 — Field Methods**](03_Field_Methods/) is *collecting the data*.
[**Section 4 — Data Interpretation**](04_Data_Interpretation/) turns the completed sheet into
carbon estimates.
[**Section 5 — Monitoring**](05_Monitoring/) is optional, and is about measuring the same place
twice.

---

## Four grasslands, one method

Canada's grasslands are not one thing, and partners working in this series span at least three of
these. They differ in water, fire and management — which changes what you measure alongside the
soil, and which corrections matter.

<table>
<tr>
<td width="56%">

| | Character | What changes in the method |
|---|---|---|
| 🌾 **Prairie**<br>mixed-grass, fescue | Deep dark soils; **grazing is the dominant management variable**; native vs tame/seeded pasture | The baseline case. Stratify on grazing first |
| 🌳 **Aspen parkland** | Grassland matrix with aspen groves | Shrub/medium plot carries more weight; the boundary with [Forests](../Forests/) matters |
| 🌰 **Black Oak savannah** | Scattered open-grown oaks over grass and forbs; **fire-maintained**; often sandy, lower-carbon soils | **Trees are present.** Fire history becomes a stratification variable |
| 🏜 **Interior BC**<br>bunchgrass, sagebrush steppe | Semi-arid; shallow soils, often to bedrock; **coarse fragments common** | The **coarse-fragment correction** stops being optional. Shallow-soil method needed |

</td>
<td width="44%">

> 📸 **[FIGURE NEEDED]** — the four types side by side, so a crew can place their own site before
> reading further.

**The method is the same in all four.** You stratify, core the soil, separate roots from the
sample, clip the standing vegetation at peak season, and send it all for carbon analysis. What
changes is what *else* you measure, and which corrections you cannot skip.

</td>
</tr>
</table>

> [!NOTE]
> **Where there are trees, use the tree protocol.** Savannah and parkland carry real above-ground
> tree carbon. Measure it with [Forests Part 3A](../Forests/03_Field_Methods/3A_Trees.md) — DBH,
> species, height — and the same allometric equations.
>
> 🟠 **[DECISION NEEDED]** — at what canopy cover does that kick in? The Wetlands workshop uses
> **≥ 25%** for treed swamps, and using the same number here would keep the series consistent.
> **Savannah sits right on that boundary by definition**, so this matters more here than anywhere
> else. Set it in the calculator's `Fill Me In` tab.

---

## Why this workshop is mostly about what you cannot see

<table>
<tr>
<td width="55%">

Walk into a grassland and essentially none of the carbon is visible.

- **The soil holds the overwhelming majority.** As in a forest, but more so — there is no trunk
  to compete with it.
- **Of the living biomass, most is root.** Grassland root biomass commonly exceeds shoot biomass
  **several times over**. The relationship is the reverse of a forest, where roots are a fraction
  of the above-ground mass.
- **The standing crop you can see turns over every year.** It is not a stock in the way soil
  carbon is a stock.

So a grassland survey that leads with clip-and-weigh has the emphasis backwards. **Lead with the
soil, measure the roots properly, and treat the shoots as the small, seasonal component they
are.**

</td>
<td width="45%">

> 📸 **[FIGURE NEEDED]** — the three pools on one axis: shoot, root, soil. The visual point is
> that the bar you can see from standing height is the smallest one.

> 📊 **[REFERENCE NEEDED]** — a citable source for the root:shoot relationship in Canadian
> grassland, to replace "several times over" with a number and a range. See
> [`TODO.md`](TODO.md).

</td>
</tr>
</table>

### We measure roots. We don't model them.

Most carbon accounting estimates below-ground biomass by multiplying above-ground biomass by a
published **root:shoot ratio**. This workshop does not.

> **When you core the soil, you already have the roots.** Separating and weighing them is a
> *measurement*. A ratio is someone else's measurement, from somewhere else, applied to your site.

That decision runs through the whole workshop: root separation is built into
[the coring protocol](03_Field_Methods/3A_Soil.md), root processing has its own lab chain in
[Part 4](04_Data_Interpretation/), and the calculator has a **`Root Biomass`** tab holding
measured mass — not a multiplier.

> [!WARNING]
> **It also creates a trap, and the workshop is explicit about it.** Soil carbon analysis
> conventionally removes visible roots — but fine roots stay in the sample. Add measured root
> carbon to a soil stock that already contains fine-root carbon and **you have counted it twice**.
>
> The rule: **sieve the roots out first, analyse root-free soil, report root carbon separately —
> and say what mesh you used.** [Part 3A](03_Field_Methods/3A_Soil.md) covers it.

---

## 30 cm is a floor, not an answer

<table>
<tr>
<td width="55%">

The workshop reports **30 cm as a minimum depth**, because that is what IPCC defaults and most
grassland literature use, and comparability matters.

**It is not the scientific endpoint.** Native grassland roots reach **metres** down, and so does
the carbon they build. A 30 cm figure is a **lower bound on what is actually there** — and the
gap is largest in intact native grassland, where those deep root systems are undisturbed.

**The deeper you sample, the more accurate your estimate becomes.** Report deeper increments
alongside the 30 cm figure wherever you can reach them. It is the same core and the same trip.

</td>
<td width="45%">

> [!IMPORTANT]
> **This applies doubly to roots.** If roots go metres down and your core stops at 30 cm, your
> measured root biomass is a floor in exactly the same way — and a more severe one, because root
> mass declines with depth more slowly than most people assume.
>
> The calculator flags any root total whose deepest increment is simply the bottom of the core.
> It is a **minimum**, not a total.

*The [Wetlands workshop](../Wetlands/01_Background/) makes the same argument about peat. The
series says one consistent thing about depth: shallow sampling is a budget decision, not a
scientific one — so report it as such.*

</td>
</tr>
</table>

---

## The data sheet we're building toward

Everything in Parts 3 and 4 feeds one workbook:

| Tab | Holds |
|---|---|
| `1. Plot & Site Log` | One row per plot — grassland type, management, grazing, fire history |
| `2. Soil Data` | One row per depth increment — bulk density, coarse fragments, carbon |
| `3. Root Biomass` | **Measured** root mass by diameter class and depth |
| `4. Vegetation Data` | Shrubs (medium plot) and clip-and-weigh (small plot) |
| `5. Plot Summary` · `6. Site Summary` | Calculated — stocks, intervals, whether you hit your target |
| `Fill Me In` | 🟠 **Every value the workshop cannot supply**, in one list |

> 🟠 **The `Fill Me In` tab is how this workshop asks you for things.** Orange cells are values
> only you can provide — a regional prior, your lab's bulk-density basis, the sieve mesh you used.
> Every one has a working default so the workbook computes from the moment you open it, and a
> flag that stays lit until you replace it.

---

# TLDR

```
        soil carbon  =  depth × bulk density × carbon %        ← the overwhelming majority
        root carbon  =  measured root mass × carbon %          ← MEASURED, not a ratio
       shoot carbon  =  clipped dry mass × carbon %            ← small, and seasonal
```

**Stratify on management. Core deep. Sieve the roots out and weigh them. Clip at peak season.
Report 30 cm and deeper. Say what you left out.**

---

## Some resources to find in this workshop

- [`Grassland_Carbon_Calculator.xlsx`](04_Data_Interpretation/calculators/) — the calculator.
- [Field datasheet and skill checklist](03_Field_Methods/) — printable, for the field.
- [**Measuring Carbon in Vegetation (Non-Tree)**](../_Shared/Vegetation-FINAL-Eng-2026.pdf) and
  [**Non-Peat Soils**](../_Shared/Non-peat-FINAL-Eng-2026.pdf) — the protocols this follows.
- [Worked example](Worked_Example/) — one dataset from field sheet to reportable stock.
- [Monitoring supplement](05_Monitoring/) — measuring the same place twice.
- [`TODO.md`](TODO.md) — what this workshop still needs from you.

---

*Part of the [Terrestrial Carbon Workshops](../) series — Forests · Grasslands · Wetlands.*

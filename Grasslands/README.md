<p align="center">
  <img src="01_Background/images/banner_grassland.svg" alt="Grassland Carbon Workshop banner" width="100%">
</p>

---

# Grassland Carbon Workshop

*Measuring carbon in grassland-type ecosystems, covering above-ground plant biomass, below-ground
plant biomass, and soil carbon.*

---

## Contents

| # | Section | What it covers |
|---|---------|----------------|
| 1 | [**Background**](01_Background/) | The carbon pools of grasslands; some grassland types found in Canada; measuring roots, shoots and soils. |
| 2 | [**Project Planning**](02_Project_Planning/) | How many cores, and where: setting a precision threshold, dividing the area into meaningfully distinct parts, and permanent vs single-use plots. |
| 3 | [**Field Methods**](03_Field_Methods/) | Plot setup, clip-and-weigh, shrubs, soil coring and root separation — [all in one page](03_Field_Methods/). |
| 4 | [**Data Interpretation**](04_Data_Interpretation/) | Lab results, root processing, the carbon calculator, scaling and reporting. |
| 5 | [**Monitoring Supplement**](05_Monitoring/) *(optional)* | Detecting **change**, not just measuring a stock, for restoration, management and soil-health baselines. |

### Useful links

- **WWF-Canada Carbon Measurement library** — [wwf.ca/carbon-measurement](https://wwf.ca/carbon-measurement/)
- **Measuring Carbon in Vegetation (Non-Tree)** — [PDF](../_Shared/Vegetation-FINAL-Eng-2026.pdf)
- **Measuring Carbon in Non-Peat Soils** — [PDF](../_Shared/Non-peat-FINAL-Eng-2026.pdf)
- **Carbon Measurement: Sampling Design** — [PDF](../_Shared/Sampling-Design-Eng-2026.pdf)
- **Laboratory Analysis guide** — [PDF](../_Shared/Lab-Guide-Eng-2026.pdf)
- **Trees** — the [Forests workshop](../Forests/), for savannah and other areas with tree cover

---

## Objectives

1. **Learn about grassland carbon**, above and below ground.
2. **Learn field methods for measuring it** — soil coring, separating roots from soil, and
   clip-and-weigh at peak season.
3. **Turn measurements into outputs** — carbon stocks, and baselines you can re-measure against.

---

## How to think about this workshop

This workshop is both for learning about, and implementing, a carbon measurement project. To
implement a project it is sometimes useful to begin at the end product you are looking for and
work backwards from there — so here we **start from the data sheet we will fill in and work
backwards.**

[**Section 1 — Background**](01_Background/) is *why this matters*.
[**Section 2 — Project Planning**](02_Project_Planning/) is *making the data useful*.
[**Section 3 — Field Methods**](03_Field_Methods/) is *collecting the data*.
[**Section 4 — Data Interpretation**](04_Data_Interpretation/) turns the completed sheet into
carbon estimates.
[**Section 5 — Monitoring**](05_Monitoring/) is optional, and is about measuring the same place
over time.

---

## Some of Canada's grasslands

Canada's grasslands are diverse — differing in plants, climate, soil, hydrology, management and
more, which changes what you measure alongside the soil.

<table>
<tr>
<td width="56%">

These are **some** of the types you will encounter; the list is not exhaustive.

| | Where it is |
|---|---|
| 🌾 **Tallgrass prairie** | Red River valley in Manitoba, and remnants in southern Ontario |
| 🌾 **Mixed-grass prairie** | Southern Alberta, Saskatchewan and Manitoba |
| 🏜 **Dry mixedgrass / shortgrass** | Palliser's Triangle — southeastern Alberta, southwestern Saskatchewan |
| 🌾 **Fescue prairie** | Alberta foothills and the northern fescue belt |
| 🌳 **Aspen parkland** | The transition belt between prairie and boreal forest |
| 🏜 **Bunchgrass and sagebrush steppe** | Interior BC — Okanagan, Thompson, Chilcotin |
| 🌰 **Black Oak savannah** | Southern Ontario, fire-maintained, often sandy |
| 🌊 **Garry Oak meadows** | Vancouver Island and the Gulf Islands |
| 🪨 **Alvar** | Thin soils over limestone pavement — Ontario, Manitoulin, Quebec |

> 🟠 **[CHECK THIS LIST]** against
> [Canada's Grasslands — Explore](https://canadasgrasslands.ca/explore-grasslands) and the
> [Canadian Forage & Grassland Association grassland inventory](https://www.canadianfga.ca/en/conservation/grassland-inventory/),
> and add or rename to match the terms your partners use.

</td>
<td width="44%">

> 🗺 **[MAP NEEDED]** — a map of Canadian (or North American) grasslands, to place a site before
> reading further. Candidate sources: the two links opposite, the *Prairie Ecozone* map from the
> [National Ecological Framework for Canada](https://sis.agr.gc.ca/cansis/nsdb/ecostrat/), or the
> Grassland Ecosystem Inventory layers. **Check the licence before embedding.**

</td>
</tr>
</table>

> [!NOTE]
> **Where there are trees, use the tree protocol.** Any tree over **2 m** tall is measured with
> the [Forests large plot and calculator](../Forests/03_Field_Methods/3A_Trees.md) — species, DBH
> and height, through the same allometric equations — and the result is carried across into this
> workshop's `4. Vegetation Data` tab.
>
> That threshold is also the clean handoff: the **medium plot** here covers shrubs and woody
> stems **0.5–2 m**, so nothing is missed between the two and nothing is counted twice.

---

## Why this workshop is mostly about what you cannot see

<table>
<tr>
<td width="55%">

<img width="1000" alt="Soil carbon formation and the below-ground share of grassland carbon" src="https://github.com/user-attachments/assets/ef253a75-2323-4505-b272-72ed680fcdc8" />

</td>
<td width="45%">

Walk into a grassland and essentially none of the carbon is visible.

**The soil holds the majority of the carbon**, and it builds slowly, over long periods.

See [*Monitoring soil carbon formation during afforestation*](https://cid-inc.com/blog/monitoring-soil-carbon-formation-during-afforestation/)
for an introduction to how that carbon gets there.

</td>
</tr>
<tr>
<td width="55%">

<img width="800" alt="Root systems of native grassland plants" src="https://github.com/user-attachments/assets/2f56be3a-eabc-420d-8632-2666be078ecf" />

</td>
<td width="45%">

**Of the living biomass, most is in the roots.** Grassland root biomass commonly exceeds shoot
biomass several times over — the reverse of a forest, where roots are a fraction of above-ground
mass.

> 📊 **[REFERENCE NEEDED]** — a citable figure and range for the root:shoot relationship in
> Canadian grassland, to replace "several times over" with a number. See [`TODO.md`](TODO.md).

</td>
</tr>
<tr>
<td width="55%">

<img width="960" alt="Above-ground grassland vegetation through a growing season" src="https://github.com/user-attachments/assets/88da08ec-3e1d-44b8-a0d0-918ce14fca57" />

</td>
<td width="45%">

**Plants grow quickly, and decompose quickly as well.** The standing crop you can see turns over
on a seasonal cycle.

So a grassland carbon project should decide **which pools it cares about**, because that governs
how different stewardship techniques will show up in the numbers.

</td>
</tr>
</table>

---

## Two ways to get plant biomass — and one of them is built from the other

<table>
<tr>
<td width="55%">

**1 · Direct measurement.** Clip the quadrat, wash the roots out of the core, weigh what you
have. This is what [Part 3](03_Field_Methods/) covers, and it is what the calculator's
`3. Root Biomass` and `4. Vegetation Data` tabs hold — measured mass, not a multiplier.

**2 · Allometric relationships.** A measurement you can take easily stands in for one you cannot:
shrub crown volume for shrub biomass, tree diameter for tree biomass, shoot mass for root mass.

**These are not alternatives.** An allometric relationship is *built from* direct measurement —
someone measured both quantities, on enough plants, to establish the relationship in the first
place. Root:shoot relationships in particular are often developed on a **regional or study-area
basis**, where the ratio is compared across sites and against plant relative abundance, then
modelled out.

</td>
<td width="45%">

**Why it is worth collecting data towards this**

Every campaign that measures both quantities contributes to a local relationship. Once you have
one, **later surveys can collect less field data for the same answer**, because the relationship
carries part of the work — and it is the step that makes drone and aerial survey for carbon
possible at all.

> [!IMPORTANT]
> **This applies to plant biomass only.** There is no equivalent shortcut for **soil carbon**:
> bulk density and carbon concentration have to be measured. Soil is also the largest pool, so
> the pool you can least afford to estimate indirectly is the one you cannot.

> 📸 **[FIGURE NEEDED]** — measured vs modelled, side by side: a washed root sample on one side,
> a fitted root:shoot relationship on the other.

</td>
</tr>
</table>

---

## Sample the full soil profile

<table>
<tr>
<td width="55%">

**The method is to sample the whole profile** — from the surface down to the parent material, or
to refusal. Not a fixed 30 cm window.

**Why:** a fixed depth does not hold a fixed amount of soil. As bulk density changes, a 30 cm
window holds a different *mass* of soil from one survey to the next, so you are not comparing
like with like — you are comparing two different quantities of material.

That failure has a direction, and it is the wrong one. A disturbance that **compacts** the top
30 cm raises bulk density there, which **raises the apparent carbon stock in that window** — at
the same time as the disturbance is releasing carbon from the profile as a whole. Sample only
the top 30 cm and the number can go **up** while the site is **losing** carbon.

Sampling the full profile is also what lets you see landscape-scale change at all: the signal you
are looking for is frequently below 30 cm.

</td>
<td width="45%">

**So what are 30 cm and 1 m for?**

They are **reporting conventions**, not the measurement. IPCC defaults and most of the published
grassland literature report to 30 cm or 1 m, so those depths are how you compare your site with
someone else's, or with itself across spatial scales. Report them **alongside** the full profile,
not instead of it.

> [!IMPORTANT]
> **Roots the same way.** Native grassland roots reach metres down. A root total from a core that
> stopped at 30 cm is a minimum, not a total, and the calculator flags any root total whose
> deepest increment is simply the bottom of the core.

> 🟠 **[TO ADD — Cathal]** — the full-profile / variable-soil-depth modelling approach.
>
> The established correction for the bulk-density problem above is **equivalent soil mass (ESM)**:
> compare a fixed *mass* of soil rather than a fixed *depth*, which removes the compaction
> artefact by construction. See Ellert & Bettany (1995), Wendt & Hauser (2013) and von Haden et
> al. (2020). The workbook does not do this yet.

</td>
</tr>
</table>

---

## The data sheet we're building toward

Everything in Parts 3 and 4 feeds one workbook:
**[`Grassland_Carbon_Calculator.xlsx`](04_Data_Interpretation/calculators/Grassland_Carbon_Calculator.xlsx)**

<table>
<tr>
<td width="52%">

> 📸 **[SCREENSHOT NEEDED]** — the calculator open, showing the tab strip and a few filled rows,
> so a reader can see typed cells against calculated ones before they open it.

</td>
<td width="48%">

| Tab | Holds |
|---|---|
| `1. Plot & Site Log` | One row per plot — grassland type, management, grazing, fire history |
| `2. Soil Data` | One row per depth increment — bulk density, coarse fragments, carbon |
| `3. Root Biomass` | **Measured** root mass by diameter class and depth |
| `4. Vegetation Data` | Shrubs (medium plot) and clip-and-weigh (small plot) |
| `5. Plot Summary` · `6. Site Summary` | Calculated — stocks, intervals, whether you hit your target |
| `Fill Me In` | 🟠 **Every value the workshop cannot supply**, in one list |

</td>
</tr>
</table>

> 🟠 **The `Fill Me In` tab is how this workshop asks you for things.** Orange cells are values
> only you can provide — a regional prior, your lab's bulk-density basis, the sieve mesh you used.
> Every one has a working default so the workbook computes from the moment you open it, and a
> flag that stays lit until you replace it.

---

## Some resources to find in this workshop

- [`Grassland_Carbon_Calculator.xlsx`](04_Data_Interpretation/calculators/) — the calculator.
- [Field datasheet and skill checklist](03_Field_Methods/) — printable, for the field.
- [**Measuring Carbon in Vegetation (Non-Tree)**](../_Shared/Vegetation-FINAL-Eng-2026.pdf) and
  [**Non-Peat Soils**](../_Shared/Non-peat-FINAL-Eng-2026.pdf) — the protocols this follows.
- [Worked example](Worked_Example/) — one dataset from field sheet to reportable stock.
- [Monitoring supplement](05_Monitoring/) — measuring the same place over time.
- [`TODO.md`](TODO.md) — what this workshop still needs from you.

---

*Part of the [Terrestrial Carbon Workshops](../) series — Forests · Grasslands · Wetlands.*

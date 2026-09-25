<p align="center">
  <img src="01_Background/images/banner_grassland.svg" alt="Grassland Carbon Workshop banner" width="100%">
</p>

---

# Grassland Carbon Workshop

*In this workshop, we will cover how to measure carbon in grassland ecosystems, including above-ground plant biomass, below-ground plant biomass, and soil carbon. The workshop is organized into 4 parts, with an optional part 5 for teams looking to measure carbon into the future*

---

## Contents of this workshop

| # | Section | What it covers |
|---|---------|----------------|
| 1 | [**Background**](01_Background/) | The carbon pools of grasslands; common grassland types found in Canada; measuring roots, shoots and soils. |
| 2 | [**Project Planning**](02_Project_Planning/) | How many cores, and where: setting project goals, dividing the area into meaningfully distinct zones, and applying permanent vs single-use plots |
| 3 | [**Field Methods**](03_Field_Methods/) | Plot setup, clip-and-weigh methods, shrub allometry, soil coring and root separation  |
| 4 | [**Data Interpretation**](04_Data_Interpretation/) | Lab results, root processing, the carbon calculator, scaling and reporting |
| 5 | [**Monitoring Supplement**](05_Monitoring/) *(optional)* | Detecting change over time, for restoration, stewardship and soil-health baselines |

---

## TLDR: Workshop Objectives and Overview

1. **Learn about grassland carbon**, above and below ground.
2. **Learn field methods for measuring different carbon types**, including soil coring, separating roots from soil, and clip-and-weigh methods for above-ground carbon
3. **Turn measurements into outputs**, carbon stocks, and baselines you can compare against


## How to think about this workshop

For some projects, it can be useful to begin at the end and work backwards from there. In
this spirit, we will **start from the data sheet**:
**[`Grassland_Carbon_Calculator.xlsx`](04_Data_Interpretation/calculators/Grassland_Carbon_Calculator.xlsx)**

Every heading on it is something that will be documented or measured in the field, or you will get back from the lab. Once the
sheet is full, those numbers can be turned into a carbon stock.

(Note for Codex - Separate these to be stacked on top of each other and to be larger . In a table below, we will add what each header describes and link to the where it is discussed further and will be filled in)

<table>
<tr>
<td width="50%">

<img width="100%" alt="Data sheet — Soil Data tab" src="https://github.com/user-attachments/assets/beb531e4-aed0-430c-97e9-bc657db6c39d" />

**Soil Data** — one row per depth increment.

</td>
<td width="50%">

<img width="100%" alt="Data sheet — Vegetation Data tab" src="https://github.com/user-attachments/assets/dc1908fc-4c81-4aa5-aad9-300bda336db8" />

**Vegetation Data** — one row per plot.

</td>
</tr>
</table>

---


## Background on Canada's grasslands, and what has been lost

<table>
<tr>
<td width="55%">

(For codex here is a link to a map image of just the prarie provinces, note there are other grasslands and losses are prevelant in these areas aswell)
(And make this a 2 by 2 table so we can add in this restoration potential map as well)

<img width="4200" height="2550" alt="grasslands" src="https://github.com/user-attachments/assets/b07c519e-d56c-423d-bbfa-e8d419c5f33a" />

https://institute.smartprosperity.ca/Grasslands-Drought-Resilience-Prairies

[Living Planet Data Hub _ WWF-Canada.pdf](https://github.com/user-attachments/files/32654290/Living.Planet.Data.Hub._.WWF-Canada.pdf)

 And this is from https://wwf.ca/restoration-analysis/


(For codex - move these sources to a spot below for "Further reading")

> [Canada's Grasslands](https://canadasgrasslands.ca/explore-grasslands), the
> [CFGA grassland inventory](https://www.canadianfga.ca/en/conservation/grassland-inventory/), the
> Prairie Ecozone map from the
> [National Ecological Framework for Canada](https://sis.agr.gc.ca/cansis/nsdb/ecostrat/), or the
> Grassland Ecosystem Inventory layers. **Check the licence before embedding.**

</td>
<td width="45%">

Temperate grassland is among the **least protected and most converted** biomes on Earth, and
Canada's share of it has gone the same way. Most of the native prairie that was here before
settlement is now cropland or pasture. However, these areas have also been identified as having some of the hiester potential for restoration to recover both biodiversity and carbon

What went with it is not only carbon:

- **Grassland birds** have fallen further than any other group of North American birds — roughly a
  **50–60% decline since 1970**, the steepest of any habitat guild.
- **Prairie species** dependent on intact sod — swift fox, burrowing owl, greater sage-grouse,
  black-footed ferret — are among Canada's most at-risk.
- **Services that come with deep-rooted perennial cover**: water infiltration and storage, erosion
  control, drought resilience, forage, and the carbon this workshop measures.

That is the context a carbon number sits in. It is rarely the only reason a community is measuring.

</td>
</tr>
</table>

<details>
<summary><b>

(Note for codex Im removing this entire section with the drop down

</details>

---


## TLDR: Background - What is Grassland Carbon?

<table>
<tr>
<td width="55%">

<img width="100%" alt="Above-ground grassland vegetation through a growing season" src="https://github.com/user-attachments/assets/88da08ec-3e1d-44b8-a0d0-918ce14fca57" />

</td>
<td width="45%">

Organic carbon cycles through grasslands starting with photosynthesis, then the deposition of
plant remains, and the decomposition of those materials. Whatever is left over gets **sequestered
into the soils**.

**The soil holds the majority of the carbon**, and it builds slowly, over long periods.

For more, see [*Monitoring soil carbon formation during afforestation*](https://cid-inc.com/blog/monitoring-soil-carbon-formation-during-afforestation/).

</td>
</tr>
<tr>
<td width="55%">

<img width="100%" alt="Root systems of native grassland plants" src="https://github.com/user-attachments/assets/2f56be3a-eabc-420d-8632-2666be078ecf" />

</td>
<td width="45%">

**Of the living biomass, most is in the roots.** Grassland root biomass commonly exceeds shoot
biomass several times over, especially in native grasses. Those roots also carry much of the
ecosystem's function — soil health, water infiltration and landscape stability
([Ecosphere, 2019](https://esajournals.onlinelibrary.wiley.com/doi/10.1002/ecs2.2582)).

</td>
</tr>
<tr>
<td width="55%">

<img width="100%" alt="Soil carbon formation and the below-ground share of grassland carbon" src="https://github.com/user-attachments/assets/ef253a75-2323-4505-b272-72ed680fcdc8" />

</td>
<td width="45%">

**Plants grow quickly, and decompose quickly as well.** The standing crop you can see turns over on
a seasonal cycle.

So a grassland carbon project should decide **which pools it cares about**, because that governs
how different stewardship techniques will show up in the numbers. Here we see a range of native
grasses and the vast underground networks we do not always see on the surface.

</td>
</tr>
</table>

---

## Part 3 - Measuring carbon stocks in grasslands<img width="467" height="169" alt="Screenshot 2026-09-25 at 09 31 59" src="https://github.com/user-attachments/assets/fc467588-7d87-4b0d-ab0c-5a3c12c3e6e6" />


There are two ways to get plant biomass, and one of them is built from the other.

<table>
<tr>
<td width="50%">

**Method 1 · Direct measurement**

Clip the quadrat, wash the roots out of the core, weigh what you have. This is what
[Part 3](03_Field_Methods/) covers, and it is what the calculator's `3. Root Biomass` and
`4. Vegetation Data` tabs hold — measured mass, not a multiplier.

</td>
<td width="50%">



> 📸 **[IMAGE NEEDED]** —  here it is - <img width="451" height="153" alt="image" src="https://github.com/user-attachments/assets/fd32e15b-5702-48d2-96c3-3f0667fd6f34" />




</td>
</tr>
<tr>
<td width="50%">

**Method 2 · Allometric relationships**

A measurement you can take easily stands in for one you cannot: shrub crown volume for shrub
biomass, tree diameter for tree biomass, shoot mass for root mass.

An allometric relationship is *built from* direct measurement — someone measured both quantities,
on enough plants, to establish the relationship in the first place. Root:shoot relationships in
particular are often developed on a **regional or study-area basis**, where the ratio is compared
across sites and against plant relative abundance, then modelled out.

</td>
<td width="50%">

> 📸 **[DIAGRAM NEEDED]** — <img width="310" height="235" alt="image" src="https://github.com/user-attachments/assets/47ed5e04-5c43-422e-8e39-6921b976d70c" />


</td>
</tr>
</table>

**Why it is worth collecting data towards this.** Every field outing that measures both quantities
contributes to a local relationship. Once you have one, **later surveys can collect less field data
for the same answer**, because the relationship can be used instead of clipping.

---

## Part 2: Soil organic carbon

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

> 📸 **[IMAGE NEEDED]** — image here of both pits and soil cores -<img width="2500" height="2368" alt="image" src="https://github.com/user-attachments/assets/9b846c54-d1d3-41ea-954b-02edddc26509" />


</td>
</tr>
</table>

---


## Back to the data sheet

Everything in Parts 3 and 4 feeds one workbook:
**[`Grassland_Carbon_Calculator.xlsx`](04_Data_Interpretation/calculators/Grassland_Carbon_Calculator.xlsx)**

(Insert the screenshots of the data sheets here and seperate the tabkle into two tables that corresponds to the vegetation and teh soils data sheet respectively

Screenshots of two of its tabs are at the
[top of this page](#how-to-think-about-this-workshop).

| Tab | Holds |
|---|---|
| `1. Plot & Site Log` | One row per plot — grassland type, management, grazing, fire history |
| `2. Soil Data` | One row per depth increment — bulk density, coarse fragments, carbon |
| `3. Root Biomass` | **Measured** root mass by diameter class and depth |
| `4. Vegetation Data` | Shrubs (medium plot) and clip-and-weigh (small plot) |
| `5. Plot Summary` · `6. Site Summary` | Calculated — stocks, intervals, whether you hit your target |

---

### Useful links

- **WWF-Canada Carbon Measurement library** — [wwf.ca/carbon-measurement](https://wwf.ca/carbon-measurement/)
- **Measuring Carbon in Vegetation (Non-Tree)** — [PDF](../_Shared/Vegetation-FINAL-Eng-2026.pdf)
- **Measuring Carbon in Non-Peat Soils** — [PDF](../_Shared/Non-peat-FINAL-Eng-2026.pdf)
- **Carbon Measurement: Sampling Design** — [PDF](../_Shared/Sampling-Design-Eng-2026.pdf)
- **Laboratory Analysis guide** — [PDF](../_Shared/Lab-Guide-Eng-2026.pdf)
- **Trees** — the [Forests workshop](../Forests/), for savannah and other areas with tree cover

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

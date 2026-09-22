<p align="center">
  <img src="01_Background/images/banner_grassland.svg" alt="Grassland Carbon Workshop banner" width="100%">
</p>

(For claude - Change the banner sub header to "Roots - Shoots - Soils - Carbon Stocks and Monitoring")
---

# Grassland Carbon Workshop

*Measuring carbon in grasslands type ecosystems, covering above-ground plant biomass, below-ground plant biomass, and soil carbon*

---

## Contents

| # | Section | What it covers |
|---|---------|----------------|
| 1 | [**Background**](01_Background/) | The carbon pools of grasslands; the four grassland types; measuring roots and shoots and soils. |
| 2 | [**Project Planning**](02_Project_Planning/) | How many cores and where: stratifying on **management and restoration types**, and permanent vs single-use plots |
| 3 | [**Field Methods**](03_Field_Methods/) | [Soil coring](03_Field_Methods/3A_Soil.md), and [clip-and-weigh methods](03_Field_Methods/3B_Vegetation.md). |
| 4 | [**Data Interpretation**](04_Data_Interpretation/) | Lab results, root processing, the carbon calculator, scaling and reporting. |
| 5 | [**Monitoring Supplement**](05_Monitoring/) *(optional)* | Detecting **change**, not just measuring a stock for restoration, management and soil-health baselines. |

### Useful links

- **WWF-Canada Carbon Measurement library** — [wwf.ca/carbon-measurement](https://wwf.ca/carbon-measurement/)
- **Measuring Carbon in Vegetation (Non-Tree)** — [PDF](../_Shared/Vegetation-FINAL-Eng-2026.pdf)
- **Measuring Carbon in Non-Peat Soils** — [PDF](../_Shared/Non-peat-FINAL-Eng-2026.pdf)
- **Carbon Measurement: Sampling Design** — [PDF](../_Shared/Sampling-Design-Eng-2026.pdf)
- **Laboratory Analysis guide** — [PDF](../_Shared/Lab-Guide-Eng-2026.pdf)
- **Trees** — the [Forests workshop](../Forests/), for savannah and other areas with tree cover

---

## Objectives

1. **Learn about grassland carbon** above and below-ground
2. **Learn field methods for measuring it** for soil coring, separating roots from soil, and
   clip-and-weigh at peak season.
3. **Turn measurements into outputs** measure carbon stocks for baselines you
   can re-measure against.

---

## How to think about this workshop

This workshop is both for learning about, and implementing a carbon measurement project. To implement a project, its sometimes useful to begin at the end product you are looking for, and work backwards from there, therefore, here we **start from the data sheet we will fill-in and work backwards.**

[**Section 1 — Background**](01_Background/) is *why this matters*.
[**Section 2 — Project Planning**](02_Project_Planning/) is *making the data useful*.
[**Section 3 — Field Methods**](03_Field_Methods/) is *collecting the data*.
[**Section 4 — Data Interpretation**](04_Data_Interpretation/) turns the completed sheet into
carbon estimates.
[**Section 5 — Monitoring**](05_Monitoring/) is optional, and is about measuring the same place over time

---

## Four grasslands, one method

Canada's grasslands are diverse, differing types of plants, climates, soils, hydrology, management types, and more, which changes what you measure alongside the
soil

<table>
<tr>
<td width="56%">

(NOTE to claude - remove the last column, just have a table with "some" types of grasslands in Canada, There are a couple more across canada, I liked the list here from Canada Grasslands - https://canadasgrasslands.ca/explore-grasslands and the Grasslands inventory - https://www.canadianfga.ca/en/conservation/grassland-inventory/) - Find a map for Canada or North aMerica we can add in here too.
| | Character | What changes in the method |
|---|---|---|
| 🌾 **Prairie**<br>mixed-grass, fescue | Deep dark soils; **grazing is the dominant management variable**; native vs tame/seeded pasture | The baseline case. Stratify on grazing first |
| 🌳 **Aspen parkland** | Grassland matrix with aspen groves | Shrub/medium plot carries more weight; the boundary with [Forests](../Forests/) matters |
| 🌰 **Black Oak savannah** | Scattered open-grown oaks over grass and forbs; **fire-maintained**; often sandy, lower-carbon soils | **Trees are present.** Fire history becomes a stratification variable |
| 🏜 **Interior BC**<br>bunchgrass, sagebrush steppe | Semi-arid; shallow soils, often to bedrock; **coarse fragments common** | The **coarse-fragment correction** stops being optional. Shallow-soil method needed |

</td>
<td width="44%">


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

(NOTE for Claude - Remove this - We can measure the Carbon in Any tree over 2 meters in height with the forest plot and Carbon calculator spreadsheet)

---

## Why this workshop is mostly about what you cannot see

(Note to claude here are some images you can add in to this table - and here is a good intor article to reference https://cid-inc.com/blog/monitoring-soil-carbon-formation-during-afforestation/)

<img width="1000" height="632" alt="image" src="https://github.com/user-attachments/assets/ef253a75-2323-4505-b272-72ed680fcdc8" />

and


<img width="800" height="694" alt="image" src="https://github.com/user-attachments/assets/2f56be3a-eabc-420d-8632-2666be078ecf" />

and

<img width="960" height="350" alt="image" src="https://github.com/user-attachments/assets/88da08ec-3e1d-44b8-a0d0-918ce14fca57" />




<table>
<tr>
<td width="55%">

Walk into a grassland and essentially none of the carbon is visible.

- **The soil holds the majority of the carbon.** Soil grows slowly over long periods

- **Of the living biomass, most is found in the plant root.** Grassland root biomass commonly exceeds shoot biomass
  **several times over**.
- **Plants grow quickly, but decompose quickly as well**

So a grassland carbon project should consider which pools they are most interested in, which will result in how different stewardship techniques might impact the different pools.

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

### 

Here we will show two methods for measuring plant biomass. The first is direct measurement, the second is using allometric relationships to model the plant biomass. This means we take 1 measurement of the plant that we know is correlated to another, such as the mass of the roots compared to the shoots. So once you know 1 you can estiamte the other.

> **When you core the soil, you already have the roots.** Separating and weighing them is a
> *measurement*. A ratio is someone else's measurement, from somewhere else, applied to your site.

You can learn more about directly measuring root biomass via soil separation in:
[the coring protocol](03_Field_Methods/3A_Soil.md), root processing has its own lab guide in
[Part 4](04_Data_Interpretation/), and the calculator has a **`Root Biomass`** tab holding
measured mass.


(Note to claude remove this here and add it to the post-field work part)
> [!WARNING]
> **It also creates a trap, and the workshop is explicit about it.** Soil carbon analysis
> conventionally removes visible roots — but fine roots stay in the sample. Add measured root
> carbon to a soil stock that already contains fine-root carbon and **you have counted it twice**.
>
> The rule: **sieve the roots out first, analyse root-free soil, report root carbon separately —
> and say what mesh you used.** [Part 3A](03_Field_Methods/3A_Soil.md) covers it.

---

(For claude we can remove this below - it is not relevant)
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

(For claud add in a link to the spreadsheet and a placeholder that I can paste a screenshot of it into)
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

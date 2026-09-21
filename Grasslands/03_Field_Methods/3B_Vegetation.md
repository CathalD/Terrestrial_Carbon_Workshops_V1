[← 3A — Soil and Roots](3A_Soil.md) · [← 3 — Field Methods](README.md) · [Back to main guide](../README.md) · Next: [4 — Data Interpretation →](../04_Data_Interpretation/)

---

# 3B — Vegetation

*Clip-and-weigh, shrubs, and trees where there are any — the small, seasonal, visible pool.*

**Source:** [*Measuring Carbon in Vegetation (Non-Tree)*](../../_Shared/Vegetation-FINAL-Eng-2026.pdf)
(WWF-Canada, 2024), whose method this follows directly.

**Fills:** `4. Vegetation Data`

---

## Keep the proportions in mind

This page covers the **smallest** of the three pools. In a grassland the soil holds the
overwhelming majority of the carbon, and of the *living* biomass most is root
([3A](3A_Soil.md)).

That is not a reason to skip it — above-ground biomass responds to management faster than
anything else you measure, which makes it the most *informative* pool per hour spent even though
it is the smallest. It is a reason **not to let it set the schedule** for the rest of the
campaign.

---

## Three plot sizes, three methods

| Plot | Size | Holds | Method |
|---|---|---|---|
| **Large** | 400 m² | Trees | → [Forests Part 3A](../../Forests/03_Field_Methods/3A_Trees.md) |
| **Medium** | **16–100 m²** | Plants **0.5–2 m** — shrubs, tall grasses | **Measure and predict** (allometric) |
| **Small** | **0.25 m²** | Ground vegetation **below 0.5 m** | **Clip and weigh** (destructive) |

*Plot sizes and height classes from the [Vegetation guide](../../_Shared/Vegetation-FINAL-Eng-2026.pdf)
glossary. The small plot is a 0.25 m² quadrat, or a circle of radius 0.28 m.*

---

## Small plot — clip and weigh

The core method for grassland, and the one most of your vegetation carbon comes from.

| # | Step |
|---|---|
| **1** | Lay the **0.25 m² quadrat** on the plot, **offset from where the core will go** |
| **2** | **Photograph the whole quadrat from directly above**, before touching it |
| **3** | Clip **all** vegetation below 0.5 m **at ground level** inside the quadrat |
| **4** | Separate by species — or at minimum **live vs dead (standing litter)** |
| **5** | Bag each fraction separately, pre-labelled |
| **6** | **Photograph the quadrat again**, clipped |
| **7** | Straight into the cooler |
| **8** | Oven-dry to constant mass and weigh |

> [!IMPORTANT]
> **Clip at ground level, and mean it.** "Grazing height" is not a defined datum and will not be
> repeatable between crews or between visits. Ground level is.

### Live and dead are different things

Standing dead material and litter hold carbon, but they are not *production* and they behave
differently under management. **Separate them at the quadrat**, bag them apart, and report them
apart. Merging them is easy afterwards; splitting them is not.

---

## Peak growing season is a rule, not a preference

This is the point where a grassland survey most easily produces a misleading number.

<table>
<tr>
<td width="55">

Herbaceous above-ground biomass is a **standing crop**. It grows from nothing each spring, peaks,
then senesces or is grazed. Measure the same quadrat in May and in August and you get numbers
that differ several-fold — with **nothing having changed about the site**.

The [Vegetation guide](../../_Shared/Vegetation-FINAL-Eng-2026.pdf) says to sample at peak
growing season. The reason is that **peak is the only phenological point that is repeatable** —
between sites, between years, between crews.

</td>
<td width="45%">

> [!WARNING]
> **The rules that follow from it:**
>
> - **Sample at peak.** For most Canadian grassland that is mid-to-late summer, but it varies by
>   region, by year, and with drought.
> - **Record the date. Always.** A clip-and-weigh without a date is uninterpretable.
> - **Never compare** a spring harvest with a late-summer one, or a drought year with a wet one,
>   without saying so.
> - **Report shoot biomass separately** from soil carbon — never buried inside a total.

</td>
</tr>
</table>

> 🟠 **[FILL ME IN]** — `PEAK_SEASON_SAMPLED` in the calculator. A flag fires while it reads `No`,
> because a standing crop measured off-peak is not comparable to anything.

### A standing crop is not a stock

**Soil carbon** accumulated over centuries and will still be there next year. **This year's
shoots** will not.

Putting the two in the same column and adding them implies a comparability that does not exist.
The calculator keeps them in separate columns and reports them separately for exactly this reason.

**Grazed sites make this sharper still.** On a grazed paddock, clip-and-weigh measures what the
cattle *have not eaten yet* — which is a function of stocking rate as much as of production. If
your question is about production rather than standing crop, you need exclosure cages, and that
is a different study design.

---

## Medium plot — measure and predict

For plants **0.5–2 m**: shrubs, and tall grasses where present. **Non-destructive** — you measure
dimensions and predict biomass, rather than cutting.

| | |
|---|---|
| **Measure** | Species, and either **stem diameter at 0.3 m** (for short-statured tree forms) or **crown L × W × H** (for shrubs) |
| **Equation** | `Biomass (g) = b × x^a`, then ÷ 1000 for kg |
| **Coefficients** | Flade et al. (2020), carried on the Forests calculator's `R2. Understory Coefficients` tab |
| **Enter into** | `4. Vegetation Data` |

Species covered by the coefficient table include **willow**, **shrubby cinquefoil**, **soap
berry**, **alder**, **bog birch** and a generic **"all shrubs"** fallback — several of which are
prairie and parkland species.

> [!WARNING]
> **These are ABOVE-ground equations only** — the `R2` tab says so on its face. Shrub roots are
> **not** included, and they are not captured by [3A](3A_Soil.md)'s coring either, because a
> shrub's coarse roots will not come up in a soil core.
>
> **This is a real and declared gap.** If shrubs are a significant part of your site — encroaching
> savannah, parkland — say in your reporting that below-ground shrub biomass is excluded.

> [!NOTE]
> **Check your species before relying on an allometric.** If it is not in the coefficient table,
> either use the generic "all shrubs" equation and say so, or **clip and weigh** the shrub
> instead. A species-specific equation applied to the wrong species is worse than a generic one
> applied honestly.

---

## Trees, where there are any

**Black Oak savannah and aspen parkland carry real tree carbon.** The protocol is identical to
the forest one — a black oak is measured the same way wherever it grows.

**👉 [Forests Part 3A — Trees](../../Forests/03_Field_Methods/3A_Trees.md)**

| | |
|---|---|
| **Plot** | **400 m²** large plot |
| **Measure** | Species, **DBH at 1.3 m**, height |
| **Equations** | Lambert et al. (2005), Ung et al. (2008) |
| **Enter into** | The [Forests calculator](../../Forests/04_Data_Interpretation/calculators/), then carry the per-m² result across |

> 🟠 **[DECISION NEEDED]** — **at what canopy cover does this apply?** Proposed **≥ 25%**, matching
> the Wetlands treed-swamp rule. **Savannah sits right on that boundary by definition.** Set it in
> the `Fill Me In` tab, apply it consistently, and state it in your reporting.

### Two things that differ from a closed forest

1. **Open-grown trees are not forest-grown trees.** A savannah oak has a short bole and a huge
   spreading crown; a forest oak is tall and narrow. Allometric equations fitted on forest stems
   may not extrapolate well to open-grown form. **Record that the trees were open-grown**, and
   treat the biomass figure as more uncertain than the same equation applied in a closed stand.
2. **Encroachment is a finding.** Young trees and shrubs invading a fire-suppressed grassland are
   *gaining* above-ground carbon while the grassland is being lost. Report both — a carbon number
   presented alone will be read as endorsement.

---

## Where the numbers go

```
Trees (savannah, parkland)
      │
      ▼
Forests calculator ──► per-m² tree carbon
      │
      ▼
Grassland calculator ──► 4. Vegetation Data, "Tree carbon (kg C/m²)"

Shrubs (medium plot) ─┐
Clip-and-weigh (small)─┴──► 4. Vegetation Data, directly
```

**Match `Plot ID` exactly across both workbooks.** That string is the join, and a mismatch
silently drops the tree carbon.

> [!NOTE]
> **Mind the plot areas.** Trees come from a **400 m²** plot, shrubs from **16–100 m²**,
> clip-and-weigh from **0.25 m²**. Each is divided by **its own** plot area to give kg C/m², which
> is what makes them addable. Check the units on the cell you copy.

---

## ✅ Before you leave the plot

| | |
|---|---|
| ☐ | Quadrat photographed **before and after** clipping |
| ☐ | Clipped **at ground level**, everything below 0.5 m |
| ☐ | **Live and dead separated** and bagged apart |
| ☐ | **Date recorded**, and whether this is peak season |
| ☐ | Shrubs measured, species checked against the coefficient table |
| ☐ | Trees measured if cover exceeds your threshold, and **open-grown form noted** |
| ☐ | All of this done **before** any coring |
| ☐ | Bags labelled and in the cooler |

---

[← 3A — Soil and Roots](3A_Soil.md) · [← 3 — Field Methods](README.md) · [Back to main guide](../README.md) · Next: [4 — Data Interpretation →](../04_Data_Interpretation/)

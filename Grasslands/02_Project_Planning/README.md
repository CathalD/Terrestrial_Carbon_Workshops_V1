<p align="center">
  <img src="images/banner_planning.svg" alt="Project Planning — Grassland Carbon Workshop banner" width="100%">
</p>

---

[← 1 — Background](../01_Background/) · [Back to main guide](../README.md) · Next: [3 — Field Methods →](../03_Field_Methods/)

---

# Part 2 — Project Planning

## From a carbon question to a sampling design

**Quick links:** [Sampling Design Guide](../../_Shared/Sampling-Design-Eng-2026.pdf) · [Vegetation (Non-Tree)](../../_Shared/Vegetation-FINAL-Eng-2026.pdf) · [Non-Peat Soils](../../_Shared/Non-peat-FINAL-Eng-2026.pdf) · [Sampling design tools](Sampling%20Design%20Tools/) · [Appendix A](#appendix-a--a-brief-lesson-in-sampling-logic)

---

**Before establishing any plots**, four questions:

1. **What do I want to know?** A baseline stock? A comparison between grazing regimes? Whether a
   restoration is working?
2. **Where does that question apply?** The whole property, one pasture, the burned unit?
3. **How much data do I need?** And can we actually process it?
4. **Where should the cores go?**

This section covers the five steps of a sampling design.

| # | Step | Answers |
|---|------|---------|
| 1 | **[Define the study area](#step-1--define-your-study-area)** | *Where am I working?* |
| 2 | **[Stratify](#step-2--stratify-your-site)** | *How does management divide this place up?* |
| 3 | **[Choose the pools](#step-3--choose-which-pools-to-measure)** | *Soil, roots, shoots, shrubs, trees — which?* |
| 4 | **[Decide how many cores](#step-4--decide-how-many-cores)** | *How many, and why do roots need more?* |
| 5 | **[Decide where they go](#step-5--decide-where-the-cores-go)** | *Exactly where, and how is each plot laid out?* |

### Three differences from the other two workshops

If you have worked through [Forests](../../Forests/02_Project_Planning/) or
[Wetlands](../../Wetlands/02_Project_Planning/), most of this will be familiar. Three things
genuinely change.

1. **Stratification is about management, not vegetation.** In a forest you stratify on stand type;
   in a peatland on wetland type and landscape position. In a grassland the dominant variable is
   **what people have done to it** — grazing, fire, cultivation, seeding.
2. **Roots and soil need different sample sizes**, and the gap is large.
   [Step 4](#step-4--decide-how-many-cores) is mostly about that.
3. **The cheap-prior trick from Wetlands does not transfer.** There, peat depth predicted carbon
   variability well enough to size a campaign from a probe survey. Grassland soil depth is far
   less variable, so it carries much less information about carbon. Your prior has to come from a
   pilot or from published values.

> [!WARNING]
> **The sampling tool in this folder is a placeholder.** No grassland-specific Earth Engine tool
> exists yet. The [Forests tool](Sampling%20Design%20Tools/) is copied in because its statistics
> core is ecosystem-free, but **its priors are forest values and its plot size is 400 m²**, and it
> has **no concept of sizing two pools separately**. Read
> [`Sampling Design Tools/README.md`](Sampling%20Design%20Tools/) before opening it.
>
> You do not need the tool. Everything it computes is set out longhand in
> [Appendix A](#appendix-a--a-brief-lesson-in-sampling-logic).

---

## Step 1 — Define your study area

Draw the boundary your estimate will apply to, and get its **area in m²**. Every scaling step in
[Part 4](../04_Data_Interpretation/) multiplies by this number.

Three grassland-specific cautions:

- **Management boundaries are usually the real boundaries.** A fence line is often a sharper
  ecological edge than anything in the soil. If your study area crosses one, it is at least two
  strata — see [Step 2](#step-2--stratify-your-site).
- **Exclude what is not grassland.** Wetland inclusions, rock outcrop, roads, dugouts, shelterbelts.
  Averaging them in silently is a real error, and in interior BC and parkland these inclusions can
  be a substantial fraction of a quarter section.
- **Say whether you mean native or seeded.** "Grassland" covers intact native prairie and a
  five-year-old tame pasture, and they differ in exactly the thing this workshop measures — rooting
  depth. Write down which you mean and how you told them apart.

> [!TIP]
> **✅ Before moving on:** a boundary you can defend, the **rule** you used to draw it, its area in
> m², and internal exclusions removed from that area.

---

## Step 2 — Stratify your site

*How does management divide this place up?*

**Stratification** divides the study area into internally similar sub-areas — **strata** — and
samples each separately. In a grassland it is the single highest-return decision on this page,
because the variable that drives carbon is usually **mappable from a fence line and a
conversation with the landholder**.

### Stratify on management first

| Stratify by | Typical strata | Why it works |
|---|---|---|
| **Grazing regime** | Ungrazed · season-long · rotational · heavily stocked | The dominant management variable. Changes root allocation, surface cover and compaction |
| **Land-use history** | Never cultivated · cultivated and reseeded · long-term tame pasture | **The largest single carbon difference you will find.** Cultivation resets the deep root system |
| **Fire history** | Years since burn; burned vs unburned units | Essential in savannah and parkland. A recently burned unit is a different population |
| **Seeded vs native** | Native sward · tame/introduced species | Rooting depth differs, so the depth distribution of carbon differs |
| **Soil type / texture** | From soil survey polygons | Sets the carbon-holding capacity and the coarse-fragment problem |
| **Slope position** | Upper · mid · lower slope · depression | Water and eroded material both accumulate downslope |

> [!NOTE]
> **Stratify on something you can map, because you need its area to weight it.** "The part that
> looks better" is not a stratum. "North of the cross-fence, rotationally grazed since 2015" is —
> and its area comes off the same map you drew in Step 1.

### The conversation is part of the method

Management history is rarely in a dataset. It is in the head of the person who runs the place.

**Budget time for that conversation and write down what you learn** — grazing regime and stocking,
burn years, cultivation history and when it stopped, seeding, and anything unusual (a drought
year, a wildfire, a pipeline right-of-way). A stock measurement with no management context cannot
distinguish a site that is gaining carbon from one that is losing it.

> 🟠 **[FILL ME IN]** — the calculator's `1. Plot & Site Log` has `Management`, `Grazing regime`,
> `Years since fire` and `Native or seeded` columns for exactly this. They drive nothing
> automatically; they are there so that when your interval comes out wide, you can post-stratify.

### Savannah and parkland: fire is a stratum, not context

In a fire-maintained system, **time since burn is a first-class stratification variable.** A unit
burned last year and one unburned for fifteen differ in standing biomass, in litter, in shrub
encroachment, and possibly in surface soil carbon. Pooling them produces a mean that describes
neither.

If your restoration or fire-management programme is the *reason* for the survey, this is not
optional — it is the design.

> [!TIP]
> **✅ Before moving on:** strata **drawn and named**, the **area of each in m²**, and the
> management history behind each one written down.

---

## Step 3 — Choose which pools to measure

| Pool | Share of the total | Cost | Recommendation |
|---|---|---|---|
| **Soil** | The overwhelming majority | Coring + lab | ✅ **Always.** This is the project |
| **Roots** | Small share of carbon, **most of the living biomass** | Coring is shared with soil; **washing is the cost** | ✅ **Yes** — see the budget discussion in [Step 4](#step-4--decide-how-many-cores) |
| **Shoots** (clip-and-weigh) | Smallest | Cheap in the field, cheap in the lab | ✅ Usually. But it is a **standing crop**, not a stock |
| **Shrubs** (medium plot) | Small, larger in parkland and encroaching sites | Non-destructive allometrics | ⬜ Where present |
| **Trees** | Real in savannah and parkland | One plot visit | ✅ **If canopy cover warrants** — see below |
| **Litter** | Modest | Separate protocol | ❌ Not covered — a genuine gap, shared with the other two workshops |

### Is there enough tree cover to matter?

Where canopy cover is high enough, use
[Forests Part 3A](../../Forests/03_Field_Methods/3A_Trees.md) — DBH, species, height, and the
same allometric equations.

> 🟠 **[DECISION NEEDED]** — **at what cover?** The Wetlands workshop uses **≥ 25%** for treed
> swamps, and reusing that number would keep the series consistent. **Black Oak savannah sits right
> on that boundary by definition**, so this matters more here than anywhere else in the series.
> Set it in the calculator's `Fill Me In` tab, apply it consistently, and state it in your
> reporting.

### Decide your reporting depth now, not later

| Basis | What it is | Notes |
|---|---|---|
| **30 cm** *(the minimum)* | Surface to 30 cm | The IPCC default and what most grassland literature uses. **This is what makes your number comparable** |
| **Deeper increments** | 30–60, 60–100 cm, deeper | **Report alongside.** Same core, same trip, more lab samples |
| **To refusal** | Wherever the corer stops | Necessary in shallow interior BC soils. Record the depth as data, not as a failure |

**Report 30 cm as a floor and go deeper where you can** — the argument is in
[Part 1](../01_Background/). The calculator computes both from the same increments.

> [!TIP]
> **✅ Before moving on:** a pool list with a reason for each inclusion *and* exclusion; a yes/no
> on trees and the cover threshold you used; and a reporting depth written down.

---

## Step 4 — Decide how many cores

*How many, and why do roots need more?*

You provide four things and the calculation returns a number of cores:

| You provide | Meaning |
|---|---|
| **Area** (m²) | Per stratum, from Step 2 |
| **Margin of error** ($E$) | How precise the estimate must be |
| **Confidence level** | How reliable that interval has to be |
| **A variability prior** | How patchy the thing you are measuring is |

### Where the prior comes from

Grassland has no equivalent of the peat-depth trick. Soil depth does not predict carbon
variability well enough to size a campaign from a probe survey, so the prior has to be measured or
borrowed.

| | Source | Use when |
|---|---|---|
| **1** | **A pilot survey** — mean and SD from a handful of your own cores | **The best option.** Local variability is what actually drives sample size |
| **2** | **Published values for comparable grassland** under comparable management | No field data yet |
| **3** | **AAFC / CanSIS** soil-landscape carbon data, or **SoilGrids 250 m** as a fallback | Scoping only |

> [!WARNING]
> **A map's variability is not a field crew's variability.** The SD you read off a 250 m modelled
> map is the spread between **pixels of a smoothed statistical model**. The SD your crew will meet
> is the spread between **cores in real, patchy grassland**, and it is substantially larger.
>
> Take the map's mean at face value. **Do not take its CV at face value** — inflate it, or better,
> run a pilot. The same warning applies in both other workshops.

> 🟠 **[FILL ME IN]** — a regional SOC prior (mean and CV) and its source, in the calculator's
> `Fill Me In` tab. There is a working default so the workbook computes from the moment you open
> it, and a flag that stays lit until you replace it.

### ⚠ Roots need far more cores than soil does

This is the finding that shapes a grassland campaign, and it falls straight out of the arithmetic.

**Soil carbon is relatively uniform** — typical CV **0.2–0.4**. **Root biomass is not** — typical
CV **0.5–1.0 or higher** — because roots cluster around individual plants and tussocks rather than
spreading evenly.

Since sample size scales with $CV^2$, that difference is not small. At **90% confidence and a
±20% target**, with the *t*-correction applied ([A9](#a9--plan-with-z-floor-it-with-t)):

| Pool | Typical CV | Cores for ±20% |
|---|---|---|
| **Soil carbon** — uniform site | 0.20 | **5** |
| **Soil carbon** — typical | 0.30 | **9** |
| **Soil carbon** — patchy | 0.40 | **13** |
| **Roots** — low end | 0.50 | **19** |
| **Roots** — typical | 0.70 | **36** |
| **Roots** — high end | 1.00 | **70** |

**At the same target, roots need roughly four to five times the cores soil does.** Soil at CV 0.30
needs 9; roots at CV 0.70 need 36.

Combined with the fact that **root washing is days of lab work, not hours**, sizing both pools at
±20% will sink most projects.

### So set a different target for each pool

The way out is not to sample less — it is to **stop pretending both pools need the same
precision.**

| Design | Soil | Roots | Cores to field |
|---|---|---|---|
| Same target for both | ±20% (9) | ±20% (36) | **36** ❌ |
| **Per-pool targets** | ±20% (9) | **±40%** (11) | **11** ✅ |
| Tighter roots | ±20% (9) | ±30% (17) | **17** |
| Looser overall | ±25% (6) | ±50% (8) | **8** |

**±40% on a root estimate is not a failure.** It is an honest interval on a pool that is
genuinely patchy, reported as such — and it is far better than a ±20% claim you did not earn.

### The subsample option

Because soil and roots come from **the same core**, you have a second lever: run soil carbon on
every core, and **wash only a subset for roots**.

| Cores taken | Soil precision | Cores washed | Root precision |
|---|---|---|---|
| 10 | ±17% | 5 | ±67% |
| 10 | ±17% | 8 | ±47% |
| 15 | ±14% | 8 | ±47% |
| 20 | ±12% | 10 | ±41% |

*Soil at CV 0.30, roots at CV 0.70, 90% confidence.*

**Choose the washed subset at random**, not by which cores looked interesting. And say plainly in
your reporting that the root estimate rests on a subsample of *n*, not on the full campaign.

> [!TIP]
> **✅ Before moving on:**
> - A **target margin and confidence level**, **per pool** — they should not be the same
> - A **variability prior** per stratum per pool, and where it came from
> - A **core count**, and if you are subsampling for roots, how many and chosen how
> - A minimum of **3 cores in any stratum**, whatever the formula says — with fewer you cannot
>   estimate variance at all

---

## Step 5 — Decide where the cores go

### 5A — Where the plot centres go

| Approach | When |
|---|---|
| **Stratified random** | **Default.** Randomise within each stratum from Step 2 |
| **Systematic grid** | Large or uniform sites. Check the grid pitch is not aligned with a real periodicity — old cultivation furrows, pipeline corridors |
| **Paired across a boundary** | When the *question* is the boundary — grazed vs ungrazed across a fence, burned vs unburned. See [Part 5](../05_Monitoring/) |
| **Purely judgemental** | ❌ Avoid. "Where it looked representative" cannot be defended afterwards |

Allocate across strata **proportionally to area**, round each stratum **up**, and raise any
stratum below 3 to 3 — see [A7](#a7--proportional-allocation-across-strata).

### 5B — How each plot is laid out

The plot sizes come from the
[Vegetation guide](../../_Shared/Vegetation-FINAL-Eng-2026.pdf):

| Plot | Size | Holds |
|---|---|---|
| **Large** *(savannah, parkland only)* | 400 m² | Trees — [Forests 3A](../../Forests/03_Field_Methods/3A_Trees.md) |
| **Medium** | **16–100 m²** | Plants **0.5–2 m** — shrubs, tall grasses |
| **Small** | **0.25 m²** (or 1 m²) | Ground vegetation **below 0.5 m** — clip-and-weigh |
| **Soil core** | A point within the plot | Soil **and roots**, by depth increment |

The guide's small plot is **0.25 m²** — a quadrat, or a circle of radius **0.28 m**.

**The ordering rule is absolute:** all vegetation work finishes before any coring. Coring is
destructive, and a corer hole in a quadrat you have not yet clipped is a lost plot.

### 5C — Where the core goes within the plot

**Offset the core from the clipped quadrat**, not through it. You need the quadrat intact for the
above-ground measurement, and you need the core to sample soil that has not been trampled by the
clipping.

Record the offset. For **permanent plots** you intend to re-measure — which is most monitoring
work — the offset matters more, because the next visit must avoid last visit's holes. See
[Part 5](../05_Monitoring/).

### 5D — If you will re-measure this site

Detecting **change** is a harder statistical problem than measuring a stock once, and it reaches
back into this step:

| Requirement | Why |
|---|---|
| **Permanent, relocatable plots** | Paired resampling is far more powerful than independent resampling — you difference out the between-plot variation that dominates your interval |
| **Markers you can find in ten years** | Grassland has nothing to tag. Buried magnets, driven rod with GPS, photographs |
| **More plots than a one-off stock needs** | You are estimating a *difference* between two uncertain numbers |
| **Bulk density measured every time** | Compaction changes it, and a fixed-depth comparison then compares different masses of soil. See [Part 5](../05_Monitoring/) |

**Decide this now.** A campaign designed for a one-off stock is often unusable as a baseline.

> [!TIP]
> **✅ Before moving on:** plot coordinates per stratum, plot sizes chosen, the core-offset rule,
> and a decision on whether these are permanent plots.

---

## ✅ Sampling design complete

| | Item |
|---|---|
| ☐ | A **boundary**, its area, and the rule used to draw it |
| ☐ | **Strata** named with areas, and the **management history** behind each |
| ☐ | A **pool list**, and the tree-cover threshold if trees are in scope |
| ☐ | A **reporting depth** — 30 cm floor, plus whatever deeper you can reach |
| ☐ | **Per-pool precision targets** — soil and roots should differ |
| ☐ | A **variability prior** per pool, and where it came from |
| ☐ | A **core count**, and the root subsample plan if you are using one |
| ☐ | **Plot coordinates** and layout |
| ☐ | A decision on **permanent plots** |
| ☐ | The **season** you will sample — peak growing season for shoots |

Next: [Part 3 — Field Methods](../03_Field_Methods/).

---

# Appendix A — A brief lesson in sampling logic

*and the derivations that drive this work*

Steps 1–5 don't require any of this. But if you want to know why the numbers come out the way
they do, or you need to defend a core count to a reviewer, it's here.

| | | Used in |
|---|---|---|
| [A1](#a1--what-an-estimate-actually-is) | What an estimate actually is | Background |
| [A2](#a2--working-backwards-from-precision-to-sample-size) | Working backwards: precision to sample size | Step 4 |
| [A3](#a3--cochrans-correction-why-big-areas-stop-needing-more-plots) | Cochran's correction | Step 4 |
| [A4](#a4--what-actually-drives-sample-size) | What actually drives sample size | Step 4 |
| [A5](#a5--the-proportion-form) | The proportion form | Step 4 |
| [A6](#a6--symbol-crosswalk-to-the-unfccc-a64-tool) | Symbol crosswalk to the UNFCCC A6.4 tool | Step 4 |
| [A7](#a7--proportional-allocation-across-strata) | Proportional allocation across strata | Step 5 |
| [A8](#a8--after-the-campaign-did-you-hit-your-target) | After the campaign: did you hit your target? | Step 4 |
| [A9](#a9--plan-with-z-floor-it-with-t) | Plan with $z$, floor it with $t$ | Step 4 |
| [**A10**](#a10--why-roots-need-more-cores-than-soil) | **Why roots need more cores than soil** — *new in this workshop* | Step 4 |

---

### A1 — What an estimate actually is

You core a subset of plots and average them. That average, $\bar{x}$, estimates the site's true
mean. How far off might it be? That depends on how much the plots differ from each other (the
standard deviation, $s$) and how many you took ($n$):

$$SE = \frac{s}{\sqrt{n}}$$

The $\sqrt{n}$ is the whole story of sampling economics. **Four times the cores buys twice the
precision** — never four times.

The **margin of error** scales that by a multiplier set by your confidence level:

$$E \cdot \bar{x} = z\,\frac{s}{\sqrt{n}}$$

where $z = 1.282$ at 80% confidence, $1.645$ at 90%, and $1.96$ at 95%.

---

### A2 — Working backwards: from precision to sample size

Run A1 in reverse:

$$n = \left(\frac{z \cdot CV}{E}\right)^{2}, \qquad CV = \frac{s}{\bar{x}}$$

Expressing variability as a **coefficient of variation** makes the result **scale-free** — it no
longer matters whether carbon is in kg C/m² or t C/ha.

**Notice what is squared: $z$, $CV$ and $E$.** That single fact explains
[A4](#a4--what-actually-drives-sample-size), and it is the whole reason roots are expensive
([A10](#a10--why-roots-need-more-cores-than-soil)).

---

### A3 — Cochran's correction: why big areas stop needing more plots

A 10 ha stratum at 100 m² per plot holds 1,000 possible plot locations. Cochran's
**finite-population correction** gives you credit for covering some of them:

$$n \geq \frac{z^2\, N\, CV^2}{(N-1)\,E^2 + z^2\, CV^2}$$

where $N$ = stratum area ÷ plot footprint.

At grassland plot sizes the correction fades almost immediately. At $CV$ = 0.35, ±20%, 90%:

| Stratum area | $N$ | $n$ |
|---|---|---|
| 0.5 ha | 50 | 8 |
| 1 ha | 100 | 8 |
| **10 ha** | **1,000** | **9** |
| 100 ha | 10,000 | 9 |
| infinite | ∞ | 9 |

**One core of difference across a 200-fold range of area.** Use the simple form from
[A2](#a2--working-backwards-from-precision-to-sample-size).

**And the corollary worth telling a funder: a bigger pasture is not a more expensive survey.**
You are estimating a *mean*, and that depends on variability, not on the size of the field.

---

### A4 — What actually drives sample size

*If you read one appendix section, read this one.*

Anchored on a **10 ha stratum**, **±20%**, **90% confidence**, $CV$ = 0.35 → **9 cores**. One knob
turned at a time:

```
                                              cores needed (from 9)
  Precision      ±20% → ±10%     ████████████████████████  33
  Variability    CV 0.35 → 0.70  ████████████████████████  33
  Confidence     90% → 95%       █████████                 12
  Study area     10 ha → 100 ha  ██████                     9
```

| Knob | Turn it… | Effect | Why |
|---|---|---|---|
| **Margin of error, $E$** | ±20% → ±10% | **3.7× more** | $E$ is squared |
| **Variability, $CV$** | 0.35 → 0.70 | **3.7× more** | also squared |
| **Confidence** | 90% → 95% | **~33% more** | $z$ is squared, but 1.645 → 1.96 is a small step |
| **Study area** | 10 ha → 100 ha | **none** | see [A3](#a3--cochrans-correction-why-big-areas-stop-needing-more-plots) |

**Precision is expensive; confidence is cheap.** If the budget is fixed, loosening $E$ buys back
far more cores than dropping confidence — and a wider interval at 95% is usually easier to defend
than a tight one at 90%.

**And $CV$ is the input you do not control.** Which is exactly why soil and roots cannot share a
sample size.

---

### A5 — The proportion form

Some questions are about a **proportion** — what fraction of the pasture is still native sward,
what percentage of cores reached 30 cm without refusal:

$$n \geq \frac{z^2\, N\, p\,q}{(N-1)\,E^2 p^2 + z^2\, p\, q}, \qquad q = 1-p$$

**Use $p = 0.5$ when you have no prior** — it returns the largest, most conservative $n$.

---

### A6 — Symbol crosswalk to the UNFCCC A6.4 tool

| This guide | UNFCCC tool | Meaning |
|---|---|---|
| $z$ | $Z_{\alpha/2}$ | multiplier set by confidence level |
| $E$ | $e_{abs}$ | target **relative** precision |
| $s$ | $SD$ | expected standard deviation |
| $CV$ | $CV$ | coefficient of variation |
| $N$ | $N$ | population size |
| $n$ | $n$ | plots to establish |

> The formula is identical. The tools differ only in how $N$ is obtained — area ÷ plot size, versus
> a population count — and at grassland plot sizes that difference vanishes
> ([A3](#a3--cochrans-correction-why-big-areas-stop-needing-more-plots)).
>
> **None of them apply the $t$-correction in [A9](#a9--plan-with-z-floor-it-with-t)**, and none of
> them size two pools separately.

---

### A7 — Proportional allocation across strata

Each stratum gets a share of $n$ proportional to its area:

$$n_h = \frac{g_h}{N}\times n$$

Then three rules: round each $n_h$ **up**; raise any stratum below **3** to 3; prefer 5 where you
can afford it.

> **Proportional allocation is not always right.** It allocates on **area**. Where one stratum is
> far more variable than another — a heavily grazed unit against an ungrazed exclosure — allocating
> on $\text{area} \times CV$ (**Neyman allocation**) puts cores where the uncertainty is. Check
> each stratum's own required $n$, not just its share.

---

### A8 — After the campaign: did you hit your target?

Planning uses *expected* variability. Check the **achieved** precision against the target:

$$\text{RME} = \frac{t \cdot SE}{\bar{x}}, \qquad SE = \frac{s}{\sqrt{n}}$$

With small $n$, use $t$ rather than $z$: at $n$ = 3 and 90% confidence, $t = 2.92$ against
$z = 1.645$.

**The calculator's [Site Summary](../04_Data_Interpretation/) does this automatically** and prints
`MET` or `NOT MET` — **separately for soil and for roots**, against their separate targets.

**If you miss:**

1. **Scrutinise the raw data** — a core that hit refusal early, a root sample that was not
   ash-corrected, a mis-recorded depth.
2. **Post-stratify.** Check **management** first — this is what the grazing and fire columns on the
   plot log are for.
3. **Add cores**, guided by each pool's own CV rather than evenly.
4. **As a last resort**, report the conservative bound.

---

### A9 — Plan with $z$, floor it with $t$

Cochran's formula uses $z$, the multiplier for a **known** population standard deviation. You never
know it — you estimate it from the same cores you are averaging, so the honest multiplier is
**Student's $t$**. At small $n$ that is a large difference:

| $n$ | $t$ (90%) | $z$ | $t/z$ |
|---|---|---|---|
| 3 | 2.920 | 1.645 | **1.78 ×** |
| 5 | 2.132 | 1.645 | 1.30 × |
| 10 | 1.833 | 1.645 | 1.11 × |
| 20 | 1.729 | 1.645 | 1.05 × |

**At ±20% and 90% confidence:**

| $CV$ | Cochran $n$ | $t$-floor | Extra |
|---|---|---|---|
| 0.20 | 3 | **5** | +2 |
| 0.30 | 7 | **9** | +2 |
| 0.40 | 11 | **13** | +2 |
| 0.50 | 17 | **19** | +2 |
| 0.70 | 34 | **36** | +2 |
| 1.00 | 68 | **70** | +2 |

**The correction costs two cores, at every variability level.** It is not a reason to redesign a
campaign; it is a reason not to field the bare Cochran minimum.

**Report both:**

> *"Design n = 9 cores per stratum (Cochran, 90% confidence, ±20% target, CV = 0.30 from a pilot).
> Fielded n = 11 to account for the t-multiplier at small sample size."*

That sentence is auditable against the standard tools and honest about what they omit. The same
appendix appears in the [Wetlands workshop](../../Wetlands/02_Project_Planning/README.md#a9--plan-with-z-floor-it-with-t).

---

### A10 — Why roots need more cores than soil

*New in this workshop, and the reason a grassland campaign is shaped differently from a forest or
peatland one.*

**The mechanism.** Soil carbon at a site is the integrated product of centuries of inputs, mixed
and redistributed. It is **spatially smoothed**. Root biomass is the standing mass of individual
living plants — it is **high under a tussock and near zero between tussocks**, at a scale of
centimetres.

So the two pools have genuinely different coefficients of variation:

| Pool | Typical CV | Why |
|---|---|---|
| **Soil carbon** | **0.2–0.4** | Centuries of mixing |
| **Root biomass** | **0.5–1.0+** | The plants are discrete objects |

**And $n$ scales with $CV^2$.** Doubling the CV quadruples the cores. From
[A2](#a2--working-backwards-from-precision-to-sample-size):

$$\frac{n_{\text{roots}}}{n_{\text{soil}}} = \left(\frac{CV_{\text{roots}}}{CV_{\text{soil}}}\right)^{2}$$

At $CV_{\text{soil}} = 0.30$ and $CV_{\text{roots}} = 0.70$, that ratio is $(0.70/0.30)^2 \approx
5.4$ — and after the $t$-floor, **9 cores against 36**.

#### What to do about it

**Not** field 36 cores and wash them all. Three better options, in the order most projects should
consider them:

| Option | Mechanism | Trade |
|---|---|---|
| **1 · Per-pool targets** ⭐ | Soil ±20%, roots ±40% → **11 cores** | A wider but honest root interval. **The recommended default** |
| **2 · Subsample for roots** | All cores for soil, a random subset washed | Root estimate rests on fewer samples — say so |
| **3 · Reduce root CV by design** | Larger-diameter cores, or composite several cores per plot | Compositing loses within-plot variance information |

> [!IMPORTANT]
> **A ±40% root interval is not a failure.** It is an honest interval on a genuinely patchy pool.
> The alternative is not a better number — it is a ±20% claim that the data does not support.
>
> What matters is that you **state the target and the achievement, per pool.** The calculator does
> this automatically.

#### On option 3, briefly

A **larger core diameter** averages over more of the tussock/gap pattern, which genuinely reduces
CV — and it also increases washing time per core. There is a real optimum here, and it depends on
your tussock spacing.

**Compositing** several cores per plot into one sample reduces the CV *between plots* but discards
the variance *within* them. That is fine if you only want a mean, and a problem if you want to
understand the pattern — or if you later want to use the data for [monitoring](../05_Monitoring/),
where within-plot variance is what determines whether you can detect change.

---

## In this section

- [`Sampling Design Tools/`](Sampling%20Design%20Tools/) — **placeholders.** The Forests tool as
  an interim stand-in, with a README setting out what transfers and what does not.

> 📸 **[SCREENSHOTS NEEDED]** — a stratified grassland in the GEE tool; the sample-size output
> with two pools sized separately.
>
> ✍️ **[SLIDE DECK NEEDED]** — the workshop presentation for Part 2.
>
> 🛠 **[TOOL NEEDED]** — a grassland sampling-design tool: grassland priors, the right plot sizes,
> stratification on management and fire, **separate sizing for soil and roots**, and the
> [$t$-floor](#a9--plan-with-z-floor-it-with-t) reported beside the Cochran figure.

---

[← 1 — Background](../01_Background/) · [Back to main guide](../README.md) · Next: [3 — Field Methods →](../03_Field_Methods/)

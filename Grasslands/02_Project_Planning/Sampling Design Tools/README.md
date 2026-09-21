# Sampling Design Tools — placeholders

> [!WARNING]
> **Nothing in this folder is grassland-specific yet.** A grassland sampling tool is in
> development. What is here is an interim stand-in, and you need to know what it does and doesn't
> give you before using it.

---

## What's here now

### `ForestSamplingTool_GEE.js` — usable, with caveats

This is the **Forests** sampling tool, copied in unchanged. Paste it into the
[Google Earth Engine Code Editor](https://code.earthengine.google.com/) and run it.

**What transfers to a grassland without any change** — the statistics are ecosystem-free:

- Cochran's finite-population sample size (the *n* behind
  [Part 2, Step 4](../README.md#step-4--decide-how-many-cores))
- Proportional allocation across strata, with a per-stratum minimum
- The achieved-precision check you run after the field season
- Boundary geometry, buffering, plot layout and spacing
- Its self-test harness, which verifies every reported number against the workshop's own
  arithmetic

**What does NOT transfer:**

| Setting | Forests value | Why it's wrong for a grassland |
|---|---|---|
| **Priors** | Forest biomass and mineral soil carbon | Grassland carbon is distributed differently and the variability differs by management. Forest priors will mis-size your campaign |
| **Plot size** | 400 m² (a tree plot) | Grassland works in **medium plots of 16–100 m²** and **small plots of 0.25–1 m²**, with soil cores at points |
| **Pool selection** | Trees / Soil / Understory | A grassland campaign is **soil-first**, with **roots as a separate pool** |
| **One *n* for everything** | — | **Roots need more cores than soil carbon** at the same precision, because root biomass is more spatially variable. The tool has no concept of this |

**How to use it anyway.** Ignore the built-in priors and **type in your own**: a mean and standard
deviation from a pilot, or from a published grassland source. Set the plot size to match the pool
you are sizing. **Run it twice — once for soil, once for roots** — and field the larger number
where the two pools come from the same core.

---

## What's coming

| Tool | Status |
|---|---|
| **Grassland sampling design tool** | To be built. Grassland priors, the right plot sizes, stratification by management and fire, and **separate sizing for soil and roots** |
| **Prior carbon scoping tool** | A larger version is in development separately. The current Forests copy lives in [`../../../Forests/02_Project_Planning/Sampling Design Tools/`](../../../Forests/02_Project_Planning/Sampling%20Design%20Tools/) |

> 📌 **Note for whoever builds these.** The grassland prior sources differ from both of the other
> workshops. **AAFC / CanSIS** holds Canadian soil-landscape carbon data, and **SoilGrids 250 m**
> is the global fallback. Neither is wired into the existing scoping script, which loads Sothe,
> CanPeat and WoSIS — so this is a genuine addition rather than a filter change.
>
> Carry the **map-CV-inflation warning** across: a modelled 250 m pixel understates plot-scale
> variance, so its CV must be inflated or replaced with a pilot estimate before it sizes a
> campaign.

---

## In the meantime

You do not need Earth Engine to plan a campaign. Everything the tool computes is set out longhand
in [**Part 2, Appendix A**](../README.md#appendix-a--a-brief-lesson-in-sampling-logic), including
the [*t*-floor correction](../README.md#a9--plan-with-z-floor-it-with-t) that none of the standard
tools apply.

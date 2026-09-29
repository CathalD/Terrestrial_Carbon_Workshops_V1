// =================================================================================
// GRASSLAND SAMPLING DESIGN TOOL — 2026
// WWF-Canada · Terrestrial Carbon Workshops
//
// Companion to Part 2 (Project Planning) of the Grassland Carbon Workshop.
// Steps 1-5 of Part 2: boundary -> zones -> pools and priors -> precision -> layout.
//
//   SECTION 0   Configuration and resource links
//   SECTION 1   Statistics core          (BCStats)
//   SECTION 2   Geometry and feasibility (BCGeom)
//   SECTION 3   Test harness             (BCTest)
//   SECTION 5   Earth Engine layer       (BCEarth)
//   SECTION 6   Layout engine            (BCLayout, BCPlace, BCZones)
//   SECTION 7   User interface
//
// ── HOW THIS DIFFERS FROM THE FOREST TOOL ────────────────────────────────────
//   * SAMPLE SIZE MATCHES grassland-sample-allocation.xlsx, not Cochran's
//     finite-population form. n = (z CV / E)^2, then the Student-t fixed-point
//     iteration (Part 2, Appendix A2 and A9). Appendix A3 flags "N = area / plot"
//     as unresolved for grasslands, so no finite-population correction is applied
//     and plot size no longer enters the sample-size maths. It only sets spacing.
//   * SOIL AND ROOTS ARE SIZED SEPARATELY, each with its own precision target
//     and prior. Roots are washed from the same cores, so the number of plot
//     centres is the larger of the two (Appendix A10).
//   * NO DEFAULT PRIORS. Nothing is calculated until a prior AND its source are
//     entered (Part 2 Step 4). The forest tool's built-in fallback values and its
//     x1.5 map-CV inflation are not carried over.
//   * ALLOCATION IS AREA-PROPORTIONAL ONLY, with a per-stratum minimum (Appendix A7).
//   * COMPOSITE SAMPLING IS KEPT. n counts composite SAMPLES (lab analyses); each
//     one pools several subsample cores. See the note above BCPlace.
//   * TRANSECTS ARE REMOVED (wetland / forest layout).
//
// To run the tests: set RUN_SELF_TEST to true and press Run. Results print to
// the Console panel. Set it to false for the released app.
// =================================================================================

var RUN_SELF_TEST = false;  // set true only when validating a new edit

// Works in the GEE Code Editor (print) and in plain JavaScript (console.log).
var LOG = (typeof print === 'function') ? print : console.log;


// =================================================================================
// === SECTION 0 — CONFIGURATION ===================================================
// =================================================================================

var CONFIG = {

  VERSION: '2026.1-grassland',

  // --- Defaults, matched to the workshop text and the workbook -------------------
  CONFIDENCE:         0.90,   // Step 4
  MARGIN_SOIL:        0.20,   // workbook '1. Design'
  MARGIN_ROOT:        0.40,   // workbook '1. Design' — a wider root target is usual
  MIN_PLOTS_PER_ZONE: 3,      // workbook default. Draft statistical minimum is 3; 5 is preferred.
  SEED:               42,

  // --- Nested-plot footprint (Step 3) --------------------------------------------
  // Centres are kept at least one plot width apart, using the LARGEST nested plot
  // in use, so two plots never overlap.
  //   Large  400 m2  trees taller than 2 m
  //   Medium  25 m2  shrubs and vegetation 0.5-2 m (workshop default)
  //   Small 0.25 m2  ground vegetation below 0.5 m (sits inside the medium plot)
  FOOTPRINTS: {
    trees:  { plotM2: 400, label: 'Trees taller than 2 m are in scope (400 m² large plot)' },
    shrubs: { plotM2: 25,  label: 'No trees (25 m² medium plot)' }
  },

  // --- Composite sampling --------------------------------------------------------
  COMPOSITE_RADIUS_M: 5,     // subsamples fall in a ring around each centre
  COMPOSITE_SUBSAMPLES: 5,

  // --- Resource links shown to the user -----------------------------------------
  REPO: 'https://github.com/CathalD/Terrestrial_Carbon_Workshops_V1',

  LINKS: {
    calculator:    '/blob/main/Grasslands/02_Project_Planning/Sampling%20Design%20Tools/grassland-sample-allocation.xlsx',
    planningGuide: '/blob/main/Grasslands/02_Project_Planning/README.md',
    appendixA:     '/blob/main/Grasslands/02_Project_Planning/README.md#appendix-a--a-brief-lesson-in-sampling-logic',
    treesGuide:    '/blob/main/Forests/03_Field_Methods/3A_Trees.md',
    vegGuide:      '/blob/main/_Shared/Vegetation-FINAL-Eng-2026.pdf',
    soilGuide:     '/blob/main/_Shared/Non-peat-FINAL-Eng-2026.pdf',
    labGuide:      '/blob/main/_Shared/Lab-Guide-Eng-2026.pdf',
    datasheets:    '/blob/main/Grasslands/03_Field_Methods/datasheets/',
    workedExample: '/blob/main/Grasslands/Worked_Example/'
  },

  linkTo: function (key) { return this.REPO + this.LINKS[key]; }
};


// =================================================================================
// === SECTION 1 — STATISTICS CORE =================================================
// ===
// === Every reported number originates here. Verified against
// === grassland-sample-allocation.xlsx (tab 4, Sensitivity) by the tests in Section 3.
// =================================================================================

var BCStats = {

  VERSION: '2026.1',

  // Priors above this CV get a warning: the campaign will be unusually large.
  HIGH_CV: 0.80,
  // Priors below this are unusual for field data; the warning asks the user to
  // check they entered a between-sample SD and not a standard error.
  LOW_CV: 0.15,
  // Below this the achieved precision (Appendix A8) is poorly determined: one
  // sample has no SD, and a handful gives a very uncertain one.
  MIN_USABLE_SAMPLES: 5,
  // Unrolled passes of the t iteration. The workbook does six and takes the larger
  // of the last two, so this does too.
  T_PASSES: 6,

  // Round away binary noise before ceil(), as Excel's 15-digit arithmetic does.
  // Without it 10 * 0.3 = 3.0000000000000004 would round UP to 4.
  ceilSafe: function (x) { return Math.ceil(Math.round(x * 1e9) / 1e9); },

  // --- Inverse normal -----------------------------------------------------------
  // Acklam's algorithm; relative error below 1.15e-9.

  invNorm: function (p) {
    if (!(p > 0 && p < 1)) return NaN;

    var a = [-3.969683028665376e+01,  2.209460984245205e+02, -2.759285104469687e+02,
              1.383577518672690e+02, -3.066479806614716e+01,  2.506628277459239e+00];
    var b = [-5.447609879822406e+01,  1.615858368580409e+02, -1.556989798598866e+02,
              6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
             -2.549732539343734e+00,  4.374664141464968e+00,  2.938163982698783e+00];
    var d = [ 7.784695709041462e-03,  3.224671290700398e-01,  2.445134137142996e+00,
              3.754408661907416e+00];

    var pLow = 0.02425, pHigh = 1 - pLow, q, r;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
             ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    }
    if (p <= pHigh) {
      q = p - 0.5; r = q * q;
      return (((((a[0]*r + a[1])*r + a[2])*r + a[3])*r + a[4])*r + a[5]) * q /
             (((((b[0]*r + b[1])*r + b[2])*r + b[3])*r + b[4])*r + 1);
    }
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
            ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
  },

  z: function (confidence) { return this.invNorm(1 - (1 - confidence) / 2); },

  // --- Student's t --------------------------------------------------------------
  // Regularised incomplete beta (Lentz continued fraction), then the t CDF, then
  // bisection for the quantile. Matches Excel's TINV(1 - confidence, df), which
  // the workbook uses: the two-tailed critical value.

  lnGamma: function (x) {
    var c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
             771.32342877765313, -176.61502916214059, 12.507343278686905,
             -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    x -= 1;
    var a = c[0], t = x + 7.5, i;
    for (i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  },

  betaCF: function (a, b, x) {
    var MAXIT = 300, EPS = 3e-14, FPMIN = 1e-300, m, m2, aa, del;
    var qab = a + b, qap = a + 1, qam = a - 1;
    var c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    var h = d;
    for (m = 1; m <= MAXIT; m++) {
      m2 = 2 * m;
      aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  },

  betaInc: function (a, b, x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(this.lnGamma(a + b) - this.lnGamma(a) - this.lnGamma(b) +
                      a * Math.log(x) + b * Math.log(1 - x));
    return (x < (a + 1) / (a + b + 2))
      ? bt * this.betaCF(a, b, x) / a
      : 1 - bt * this.betaCF(b, a, 1 - x) / b;
  },

  tCdf: function (t, df) {
    var tail = 0.5 * this.betaInc(df / 2, 0.5, df / (df + t * t));
    return t > 0 ? 1 - tail : tail;
  },

  tInv: function (p, df) {
    if (!(p > 0 && p < 1) || !(df >= 1)) return NaN;
    if (p === 0.5) return 0;
    if (p < 0.5) return -this.tInv(1 - p, df);
    var lo = 0, hi = 1, i;
    while (this.tCdf(hi, df) < p && hi < 1e9) hi *= 2;
    for (i = 0; i < 200; i++) {
      var mid = (lo + hi) / 2;
      if (this.tCdf(mid, df) < p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  },

  // Two-tailed critical value, as Excel's TINV(1 - confidence, df).
  tCrit: function (confidence, df) { return this.tInv(1 - (1 - confidence) / 2, df); },

  // --- Sample size, one pool ----------------------------------------------------
  //   n0     = ceil( (z CV / E)^2 )                          Appendix A2
  //   n_k+1  = ceil( (t(n_k - 1) CV / E)^2 )                 Appendix A9
  // Six passes; the larger of the last two is taken, so a two-cycle resolves
  // upward. Identical to the workbook's '3. Result' tab.

  sampleSize: function (o) {
    var cv = o.cv, E = o.marginOfError, conf = o.confidence;
    if (!isFinite(cv) || cv <= 0 || !isFinite(E) || E <= 0 || !(conf > 0 && conf < 1)) {
      return { ok: false, reason: 'Need a positive CV, a positive margin of error and a confidence between 0 and 1.' };
    }
    var z  = this.z(conf);
    var n0 = this.ceilSafe(Math.pow(z * cv / E, 2));
    var passes = [], n = n0, k;
    for (k = 0; k < this.T_PASSES; k++) {
      var df = Math.max(1, n - 1);
      n = this.ceilSafe(Math.pow(this.tCrit(conf, df) * cv / E, 2));
      passes.push(n);
    }
    var last = passes.length;
    var nFinal = Math.max(passes[last - 1], passes[last - 2]);
    return { ok: true, nZ: n0, n: nFinal, added: nFinal - n0, passes: passes,
             z: z, cv: cv, marginOfError: E, confidence: conf };
  },

  // --- Allocation across strata, proportional to area (Appendix A7) --------------
  // Rounded up, then raised to the minimum. Both push the total above n, which is
  // expected: rounding down, or allowing a two-sample stratum, would leave that
  // stratum without an estimable variance.

  allocate: function (o) {
    var strata = o.strata, minPer = o.minPerStratum, G = 0, j;
    for (j = 0; j < strata.length; j++) G += strata[j].areaM2;
    var out = [], total = 0;
    for (j = 0; j < strata.length; j++) {
      var raw   = o.n * strata[j].areaM2 / G;
      var cores = Math.max(minPer, this.ceilSafe(raw));
      total += cores;
      out.push({ name: strata[j].name, areaM2: strata[j].areaM2, share: strata[j].areaM2 / G,
                 rawCores: raw, cores: cores, flooredToMinimum: this.ceilSafe(raw) < minPer });
    }
    return { strata: out, total: total, totalAreaM2: G };
  },

  // --- Achieved precision, after fieldwork (Appendix A8) ------------------------
  // Simple random sample form: RME = t * SE / mean, SE = s / sqrt(n). A stratified,
  // composite or paired design needs a design-specific analysis.

  achievedPrecision: function (o) {
    var t   = this.tCrit(o.confidence, o.n - 1);
    var se  = o.sampleSd / Math.sqrt(o.n);
    var rme = t * se / o.sampleMean;
    return { ok: true, t: t, se: se, rme: rme, target: o.target, pass: rme <= o.target };
  },

  // --- Priors -------------------------------------------------------------------
  // There is NO default prior. The user supplies a CV, or a mean and SD, and says
  // where it came from. A CV entered directly wins over mean and SD (as in the
  // workbook). Nothing downstream computes without one.

  priorFromInputs: function (o) {
    var cv = NaN, how = '';
    if (isFinite(o.cv) && o.cv > 0) { cv = o.cv; how = 'CV entered directly'; }
    else if (isFinite(o.mean) && o.mean > 0 && isFinite(o.sd) && o.sd >= 0) {
      cv = o.sd / o.mean; how = 'SD / mean';
    }
    if (!isFinite(cv) || cv <= 0) {
      return { ok: false, reason: 'Enter a CV, or a mean above zero and a standard deviation above zero.' };
    }
    var source = (o.source || '').replace(/^\s+|\s+$/g, '');
    if (!source) {
      return { ok: false, reason: 'Say where this prior came from (pilot, published study, soil map). A reviewer will ask.' };
    }
    var thin = (isFinite(o.pilotN) && o.pilotN < this.MIN_USABLE_SAMPLES);
    return { ok: true, pool: o.pool, cv: cv, how: how, source: source,
             mean: isFinite(o.mean) ? o.mean : null, sd: isFinite(o.sd) ? o.sd : null,
             pilotN: isFinite(o.pilotN) ? o.pilotN : null,
             indicative: thin,
             note: thin ? 'Fewer than ' + this.MIN_USABLE_SAMPLES + ' pilot samples: the SD is itself poorly estimated. Treat as indicative.' : '',
             highVariability: cv > this.HIGH_CV,
             lowVariability:  cv < this.LOW_CV };
  },

  pools: function () { return ['Soil', 'Roots']; }
};


// =================================================================================
// === SECTION 2 — GEOMETRY AND FEASIBILITY ========================================
// ===
// === Analysis scale adapts to site size: a fixed 250 m scale resolves a 5 ha site
// === to zero pixels and returns empty stratum areas.
// =================================================================================

var BCGeom = {

  VERSION: '2026.1',

  SCALE_LADDER: [10, 20, 30, 50, 100, 250],  // never finer than Sentinel-2
  TARGET_PIXELS: 5000,
  BUFFER_LADDER: [50, 25, 10, 5, 0],
  MIN_AREA_RETAINED: 0.60,

  // Square packing is a theoretical ceiling. Placing plots at random with a
  // minimum separation stalls well below it.
  FILL_WARN:  0.25,
  FILL_LIMIT: 0.50,

  // --- Analysis scale -----------------------------------------------------------

  analysisScale: function (areaM2) {
    if (!(areaM2 > 0)) return { ok: false, reason: 'Area must be greater than zero.' };

    var ideal = Math.sqrt(areaM2 / this.TARGET_PIXELS);
    var scale = this.SCALE_LADDER[0];
    for (var i = 0; i < this.SCALE_LADDER.length; i++) {
      if (this.SCALE_LADDER[i] <= ideal) scale = this.SCALE_LADDER[i];
    }
    var pixels = Math.floor(areaM2 / (scale * scale));

    return { ok: true, scale: scale, pixels: pixels, areaHa: areaM2 / 10000,
             coarse: pixels < 100,
             note: 'Analysis at ' + scale + ' m gives about ' + pixels +
                   ' pixels across the site.' };
  },

  // --- Which stratification methods can resolve this site -----------------------
  // For grasslands the strata that matter (restoration age, burn history,
  // management) are usually NOT visible to a satellite. Drawing or uploading them
  // is the recommended route; the automatic methods group by appearance only.

  SOURCES: [
    { id: 'draw',       label: 'Draw them by hand (recommended)',        nativeScale: null, minPixels: 0 },
    { id: 'upload',     label: 'Upload my own boundaries (recommended)', nativeScale: null, minPixels: 0 },
    { id: 'dynamic',    label: 'Land cover (Dynamic World, 10 m)',       nativeScale: 10,  minPixels: 200 },
    { id: 'copernicus', label: 'Land cover (Copernicus, 100 m)',         nativeScale: 100, minPixels: 200 },
    { id: 'covariates', label: 'Satellite imagery grouping (30 m)',      nativeScale: 30,  minPixels: 300 },
    { id: 'embeddings', label: 'Satellite Embeddings grouping (10 m)',   nativeScale: 10,  minPixels: 300 }
  ],

  stratificationOptions: function (areaM2) {
    var out = [];
    for (var i = 0; i < this.SOURCES.length; i++) {
      var s = this.SOURCES[i];
      var entry = { id: s.id, label: s.label, available: true, reason: '' };
      if (s.nativeScale) {
        var px = Math.floor(areaM2 / (s.nativeScale * s.nativeScale));
        entry.pixels = px;
        if (px < s.minPixels) {
          entry.available = false;
          entry.reason = 'Only ' + px + ' pixels fit inside this site at ' +
                         s.nativeScale + ' m. Too coarse to split it up.';
        }
      }
      out.push(entry);
    }
    return out;
  },

  // --- Spacing ------------------------------------------------------------------
  // Two plot centres closer than one plot width describe overlapping ground and are
  // one observation counted twice. For composites the spacing is at least the
  // composite's diameter, so no two composites overlap.

  minSpacing: function (plotM2, compositeRadiusM) {
    var s = Math.sqrt(plotM2);
    return compositeRadiusM ? Math.max(s, 2 * compositeRadiusM) : s;
  },

  capacity: function (areaM2, spacingM) { return Math.floor(areaM2 / (spacingM * spacingM)); },

  practicalCapacity: function (areaM2, spacingM) {
    return Math.floor(this.capacity(areaM2, spacingM) * this.FILL_LIMIT);
  },

  // --- Inward buffer (estimate; not applied by the UI) ---------------------------
  // Client-side estimate assuming a compact shape.

  retainedAfterBuffer: function (areaM2, bufferM) {
    var side = Math.sqrt(areaM2) - 2 * bufferM;
    return side <= 0 ? 0 : side * side;
  },

  chooseBuffer: function (areaM2, coresNeeded, spacingM) {
    for (var i = 0; i < this.BUFFER_LADDER.length; i++) {
      var b = this.BUFFER_LADDER[i];
      var retained = this.retainedAfterBuffer(areaM2, b);
      if (retained / areaM2 < this.MIN_AREA_RETAINED) continue;
      if (this.practicalCapacity(retained, spacingM) < coresNeeded) continue;
      return { ok: true, buffer: b, retainedM2: retained,
               retainedFraction: retained / areaM2,
               note: b === 0
                 ? 'No edge buffer — the zone is too small to give any up.'
                 : b + ' m edge buffer, keeping ' +
                   Math.round(100 * retained / areaM2) + '% of the zone.' };
    }
    return { ok: false, buffer: 0, retainedM2: areaM2, retainedFraction: 1,
             note: 'No buffer possible. This zone is barely larger than the plots it must hold.' };
  },

  // --- Feasibility --------------------------------------------------------------
  // Run before any point generation. Every message names the fix.
  //   o.spacingM       minimum distance between plot centres
  //   o.strata         [{ name, areaM2, cores }]
  //   o.minPerStratum  the minimum per zone in force

  feasibility: function (o) {
    var spacing = o.spacingM;
    var minPer  = (o.minPerStratum === undefined) ? CONFIG.MIN_PLOTS_PER_ZONE : o.minPerStratum;
    var strata  = o.strata || [{ name: 'Whole site', areaM2: o.areaM2, cores: o.cores }];
    var problems = [], warnings = [], j;

    var total = 0;
    for (j = 0; j < strata.length; j++) total += strata[j].areaM2;
    var N = this.capacity(total, spacing);

    if (N < 1) {
      problems.push('The site (' + Math.round(total) + ' m²) is smaller than the ' +
                    Math.round(spacing * spacing) + ' m² one plot needs. Check the boundary, ' +
                    'or use a smaller plot.');
      return { ok: false, problems: problems, warnings: warnings, N: N };
    }

    if (strata.length * minPer > N) {
      problems.push(strata.length + ' zones at a minimum of ' + minPer + ' plots each needs ' +
                    (strata.length * minPer) + ' plots, but the site only holds ' + N +
                    '. Use fewer zones or a smaller plot.');
    }

    for (j = 0; j < strata.length; j++) {
      var s    = strata[j];
      var name = s.name || ('Zone ' + (j + 1));
      var Nh   = this.capacity(s.areaM2, spacing);

      if (Nh < minPer) {
        problems.push(name + ' holds only ' + Nh + ' plots but needs at least ' + minPer +
                      '. Merge it into a neighbouring zone, or drop it.');
        continue;
      }

      var cores = s.cores || minPer;
      var slots = Nh;
      var fill  = slots > 0 ? cores / slots : Infinity;

      if (fill > this.FILL_LIMIT) {
        problems.push(name + ' cannot hold ' + cores + ' plots kept ' + Math.round(spacing) +
                      ' m apart. About ' + Math.floor(slots * this.FILL_LIMIT) +
                      ' is the practical limit for this zone. Reduce the plot count, ' +
                      'enlarge the zone, or merge it.');
      } else if (fill > this.FILL_WARN) {
        warnings.push(name + ' will be densely sampled (' + cores + ' plots in about ' +
                      slots + ' possible positions). Placement may take several attempts.');
      }
    }

    var sc = this.analysisScale(total);
    if (sc.ok && sc.coarse) {
      warnings.push('This site is small (' + sc.areaHa.toFixed(1) + ' ha). Areas are computed at ' +
                    sc.scale + ' m, the finest available, giving about ' + sc.pixels +
                    ' pixels. Expect the area to be approximate.');
    }

    return { ok: problems.length === 0, problems: problems, warnings: warnings,
             N: N, scale: sc.scale, totalAreaM2: total };
  }
};


// =================================================================================
// === SECTION 6A — PURE GEOMETRY AND BOOKKEEPING (no Earth Engine) ===============
// ===
// === Defined ahead of the tests so they can exercise it. Sections 5 and 6B, which
// === do call Earth Engine, follow.
// =================================================================================

// --- Drawn-zone bookkeeping -------------------------------------------------------
// A stratum may be made of SEVERAL polygons. Two things went wrong before:
//   1. Only the first shape in the drawing layer was read (`geometries().get(0)`),
//      so drawing three polygons and pressing "Add" kept one.
//   2. Every polygon was kept as its own zone, so a second polygon of the same
//      stratum overwrote the first one's geometry.
// Here every shape is collected, and shapes that share a name are held together.

var BCZones = {

  // Read every geometry from a drawing layer's list (ui.data.ActiveList or any
  // object with length() and get(i)).
  collectAll: function (list) {
    var out = [], n = list.length(), i;
    for (i = 0; i < n; i++) out.push(list.get(i));
    return out;
  },

  // store: { order: [names], byName: { name: [geometry, ...] } }
  emptyStore: function () { return { order: [], byName: {} }; },

  add: function (store, name, geometries) {
    if (!store.byName.hasOwnProperty(name)) { store.byName[name] = []; store.order.push(name); }
    for (var i = 0; i < geometries.length; i++) store.byName[name].push(geometries[i]);
    return store;
  },

  polygonCount: function (store) {
    var n = 0;
    for (var i = 0; i < store.order.length; i++) n += store.byName[store.order[i]].length;
    return n;
  },

  // Flat list of { name, geometry }, one per polygon, in the order drawn.
  flatten: function (store) {
    var out = [], i, j;
    for (i = 0; i < store.order.length; i++) {
      var nm = store.order[i];
      for (j = 0; j < store.byName[nm].length; j++) out.push({ name: nm, geometry: store.byName[nm][j] });
    }
    return out;
  }
};


// --- Layout geometry ----------------------------------------------------------

var BCLayout = {

  LAYOUTS: [
    { id: 'random',    label: 'Random (stratified-random when there are zones)',
      blurb: 'Plot centres scattered at random inside each zone. The default. Zones get their share of plots first, then locations are randomised within each.' },
    { id: 'grid',      label: 'Even grid',
      blurb: 'Plot centres on a regular lattice. Even coverage. Check the spacing does not line up with furrows, fence lines, pipeline corridors or treatment strips.' },
    { id: 'composite', label: 'Composite samples',
      blurb: 'Several subsample cores pooled into one lab sample. Fewer analyses. The sample size counts composites, not cores.' }
  ],

  // --- local metric frame -------------------------------------------------------
  // Coordinates near a small site are converted to metres about a centroid, the
  // geometry is done flat, then converted back. Error over a few kilometres is
  // far below the precision anything here needs.

  M_PER_DEG_LAT: 111320,

  toLocal: function (lon, lat, c) {
    return { x: (lon - c.lon) * this.M_PER_DEG_LAT * Math.cos(c.lat * Math.PI / 180),
             y: (lat - c.lat) * this.M_PER_DEG_LAT };
  },

  toLonLat: function (x, y, c) {
    return { lon: c.lon + x / (this.M_PER_DEG_LAT * Math.cos(c.lat * Math.PI / 180)),
             lat: c.lat + y / this.M_PER_DEG_LAT };
  },

  centroidOf: function (ring) {
    var sx = 0, sy = 0;
    for (var i = 0; i < ring.length; i++) { sx += ring[i][0]; sy += ring[i][1]; }
    return { lon: sx / ring.length, lat: sy / ring.length };
  },

  metresBetween: function (a, b) {
    var R = 6371000;
    var p1 = a.lat * Math.PI / 180, p2 = b.lat * Math.PI / 180;
    var dp = (b.lat - a.lat) * Math.PI / 180, dl = (b.lon - a.lon) * Math.PI / 180;
    var h = Math.sin(dp/2)*Math.sin(dp/2) +
            Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)*Math.sin(dl/2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  },

  // --- minimum separation -------------------------------------------------------
  // Earth Engine's randomPoints has no spacing control, so two plots can land 3 m
  // apart. Points are oversampled, then thinned greedily in the order returned,
  // which keeps the result reproducible for a given seed.

  thin: function (candidates, spacingM, wanted) {
    var kept = [], i, j, ok;
    for (i = 0; i < candidates.length && kept.length < wanted; i++) {
      ok = true;
      for (j = 0; j < kept.length; j++) {
        if (this.metresBetween(candidates[i], kept[j]) < spacingM) { ok = false; break; }
      }
      if (ok) kept.push(candidates[i]);
    }
    return kept;
  },

  minSeparation: function (points) {
    var lowest = Infinity, i, j;
    for (i = 0; i < points.length; i++) {
      for (j = i + 1; j < points.length; j++) {
        var d = this.metresBetween(points[i], points[j]);
        if (d < lowest) lowest = d;
      }
    }
    return points.length < 2 ? Infinity : lowest;
  },

  // --- deterministic random -----------------------------------------------------
  // A tiny generator so grid offsets, subsets and subsamples reproduce exactly from
  // the seed, rather than depending on when a callback happened to return.

  rng: function (seed) {
    var s = seed || 1;
    return function () { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  },

  // k distinct indices from 0..n-1, chosen at random (Fisher-Yates), sorted.
  // Used for the random root subset and for trimming an over-full grid.
  pickIndices: function (n, k, seed) {
    var idx = [], i, rand = this.rng(seed);
    for (i = 0; i < n; i++) idx.push(i);
    for (i = n - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return idx.slice(0, Math.min(k, n)).sort(function (a, b) { return a - b; });
  },

  // --- even grid ----------------------------------------------------------------

  lattice: function (ring, wanted, areaM2, seed) {
    var c = this.centroidOf(ring), i, j;
    var spacing = Math.sqrt(areaM2 / wanted);

    var xs = [], ys = [];
    for (i = 0; i < ring.length; i++) {
      var p = this.toLocal(ring[i][0], ring[i][1], c);
      xs.push(p.x); ys.push(p.y);
    }
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);

    // Centre the lattice in the bounding box and jitter by less than half a step,
    // so a large site needing few plots cannot step past the box and return nothing.
    var width = maxX - minX, height = maxY - minY;
    var cols = Math.max(1, Math.floor(width / spacing) + 1);
    var rows = Math.max(1, Math.floor(height / spacing) + 1);

    var rand = this.rng(seed);
    var startX = minX + (width  - (cols - 1) * spacing) / 2 + (rand() - 0.5) * spacing * 0.4;
    var startY = minY + (height - (rows - 1) * spacing) / 2 + (rand() - 0.5) * spacing * 0.4;

    var out = [];
    for (i = 0; i < cols; i++) {
      for (j = 0; j < rows; j++) {
        out.push(this.toLonLat(startX + i * spacing, startY + j * spacing, c));
      }
    }
    return { points: out, spacingM: spacing, cols: cols, rows: rows };
  },

  // --- composite subsamples -----------------------------------------------------
  // Subsamples fall in a ring between half the radius and the radius around the
  // centre, at evenly spread bearings with a random start.

  compositeSubsamples: function (centre, subsampleCount, radiusM, seed) {
    var rand = this.rng(seed), out = [], i;
    var phase = rand() * 2 * Math.PI;
    for (i = 0; i < subsampleCount; i++) {
      var ang = phase + 2 * Math.PI * i / subsampleCount;
      var rad = radiusM * Math.sqrt(0.25 + 0.75 * rand());
      out.push(this.toLonLat(rad * Math.cos(ang), rad * Math.sin(ang), centre));
    }
    return out;
  }
};


// =================================================================================
// === SECTION 3 — TEST HARNESS ====================================================
// ===
// === Checks Sections 1, 2 and 6A against grassland-sample-allocation.xlsx and
// === against hand calculations. Pure JavaScript; no Earth Engine calls, so it
// === runs instantly and needs no assets.
// =================================================================================

var BCTest = {

  lines: [], passed: 0, failed: 0,

  say:  function (t) { this.lines.push(t); },
  head: function (t) { this.say(''); this.say('=== ' + t + ' ==='); },
  pad:  function (s, n, right) {
    s = String(s);
    while (s.length < n) { s = right ? (' ' + s) : (s + ' '); }
    return s;
  },
  near: function (label, got, want, tol) {
    tol = (tol === undefined) ? 1e-6 : tol;
    var ok = isFinite(got) && Math.abs(got - want) <= tol;
    ok ? this.passed++ : this.failed++;
    this.say('  ' + (ok ? 'PASS  ' : 'FAIL  ') + this.pad(label, 40) +
             (ok ? '' : '  got ' + got + ', want ' + want));
    return ok;
  },
  eq: function (label, got, want) {
    var ok = (got === want);
    ok ? this.passed++ : this.failed++;
    this.say('  ' + (ok ? 'PASS  ' : 'FAIL  ') + this.pad(label, 40) +
             (ok ? '' : '  got ' + got + ', want ' + want));
    return ok;
  },

  // ---- 3.1 inverse normal ------------------------------------------------------
  testInverseNormal: function () {
    this.head('3.1  Inverse normal, against published z values');
    this.near('z at 80%',   BCStats.z(0.80),  1.2815516);
    this.near('z at 90%',   BCStats.z(0.90),  1.6448536);
    this.near('z at 95%',   BCStats.z(0.95),  1.9599640);
    this.near('z at 99%',   BCStats.z(0.99),  2.5758293);
  },

  // ---- 3.2 Student t -----------------------------------------------------------
  testStudentT: function () {
    this.head("3.2  Student's t, against published tables");
    this.near('t(0.975, df 10)',  BCStats.tInv(0.975, 10),  2.228139, 1e-5);
    this.near('t(0.95,  df 4)',   BCStats.tInv(0.95, 4),    2.131847, 1e-5);
    this.near('t(0.95,  df 1)',   BCStats.tInv(0.95, 1),    6.313752, 1e-4);
    this.near('t(0.975, df 1)',   BCStats.tInv(0.975, 1),  12.706205, 1e-3);
    this.near('t(0.95,  df 21)',  BCStats.tInv(0.95, 21),   1.720743, 1e-5);
    this.near('t(0.95,  df 30)',  BCStats.tInv(0.95, 30),   1.697261, 1e-5);
    this.near('t(0.95,  df 120)', BCStats.tInv(0.95, 120),  1.657651, 1e-5);
    this.near('t(0.995, df 5)',   BCStats.tInv(0.995, 5),   4.032143, 1e-5);
    this.near('two-tailed 90%, df 8 (= TINV)', BCStats.tCrit(0.90, 8), 1.859548, 1e-5);
    this.near('symmetry', BCStats.tInv(0.05, 10), -BCStats.tInv(0.95, 10), 1e-9);
  },

  // ---- 3.3 sample size vs the workbook -----------------------------------------
  testSensitivity: function () {
    this.head("3.3  Sample size, against workbook tab '4. Sensitivity' (9 rows)");
    // [label, CV, E, confidence, n (z only), n (t-adjusted)]
    var rows = [
      ['Soil, relatively uniform',    0.2, 0.2, 0.90,  3,  5],
      ['Soil, moderate variation',    0.3, 0.2, 0.90,  7,  9],
      ['Soil, higher variation',      0.4, 0.2, 0.90, 11, 13],
      ['Roots, lower variation',      0.5, 0.2, 0.90, 17, 19],
      ['Roots, moderate variation',   0.7, 0.2, 0.90, 34, 36],
      ['Roots, high variation',       1.0, 0.2, 0.90, 68, 70],
      ['Roots at a +/-30% target',    0.7, 0.3, 0.90, 15, 17],
      ['Roots at a +/-40% target',    0.7, 0.4, 0.90,  9, 11],
      ['Soil at 95% confidence',      0.3, 0.2, 0.95,  9, 12]
    ];
    var bad = 0, i;
    this.say('    ' + this.pad('', 30) + 'z-only   t-adjusted');
    for (i = 0; i < rows.length; i++) {
      var r = rows[i];
      var s = BCStats.sampleSize({ cv: r[1], marginOfError: r[2], confidence: r[3] });
      if (s.nZ !== r[4] || s.n !== r[5]) bad++;
      this.say('    ' + this.pad(r[0], 30) + this.pad(s.nZ, 5, true) + this.pad(s.n, 11, true) +
               ((s.nZ === r[4] && s.n === r[5]) ? '' : '   MISMATCH, want ' + r[4] + ' / ' + r[5]));
    }
    this.eq('all 9 workbook rows match', bad, 0);
  },

  // ---- 3.4 soil and roots ------------------------------------------------------
  testPools: function () {
    this.head('3.4  Soil and roots sized separately (Part 2, Step 4 table)');
    var soil = BCStats.sampleSize({ cv: 0.30, marginOfError: 0.20, confidence: 0.90 }).n;
    var rEq  = BCStats.sampleSize({ cv: 0.70, marginOfError: 0.20, confidence: 0.90 }).n;
    var r30  = BCStats.sampleSize({ cv: 0.70, marginOfError: 0.30, confidence: 0.90 }).n;
    var r40  = BCStats.sampleSize({ cv: 0.70, marginOfError: 0.40, confidence: 0.90 }).n;
    this.eq('same +/-20% target: field count', Math.max(soil, rEq), 36);
    this.eq('different targets +/-20 / +/-40: ', Math.max(soil, r40), 11);
    this.eq('tighter root target +/-30%: ',      Math.max(soil, r30), 17);
    this.say('  Roots are washed from the same cores, so plot centres = the larger of the two.');
  },

  // ---- 3.5 allocation ----------------------------------------------------------
  testAllocation: function () {
    this.head('3.5  Allocation by area, rounding and the per-zone minimum');
    var strata = [{ name: 'Restored',  areaM2: 30000 }, { name: 'Unrestored', areaM2: 20000 }];

    var a = BCStats.allocate({ n: 9, strata: strata, minPerStratum: 3 });
    this.eq('n = 9: restored',   a.strata[0].cores, 6);    // ceil(5.4)
    this.eq('n = 9: unrestored', a.strata[1].cores, 4);    // ceil(3.6)
    this.eq('total runs above n', a.total, 10);

    var f = BCStats.allocate({ n: 9, strata: strata, minPerStratum: 5 });
    this.eq('min 5 lifts the smaller zone', f.strata[1].cores, 5);
    this.eq('...and flags it', f.strata[1].flooredToMinimum, true);

    this.eq('ceilSafe(3.0000000000000004) is 3', BCStats.ceilSafe(3.0000000000000004), 3);
    this.eq('ceilSafe(3.4) is 4',                BCStats.ceilSafe(3.4), 4);

    var one = BCStats.allocate({ n: 2, strata: [{ name: 'Whole site', areaM2: 50000 }], minPerStratum: 3 });
    this.eq('one zone still gets the minimum', one.strata[0].cores, 3);
  },

  // ---- 3.6 achieved precision --------------------------------------------------
  testAchieved: function () {
    this.head('3.6  Achieved precision (Appendix A8), t on n-1 df');
    // n 22, mean 21.4, SD 12.8, 90%: t(0.95, 21) = 1.720743
    var a = BCStats.achievedPrecision({ n: 22, sampleMean: 21.4, sampleSd: 12.8,
                                        confidence: 0.90, target: 0.20 });
    this.near('standard error',           a.se,  12.8 / Math.sqrt(22), 1e-9);
    this.near('achieved margin of error', a.rme, 1.720743 * (12.8 / Math.sqrt(22)) / 21.4, 1e-5);
    this.eq  ('verdict is a miss at +/-20%', a.pass, false);
  },

  // ---- 3.7 priors --------------------------------------------------------------
  testPriors: function () {
    this.head('3.7  Priors: nothing is assumed');
    var none = BCStats.priorFromInputs({ pool: 'Soil', source: 'pilot' });
    this.eq('no numbers -> refused', none.ok, false);

    var noSrc = BCStats.priorFromInputs({ pool: 'Soil', mean: 10, sd: 3 });
    this.eq('numbers but no source -> refused', noSrc.ok, false);

    var p = BCStats.priorFromInputs({ pool: 'Soil', mean: 10, sd: 3, source: 'Pilot, 8 cores' });
    this.near('CV from mean and SD', p.cv, 0.3);

    var both = BCStats.priorFromInputs({ pool: 'Soil', mean: 10, sd: 3, cv: 0.5, source: 'x' });
    this.near('a CV entered directly wins', both.cv, 0.5);

    var thin = BCStats.priorFromInputs({ pool: 'Roots', cv: 0.7, source: 'pilot', pilotN: 3 });
    this.eq('thin pilot flagged indicative', thin.indicative, true);
    this.eq('CV 0.9 flagged as high variability',
            BCStats.priorFromInputs({ pool: 'Roots', cv: 0.9, source: 's' }).highVariability, true);
    this.eq('CV 0.1 flagged as unusually low',
            BCStats.priorFromInputs({ pool: 'Soil', cv: 0.1, source: 's' }).lowVariability, true);
  },

  // ---- 3.8 multi-polygon strata ------------------------------------------------
  testZones: function () {
    this.head('3.8  Drawn zones: several polygons per stratum (the reported bug)');

    // A stand-in for the drawing layer's list: length() and get(i).
    function fakeList(items) { return { length: function () { return items.length; },
                                        get: function (i) { return items[i]; } }; }

    var draft = fakeList(['polyA1', 'polyA2', 'polyA3']);
    var got = BCZones.collectAll(draft);
    this.eq('three shapes drawn -> three collected', got.length, 3);
    this.say('  (the old code read geometries().get(0) only, and would have kept 1)');

    var store = BCZones.emptyStore();
    BCZones.add(store, 'Restored 2015', got);
    BCZones.add(store, 'Unrestored', BCZones.collectAll(fakeList(['polyB1', 'polyB2'])));
    this.eq('two strata', store.order.length, 2);
    this.eq('restored keeps all 3 polygons', store.byName['Restored 2015'].length, 3);
    this.eq('unrestored keeps both polygons', store.byName['Unrestored'].length, 2);

    BCZones.add(store, 'Restored 2015', ['polyA4']);   // same name again, later
    this.eq('same name later ADDS, not replaces', store.byName['Restored 2015'].length, 4);
    this.eq('still two strata', store.order.length, 2);
    this.eq('5 + 1 polygons in total', BCZones.polygonCount(store), 6);

    var flat = BCZones.flatten(store);
    this.eq('flatten keeps every polygon', flat.length, 6);
    this.eq('flatten keeps its stratum name', flat[3].name, 'Restored 2015');
  },

  // ---- 3.9 scale, options, buffer, feasibility ---------------------------------
  testGeometry: function () {
    this.head('3.9  Analysis scale and stratification options');
    var sites = [[50000, '5 ha'], [500000, '50 ha'], [5e6, '500 ha'], [5e7, '5,000 ha'], [5e9, '500,000 ha']];
    for (var i = 0; i < sites.length; i++) {
      var r = BCGeom.analysisScale(sites[i][0]);
      this.say('    ' + this.pad(sites[i][1], 12) + ' -> ' + this.pad(r.scale, 4, true) +
               ' m, ' + this.pad(r.pixels, 8, true) + ' px' + (r.coarse ? '   [coarse]' : ''));
    }
    this.eq('5 ha site uses 10 m',            BCGeom.analysisScale(50000).scale, 10);
    this.eq('500,000 ha site capped at 250 m', BCGeom.analysisScale(5e9).scale, 250);

    var opts = BCGeom.stratificationOptions(50000);
    function byId(list, id) { for (var k = 0; k < list.length; k++) { if (list[k].id === id) return list[k]; } }
    this.eq('Copernicus 100 m hidden at 5 ha',  byId(opts, 'copernicus').available, false);
    this.eq('Drawing always offered',           byId(opts, 'draw').available, true);
    this.eq('Copernicus returns at 500 ha',
            byId(BCGeom.stratificationOptions(5e6), 'copernicus').available, true);

    this.head('3.10  Spacing, buffer and feasibility');
    this.near('25 m2 plot -> 5 m spacing',   BCGeom.minSpacing(25), 5);
    this.near('400 m2 plot -> 20 m spacing', BCGeom.minSpacing(400), 20);
    this.near('composite radius 5 m dominates a 25 m2 plot', BCGeom.minSpacing(25, 5), 10);
    this.near('a 400 m2 plot dominates radius 5 m',           BCGeom.minSpacing(400, 5), 20);

    var b = BCGeom.chooseBuffer(30000, 6, 5);
    this.say('    3 ha zone, 6 plots at 5 m: ' + b.note);

    var strata = [{ name: 'Restored', areaM2: 30000, cores: 6 }, { name: 'Unrestored', areaM2: 20000, cores: 4 }];
    var f = BCGeom.feasibility({ spacingM: 5, minPerStratum: 3, strata: strata });
    this.eq('two-zone design is feasible', f.ok, true);

    var sliver = BCGeom.feasibility({ spacingM: 5, minPerStratum: 3,
                                      strata: [{ name: 'Sliver', areaM2: 60, cores: 3 }] });
    this.eq('0.006 ha zone rejected', sliver.ok, false);

    var packed = BCGeom.feasibility({ spacingM: 20, minPerStratum: 3,
                                      strata: [{ name: 'Packed', areaM2: 8000, cores: 70 }] });
    this.eq('70 plots at 20 m in 0.8 ha rejected', packed.ok, false);

    var tiny = BCGeom.feasibility({ spacingM: 5, minPerStratum: 3, areaM2: 10, cores: 3 });
    this.eq('site smaller than one plot rejected', tiny.ok, false);
  },

  // ---- 3.11 layout geometry ----------------------------------------------------
  testLayout: function () {
    this.head('3.11  Layout geometry');

    var square = [[-123.09153,49.00399],[-123.08847,49.00399],
                  [-123.08847,49.00600],[-123.09153,49.00600],[-123.09153,49.00399]];
    var c = BCLayout.centroidOf(square);
    var loc  = BCLayout.toLocal(-123.0900, 49.0050, c);
    var back = BCLayout.toLonLat(loc.x, loc.y, c);
    this.eq('metric frame round-trips',
            BCLayout.metresBetween({ lon: -123.0900, lat: 49.0050 }, back) < 0.01, true);

    var rnd = BCLayout.rng(7), cand = [], i;
    for (i = 0; i < 3000; i++) cand.push(BCLayout.toLonLat((rnd() - 0.5) * 60, (rnd() - 0.5) * 60, c));
    var kept   = BCLayout.thin(cand, 10, 22);
    var before = BCLayout.minSeparation(cand.slice(0, 22));
    var after  = BCLayout.minSeparation(kept);
    this.eq('all 22 plots placed', kept.length, 22);
    this.eq('minimum spacing respected', after >= 10, true);
    this.eq('thinning changed the result', before < 10, true);

    var g = BCLayout.lattice(square, 22, 50000, CONFIG.SEED);
    this.near('grid spacing = sqrt(area/n)', g.spacingM, Math.sqrt(50000 / 22), 0.01);
    this.eq('grid offers at least the plots asked for', g.points.length >= 22, true);

    var big = [[-123.12, 48.98], [-123.06, 48.98], [-123.06, 49.03],
               [-123.12, 49.03], [-123.12, 48.98]];
    var empty = 0, sd;
    for (sd = 1; sd <= 40; sd++) { if (BCLayout.lattice(big, 1, 11480000, sd).points.length < 1) empty++; }
    this.eq('a sparse lattice is never empty (40 seeds)', empty, 0);

    // random subset: the root subsample and the grid trim
    var pick = BCLayout.pickIndices(20, 8, 42);
    this.eq('subset has the size asked for', pick.length, 8);
    var seen = {}, dupes = 0;
    for (i = 0; i < pick.length; i++) { if (seen[pick[i]]) dupes++; seen[pick[i]] = true; }
    this.eq('subset has no repeats', dupes, 0);
    this.eq('subset reproduces from the seed',
            JSON.stringify(BCLayout.pickIndices(20, 8, 42)) === JSON.stringify(pick), true);
    this.eq('a different seed gives a different subset',
            JSON.stringify(BCLayout.pickIndices(20, 8, 43)) !== JSON.stringify(pick), true);
    this.eq('asking for more than exist returns all', BCLayout.pickIndices(5, 9, 1).length, 5);

    // composite
    var centre = { lon: -123.09, lat: 49.005 };
    var subs = BCLayout.compositeSubsamples(centre, 5, 5, CONFIG.SEED);
    var far = 0, near = Infinity;
    for (i = 0; i < subs.length; i++) {
      var d = BCLayout.metresBetween(centre, subs[i]);
      far = Math.max(far, d); near = Math.min(near, d);
    }
    this.eq('5 subsamples generated', subs.length, 5);
    this.eq('subsamples stay inside the radius', far <= 5.01, true);
    this.eq('subsamples keep off the centre point', near >= 2.49, true);

    this.eq('same seed reproduces the grid',
      JSON.stringify(BCLayout.lattice(square, 22, 50000, 42)) ===
      JSON.stringify(BCLayout.lattice(square, 22, 50000, 42)), true);
    this.eq('a different seed does not',
      JSON.stringify(BCLayout.lattice(square, 22, 50000, 42)) !==
      JSON.stringify(BCLayout.lattice(square, 22, 50000, 43)), true);
  },

  // ---- runner ------------------------------------------------------------------
  run: function () {
    this.lines = []; this.passed = 0; this.failed = 0;

    this.say('GRASSLAND SAMPLING DESIGN TOOL — SELF TEST');
    this.say('version ' + CONFIG.VERSION +
             '   ·   reference: Grassland Carbon Workshop, Part 2 Appendix A, and grassland-sample-allocation.xlsx');

    this.testInverseNormal();
    this.testStudentT();
    this.testSensitivity();
    this.testPools();
    this.testAllocation();
    this.testAchieved();
    this.testPriors();
    this.testZones();
    this.testGeometry();
    this.testLayout();

    this.say('');
    this.say('-----------------------------------------------------------');
    this.say(this.failed === 0
      ? 'ALL ' + this.passed + ' CHECKS PASSED'
      : this.passed + ' passed, ' + this.failed + ' FAILED');
    this.say('-----------------------------------------------------------');

    LOG(this.lines.join('\n'));
    return { passed: this.passed, failed: this.failed };
  }
};


// =================================================================================
// === SECTION 5 — EARTH ENGINE LAYER ==============================================
// ===
// === Everything that touches Earth Engine. Holds no statistics and no thresholds
// === of its own — it asks Sections 1 and 2 for those, then does the spatial work.
// ===
// === Earth Engine is asynchronous: results arrive in callbacks, not return
// === values. Every method here takes a callback(result, error).
// =================================================================================

var BCEarth = {

  MAX_PIXELS: 1e10,
  MAX_ERROR: 1,
  TILE_SCALE: 4,
  EMBEDDING_YEAR: 2024,
  EMBEDDING_SCALE: 10,

  // --- Area ---------------------------------------------------------------------
  // Geodesic area from the geometry itself, not by counting pixels.

  areaOf: function (geometry, callback) {
    geometry.area({ maxError: this.MAX_ERROR }).evaluate(function (m2, err) {
      if (err || !m2) { callback(null, err || 'Could not measure that boundary.'); return; }
      callback({ areaM2: m2, areaHa: m2 / 10000, scale: BCGeom.analysisScale(m2) }, null);
    });
  },

  // --- Stratification: land cover -----------------------------------------------

  LANDCOVER: {
    dynamic: {
      collection: 'GOOGLE/DYNAMICWORLD/V1', band: 'label', scale: 10,
      labels: { 0: 'Water', 1: 'Trees', 2: 'Grass', 3: 'Flooded vegetation', 4: 'Crops',
                5: 'Shrub and scrub', 6: 'Built area', 7: 'Bare ground', 8: 'Snow and ice' }
    },
    copernicus: {
      image: 'COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019',
      band: 'discrete_classification', scale: 100,
      labels: { 20: 'Shrubland', 30: 'Herbaceous vegetation', 50: 'Urban', 60: 'Bare or sparse',
                80: 'Permanent water', 90: 'Herbaceous wetland', 200: 'Ocean' }
    }
  },

  landcoverImage: function (aoi, cfg) {
    return cfg.collection
      ? ee.ImageCollection(cfg.collection).filterBounds(aoi)
          .filterDate('2022-01-01', '2023-01-01').select(cfg.band).mode()
      : ee.Image(cfg.image).select(cfg.band);
  },

  landcoverClasses: function (aoi, sourceId, callback) {
    var cfg = this.LANDCOVER[sourceId];
    if (!cfg) { callback(null, 'Unknown land cover source: ' + sourceId); return; }

    var img = this.landcoverImage(aoi, cfg);
    img.rename('class').clip(aoi).reduceRegion({
      reducer: ee.Reducer.frequencyHistogram(), geometry: aoi,
      scale: cfg.scale, maxPixels: this.MAX_PIXELS, tileScale: this.TILE_SCALE
    }).evaluate(function (res, err) {
      if (err || !res || !res['class']) {
        callback(null, err || 'No land cover classes found inside this boundary.');
        return;
      }
      var out = [], code;
      for (code in res['class']) {
        if (res['class'].hasOwnProperty(code)) {
          out.push({ code: parseInt(code, 10), pixels: res['class'][code],
                     name: cfg.labels[code] || ('Class ' + code) });
        }
      }
      out.sort(function (a, b) { return b.pixels - a.pixels; });
      callback({ classes: out, image: img, scale: cfg.scale }, null);
    });
  },

  landcoverStrata: function (aoi, sourceId, selected, renames) {
    var cfg = this.LANDCOVER[sourceId];
    var img = this.landcoverImage(aoi, cfg);

    var from = [], to = [], zones = [], i;
    for (i = 0; i < selected.length; i++) {
      from.push(selected[i].code);
      to.push(i);
      zones.push({ code: i, sourceCode: selected[i].code,
                   name: (renames && renames[selected[i].code]) || selected[i].name });
    }

    var remapped = img.rename('c').remap(from, to, -999);
    return { image: remapped.updateMask(remapped.neq(-999)).rename('zone').clip(aoi),
             zones: zones };
  },

  // --- Stratification: unsupervised grouping ------------------------------------
  // Satellite Embeddings are the default for small sites: 64 bands at 10 m. Tiles
  // are served per UTM zone and a mosaic inherits a 1-degree default projection,
  // so the projection is set explicitly — without it the clusterer trains on
  // effectively one pixel. These groups reflect appearance, not management history.

  embeddingImage: function (aoi) {
    var y = this.EMBEDDING_YEAR;
    return ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')
      .filterDate(y + '-01-01', (y + 1) + '-01-01')
      .filterBounds(aoi)
      .mosaic()
      .setDefaultProjection('EPSG:4326', null, this.EMBEDDING_SCALE)
      .clip(aoi);
  },

  covariateStack: function (aoi) {
    var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(aoi).filterDate('2022-01-01', '2024-01-01')
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)).median()
      .select(['B2','B3','B4','B8','B11','B12'],
              ['blue','green','red','nir','swir1','swir2']);

    var ndvi = s2.normalizedDifference(['nir','red']).rename('ndvi');
    var ndwi = s2.normalizedDifference(['green','nir']).rename('ndwi');
    var dem  = ee.Image('USGS/SRTMGL1_003').rename('elevation');

    return s2.addBands([ndvi, ndwi, dem])
             .setDefaultProjection('EPSG:4326', null, 30).clip(aoi);
  },

  clusterStrata: function (aoi, sourceId, k, areaM2, callback) {
    var img   = (sourceId === 'embeddings') ? this.embeddingImage(aoi) : this.covariateStack(aoi);
    var scale = (sourceId === 'embeddings') ? this.EMBEDDING_SCALE : 30;

    // Training size follows the site, so a small block is not asked for more
    // pixels than it contains.
    var available = Math.floor(areaM2 / (scale * scale));
    var training  = Math.max(200, Math.min(5000, Math.floor(available * 0.5)));

    if (available < k * 20) {
      callback(null, 'This site holds about ' + available + ' pixels at ' + scale +
                     ' m — too few to separate ' + k + ' zones. Use fewer zones, or draw them.');
      return;
    }

    var sample = img.sample({ region: aoi, scale: scale, numPixels: training,
                              seed: CONFIG.SEED, geometries: false });

    sample.size().evaluate(function (n, err) {
      if (err || !n || n < k * 10) {
        callback(null, 'Only ' + (n || 0) + ' usable pixels were found. Try drawing the zones instead.');
        return;
      }
      var clusterer = ee.Clusterer.wekaKMeans({ nClusters: k, seed: CONFIG.SEED }).train(sample);
      var zones = [];
      for (var i = 0; i < k; i++) zones.push({ code: i, sourceCode: i, name: 'Zone ' + (i + 1) });
      callback({ image: img.cluster(clusterer).rename('zone').clip(aoi),
                 zones: zones, trainingPixels: n, scale: scale }, null);
    });
  },

  // --- Zone areas (raster zones) ------------------------------------------------

  zoneAreas: function (zoneImage, zones, aoi, scale, callback) {
    ee.Image.pixelArea().addBands(zoneImage.rename('zone')).reduceRegion({
      reducer: ee.Reducer.sum().group({ groupField: 1, groupName: 'zone' }),
      geometry: aoi, scale: scale, maxPixels: this.MAX_PIXELS, tileScale: this.TILE_SCALE
    }).evaluate(function (res, err) {
      if (err || !res || !res.groups || res.groups.length === 0) {
        callback(null, err || 'No zones were found inside the boundary.');
        return;
      }
      var out = [], i, j;
      for (i = 0; i < res.groups.length; i++) {
        var g = res.groups[i], name = 'Zone ' + g.zone;
        for (j = 0; j < zones.length; j++) { if (zones[j].code === g.zone) name = zones[j].name; }
        if (g.sum > 0) out.push({ code: g.zone, name: name, areaM2: g.sum });
      }
      out.sort(function (a, b) { return b.areaM2 - a.areaM2; });
      callback({ zones: out, scale: scale }, null);
    });
  },

  // --- Vector zones: drawn or uploaded, ONE OR MANY POLYGONS PER ZONE -------------
  // `features` is a list (or collection) of ee.Feature, each carrying a `zone`
  // name. All polygons that share a name are dissolved into ONE geometry per zone,
  // and the area is measured on that dissolved geometry, so:
  //   * no polygon is dropped,
  //   * a zone's area is the sum of all its polygons,
  //   * two overlapping polygons of the SAME zone are not counted twice.
  // (Polygons of DIFFERENT zones that overlap each other are not detected here.)

  zonesFromFeatures: function (features, callback) {
    var err_ = this.MAX_ERROR;
    var fc = ee.FeatureCollection(features);
    var names = ee.List(fc.aggregate_array('zone')).distinct();

    var merged = ee.FeatureCollection(names.map(function (nm) {
      var parts = fc.filter(ee.Filter.eq('zone', nm));
      var geom  = parts.geometry(err_).dissolve(err_);
      return ee.Feature(geom, { zone: nm, area_m2: geom.area(err_), parts: parts.size() });
    }));

    ee.Dictionary({ names: merged.aggregate_array('zone'),
                    areas: merged.aggregate_array('area_m2'),
                    parts: merged.aggregate_array('parts') })
      .evaluate(function (r, err) {
        if (err || !r || !r.names || r.names.length === 0) {
          callback(null, err || 'Those zones have no area.'); return;
        }
        var out = [], i;
        for (i = 0; i < r.names.length; i++) {
          if (r.areas[i] > 0) out.push({ code: i, name: String(r.names[i]),
                                         areaM2: r.areas[i], polygons: r.parts[i] });
        }
        if (out.length === 0) { callback(null, 'Those zones have no area.'); return; }
        callback({ zones: out, collection: merged }, null);
      });
  },

  // The dissolved geometry of one named zone, from the collection above.
  zoneGeometryByName: function (collection, name) {
    return ee.Feature(collection.filter(ee.Filter.eq('zone', name)).first()).geometry();
  },

  uploadedZones: function (assetId, field, aoi, callback) {
    var tagged;
    try {
      tagged = ee.FeatureCollection(assetId.trim()).filterBounds(aoi).map(function (f) {
        return ee.Feature(f.geometry(), { zone: ee.Algorithms.String(f.get(field)) });
      });
    } catch (e) { callback(null, 'Could not open that asset.'); return; }

    this.zonesFromFeatures(tagged, function (r, err) {
      if (err || !r) {
        callback(null, 'No features with a "' + field + '" value fell inside your site.');
        return;
      }
      callback(r, null);
    });
  },

  // A raster zone has to become a polygon before plots can be placed inside it.
  zoneGeometry: function (zoneImage, code, aoi, scale, callback) {
    var vec = zoneImage.eq(code).selfMask().reduceToVectors({
      geometry: aoi, scale: scale, geometryType: 'polygon',
      eightConnected: false, maxPixels: this.MAX_PIXELS, tileScale: this.TILE_SCALE
    });
    vec.size().evaluate(function (n, err) {
      if (err || !n) { callback(null, err || 'That zone has no mapped area.'); return; }
      callback(vec.union(1).geometry(), null);
    });
  }
};


// =================================================================================
// === SECTION 6B — PLACEMENT (Earth Engine wrappers) ==============================
// ===
// === COMPOSITE SAMPLES. The sample size n counts independent SAMPLES, i.e. lab
// === analyses. With the composite layout each such sample is one composite: k
// === subsample cores taken around a plot centre and pooled. So n composites are
// === placed, and the field team takes n x k cores. n is NOT divided by k.
// === The prior CV must describe variability between composites; a CV taken from
// === single cores overstates it, which errs on the side of more samples.
// === Compositing removes within-composite variation (Appendix A10): only choose
// === it if that is acceptable for any later monitoring.
// =================================================================================

var BCPlace = {

  OVERSAMPLE: 10,

  // coordinates() returns [lon, lat] for one point and [[lon, lat], ...] for many.
  asPoints: function (coords) {
    if (!coords || coords.length === 0) return [];
    if (typeof coords[0] === 'number') return [{ lon: coords[0], lat: coords[1] }];
    return coords.map(function (p) { return { lon: p[0], lat: p[1] }; });
  },

  // o: { geometry, areaM2, cores, layout, spacingM, zoneIndex,
  //      subsamples, compositeRadiusM }
  place: function (o, callback) {
    var self = this, R = o.compositeRadiusM;

    // Composite subsamples must stay inside the zone, so centres are placed in
    // the zone pulled in by the composite radius.
    if (o.layout === 'composite') {
      var shrunk = o.geometry.buffer(-R, BCEarth.MAX_ERROR);
      shrunk.area(BCEarth.MAX_ERROR).evaluate(function (a, err) {
        if (err || !(a > 0)) {
          callback(null, 'This zone is too small or narrow to keep composites ' + R +
                         ' m inside it. Reduce the composite radius, or merge the zone.');
          return;
        }
        self.run(o, shrunk, a, callback);
      });
      return;
    }
    self.run(o, o.geometry, o.areaM2, callback);
  },

  run: function (o, region, regionAreaM2, callback) {
    var self = this, spacing = o.spacingM, seed = CONFIG.SEED + (o.zoneIndex || 0);

    region.bounds(BCEarth.MAX_ERROR).coordinates().evaluate(function (ring, err) {
      if (err || !ring || !ring[0]) { callback(null, err || 'Could not read that zone.'); return; }

      // ---- even grid -----------------------------------------------------------
      if (o.layout === 'grid') {
        var built = BCLayout.lattice(ring[0], o.cores, regionAreaM2, seed);
        var fc = ee.FeatureCollection(built.points.map(function (p) {
          return ee.Feature(ee.Geometry.Point([p.lon, p.lat]));
        })).filterBounds(region);

        fc.geometry().coordinates().evaluate(function (inside, e2) {
          var cand = self.asPoints(inside);
          if (e2 || cand.length === 0) {
            callback(null, e2 || 'No grid positions fell inside this zone. Try the random layout.');
            return;
          }
          var kept = BCLayout.thin(cand, spacing, cand.length);
          var shortfall = null;
          if (kept.length > o.cores) {
            // Trim at random, not from one end of the lattice, which would leave
            // one side of the zone unsampled.
            var keep = BCLayout.pickIndices(kept.length, o.cores, seed);
            kept = keep.map(function (i) { return kept[i]; });
          } else if (kept.length < o.cores) {
            shortfall = 'Only ' + kept.length + ' of ' + o.cores + ' grid positions fit inside ' +
                        'this zone at ' + Math.round(spacing) + ' m spacing. Try the random layout.';
          }
          callback({ points: kept, layout: 'grid', requested: o.cores, placed: kept.length,
                     shortfall: shortfall, seed: seed,
                     minSeparationM: BCLayout.minSeparation(kept) }, null);
        });
        return;
      }

      // ---- random, and composite centres ---------------------------------------
      var over = Math.min(o.cores * self.OVERSAMPLE, 3000);

      ee.FeatureCollection.randomPoints({
        region: region, points: over, seed: seed, maxError: BCEarth.MAX_ERROR
      }).geometry().coordinates().evaluate(function (raw, e3) {
        var cand = self.asPoints(raw);
        if (e3 || cand.length === 0) {
          callback(null, e3 || 'Could not place points inside this zone.');
          return;
        }
        var kept = BCLayout.thin(cand, spacing, o.cores);
        var result = { points: kept, layout: o.layout, requested: o.cores, placed: kept.length,
                       seed: seed, minSeparationM: BCLayout.minSeparation(kept) };

        if (kept.length < o.cores) {
          result.shortfall = 'Only ' + kept.length + ' of ' + o.cores + ' plots fit while staying ' +
                             Math.round(spacing) + ' m apart. The zone is close to full.';
        }

        if (o.layout === 'composite') {
          var all = [], i, j;
          for (i = 0; i < kept.length; i++) {
            var subs = BCLayout.compositeSubsamples(kept[i], o.subsamples, o.compositeRadiusM, seed + i);
            for (j = 0; j < subs.length; j++) {
              all.push({ lon: subs[j].lon, lat: subs[j].lat, centre: i, subsample: j + 1 });
            }
          }
          result.subsamples = all;
        }
        callback(result, null);
      });
    });
  }
};


// =================================================================================
// === SECTION 7 — USER INTERFACE ==================================================
// ===
// === Steps matching Part 2 of the workshop. Plain language on the surface;
// === anything statistical sits behind a "Show the working" toggle.
// ===
// === The interface holds no arithmetic. It collects answers, calls Sections 1,
// === 2, 5 and 6, and displays what comes back.
// =================================================================================

var UI = {
  TITLE:   { fontSize: '22px', fontWeight: 'bold', color: '#2F5D2B', margin: '8px 8px 0 8px' },
  SUB:     { fontSize: '13px', color: '#5B6B70', margin: '0 8px 10px 8px' },
  STEP:    { fontSize: '15px', fontWeight: 'bold', color: '#2F5D2B', margin: '16px 8px 2px 8px' },
  ASK:     { fontSize: '13px', color: '#26343A', margin: '2px 8px 6px 8px' },
  HINT:    { fontSize: '11px', color: '#7A8B90', margin: '0 8px 6px 8px' },
  RESULT:  { fontSize: '20px', fontWeight: 'bold', color: '#2F5D2B', margin: '6px 8px' },
  NOTE:    { fontSize: '12px', color: '#26343A', margin: '2px 8px' },
  WARN:    { fontSize: '12px', color: '#B26A00', margin: '4px 8px' },
  ERROR:   { fontSize: '12px', color: '#B3261E', margin: '4px 8px' },
  OK:      { fontSize: '12px', color: '#3F7D3A', margin: '4px 8px' },
  LINK:    { fontSize: '12px', color: '#3F7D3A', margin: '2px 8px' },
  PANEL:   { width: '430px', border: '1px solid #D8E2E5' },
  BTN:     { stretch: 'horizontal', margin: '8px' },
  WIDE:    { stretch: 'horizontal', margin: '0 8px 4px 8px' },
  ZONE_COLOURS: ['#3F7D3A', '#C8763C', '#4C6E8C', '#8C5B8C', '#A8843C', '#5B8C8C']
};

var State = {
  aoi: null, areaM2: null, scale: null,
  priors: null,
  zoneMode: 'none', zoneImage: null, zones: null, zoneAreas: null,
  zoneKeep: {}, zoneGeoms: null, zoneCollection: null,
  drawn: BCZones.emptyStore(), draft: null, classWidgets: [],
  design: null, layout: 'random',
  placed: null, features: null,

  reset: function () {
    this.aoi = null; this.areaM2 = null; this.scale = null;
    this.priors = null; this.zoneMode = 'none'; this.zoneImage = null;
    this.zones = null; this.zoneAreas = null; this.zoneKeep = {};
    this.zoneGeoms = null; this.zoneCollection = null;
    this.drawn = BCZones.emptyStore(); this.draft = null; this.classWidgets = [];
    this.design = null; this.placed = null; this.features = null;
  }
};

ui.root.clear();
var map   = ui.Map();
var panel = ui.Panel({ style: UI.PANEL });
ui.root.add(ui.SplitPanel(panel, map, 'horizontal', false));
// Start over Canada; the user draws or loads the local AOI.
map.setCenter(-96, 56, 4);
map.setOptions('SATELLITE');

function label(t, s)  { return ui.Label(t, s); }
function clearPanel(p) { p.clear(); }
function plotFootprintM2() { return CONFIG.FOOTPRINTS[footprintSelect.getValue()].plotM2; }
function compositeRadius() { return radiusBox.getValue(); }
function currentSpacing() {
  return BCGeom.minSpacing(plotFootprintM2(),
                           State.layout === 'composite' ? compositeRadius() : 0);
}
function numberOf(box) { var v = parseFloat(box.getValue()); return isNaN(v) ? NaN : v; }

panel.add(label('Grassland Sampling Design', UI.TITLE));
panel.add(label('Turn a boundary and a precision target into a list of plot locations. ' +
                'Companion to Part 2 of the Grassland Carbon Workshop.', UI.SUB));

// --- STEP 1 · boundary ----------------------------------------------------------

panel.add(label('Step 1 · Where are you working?', UI.STEP));
panel.add(label('Draw your site on the map, or point at a boundary you have already saved.', UI.ASK));

var sourceSelect = ui.Select({
  items: ['Draw it on the map', 'Use a saved boundary'], value: 'Draw it on the map',
  style: UI.WIDE,
  onChange: function (v) { assetRow.style().set('shown', v === 'Use a saved boundary'); }
});
var assetBox = ui.Textbox({ placeholder: 'users/you/your_site', style: UI.WIDE });
var assetRow = ui.Panel([assetBox], null, { shown: false });
var areaOut  = ui.Panel();

panel.add(sourceSelect); panel.add(assetRow);
panel.add(ui.Button({ label: 'Measure this site', style: UI.BTN, onClick: measureSite }));
panel.add(areaOut);

// --- STEP 2 · zones -------------------------------------------------------------

panel.add(label('Step 2 · Is the site all one thing?', UI.STEP));
panel.add(label('If part of the site differs in restoration age, burn history, grazing or ' +
                'management, split it into zones now. A zone can be made of several ' +
                'separate polygons. Splitting by something that actually drives carbon ' +
                'gives a fairer allocation of plots.', UI.ASK));

var zoneSelect = ui.Select({ items: ['Measure the site first'], style: UI.WIDE,
                             onChange: chooseZoneMode });

// how many groups, for the automatic methods
var zoneCount = ui.Slider({ min: 2, max: 6, value: 3, step: 1, style: UI.WIDE });
var zoneCountRow = ui.Panel([label('How many groups should it look for?', UI.HINT), zoneCount],
                            null, { shown: false });

// drawing zones by hand
var zoneNameBox = ui.Textbox({ placeholder: 'Name this zone, e.g. Restored 2015', style: UI.WIDE });
var drawnList   = ui.Panel();
var drawRow = ui.Panel([
  label('1. Name the zone.  2. Draw ALL of its polygons on the map (as many as you like).  ' +
        '3. Press "Add". To add more polygons to a zone later, use the same name again.', UI.HINT),
  zoneNameBox,
  ui.Button({ label: 'Start drawing this zone', style: UI.BTN, onClick: startZoneDrawing }),
  ui.Button({ label: 'Add everything I just drew to this zone', style: UI.BTN, onClick: addDrawnZone }),
  drawnList
], null, { shown: false });

// zones from an uploaded asset
var zoneAssetBox = ui.Textbox({ placeholder: 'users/you/your_zones', style: UI.WIDE });
var zoneFieldBox = ui.Textbox({ placeholder: 'Which column holds the zone name?', style: UI.WIDE });
var uploadRow = ui.Panel([
  label('An asset with polygons and a column naming each. Polygons sharing a name are one zone.', UI.HINT),
  zoneAssetBox, zoneFieldBox
], null, { shown: false });

// land cover classes, chosen after they are read from the map
var classRow = ui.Panel(null, null, { shown: false });

var zoneOut     = ui.Panel();
var zoneChoices = ui.Panel();

panel.add(zoneSelect);
panel.add(zoneCountRow); panel.add(drawRow); panel.add(uploadRow); panel.add(classRow);
panel.add(ui.Button({ label: 'Build the zones', style: UI.BTN, onClick: buildZones }));
panel.add(zoneOut);
panel.add(zoneChoices);

// --- STEP 3 · what is being measured, and how variable it is --------------------

panel.add(label('Step 3 · What are you measuring?', UI.STEP));
panel.add(label('Soil and roots are sized separately, because roots are usually the more ' +
                'variable pool. Roots are washed from the same cores as the soil.', UI.ASK));

var footprintSelect = ui.Select({
  items: [{ label: CONFIG.FOOTPRINTS.shrubs.label, value: 'shrubs' },
          { label: CONFIG.FOOTPRINTS.trees.label,  value: 'trees' }],
  value: 'shrubs', style: UI.WIDE, onChange: function () { State.placed = null; recompute(); }
});
panel.add(label('Nested plot: sets how far apart plot centres must be.', UI.HINT));
panel.add(footprintSelect);

var rootsBox = ui.Checkbox({ label: 'Include roots (washed from the same cores)', value: true,
                             style: { margin: '4px 8px' },
                             onChange: function (v) { rootPriorRow.style().set('shown', v); State.placed = null; recompute(); } });
panel.add(rootsBox);

panel.add(label('How variable is each pool? There is no default. Use a pilot survey if you can, a ' +
                'published grassland with a comparable history, depth and method, or a soil map for ' +
                'scoping only. Enter a CV, or a mean and SD, AND say where it came from.', UI.ASK));

function priorBlock(title) {
  var b = {
    mean: ui.Textbox({ placeholder: 'Mean (any unit)', style: UI.WIDE }),
    sd:   ui.Textbox({ placeholder: 'Standard deviation between samples (same unit)', style: UI.WIDE }),
    cv:   ui.Textbox({ placeholder: 'OR a CV directly (overrides mean and SD)', style: UI.WIDE }),
    src:  ui.Textbox({ placeholder: 'Source: pilot / published study / soil map', style: UI.WIDE }),
    n:    ui.Textbox({ placeholder: 'Pilot samples behind it (optional)', style: UI.WIDE })
  };
  b.panel = ui.Panel([label(title, UI.NOTE), b.mean, b.sd, b.cv, b.src, b.n]);
  return b;
}
var soilPrior = priorBlock('Soil carbon prior');
var rootPrior = priorBlock('Root biomass prior');
var rootPriorRow = ui.Panel([rootPrior.panel], null, { shown: true });
var priorOut = ui.Panel();

panel.add(soilPrior.panel); panel.add(rootPriorRow);
panel.add(label('Use the same depth basis and sampling unit you will report. A prior from ' +
                '0–30 cm cores does not describe a full-profile stock.', UI.HINT));
panel.add(ui.Button({ label: 'Use these priors', style: UI.BTN, onClick: applyPriors }));
panel.add(priorOut);

// --- STEP 4 · precision ---------------------------------------------------------

panel.add(label('Step 4 · How precise do you need to be?', UI.STEP));
panel.add(label('Decide this before you see the answer, not after. Each pool has its own target.', UI.ASK));

var soilMoe = ui.Select({
  items: [{ label: 'Soil: within 10% — demanding', value: 0.10 },
          { label: 'Soil: within 20% — usual for a baseline survey', value: 0.20 },
          { label: 'Soil: within 30% — a first look', value: 0.30 }],
  value: CONFIG.MARGIN_SOIL, style: UI.WIDE, onChange: recompute
});
var rootMoe = ui.Select({
  items: [{ label: 'Roots: within 20%', value: 0.20 },
          { label: 'Roots: within 30%', value: 0.30 },
          { label: 'Roots: within 40% — a wider, stated target is usual', value: 0.40 },
          { label: 'Roots: within 50%', value: 0.50 }],
  value: CONFIG.MARGIN_ROOT, style: UI.WIDE, onChange: recompute
});
var confSelect = ui.Select({
  items: [{ label: '80% sure', value: 0.80 },
          { label: '90% sure — usual', value: 0.90 },
          { label: '95% sure', value: 0.95 }],
  value: CONFIG.CONFIDENCE, style: UI.WIDE, onChange: recompute
});
var minSelect = ui.Select({
  items: [{ label: 'At least 3 plots per zone (statistical minimum)', value: 3 },
          { label: 'At least 5 plots per zone (preferred where feasible)', value: 5 }],
  value: CONFIG.MIN_PLOTS_PER_ZONE, style: UI.WIDE, onChange: recompute
});
var designOut = ui.Panel();
var mathPanel = ui.Panel(null, null, { shown: false });
var mathToggle = ui.Checkbox({
  label: 'Show the working', value: false, style: { margin: '4px 8px' },
  onChange: function (v) { mathPanel.style().set('shown', v); }
});

panel.add(soilMoe); panel.add(rootMoe); panel.add(confSelect);
panel.add(label('Operational minimum (the series-wide rule is still to be confirmed):', UI.HINT));
panel.add(minSelect);
panel.add(designOut); panel.add(mathToggle); panel.add(mathPanel);

// --- STEP 5 · layout ------------------------------------------------------------

panel.add(label('Step 5 · Where do the plots go?', UI.STEP));

var layoutSelect = ui.Select({
  items: BCLayout.LAYOUTS.map(function (l) { return { label: l.label, value: l.id }; }),
  value: 'random', style: UI.WIDE,
  onChange: function (v) {
    State.layout = v; State.placed = null;
    compositeRow.style().set('shown', v === 'composite');
    var blurb = '';
    for (var i = 0; i < BCLayout.LAYOUTS.length; i++) {
      if (BCLayout.LAYOUTS[i].id === v) blurb = BCLayout.LAYOUTS[i].blurb;
    }
    layoutHint.setValue(blurb);
    recompute();
  }
});
var layoutHint  = label(BCLayout.LAYOUTS[0].blurb, UI.HINT);
var subsampleBox = ui.Slider({ min: 3, max: 10, value: CONFIG.COMPOSITE_SUBSAMPLES, step: 1, style: UI.WIDE,
                                onChange: function () { if (State.layout === 'composite') recompute(); } });
var radiusBox    = ui.Slider({ min: 2, max: 20, value: CONFIG.COMPOSITE_RADIUS_M, step: 1, style: UI.WIDE,
                               onChange: function () { if (State.layout === 'composite') recompute(); } });
var compositeRow = ui.Panel([
  label('Subsample cores pooled into each composite:', UI.HINT), subsampleBox,
  label('Composite radius, metres (subsamples fall within this of the centre):', UI.HINT), radiusBox,
  label('The number of composites comes from Step 4. Each is made of the cores above. ' +
        'Use a prior that describes variability between composites.', UI.HINT)
], null, { shown: false });
var placeOut = ui.Panel();

panel.add(layoutSelect); panel.add(layoutHint);
panel.add(compositeRow);
panel.add(ui.Button({ label: 'Place the plots', style: UI.BTN, onClick: placeCores }));
panel.add(placeOut);

// --- STEP 6 · export ------------------------------------------------------------

panel.add(label('Step 6 · Take it to the field', UI.STEP));
var formatSelect = ui.Select({ items: ['CSV', 'GeoJSON', 'KML', 'SHP'], value: 'CSV', style: UI.WIDE });
var exportOut = ui.Panel();
var methodsOut = ui.Panel();

panel.add(formatSelect);
panel.add(ui.Button({ label: 'Download plot locations', style: UI.BTN, onClick: exportCores }));
panel.add(exportOut);
panel.add(label('Methods paragraph — paste this into your report:', UI.HINT));
panel.add(methodsOut);

// --- resources ------------------------------------------------------------------

panel.add(label('Workshop materials', UI.STEP));
[['Planning guide (Part 2)', 'planningGuide'],
 ['Sample allocation workbook', 'calculator'],
 ['The maths behind this (Appendix A)', 'appendixA'],
 ['Vegetation field guide', 'vegGuide'],
 ['Tree field guide (trees taller than 2 m)', 'treesGuide'],
 ['Soil field guide', 'soilGuide'],
 ['Laboratory guide', 'labGuide'],
 ['Field datasheets', 'datasheets'],
 ['Worked example', 'workedExample']].forEach(function (r) {
  var l = ui.Label(r[0], UI.LINK);
  l.setUrl(CONFIG.linkTo(r[1]));
  panel.add(l);
});

panel.add(ui.Button({
  label: 'Start over', style: { stretch: 'horizontal', margin: '16px 8px' },
  onClick: function () {
    State.reset(); map.layers().reset(); map.drawingTools().clear();
    [areaOut, priorOut, zoneOut, zoneChoices, designOut, mathPanel, placeOut, exportOut,
     methodsOut, drawnList, classRow].forEach(clearPanel);
    zoneSelect.items().reset(['Measure the site first']);
  }
}));

var tools = map.drawingTools();
tools.setShown(true); tools.setDrawModes(['polygon', 'rectangle']); tools.setShape('polygon');


// =================================================================================
// === SECTION 7B — BEHAVIOUR ======================================================
// =================================================================================

function getBoundary() {
  if (sourceSelect.getValue() === 'Draw it on the map') {
    var layers = map.drawingTools().layers();
    if (layers.length() === 0 || layers.get(0).geometries().length() === 0) return null;
    return layers.get(0).toGeometry();
  }
  var id = assetBox.getValue();
  if (!id) return null;
  return ee.FeatureCollection(id.trim()).geometry();
}

function measureSite() {
  clearPanel(areaOut);
  State.aoi = getBoundary();
  if (!State.aoi) {
    areaOut.add(label('Draw a polygon on the map first, or enter a saved boundary.', UI.ERROR));
    return;
  }
  areaOut.add(label('Measuring…', UI.NOTE));
  map.layers().reset();
  map.centerObject(State.aoi, 15);
  map.addLayer(State.aoi, { color: 'FFFFFF' }, 'Site boundary');

  BCEarth.areaOf(State.aoi, function (r, err) {
    clearPanel(areaOut);
    if (err) { areaOut.add(label('Could not measure that: ' + err, UI.ERROR)); return; }

    State.areaM2 = r.areaM2;
    State.scale  = r.scale.scale;
    areaOut.add(label(r.areaHa.toFixed(2) + ' hectares  ·  room for about ' +
                      BCGeom.capacity(r.areaM2, currentSpacing()) +
                      ' plots at ' + Math.round(currentSpacing()) + ' m spacing', UI.OK));

    var opts = BCGeom.stratificationOptions(r.areaM2),
        items = [{ label: 'No — treat it as one area', value: 'none' }], i;
    for (i = 0; i < opts.length; i++) {
      if (opts[i].available) items.push({ label: opts[i].label, value: opts[i].id });
    }
    zoneSelect.items().reset(items);
    zoneSelect.setValue('none');

    var hidden = [];
    for (i = 0; i < opts.length; i++) { if (!opts[i].available) hidden.push(opts[i].label); }
    if (hidden.length > 0) {
      areaOut.add(label('Too coarse for a site this size, so not offered: ' +
                        hidden.join('; ') + '.', UI.HINT));
    }
    recompute();
  });
}

// --- priors ---------------------------------------------------------------------

function readPrior(b, pool) {
  return BCStats.priorFromInputs({
    pool: pool, mean: numberOf(b.mean), sd: numberOf(b.sd), cv: numberOf(b.cv),
    source: b.src.getValue(), pilotN: numberOf(b.n) });
}

function applyPriors() {
  clearPanel(priorOut);
  var soil = readPrior(soilPrior, 'Soil'), root = null, ok = true;
  if (!soil.ok) { priorOut.add(label('Soil: ' + soil.reason, UI.ERROR)); ok = false; }
  if (rootsBox.getValue()) {
    root = readPrior(rootPrior, 'Roots');
    if (!root.ok) { priorOut.add(label('Roots: ' + root.reason, UI.ERROR)); ok = false; }
  }
  if (!ok) { State.priors = null; recompute(); return; }

  State.priors = { Soil: soil, Roots: root };
  [soil, root].forEach(function (p) {
    if (!p) return;
    priorOut.add(label(p.pool + ': CV ' + p.cv.toFixed(2) + ' (' + p.how + '). Source: ' + p.source + '.', UI.OK));
    if (p.note) priorOut.add(label(p.pool + ': ' + p.note, UI.WARN));
    if (p.lowVariability) {
      priorOut.add(label(p.pool + ': that is unusually even for field data. Check the SD is between ' +
                         'samples, not a standard error.', UI.WARN));
    }
    if (p.highVariability) {
      priorOut.add(label(p.pool + ': carbon varies a lot between samples here, so the campaign will be ' +
                         'unusually large. A short pilot would likely save effort.', UI.WARN));
    }
  });
  recompute();
}

// --- zones ----------------------------------------------------------------------

function chooseZoneMode(v) {
  State.zoneMode = v;
  clearPanel(zoneOut); clearPanel(zoneChoices); clearPanel(classRow);
  zoneCountRow.style().set('shown', v === 'embeddings' || v === 'covariates');
  drawRow.style().set('shown',      v === 'draw');
  uploadRow.style().set('shown',    v === 'upload');
  classRow.style().set('shown',     v === 'dynamic' || v === 'copernicus');
  if (v === 'draw') listDrawnZones();
  if (v === 'dynamic' || v === 'copernicus') loadLandcoverClasses();
}

// --- drawing zones by hand ------------------------------------------------------

function zoneDraft() {
  var dt = map.drawingTools();
  if (!State.draft) {
    State.draft = ui.Map.GeometryLayer({ geometries: [], name: 'New zone', color: 'C8763C' });
    dt.layers().add(State.draft);
  }
  dt.setSelected(State.draft);
  return State.draft;
}

function startZoneDrawing() {
  clearPanel(zoneOut);
  if (!zoneNameBox.getValue()) {
    zoneOut.add(label('Give the zone a name first, so the export can identify it.', UI.ERROR));
    return;
  }
  var dt = map.drawingTools();
  zoneDraft().geometries().reset([]);
  dt.setShape('polygon');
  dt.draw();
  zoneOut.add(label('Drawing. Click to place corners and double-click to close each polygon. ' +
                    'You can keep drawing more polygons for this zone. When you have drawn them ' +
                    'all, press "Add everything I just drew".', UI.NOTE));
}

function addDrawnZone() {
  clearPanel(zoneOut);
  var name = (zoneNameBox.getValue() || '').replace(/^\s+|\s+$/g, '');
  if (!name) { zoneOut.add(label('Give the zone a name first.', UI.ERROR)); return; }

  var draft = zoneDraft();
  // Every shape in the layer, not just the first one.
  var shapes = BCZones.collectAll(draft.geometries());
  if (shapes.length === 0) {
    zoneOut.add(label('Nothing drawn yet. Press "Start drawing this zone" first.', UI.ERROR));
    return;
  }
  BCZones.add(State.drawn, name, shapes);

  var colour = UI.ZONE_COLOURS[(State.drawn.order.indexOf(name)) % UI.ZONE_COLOURS.length];
  map.addLayer(ee.FeatureCollection(shapes.map(function (g) { return ee.Feature(g); }))
                 .style({ color: colour, fillColor: colour + '55', width: 2 }),
               {}, 'Zone: ' + name);

  draft.geometries().reset([]);
  map.drawingTools().stop();
  zoneNameBox.setValue('');
  listDrawnZones();
  zoneOut.add(label('Added ' + shapes.length + ' polygon' + (shapes.length === 1 ? '' : 's') +
                    ' to "' + name + '" (' + State.drawn.byName[name].length + ' in total). ' +
                    'Name and draw the next zone, or press "Build the zones".', UI.OK));
}

function listDrawnZones() {
  clearPanel(drawnList);
  var order = State.drawn.order, i;
  if (order.length === 0) { drawnList.add(label('No zones drawn yet.', UI.HINT)); return; }
  for (i = 0; i < order.length; i++) {
    var n = State.drawn.byName[order[i]].length;
    drawnList.add(label(order[i] + ': ' + n + ' polygon' + (n === 1 ? '' : 's'), UI.OK));
  }
  drawnList.add(ui.Button({
    label: 'Clear the drawn zones', style: { stretch: 'horizontal', margin: '4px 8px' },
    onClick: function () {
      State.drawn = BCZones.emptyStore(); State.zoneAreas = null; State.zoneGeoms = null;
      State.zoneCollection = null;
      map.layers().reset();
      if (State.aoi) map.addLayer(State.aoi, { color: 'FFFFFF' }, 'Site boundary');
      listDrawnZones(); clearPanel(zoneChoices); recompute();
    }
  }));
}

// --- land cover classes ---------------------------------------------------------

function loadLandcoverClasses() {
  clearPanel(classRow);
  if (!State.aoi) { classRow.add(label('Measure the site first.', UI.ERROR)); return; }
  classRow.add(label('Reading the land cover map…', UI.NOTE));

  BCEarth.landcoverClasses(State.aoi, State.zoneMode, function (r, err) {
    clearPanel(classRow);
    if (err) { classRow.add(label(err, UI.ERROR)); return; }

    State.classWidgets = [];
    classRow.add(label('Found ' + r.classes.length + ' cover types inside your site. ' +
                       'Tick the ones to keep as zones, and rename them if you like.', UI.HINT));
    for (var i = 0; i < r.classes.length; i++) {
      var cls = r.classes[i];
      var box = ui.Checkbox({ label: cls.name + '  (' + cls.pixels + ' px)', value: true,
                              style: { margin: '2px 8px' } });
      var ren = ui.Textbox({ placeholder: 'Rename (optional)',
                             style: { stretch: 'horizontal', margin: '0 8px 4px 8px' } });
      classRow.add(box); classRow.add(ren);
      State.classWidgets.push({ box: box, rename: ren, cls: cls });
    }
  });
}

// --- build ----------------------------------------------------------------------

function buildZones() {
  clearPanel(zoneOut); clearPanel(zoneChoices);
  if (!State.aoi || !State.areaM2) {
    zoneOut.add(label('Measure the site first.', UI.ERROR)); return;
  }
  State.zoneGeoms = null; State.zoneCollection = null; State.placed = null;

  if (State.zoneMode === 'none') {
    State.zones = null; State.zoneAreas = null; State.zoneImage = null;
    zoneOut.add(label('Treating the whole site as one area.', UI.OK));
    recompute();
    return;
  }

  if (State.zoneMode === 'draw') {
    if (BCZones.polygonCount(State.drawn) === 0) {
      zoneOut.add(label('Draw at least one zone first.', UI.ERROR)); return;
    }
    zoneOut.add(label('Measuring your zones…', UI.NOTE));
    var feats = BCZones.flatten(State.drawn).map(function (p) {
      return ee.Feature(p.geometry, { zone: p.name });
    });
    BCEarth.zonesFromFeatures(feats, function (r, err) {
      clearPanel(zoneOut);
      if (err) { zoneOut.add(label(err, UI.ERROR)); return; }
      useVectorZones(r);
    });
    return;
  }

  if (State.zoneMode === 'upload') {
    var asset = zoneAssetBox.getValue(), field = zoneFieldBox.getValue();
    if (!asset || !field) {
      zoneOut.add(label('Give both the asset path and the column that names each zone.', UI.ERROR));
      return;
    }
    zoneOut.add(label('Loading your zones…', UI.NOTE));
    BCEarth.uploadedZones(asset, field, State.aoi, function (r, err) {
      clearPanel(zoneOut);
      if (err) { zoneOut.add(label(err, UI.ERROR)); return; }
      map.addLayer(r.collection.style({ color: 'C8763C', fillColor: 'C8763C55', width: 2 }),
                   {}, 'Zones');
      useVectorZones(r);
    });
    return;
  }

  if (State.zoneMode === 'dynamic' || State.zoneMode === 'copernicus') {
    var picked = [], renames = {}, w;
    for (var j = 0; j < (State.classWidgets || []).length; j++) {
      w = State.classWidgets[j];
      if (w.box.getValue()) {
        picked.push(w.cls);
        if (w.rename.getValue()) renames[w.cls.code] = w.rename.getValue();
      }
    }
    if (picked.length === 0) {
      zoneOut.add(label('Tick at least one cover type to use as a zone.', UI.ERROR)); return;
    }
    var built = BCEarth.landcoverStrata(State.aoi, State.zoneMode, picked, renames);
    State.zoneImage = built.image;
    map.addLayer(built.image, { min: 0, max: Math.max(1, built.zones.length - 1),
                                palette: UI.ZONE_COLOURS }, 'Zones');
    zoneOut.add(label('Measuring each cover type…', UI.NOTE));
    BCEarth.zoneAreas(built.image, built.zones, State.aoi, State.scale, function (z, err) {
      clearPanel(zoneOut);
      if (err) { zoneOut.add(label(err, UI.ERROR)); return; }
      finishZones(z.zones);
    });
    return;
  }

  // embeddings or satellite covariates
  zoneOut.add(label('Grouping the site…', UI.NOTE));
  BCEarth.clusterStrata(State.aoi, State.zoneMode, zoneCount.getValue(), State.areaM2,
    function (c, err) {
      clearPanel(zoneOut);
      if (err) { zoneOut.add(label(err, UI.ERROR)); return; }
      State.zoneImage = c.image;
      map.addLayer(c.image, { min: 0, max: c.zones.length - 1, palette: UI.ZONE_COLOURS },
                   'Zones');
      BCEarth.zoneAreas(c.image, c.zones, State.aoi, State.scale, function (z, e2) {
        if (e2) { zoneOut.add(label(e2, UI.ERROR)); return; }
        finishZones(z.zones);
      });
    });
}

// Drawn and uploaded zones arrive as one dissolved geometry per named zone.
function useVectorZones(r) {
  State.zoneCollection = r.collection;
  State.zoneGeoms = {};
  for (var i = 0; i < r.zones.length; i++) {
    State.zoneGeoms[r.zones[i].name] = BCEarth.zoneGeometryByName(r.collection, r.zones[i].name);
  }
  finishZones(r.zones);
}

// --- what came back, and which of it to sample ----------------------------------

function finishZones(zones) {
  State.zoneAreas = zones;
  State.zoneKeep = {};

  var sum = 0, i;
  for (i = 0; i < zones.length; i++) sum += zones[i].areaM2;
  if (sum / State.areaM2 < 0.95) {
    zoneOut.add(label('Zones cover ' + Math.round(100 * sum / State.areaM2) +
                      '% of the boundary. The rest was not classified and will not ' +
                      'be sampled.', UI.WARN));
  } else if (sum / State.areaM2 > 1.05) {
    zoneOut.add(label('Zones add up to ' + Math.round(100 * sum / State.areaM2) +
                      '% of the boundary. Some zones overlap each other or extend outside ' +
                      'the site, which would distort the allocation. Check them on the map.', UI.WARN));
  }
  for (i = 0; i < zones.length; i++) {
    if (zones[i].polygons > 1) {
      zoneOut.add(label(zones[i].name + ': ' + zones[i].polygons + ' polygons, ' +
                        (zones[i].areaM2 / 10000).toFixed(2) + ' ha in total.', UI.HINT));
    }
  }
  renderZoneChoices();
  recompute();
}

function renderZoneChoices() {
  clearPanel(zoneChoices);
  if (!State.zoneAreas) return;

  zoneChoices.add(label('Which zones do you want to sample?', UI.ASK));
  zoneChoices.add(label('Untick anything you are not sampling — water, roads, bare ground, ' +
                        'or cropland. Plots are only shared out among the zones you keep, and ' +
                        'the area of the rest drops out of the calculation.', UI.HINT));

  var i;
  for (i = 0; i < State.zoneAreas.length; i++) {
    (function (z) {
      State.zoneKeep[z.name] = true;
      zoneChoices.add(ui.Checkbox({
        label: z.name + ' — ' + (z.areaM2 / 10000).toFixed(2) + ' ha',
        value: true, style: { margin: '2px 8px' },
        onChange: function (v) { State.zoneKeep[z.name] = v; State.placed = null; recompute(); }
      }));
    })(State.zoneAreas[i]);
  }
}

function keptZones() {
  if (!State.zoneAreas) return null;
  var out = [], i;
  for (i = 0; i < State.zoneAreas.length; i++) {
    if (State.zoneKeep[State.zoneAreas[i].name]) out.push(State.zoneAreas[i]);
  }
  return out;
}

// --- the design -----------------------------------------------------------------

function recompute() {
  clearPanel(designOut); clearPanel(mathPanel);
  State.design = null;
  if (!State.areaM2) return;

  var withRoots = rootsBox.getValue();
  if (!State.priors || !State.priors.Soil || (withRoots && !State.priors.Roots)) {
    designOut.add(label('Enter the prior for each pool and its source in Step 3, then press ' +
                        '"Use these priors". Nothing is calculated without one.', UI.HINT));
    return;
  }

  var conf = confSelect.getValue(), minPer = minSelect.getValue();
  var Es = soilMoe.getValue(), Er = rootMoe.getValue(), i;

  var kept = keptZones();
  if (kept && kept.length === 0) {
    designOut.add(label('Every zone is unticked, so there is nothing to sample.', UI.ERROR));
    return;
  }
  var strata = (kept && kept.length > 0)
    ? kept.map(function (k) { return { name: k.name, areaM2: k.areaM2 }; })
    : [{ name: 'Whole site', areaM2: State.areaM2 }];

  var soilN = BCStats.sampleSize({ cv: State.priors.Soil.cv, marginOfError: Es, confidence: conf });
  var rootN = withRoots
    ? BCStats.sampleSize({ cv: State.priors.Roots.cv, marginOfError: Er, confidence: conf }) : null;
  if (!soilN.ok || (rootN && !rootN.ok)) {
    designOut.add(label((soilN.ok ? rootN.reason : soilN.reason), UI.ERROR)); return;
  }

  var soilAlloc = BCStats.allocate({ n: soilN.n, strata: strata, minPerStratum: minPer });
  var rootAlloc = rootN ? BCStats.allocate({ n: rootN.n, strata: strata, minPerStratum: minPer }) : null;

  // Roots come out of the same cores, so each zone needs the larger of the two.
  var design = { strata: [], soil: soilN, root: rootN, minPer: minPer, confidence: conf,
                 marginSoil: Es, marginRoot: withRoots ? Er : null,
                 composite: State.layout === 'composite',
                 subsamples: subsampleBox.getValue(), radiusM: compositeRadius(),
                 spacingM: currentSpacing(), plotM2: plotFootprintM2() };
  var centres = 0, soilTotal = 0, rootTotal = 0;
  for (i = 0; i < strata.length; i++) {
    var sc = soilAlloc.strata[i], rc = rootAlloc ? rootAlloc.strata[i] : null;
    var c  = Math.max(sc.cores, rc ? rc.cores : 0);
    design.strata.push({ name: strata[i].name, areaM2: strata[i].areaM2, soilSamples: sc.cores,
                         rootSamples: rc ? rc.cores : 0, cores: c,
                         flooredToMinimum: sc.flooredToMinimum || (rc ? rc.flooredToMinimum : false) });
    centres += c; soilTotal += sc.cores; rootTotal += rc ? rc.cores : 0;
  }
  design.centres = centres; design.soilSamples = centres; design.rootSamples = rootTotal;
  State.design = design;

  // --- what to show: each unit on its own line, never one merged "count" ---------
  var unit = design.composite ? 'composite samples' : 'plot centres';
  designOut.add(label(centres + ' ' + unit, UI.RESULT));
  designOut.add(label('to know each pool\'s mean within its target, ' + Math.round(conf * 100) +
                      '% of the time.', UI.NOTE));
  designOut.add(label('Soil samples: ' + centres + '   ·   Root samples: ' +
                      (withRoots ? rootTotal : 'not measured') +
                      (design.composite ? '   ·   Subsample cores in the field: ' +
                        (centres * design.subsamples) : ''), UI.NOTE));
  designOut.add(label('Soil alone needs ' + soilTotal + '; roots alone need ' + (withRoots ? rootTotal : 0) +
                      '. Roots are washed from the same cores, so the plot count is the larger in each zone.',
                      UI.HINT));
  if (withRoots && rootTotal < centres) {
    designOut.add(label('Roots will be washed from a RANDOM subset of ' + rootTotal + ' of the ' + centres +
                        ' samples. The tool marks that subset in the export; pick it before looking at the cores.',
                        UI.HINT));
  }
  if (centres < BCStats.MIN_USABLE_SAMPLES) {
    designOut.add(label('Only ' + centres + ' samples in total. With so few the standard deviation is ' +
                        'very poorly estimated, and the precision you achieve will be hard to check.', UI.WARN));
  }

  if (design.strata.length > 1 || design.strata[0].name !== 'Whole site') {
    for (i = 0; i < design.strata.length; i++) {
      var s = design.strata[i];
      designOut.add(label('   ' + s.name + ': ' + s.cores + ' (soil ' + s.soilSamples +
                          (withRoots ? ', roots ' + s.rootSamples : '') + ')' +
                          (s.flooredToMinimum ? '  (raised to the ' + minPer + '-per-zone minimum)' : ''),
                          UI.NOTE));
    }
  }

  // feasibility
  var f = BCGeom.feasibility({ spacingM: design.spacingM, minPerStratum: minPer,
                               strata: design.strata.map(function (s) {
                                 return { name: s.name, areaM2: s.areaM2, cores: s.cores }; }) });
  for (i = 0; i < f.problems.length; i++) designOut.add(label(f.problems[i], UI.ERROR));
  for (i = 0; i < f.warnings.length; i++) designOut.add(label(f.warnings[i], UI.WARN));

  // what a different soil precision target would cost
  var alt = [0.10, 0.20, 0.30], line = [];
  for (i = 0; i < alt.length; i++) {
    var a = BCStats.sampleSize({ cv: State.priors.Soil.cv, marginOfError: alt[i], confidence: conf });
    if (a.ok) line.push('±' + Math.round(alt[i] * 100) + '% needs ' + a.n);
  }
  designOut.add(label('For soil, for comparison: ' + line.join(', ') + '.', UI.HINT));

  // the working
  mathPanel.add(label('Step 1 — the planning value, with the normal multiplier z:', UI.HINT));
  mathPanel.add(label('n = ( z · CV / E )²', UI.NOTE));
  mathPanel.add(label('Step 2 — the small-sample adjustment. The interval you report uses Student\'s t on ' +
                      'n−1 degrees of freedom, which is larger, so n is recomputed with t until it stops ' +
                      'moving:', UI.HINT));
  mathPanel.add(label('n = ( t(n−1) · CV / E )²', UI.NOTE));
  mathPanel.add(label('Soil:  CV ' + soilN.cv.toFixed(2) + '   E ' + Es + '   z-only n = ' + soilN.nZ +
                      '   t-adjusted n = ' + soilN.n, UI.NOTE));
  if (rootN) {
    mathPanel.add(label('Roots:  CV ' + rootN.cv.toFixed(2) + '   E ' + Er + '   z-only n = ' + rootN.nZ +
                        '   t-adjusted n = ' + rootN.n, UI.NOTE));
  }
  mathPanel.add(label('No finite-population correction is applied: what counts as a possible sampling ' +
                      'unit for a core is not yet settled (Appendix A3). This matches the workbook and is ' +
                      'the conservative choice.', UI.HINT));
  mathPanel.add(label('Plots are shared out in proportion to zone area, rounded up, then raised to the ' +
                      'per-zone minimum. Both push the total above n.', UI.HINT));
  var a1 = ui.Label('Full derivation — Appendix A', UI.LINK);
  a1.setUrl(CONFIG.linkTo('appendixA'));
  mathPanel.add(a1);
}

// --- placement ------------------------------------------------------------------

function placeCores() {
  clearPanel(placeOut);
  if (!State.design) { placeOut.add(label('Work through Steps 1 to 4 first.', UI.ERROR)); return; }
  var d = State.design;

  var f = BCGeom.feasibility({ spacingM: d.spacingM, minPerStratum: d.minPer,
                               strata: d.strata.map(function (s) {
                                 return { name: s.name, areaM2: s.areaM2, cores: s.cores }; }) });
  if (!f.ok) {
    placeOut.add(label('This design cannot be placed yet:', UI.ERROR));
    f.problems.forEach(function (p) { placeOut.add(label(p, UI.ERROR)); });
    return;
  }

  var common = { layout: State.layout, spacingM: d.spacingM,
                 subsamples: d.subsamples, compositeRadiusM: d.radiusM };
  var kept = keptZones();
  var results = [], idx = 0;

  placeOut.add(label('Placing plots' + (d.strata.length > 1 ? ' zone by zone' : '') + '…', UI.NOTE));

  function next() {
    if (idx >= d.strata.length) { clearPanel(placeOut); finishPlacement(results); return; }
    var st = d.strata[idx], zoneRecord = null, i;
    if (kept) { for (i = 0; i < kept.length; i++) { if (kept[i].name === st.name) zoneRecord = kept[i]; } }

    withZoneGeometry(zoneRecord, State.aoi, function (g, gErr) {
      if (gErr) { results.push({ zone: st.name, error: gErr }); idx++; next(); return; }
      var o = { geometry: g, areaM2: st.areaM2, cores: st.cores, zoneIndex: idx };
      for (var k in common) { if (common.hasOwnProperty(k)) o[k] = common[k]; }
      BCPlace.place(o, function (r, err) {
        results.push(err ? { zone: st.name, error: err } : { zone: st.name, result: r, stratum: st });
        idx++; next();
      });
    });
  }
  next();
}

// Drawn and uploaded zones already have a (multi-)polygon. A zone that came out of
// a raster has to be converted to one first, which is a round trip, so it is done
// once per zone and only when plots are actually being placed.
function withZoneGeometry(zoneRecord, fallback, callback) {
  if (!zoneRecord) { callback(fallback, null); return; }
  if (State.zoneGeoms && State.zoneGeoms[zoneRecord.name]) {
    callback(State.zoneGeoms[zoneRecord.name], null); return;
  }
  if (!State.zoneImage) { callback(fallback, null); return; }

  BCEarth.zoneGeometry(State.zoneImage, zoneRecord.code, State.aoi, State.scale,
    function (g, err) {
      if (err || !g) { callback(null, 'Could not outline ' + zoneRecord.name + ': ' + err); return; }
      State.zoneGeoms = State.zoneGeoms || {};
      State.zoneGeoms[zoneRecord.name] = g;
      callback(g, null);
    });
}

function finishPlacement(results) {
  clearPanel(placeOut);
  var d = State.design, rows = [], totalPlaced = 0, worst = Infinity, counter = 0, i, j;

  for (i = 0; i < results.length; i++) {
    var r = results[i];
    if (r.error) { placeOut.add(label(r.zone + ': ' + r.error, UI.ERROR)); continue; }
    var res = r.result, st = r.stratum;
    if (!res.points || res.points.length === 0) {
      placeOut.add(label(r.zone + ': no positions were produced.', UI.ERROR)); continue;
    }

    // which centres are washed for roots: a seeded random subset, chosen now, before
    // anyone looks at a core
    var rootIdx = {};
    BCLayout.pickIndices(res.points.length, Math.min(st.rootSamples, res.points.length),
                         CONFIG.SEED + 1000 + i).forEach(function (k) { rootIdx[k] = true; });

    for (j = 0; j < res.points.length; j++) {
      counter += 1;
      var pid = 'P_' + (counter < 10 ? '00' : (counter < 100 ? '0' : '')) + counter;
      rows.push({ lon: res.points[j].lon, lat: res.points[j].lat, plot_id: pid,
                  point_type: d.composite ? 'composite_centre' : 'plot_centre',
                  zone: r.zone, layout: res.layout, seed: res.seed,
                  composite_id: d.composite ? pid : '', subsample: 0,
                  root_sample: rootIdx[j] ? 1 : 0, plot_m2: d.plotM2, spacing_m: d.spacingM });
      if (res.subsamples) {
        for (var s = 0; s < res.subsamples.length; s++) {
          var sub = res.subsamples[s];
          if (sub.centre !== j) continue;
          rows.push({ lon: sub.lon, lat: sub.lat, plot_id: pid + '_S' + sub.subsample,
                      point_type: 'composite_subsample', zone: r.zone, layout: res.layout,
                      seed: res.seed, composite_id: pid, subsample: sub.subsample,
                      root_sample: rootIdx[j] ? 1 : 0, plot_m2: d.plotM2, spacing_m: d.spacingM });
        }
      }
    }
    totalPlaced += res.placed;
    if (res.minSeparationM < worst) worst = res.minSeparationM;

    if (results.length > 1) placeOut.add(label(r.zone + ': ' + res.placed + ' placed', UI.NOTE));
    if (res.shortfall) placeOut.add(label(r.zone + ': ' + res.shortfall, UI.WARN));
  }

  if (rows.length === 0) { placeOut.add(label('No plots could be placed.', UI.ERROR)); return; }

  State.features = ee.FeatureCollection(rows.map(function (p) {
    var props = {};
    for (var k in p) { if (p.hasOwnProperty(k) && k !== 'lon' && k !== 'lat') props[k] = p[k]; }
    props.lon = p.lon; props.lat = p.lat;
    return ee.Feature(ee.Geometry.Point([p.lon, p.lat]), props);
  }));
  State.placed = { placed: totalPlaced, layout: State.layout, minSeparationM: worst };

  map.addLayer(State.features, { color: 'FFCC00' }, 'Plot locations');
  placeOut.add(label(totalPlaced + (d.composite ? ' composite centres' : ' plots') + ' placed' +
                     (d.composite ? ', with ' + (rows.length - totalPlaced) + ' subsample cores' : '') + '.', UI.OK));
  placeOut.add(label('Closest pair ' + worst.toFixed(0) + ' m apart; no two plots overlap. ' +
                     'Seed ' + CONFIG.SEED + ' (+ zone number) reproduces this design.', UI.HINT));
  writeMethods();
}

function writeMethods() {
  clearPanel(methodsOut);
  var d = State.design;
  if (!d || !State.placed) return;

  var layoutName = '';
  for (var i = 0; i < BCLayout.LAYOUTS.length; i++) {
    if (BCLayout.LAYOUTS[i].id === State.layout) layoutName = BCLayout.LAYOUTS[i].label.split(' (')[0].toLowerCase();
  }
  var zoned = d.strata.length > 1 || d.strata[0].name !== 'Whole site';
  var pri = State.priors;
  var area = 0; d.strata.forEach(function (s) { area += s.areaM2; });

  var text =
    (d.composite ? 'Composite samples (n = ' : 'Plot centres (n = ') + State.placed.placed + ') were located across ' +
    (area / 10000).toFixed(1) + ' ha of grassland using a ' + layoutName + ' layout' +
    (zoned ? ', with plots shared among ' + d.strata.length + ' zones in proportion to area and at least ' +
             d.minPer + ' per zone' : '') + '. ' +
    'Sample size was calculated separately for soil (relative margin of error ' + Math.round(d.marginSoil * 100) +
    '%, CV ' + pri.Soil.cv.toFixed(2) + '; ' + pri.Soil.source + ')' +
    (d.root ? ' and roots (' + Math.round(d.marginRoot * 100) + '%, CV ' + pri.Roots.cv.toFixed(2) + '; ' +
              pri.Roots.source + ')' : '') +
    ' at ' + Math.round(d.confidence * 100) + '% confidence, as n = (z·CV/E)² and then iterated with ' +
    'Student\'s t on n−1 degrees of freedom until stable, without a finite-population correction. ' +
    'Roots, which are washed from the same cores, ' +
    (d.root ? (d.rootSamples < d.centres
                 ? 'were analysed for a random subset of ' + d.rootSamples + ' samples. ' : 'were analysed for every sample. ')
            : 'were not measured. ') +
    (d.composite ? 'Each composite pools ' + d.subsamples + ' subsample cores taken within ' + d.radiusM +
                   ' m of its centre; the sample size counts composites. ' : '') +
    'Plot centres were placed at least ' + Math.round(d.spacingM) + ' m apart using random seed ' + CONFIG.SEED +
    '. Achieved precision should be recalculated from the collected samples, with Student\'s t, ' +
    'before the estimate is reported.';

  methodsOut.add(ui.Label(text, { fontSize: '11px', color: '#26343A', margin: '2px 8px' }));
}

function exportCores() {
  clearPanel(exportOut);
  if (!State.features) { exportOut.add(label('Place the plots first.', UI.ERROR)); return; }
  var fmt = formatSelect.getValue();
  var url = State.features.getDownloadURL({
    format: fmt, filename: 'grassland_carbon_plots_' + (new Date()).getTime() });
  var l = ui.Label('Download ' + fmt, UI.LINK);
  l.setUrl(url);
  exportOut.add(l);
  exportOut.add(label('Includes plot_id, point_type, zone, layout, seed, root_sample (1 = wash the roots), ' +
                      'composite_id, subsample, plot size, spacing and coordinates.', UI.HINT));
}


if (typeof module !== 'undefined') {
  module.exports = { CONFIG: CONFIG, BCStats: BCStats, BCGeom: BCGeom, BCTest: BCTest,
                     BCEarth: BCEarth, BCLayout: BCLayout, BCPlace: BCPlace, BCZones: BCZones };
}


// =================================================================================
// === RUN THE SELF TEST ===========================================================
// === Last, so that every section above it is defined.
// =================================================================================

if (RUN_SELF_TEST) { BCTest.run(); }

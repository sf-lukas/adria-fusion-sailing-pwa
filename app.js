const DEFAULT_LOCATION = {
  id: "split",
  name: "Split",
  routeName: "Split - Brac Window",
  latitude: 43.5081,
  longitude: 16.4402,
  timezone: "Europe/Zagreb"
};

const TIMELINE = [
  { key: "now", label: "Now", hours: 0 },
  { key: "h1", label: "+1h", hours: 1 },
  { key: "h3", label: "+3h", hours: 3 },
  { key: "h6", label: "+6h", hours: 6 },
  { key: "h12", label: "+12h", hours: 12 },
  { key: "h24", label: "+24h", hours: 24 },
  { key: "h48", label: "+48h", hours: 48 }
];

const LANGUAGE_KEY = "adria_fusion_language";
const FORECAST_ARCHIVE_KEY = "adria_fusion_forecast_archive_v1";
const MAX_LOCAL_ARCHIVE_SNAPSHOTS = 180;
const GPS_RELOAD_INTERVAL_MS = 15 * 60 * 1000;
const GPS_RELOAD_DISTANCE_M = 500;
const GPS_CENTER_ZOOM = 15;
const PLAYBACK_INTERVAL_MS = 1250;
const RAIN_ALERT_PROBABILITY = 40;
const RAIN_ALERT_MM_PER_H = 0.3;
const MEDITERRANEAN_BOUNDS = [[30.2, -6.0], [46.3, 36.8]];
const MEDITERRANEAN_POINTS = [
  { id: "adria_north", label: "North Adriatic", latitude: 45.2, longitude: 13.4, timezone: "Europe/Zagreb" },
  { id: "adria_mid", label: "Mid Adriatic", latitude: 43.7, longitude: 15.4, timezone: "Europe/Zagreb" },
  { id: "adria_south", label: "South Adriatic", latitude: 42.4, longitude: 17.6, timezone: "Europe/Zagreb" },
  { id: "ionian", label: "Ionian Sea", latitude: 38.7, longitude: 19.7, timezone: "Europe/Zagreb" },
  { id: "aegean", label: "Aegean Sea", latitude: 37.8, longitude: 24.4, timezone: "Europe/Zagreb" },
  { id: "crete", label: "Crete Sea", latitude: 35.3, longitude: 25.1, timezone: "Europe/Zagreb" },
  { id: "sicily", label: "Sicily Channel", latitude: 37.1, longitude: 13.4, timezone: "Europe/Zagreb" },
  { id: "tyrrhenian", label: "Tyrrhenian Sea", latitude: 40.0, longitude: 12.0, timezone: "Europe/Zagreb" },
  { id: "ligurian", label: "Ligurian Sea", latitude: 43.5, longitude: 8.8, timezone: "Europe/Zagreb" },
  { id: "balearic", label: "Balearic Sea", latitude: 39.2, longitude: 3.0, timezone: "Europe/Zagreb" },
  { id: "alboran", label: "Alboran Sea", latitude: 36.0, longitude: -3.2, timezone: "Europe/Zagreb" },
  { id: "levante", label: "Levantine Sea", latitude: 34.5, longitude: 31.0, timezone: "Europe/Zagreb" }
];

const I18N = {
  en: {
    "status.confidence": "confidence",
    "status.sources": "sources",
    "status.freshness": "freshness",
    "status.truth": "truth",
    "control.map": "Map",
    "control.layers": "Layers",
    "control.data": "Data",
    "control.settings": "Sources and weights",
    "event.rain": "Rain",
    "event.wind": "Wind",
    "event.wave": "Wave",
    "event.warning": "Watch",
    "event.update": "Update",
    "event.loading": "loading",
    "event.none48": "none 48h",
    "event.now": "now",
    "event.at": "{time} {value}",
    "event.peak": "{time} {value}",
    "event.stable": "stable",
    "event.lowConfidence": "verify",
    "play.play": "Play",
    "play.pause": "Pause",
    "mode.chart": "Real map",
    "mode.forecast": "Forecast",
    "mode.focus": "Map focus",
    "mode.focusExit": "Exit focus",
    "mode.mediterranean": "Med",
    "base.nautical": "Marine",
    "base.street": "Map",
    "base.satellite": "Real",
    "base.depth": "Depth",
    "layer.wind": "Wind",
    "layer.wave": "Wave",
    "layer.current": "Current",
    "layer.warnings": "Warnings",
    "chart.rain": "Rain",
    "chart.depth": "Depth",
    "chart.contours": "Lines",
    "chart.seamarks": "Marks",
    "chart.shoals": "Shoals",
    "chart.quality": "Quality",
    "chart.route": "Route",
    "metric.wind": "wind",
    "metric.wave": "wave",
    "metric.current": "current",
    "metric.sea": "sea temp",
    "panel.sources": "Source health",
    "panel.quality": "Quality dashboard",
    "panel.calculation": "Calculation",
    "nav.map": "Map",
    "nav.data": "Data",
    "nav.privacy": "Privacy",
    "nav.sources": "Sources",
    "timeline.now": "Now",
    "timeline.h1": "+1h",
    "timeline.h3": "+3h",
    "timeline.h6": "+6h",
    "timeline.h12": "+12h",
    "timeline.h24": "+24h",
    "timeline.h48": "+48h",
    "frame.suffix": "frame",
    "condition.loading": "Loading forecast",
    "condition.trend": "Trend only - verify before departure",
    "condition.wind": "Wind window is demanding",
    "condition.wave": "Wave comfort is reduced",
    "condition.usable": "Usable sailing window",
    "condition.partial": "Partial forecast coverage",
    "gps.idle": "GPS",
    "gps.loading": "GPS...",
    "gps.live": "GPS live",
    "gps.fix": "GPS fix",
    "gps.blocked": "GPS blocked",
    "gps.unavailable": "GPS unavailable",
    "gps.center": "POS",
    "gps.centerTitle": "Center and zoom to my position",
    "source.weather": "Open-Meteo Weather",
    "source.backendFusion": "Backend Fusion",
    "source.marine": "Open-Meteo Marine",
    "source.seed": "DHMZ Seed Truth",
    "source.archive": "Local Forecast Archive",
    "source.mediterranean": "Mediterranean Forecast Grid",
    "source.chart": "Chart Layers",
    "source.official": "HHI/PRIMAR Official ENC",
    "quality.forecast": "Forecast",
    "quality.sources": "Sources",
    "quality.wind": "Wind",
    "quality.wave": "Wave",
    "quality.current": "Current",
    "quality.bathymetry": "Bathymetry",
    "quality.gps": "GPS",
    "quality.archive": "Archive",
    "quality.live": "live",
    "quality.seed": "seed",
    "quality.none": "none",
    "quality.ready": "ready",
    "quality.limited": "limited",
    "quality.offline": "offline",
    "quality.officialHold": "official chart hold",
    "quality.currentCap": "coastal-current cap",
    "chart.initial": "Chart layers: OSM/Esri base, OpenSeaMap seamarks, EMODnet depth/contours.",
    "chart.unavailable": "Live chart library unavailable; using forecast fallback.",
    "chart.dataState": "{summary}. Official ENC/HHI charts are not bundled.",
    "chart.status": "Map {base} {frame}: confidence {confidence}/100 | layers {layers} | wind {wind} kn | wave {wave} | depth/shallows are planning context",
    "chart.depthQuery": "Depth query...",
    "chart.depthFailed": "Depth point query failed; map layers remain visual planning context."
  },
  de: {
    "status.confidence": "Vertrauen",
    "status.sources": "Quellen",
    "status.freshness": "Frische",
    "status.truth": "Truth",
    "control.map": "Karte",
    "control.layers": "Layer",
    "control.data": "Daten",
    "control.settings": "Quellen und Gewichte",
    "event.rain": "Regen",
    "event.wind": "Wind",
    "event.wave": "Welle",
    "event.warning": "Watch",
    "event.update": "Update",
    "event.loading": "laedt",
    "event.none48": "kein 48h",
    "event.now": "jetzt",
    "event.at": "{time} {value}",
    "event.peak": "{time} {value}",
    "event.stable": "stabil",
    "event.lowConfidence": "pruefen",
    "play.play": "Play",
    "play.pause": "Pause",
    "mode.chart": "Echte Karte",
    "mode.forecast": "Forecast",
    "mode.focus": "Kartenfokus",
    "mode.focusExit": "Fokus aus",
    "mode.mediterranean": "Med",
    "base.nautical": "Marine",
    "base.street": "Karte",
    "base.satellite": "Real",
    "base.depth": "Tiefe",
    "layer.wind": "Wind",
    "layer.wave": "Welle",
    "layer.current": "Strom",
    "layer.warnings": "Warnung",
    "chart.rain": "Regen",
    "chart.depth": "Tiefe",
    "chart.contours": "Linien",
    "chart.seamarks": "Marken",
    "chart.shoals": "Untiefen",
    "chart.quality": "Quali",
    "chart.route": "Route",
    "metric.wind": "Wind",
    "metric.wave": "Welle",
    "metric.current": "Strom",
    "metric.sea": "Meer",
    "panel.sources": "Quellenstatus",
    "panel.quality": "Qualitaets-Dashboard",
    "panel.calculation": "Berechnung",
    "nav.map": "Karte",
    "nav.data": "Daten",
    "nav.privacy": "Privacy",
    "nav.sources": "Quellen",
    "timeline.now": "Jetzt",
    "timeline.h1": "+1h",
    "timeline.h3": "+3h",
    "timeline.h6": "+6h",
    "timeline.h12": "+12h",
    "timeline.h24": "+24h",
    "timeline.h48": "+48h",
    "frame.suffix": "Frame",
    "condition.loading": "Forecast laedt",
    "condition.trend": "Nur Trend - vor Abfahrt pruefen",
    "condition.wind": "Windfenster ist anspruchsvoll",
    "condition.wave": "Wellenkomfort reduziert",
    "condition.usable": "Nutzbares Segelfenster",
    "condition.partial": "Teilweise Forecast-Abdeckung",
    "gps.idle": "GPS",
    "gps.loading": "GPS...",
    "gps.live": "GPS live",
    "gps.fix": "GPS fix",
    "gps.blocked": "GPS blockiert",
    "gps.unavailable": "GPS fehlt",
    "gps.center": "POS",
    "gps.centerTitle": "Auf meine Position zentrieren und zoomen",
    "source.weather": "Open-Meteo Wetter",
    "source.backendFusion": "Backend-Fusion",
    "source.marine": "Open-Meteo Marine",
    "source.seed": "DHMZ Seed Truth",
    "source.archive": "Lokales Forecast-Archiv",
    "source.mediterranean": "Mittelmeer Forecast-Grid",
    "source.chart": "Kartenlayer",
    "source.official": "HHI/PRIMAR amtliche ENC",
    "quality.forecast": "Forecast",
    "quality.sources": "Quellen",
    "quality.wind": "Wind",
    "quality.wave": "Welle",
    "quality.current": "Strom",
    "quality.bathymetry": "Bathymetrie",
    "quality.gps": "GPS",
    "quality.archive": "Archiv",
    "quality.live": "live",
    "quality.seed": "seed",
    "quality.none": "keine",
    "quality.ready": "bereit",
    "quality.limited": "begrenzt",
    "quality.offline": "offline",
    "quality.officialHold": "amtliche Karte hold",
    "quality.currentCap": "Kuestenstrom-Cap",
    "chart.initial": "Kartenlayer: OSM/Esri Basis, OpenSeaMap Marken, EMODnet Tiefe/Linien.",
    "chart.unavailable": "Live-Karte nicht verfuegbar; Forecast-Fallback aktiv.",
    "chart.dataState": "{summary}. Amtliche ENC/HHI-Karten sind nicht gebundelt.",
    "chart.status": "Karte {base} {frame}: Vertrauen {confidence}/100 | Layer {layers} | Wind {wind} kn | Welle {wave} | Tiefe/Untiefen sind Planungskontext",
    "chart.depthQuery": "Tiefe wird abgefragt...",
    "chart.depthFailed": "Tiefenpunkt-Abfrage fehlgeschlagen; Kartenlayer bleiben Planungskontext."
  },
  hr: {
    "status.confidence": "pouzdanost",
    "status.sources": "izvori",
    "status.freshness": "svjezina",
    "status.truth": "truth",
    "control.map": "Karta",
    "control.layers": "Slojevi",
    "control.data": "Podaci",
    "control.settings": "Izvori i tezine",
    "event.rain": "Kisa",
    "event.wind": "Vjetar",
    "event.wave": "Val",
    "event.warning": "Watch",
    "event.update": "Update",
    "event.loading": "ucitava",
    "event.none48": "nema 48h",
    "event.now": "sada",
    "event.at": "{time} {value}",
    "event.peak": "{time} {value}",
    "event.stable": "stabilno",
    "event.lowConfidence": "provjeri",
    "play.play": "Play",
    "play.pause": "Pause",
    "mode.chart": "Stvarna karta",
    "mode.forecast": "Prognoza",
    "mode.focus": "Fokus karte",
    "mode.focusExit": "Izlaz fokus",
    "mode.mediterranean": "Med",
    "base.nautical": "More",
    "base.street": "Karta",
    "base.satellite": "Real",
    "base.depth": "Dubina",
    "layer.wind": "Vjetar",
    "layer.wave": "Val",
    "layer.current": "Struja",
    "layer.warnings": "Upoz.",
    "chart.rain": "Kisa",
    "chart.depth": "Dubina",
    "chart.contours": "Linije",
    "chart.seamarks": "Oznake",
    "chart.shoals": "Plicine",
    "chart.quality": "Kval.",
    "chart.route": "Ruta",
    "metric.wind": "vjetar",
    "metric.wave": "val",
    "metric.current": "struja",
    "metric.sea": "more",
    "panel.sources": "Stanje izvora",
    "panel.quality": "Kvaliteta podataka",
    "panel.calculation": "Izracun",
    "nav.map": "Karta",
    "nav.data": "Podaci",
    "nav.privacy": "Privatnost",
    "nav.sources": "Izvori",
    "timeline.now": "Sada",
    "timeline.h1": "+1h",
    "timeline.h3": "+3h",
    "timeline.h6": "+6h",
    "timeline.h12": "+12h",
    "timeline.h24": "+24h",
    "timeline.h48": "+48h",
    "frame.suffix": "okvir",
    "condition.loading": "Prognoza se ucitava",
    "condition.trend": "Samo trend - provjeriti prije polaska",
    "condition.wind": "Vjetar je zahtjevan",
    "condition.wave": "Komfor vala je smanjen",
    "condition.usable": "Upotrebljiv prozor za jedrenje",
    "condition.partial": "Djelomicna prognoza",
    "gps.idle": "GPS",
    "gps.loading": "GPS...",
    "gps.live": "GPS live",
    "gps.fix": "GPS fix",
    "gps.blocked": "GPS blok.",
    "gps.unavailable": "GPS nema",
    "gps.center": "POS",
    "gps.centerTitle": "Centriraj i priblizi moju poziciju",
    "source.weather": "Open-Meteo vrijeme",
    "source.backendFusion": "Backend fusion",
    "source.marine": "Open-Meteo more",
    "source.seed": "DHMZ seed truth",
    "source.archive": "Lokalna arhiva prognoze",
    "source.mediterranean": "Mediteranska prognozna mreza",
    "source.chart": "Slojevi karte",
    "source.official": "HHI/PRIMAR sluzbena ENC",
    "quality.forecast": "Prognoza",
    "quality.sources": "Izvori",
    "quality.wind": "Vjetar",
    "quality.wave": "Val",
    "quality.current": "Struja",
    "quality.bathymetry": "Batimetrija",
    "quality.gps": "GPS",
    "quality.archive": "Arhiva",
    "quality.live": "live",
    "quality.seed": "seed",
    "quality.none": "nema",
    "quality.ready": "spremno",
    "quality.limited": "ograniceno",
    "quality.offline": "offline",
    "quality.officialHold": "sluzbena karta hold",
    "quality.currentCap": "obalna struja cap",
    "chart.initial": "Slojevi: OSM/Esri baza, OpenSeaMap oznake, EMODnet dubina/linije.",
    "chart.unavailable": "Live karta nije dostupna; koristi se prognozni fallback.",
    "chart.dataState": "{summary}. Sluzbene ENC/HHI karte nisu ukljucene.",
    "chart.status": "Karta {base} {frame}: pouzdanost {confidence}/100 | slojevi {layers} | vjetar {wind} kn | val {wave} | dubina/plicine su kontekst planiranja",
    "chart.depthQuery": "Upit dubine...",
    "chart.depthFailed": "Upit dubine nije uspio; slojevi ostaju kontekst planiranja."
  }
};

const ROUTE_COORDS = [
  [43.5081, 16.4402],
  [43.4639, 16.5228],
  [43.3829, 16.6296],
  [43.3268, 16.6420],
  [43.2605, 16.6550]
];

const HAZARD_POINTS = [
  {
    name: "Split channel shoal focus",
    coords: [43.4405, 16.5150],
    note: "Check EMODnet contours and official chart before crossing."
  },
  {
    name: "Brac north-coast depth transition",
    coords: [43.3525, 16.5755],
    note: "Depth model changes quickly near the coast."
  },
  {
    name: "Hvar approach shallow check",
    coords: [43.1852, 16.5862],
    note: "Use the depth/contour layers as planning context only."
  }
];

const SHOAL_ZONES = [
  {
    name: "Kastela Bay shallow-watch",
    center: [43.5268, 16.3910],
    radiusM: 760,
    level: "caution",
    note: "Cross-check depth contours and official HHI/ENC before entering shallow water."
  },
  {
    name: "Split channel shallow-watch",
    center: [43.4378, 16.5148],
    radiusM: 620,
    level: "critical",
    note: "Route-adjacent shallow-water watch zone; verify on official charts."
  },
  {
    name: "Brac north shelf transition",
    center: [43.3525, 16.5755],
    radiusM: 900,
    level: "caution",
    note: "Fast depth transition close to shore; use contour spacing as risk context."
  },
  {
    name: "Hvar approach shallow-watch",
    center: [43.1852, 16.5862],
    radiusM: 820,
    level: "caution",
    note: "Planning overlay only; do not use as sole navigation basis."
  }
];

const state = {
  location: { ...DEFAULT_LOCATION },
  language: readInitialLanguage(),
  gpsLabelKey: "gps.idle",
  mapMode: "chart",
  baseMode: "nautical",
  selectedFrame: 0,
  frames: [],
  sourceHealth: [],
  seed: null,
  liveLoadedAt: null,
  chart: null,
  chartLayerHealth: {},
  forecastArchiveCount: 0,
  gpsWatchId: null,
  lastGpsForecastAt: 0,
  lastGpsForecastLocation: null,
  lastGpsPosition: null,
  quickEvents: null,
  isPlaying: false,
  playTimer: null,
  mapFocus: false,
  playbackSpeed: 1,
  regionalWeather: null
};

const el = {
  mapCard: document.querySelector(".map-card"),
  chartMap: document.getElementById("chartMap"),
  weatherMap: document.getElementById("weatherMap"),
  chartStatus: document.getElementById("chartStatus"),
  languageButtons: document.querySelectorAll("[data-language]"),
  placeTitle: document.getElementById("placeTitle"),
  gpsButton: document.getElementById("gpsButton"),
  locateButton: document.getElementById("locateButton"),
  globalConfidence: document.getElementById("globalConfidence"),
  sourceCount: document.getElementById("sourceCount"),
  freshnessState: document.getElementById("freshnessState"),
  truthState: document.getElementById("truthState"),
  frameLabel: document.getElementById("frameLabel"),
  conditionText: document.getElementById("conditionText"),
  windMetric: document.getElementById("windMetric"),
  waveMetric: document.getElementById("waveMetric"),
  currentMetric: document.getElementById("currentMetric"),
  seaMetric: document.getElementById("seaMetric"),
  chartDataState: document.getElementById("chartDataState"),
  playButton: document.getElementById("playButton"),
  mapFocusButton: document.getElementById("mapFocusButton"),
  zoomInButton: document.getElementById("zoomInButton"),
  zoomOutButton: document.getElementById("zoomOutButton"),
  mediterraneanButton: document.getElementById("mediterraneanButton"),
  speedButtons: document.querySelectorAll("[data-play-speed]"),
  nextRain: document.getElementById("nextRain"),
  eventSummary: document.getElementById("eventSummary"),
  updateState: document.getElementById("updateState"),
  rainTiming: document.getElementById("rainTiming"),
  windTiming: document.getElementById("windTiming"),
  waveTiming: document.getElementById("waveTiming"),
  timelineButtons: document.getElementById("timelineButtons"),
  timelineSlider: document.getElementById("timelineSlider"),
  sourceHealth: document.getElementById("sourceHealth"),
  qualityDashboard: document.getElementById("qualityDashboard"),
  calculationBox: document.getElementById("calculationBox"),
  windLayer: document.getElementById("windLayer"),
  currentLayer: document.getElementById("currentLayer"),
  rainSvgLayer: document.getElementById("rainSvgLayer"),
  positionDot: document.getElementById("positionDot"),
  accuracyRing: document.getElementById("accuracyRing"),
  warningZone: document.getElementById("warningZone")
};

init();

async function init() {
  registerServiceWorker();
  applyI18n();
  buildTimelineControls();
  wireControls();
  applyInitialLayerButtonState();
  initChartMap();
  renderLoadingState();
  await loadForecast();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => undefined);
  }
}

function readInitialLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored && I18N[stored]) return stored;
  } catch {
    // Local storage can be blocked in private contexts; fall back to browser language.
  }
  const browserLanguage = (navigator.language || "en").slice(0, 2).toLowerCase();
  return I18N[browserLanguage] ? browserLanguage : "en";
}

function t(key) {
  return I18N[state.language]?.[key] || I18N.en[key] || key;
}

function formatText(key, values) {
  return t(key).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => String(values[name] ?? ""));
}

function setLanguage(language) {
  if (!I18N[language]) return;
  state.language = language;
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // Persisting language is best-effort only.
  }
  applyI18n();
  buildTimelineControls();
  state.frames = state.frames.map((frame, index) => ({
    ...frame,
    label: timelineLabel(TIMELINE[index] || TIMELINE[0])
  }));
  renderFrame();
}

function applyI18n() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  el.languageButtons.forEach((button) => {
    button.dataset.active = String(button.dataset.language === state.language);
  });
  updateGpsState(state.gpsLabelKey || "gps.idle");
  updateLocateButton();
  updatePlayButton();
  updateMapFocusState();
  renderQuickSituation(state.frames[state.selectedFrame]);
  updateChartStatus(state.frames[state.selectedFrame]);
}

function timelineLabel(item) {
  return t(`timeline.${item.key}`) || item.label;
}

function buildTimelineControls() {
  el.timelineButtons.replaceChildren();
  TIMELINE.forEach((frame, index) => {
    const tick = document.createElement("span");
    tick.textContent = timelineLabel(frame);
    tick.dataset.index = String(index);
    tick.dataset.active = String(index === state.selectedFrame);
    el.timelineButtons.append(tick);
  });
}

function wireControls() {
  el.timelineSlider.max = String(TIMELINE.length - 1);
  el.timelineSlider.addEventListener("input", () => selectFrame(Number(el.timelineSlider.value)));
  el.playButton.addEventListener("click", toggleTimelinePlayback);
  el.mapFocusButton.addEventListener("click", toggleMapFocus);
  el.zoomInButton?.addEventListener("click", () => zoomChart(1));
  el.zoomOutButton?.addEventListener("click", () => zoomChart(-1));
  el.mediterraneanButton?.addEventListener("click", fitMediterranean);
  el.gpsButton.addEventListener("click", useGps);
  el.locateButton?.addEventListener("click", centerOnGpsPosition);
  el.speedButtons.forEach((button) => {
    button.addEventListener("click", () => setPlaybackSpeed(Number(button.dataset.playSpeed)));
  });
  el.languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  document.querySelectorAll("[data-map-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isPendingButton(button)) return;
      setMapMode(button.dataset.mapMode);
    });
  });
  document.querySelectorAll("[data-base-mode]").forEach((button) => {
    button.addEventListener("click", () => setBaseMode(button.dataset.baseMode));
  });
  document.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isPendingButton(button)) return;
      const active = button.dataset.active !== "true";
      button.dataset.active = String(active);
      const target = document.querySelector(`[data-svg-layer="${button.dataset.layer}"]`);
      if (target) target.style.display = active ? "" : "none";
    });
  });
  document.querySelectorAll("[data-chart-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isPendingButton(button)) return;
      const active = button.dataset.active !== "true";
      button.dataset.active = String(active);
      toggleChartLayer(button.dataset.chartLayer, active);
    });
  });
}

function isPendingButton(button) {
  return button.dataset.pending === "true" || button.getAttribute("aria-disabled") === "true";
}

function applyInitialLayerButtonState() {
  document.querySelectorAll("[data-layer]").forEach((button) => {
    const target = document.querySelector(`[data-svg-layer="${button.dataset.layer}"]`);
    if (target) target.style.display = button.dataset.active === "true" ? "" : "none";
  });
  setPlaybackSpeed(state.playbackSpeed, { silent: true });
}

async function loadForecast() {
  state.liveLoadedAt = new Date();
  const seedPromise = loadSeed();
  const weatherPromise = fetchWeather(state.location);
  const marinePromise = fetchMarine(state.location);
  const regionalPromise = fetchMediterraneanWeather();
  const [seedResult, weatherResult, marineResult, regionalResult] = await Promise.allSettled([
    seedPromise,
    weatherPromise,
    marinePromise,
    regionalPromise
  ]);

  state.seed = seedResult.status === "fulfilled" ? seedResult.value : null;
  const weatherPayload = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const marinePayload = marineResult.status === "fulfilled" ? marineResult.value : null;
  state.regionalWeather = regionalResult.status === "fulfilled" ? regionalResult.value : null;
  state.quickEvents = buildQuickEvents(weatherPayload, marinePayload);
  state.forecastArchiveCount = archiveForecastSnapshot(weatherPayload, marinePayload);
  const weather = sourceResult("source.weather", weatherResult);
  const marine = sourceResult("source.marine", marineResult);
  const backendFusion = sourceBackendFusion(state.seed);
  const seed = state.seed ? {
    nameKey: "source.seed",
    ok: true,
    mode: "seed",
    message: `Last local verification ${state.seed.run_id || "available"}`
  } : {
    nameKey: "source.seed",
    ok: false,
    mode: "offline",
    message: "Seed snapshot not available"
  };
  const localArchive = {
    nameKey: "source.archive",
    ok: state.forecastArchiveCount > 0,
    mode: "device",
    message: `${state.forecastArchiveCount} device snapshots retained from this browser`
  };
  const regionalGrid = state.regionalWeather ? {
    nameKey: "source.mediterranean",
    ok: state.regionalWeather.sourceOk,
    mode: state.regionalWeather.sourceOk ? "live" : "limited",
    message: `${state.regionalWeather.points.length}/${state.regionalWeather.requested} Open-Meteo sea-area samples loaded`
  } : {
    nameKey: "source.mediterranean",
    ok: false,
    mode: "offline",
    message: "Regional visualization grid not available"
  };
  const chart = {
    nameKey: "source.chart",
    ok: Boolean(state.chart?.ready),
    mode: state.chart?.ready ? "live" : "fallback",
    message: state.chart?.ready ? chartLayerSummary() : "Forecast fallback map active"
  };
  const officialChart = {
    nameKey: "source.official",
    ok: false,
    mode: "licensed",
    message: "Not bundled; requires official Croatian chart license/distributor access"
  };

  state.sourceHealth = [weather, backendFusion, marine, seed, localArchive, regionalGrid, chart, officialChart];
  state.frames = buildFrames(
    weatherPayload,
    marinePayload,
    state.seed
  );
  selectFrame(0);
}

function initChartMap() {
  setMapMode(state.mapMode);
  if (!window.L || !el.chartMap) {
    state.chart = { ready: false };
    setMapMode("forecast");
    updateChartStatus(null, t("chart.unavailable"));
    return;
  }

  const L = window.L;
  const map = L.map(el.chartMap, {
    zoomControl: false,
    attributionControl: true,
    preferCanvas: true
  }).setView([DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude], 11);

  const streetBase = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  const satelliteBase = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri - Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
    }
  );
  const emodnetMean = L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
    layers: "emodnet:mean_multicolour",
    format: "image/png",
    transparent: true,
    opacity: 0.48,
    attribution: "EMODnet Bathymetry"
  });
  const gebcoRelief = L.tileLayer.wms("https://wms.gebco.net/mapserv?", {
    layers: "GEBCO_LATEST",
    format: "image/png",
    transparent: true,
    opacity: 0.18,
    attribution: "GEBCO"
  });
  const depth = L.layerGroup([emodnetMean, gebcoRelief]).addTo(map);
  const contours = L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
    layers: "emodnet:contours",
    format: "image/png",
    transparent: true,
    opacity: 0.68,
    attribution: "EMODnet depth contours"
  }).addTo(map);
  const quality = L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
    layers: "emodnet:quality_index",
    format: "image/png",
    transparent: true,
    opacity: 0.38,
    attribution: "EMODnet bathymetry quality index"
  });
  const seamarks = L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "Seamark data &copy; OpenSeaMap contributors",
    opacity: 0.9
  }).addTo(map);
  registerLayerHealth("OSM", streetBase);
  registerLayerHealth("Esri World Imagery", satelliteBase);
  registerLayerHealth("EMODnet depth", emodnetMean);
  registerLayerHealth("GEBCO relief", gebcoRelief);
  registerLayerHealth("EMODnet contours", contours);
  registerLayerHealth("EMODnet quality", quality);
  registerLayerHealth("OpenSeaMap seamarks", seamarks);

  const route = L.layerGroup().addTo(map);
  L.polyline(ROUTE_COORDS, {
    color: "#fffdf7",
    weight: 5,
    opacity: 0.95
  }).addTo(route);
  L.polyline(ROUTE_COORDS, {
    color: "#10211f",
    weight: 2,
    dashArray: "8 7",
    opacity: 0.75
  }).addTo(route);
  HAZARD_POINTS.forEach((point) => {
    L.marker(point.coords, {
      icon: L.divIcon({
        className: "",
        html: "<span class=\"hazard-marker\">!</span>",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).bindTooltip(`<b>${point.name}</b><br>${point.note}`).addTo(route);
  });
  const shoals = L.layerGroup().addTo(map);
  SHOAL_ZONES.forEach((zone) => {
    L.circle(zone.center, {
      radius: zone.radiusM,
      color: zone.level === "critical" ? "#e65b4f" : "#c67b2e",
      fillColor: zone.level === "critical" ? "#e65b4f" : "#c67b2e",
      fillOpacity: zone.level === "critical" ? 0.18 : 0.12,
      weight: zone.level === "critical" ? 2 : 1.5,
      dashArray: "6 5"
    }).bindTooltip(`<b>${zone.name}</b><br>${zone.note}`).addTo(shoals);
  });

  const meteo = L.layerGroup().addTo(map);
  const rain = L.layerGroup().addTo(map);
  const positionMarker = L.marker([DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude], {
    icon: L.divIcon({
      className: "",
      html: "<span class=\"chart-marker\"></span>",
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    })
  }).addTo(map);
  const accuracyCircle = L.circle([DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude], {
    radius: 120,
    color: "#10211f",
    fillColor: "#2f8a6f",
    fillOpacity: 0.08,
    weight: 1
  }).addTo(map);

  state.chart = {
    ready: true,
    map,
    layers: { streetBase, satelliteBase, rain, depth, contours, seamarks, shoals, quality, route },
    baseLayers: { streetBase, satelliteBase, emodnetMean, gebcoRelief },
    meteo,
    rain,
    positionMarker,
    accuracyCircle
  };
  setBaseMode(state.baseMode);
  map.on("click", (event) => queryDepthAt(event.latlng));
  window.setTimeout(() => map.invalidateSize(), 80);
}

function setMapMode(mode) {
  state.mapMode = mode === "forecast" ? "forecast" : "chart";
  if (el.mapCard) el.mapCard.dataset.mode = state.mapMode;
  if (el.weatherMap) el.weatherMap.hidden = state.mapMode !== "forecast";
  document.querySelectorAll("[data-map-mode]").forEach((button) => {
    button.dataset.active = String(button.dataset.mapMode === state.mapMode);
  });
  if (state.mapMode === "chart" && state.chart?.map) {
    window.setTimeout(() => state.chart.map.invalidateSize(), 40);
  }
}

function setBaseMode(mode) {
  state.baseMode = ["nautical", "street", "satellite", "depth"].includes(mode) ? mode : "nautical";
  document.querySelectorAll("[data-base-mode]").forEach((button) => {
    button.dataset.active = String(button.dataset.baseMode === state.baseMode);
  });
  if (!state.chart?.ready) return;
  const { streetBase, satelliteBase, depth, contours, seamarks, shoals, quality, route } = state.chart.layers;
  const wanted = {
    nautical: { depth: true, contours: true, seamarks: true, shoals: true, quality: false, route: true, depthOpacity: 0.48, reliefOpacity: 0.18 },
    street: { depth: false, contours: false, seamarks: true, shoals: true, quality: false, route: true, depthOpacity: 0.24, reliefOpacity: 0.1 },
    satellite: { depth: false, contours: true, seamarks: true, shoals: true, quality: false, route: true, depthOpacity: 0.18, reliefOpacity: 0.06 },
    depth: { depth: true, contours: true, seamarks: false, shoals: true, quality: true, route: true, depthOpacity: 0.72, reliefOpacity: 0.28 }
  }[state.baseMode];

  setLayerActive(streetBase, state.baseMode !== "satellite");
  setLayerActive(satelliteBase, state.baseMode === "satellite");
  Object.entries(wanted).forEach(([name, active]) => {
    if (name.endsWith("Opacity")) return;
    const layer = { depth, contours, seamarks, shoals, quality, route }[name];
    const button = document.querySelector(`[data-chart-layer="${name}"]`);
    if (button) button.dataset.active = String(active);
    setLayerActive(layer, Boolean(active));
  });
  state.chart.baseLayers.emodnetMean.setOpacity(wanted.depthOpacity);
  state.chart.baseLayers.gebcoRelief.setOpacity(wanted.reliefOpacity);
  updateChartStatus(state.frames[state.selectedFrame]);
}

function toggleChartLayer(name, active) {
  const svgTarget = document.querySelector(`[data-svg-layer="${name}"]`);
  if (svgTarget) svgTarget.style.display = active ? "" : "none";
  if (!state.chart?.map || !state.chart.layers?.[name]) return;
  setLayerActive(state.chart.layers[name], active);
  if (active && name === "rain") renderRainLayer(state.frames[state.selectedFrame]);
  updateChartStatus(state.frames[state.selectedFrame]);
}

function setLayerActive(layer, active) {
  if (!state.chart?.map || !layer) return;
  if (active && !state.chart.map.hasLayer(layer)) {
    layer.addTo(state.chart.map);
  } else if (!active && state.chart.map.hasLayer(layer)) {
    state.chart.map.removeLayer(layer);
  }
}

function registerLayerHealth(name, layer) {
  state.chartLayerHealth[name] = { ok: true, errors: 0 };
  layer.on("tileload", () => {
    state.chartLayerHealth[name] = { ...state.chartLayerHealth[name], ok: true };
    updateChartDataState();
  });
  layer.on("tileerror", () => {
    const current = state.chartLayerHealth[name] || { ok: true, errors: 0 };
    state.chartLayerHealth[name] = { ok: false, errors: current.errors + 1 };
    updateChartDataState();
  });
}

function chartLayerSummary() {
  const entries = Object.entries(state.chartLayerHealth);
  if (!entries.length) return "OSM, OpenSeaMap and EMODnet configured";
  const failed = entries.filter(([, value]) => !value.ok);
  if (failed.length === 0) return "OSM, Esri imagery, OpenSeaMap, EMODnet depth/contours and GEBCO available";
  return `Layer warning: ${failed.map(([name]) => name).join(", ")}`;
}

function updateChartDataState(message) {
  if (!el.chartDataState) return;
  el.chartDataState.textContent = message || formatText("chart.dataState", { summary: chartLayerSummary() });
}

async function loadSeed() {
  const response = await fetch("data/split_latest.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`seed ${response.status}`);
  return response.json();
}

async function fetchWeather(locationValue) {
  const params = new URLSearchParams({
    latitude: locationValue.latitude.toFixed(4),
    longitude: locationValue.longitude.toFixed(4),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "precipitation",
      "rain",
      "showers",
      "weather_code"
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation",
      "rain",
      "showers",
      "precipitation_probability",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m"
    ].join(","),
    forecast_days: "3",
    timezone: locationValue.timezone || DEFAULT_LOCATION.timezone
  });
  return fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
}

async function fetchMarine(locationValue) {
  const params = new URLSearchParams({
    latitude: locationValue.latitude.toFixed(4),
    longitude: locationValue.longitude.toFixed(4),
    current: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "wind_wave_height",
      "swell_wave_height",
      "sea_surface_temperature",
      "ocean_current_velocity",
      "ocean_current_direction"
    ].join(","),
    hourly: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "wind_wave_height",
      "swell_wave_height",
      "sea_surface_temperature",
      "ocean_current_velocity",
      "ocean_current_direction",
      "sea_level_height_msl"
    ].join(","),
    forecast_days: "3",
    timezone: locationValue.timezone,
    cell_selection: "sea"
  });
  return fetchJson(`https://marine-api.open-meteo.com/v1/marine?${params}`);
}

async function fetchMediterraneanWeather() {
  const settled = await Promise.allSettled(
    MEDITERRANEAN_POINTS.map(async (point) => ({
      ...point,
      payload: await fetchWeather(point)
    }))
  );
  const points = settled
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  return {
    sourceOk: points.length >= Math.min(6, MEDITERRANEAN_POINTS.length),
    requested: MEDITERRANEAN_POINTS.length,
    failed: settled.filter((result) => result.status !== "fulfilled").length,
    points
  };
}

async function fetchJson(url, timeoutMs = 10000) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeout = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller?.signal });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
}

function sourceResult(nameKey, result) {
  if (result.status === "fulfilled") {
    return { nameKey, ok: true, mode: "live", message: "Live API loaded" };
  }
  return { nameKey, ok: false, mode: "fallback", message: result.reason?.message || "not available" };
}

function sourceBackendFusion(seed) {
  const metNoCount = Number(seed?.provider_counts?.met_no || 0);
  const fusionCount = Number(seed?.counts?.fusion_snapshots || 0);
  const ok = metNoCount > 0 && fusionCount > 0;
  return {
    nameKey: "source.backendFusion",
    ok,
    mode: ok ? "seed" : "offline",
    message: ok
      ? `Open-Meteo + MET Norway fused frames: ${fusionCount}`
      : "Backend fusion snapshot not available"
  };
}

function archiveForecastSnapshot(weather, marine) {
  const currentCount = readForecastArchiveCount();
  if (!weather && !marine) return currentCount;
  try {
    const archive = JSON.parse(localStorage.getItem(FORECAST_ARCHIVE_KEY) || "[]");
    const snapshot = {
      schema_version: "adria_fusion_device_forecast_snapshot_v1",
      issued_at: new Date().toISOString(),
      location: {
        id: state.location.id,
        name: state.location.name,
        latitude: Number(state.location.latitude.toFixed(5)),
        longitude: Number(state.location.longitude.toFixed(5)),
        timezone: state.location.timezone
      },
      providers: {
        open_meteo_weather: Boolean(weather),
        open_meteo_marine: Boolean(marine)
      },
      frames: TIMELINE.map((item) => ({
        label: item.label,
        lead_hours: item.hours,
        weather: pickWeather(weather, item.hours),
        marine: pickMarine(marine, item.hours)
      }))
    };
    archive.unshift(snapshot);
    localStorage.setItem(
      FORECAST_ARCHIVE_KEY,
      JSON.stringify(archive.slice(0, MAX_LOCAL_ARCHIVE_SNAPSHOTS))
    );
    return Math.min(archive.length, MAX_LOCAL_ARCHIVE_SNAPSHOTS);
  } catch {
    return currentCount;
  }
}

function readForecastArchiveCount() {
  try {
    const archive = JSON.parse(localStorage.getItem(FORECAST_ARCHIVE_KEY) || "[]");
    return Array.isArray(archive) ? archive.length : 0;
  } catch {
    return 0;
  }
}

function buildFrames(weather, marine, seed) {
  return TIMELINE.map((item) => {
    const weatherPoint = pickWeather(weather, item.hours);
    const marinePoint = pickMarine(marine, item.hours);
    const fallback = pickSeed(seed, item.hours);
    const backendFusion = pickBackendFusion(seed, item.hours);
    const backendProviderCount = backendFusion?.providerCount || 0;
    const sources = [
      weatherPoint.sourceOk,
      backendProviderCount >= 2,
      marinePoint.sourceOk,
      Boolean(fallback)
    ].filter(Boolean).length;
    const confidence = calculateConfidence({
      weatherOk: weatherPoint.sourceOk,
      backendProviderCount,
      marineOk: marinePoint.sourceOk,
      seedOk: Boolean(fallback),
      leadHours: item.hours
    });
    return {
      label: timelineLabel(item),
      hours: item.hours,
      weather: weatherPoint,
      marine: marinePoint,
      fallback,
      backendFusion,
      sources,
      confidence,
      conditionKey: describeConditionKey(weatherPoint, marinePoint, confidence)
    };
  });
}

function pickWeather(payload, leadHours) {
  if (!payload) return fallbackWeather();
  if (leadHours === 0 && payload.current) {
    return {
      sourceOk: true,
      temperature: asNumber(payload.current.temperature_2m),
      windSpeedKmh: asNumber(payload.current.wind_speed_10m),
      windDirection: asNumber(payload.current.wind_direction_10m),
      windGustKmh: asNumber(payload.current.wind_gusts_10m),
      precipitationMm: rainIntensityFromValues(
        payload.current.precipitation,
        payload.current.rain,
        payload.current.showers
      ),
      rainMm: asNumber(payload.current.rain),
      showersMm: asNumber(payload.current.showers),
      precipitationProbability: null,
      time: payload.current.time
    };
  }
  const index = closestHourlyIndex(payload.hourly?.time, leadHours);
  if (index < 0) return fallbackWeather();
  return {
    sourceOk: true,
    temperature: asNumber(payload.hourly.temperature_2m?.[index]),
    windSpeedKmh: asNumber(payload.hourly.wind_speed_10m?.[index]),
    windDirection: asNumber(payload.hourly.wind_direction_10m?.[index]),
    windGustKmh: asNumber(payload.hourly.wind_gusts_10m?.[index]),
    precipitationMm: rainIntensityFromValues(
      payload.hourly.precipitation?.[index],
      payload.hourly.rain?.[index],
      payload.hourly.showers?.[index]
    ),
    rainMm: asNumber(payload.hourly.rain?.[index]),
    showersMm: asNumber(payload.hourly.showers?.[index]),
    precipitationProbability: asNumber(payload.hourly.precipitation_probability?.[index]),
    time: payload.hourly.time[index]
  };
}

function pickMarine(payload, leadHours) {
  if (!payload) return fallbackMarine();
  if (leadHours === 0 && payload.current) {
    return {
      sourceOk: true,
      waveHeight: asNumber(payload.current.wave_height),
      waveDirection: asNumber(payload.current.wave_direction),
      wavePeriod: asNumber(payload.current.wave_period),
      seaSurfaceTemperature: asNumber(payload.current.sea_surface_temperature),
      currentVelocityKmh: asNumber(payload.current.ocean_current_velocity),
      currentDirection: asNumber(payload.current.ocean_current_direction),
      time: payload.current.time
    };
  }
  const index = closestHourlyIndex(payload.hourly?.time, leadHours);
  if (index < 0) return fallbackMarine();
  return {
    sourceOk: true,
    waveHeight: asNumber(payload.hourly.wave_height?.[index]),
    waveDirection: asNumber(payload.hourly.wave_direction?.[index]),
    wavePeriod: asNumber(payload.hourly.wave_period?.[index]),
    seaSurfaceTemperature: asNumber(payload.hourly.sea_surface_temperature?.[index]),
    currentVelocityKmh: asNumber(payload.hourly.ocean_current_velocity?.[index]),
    currentDirection: asNumber(payload.hourly.ocean_current_direction?.[index]),
    time: payload.hourly.time[index]
  };
}

function pickSeed(seed, leadHours) {
  if (!seed?.sample_forecasts) return null;
  const candidates = [...seed.sample_forecasts, ...(seed.sample_marine_forecasts || [])];
  const scored = candidates
    .map((item) => ({ item, distance: Math.abs((item.lead_hours || 0) - leadHours) }))
    .sort((a, b) => a.distance - b.distance);
  return scored[0]?.item || null;
}

function pickBackendFusion(seed, leadHours) {
  const frames = seed?.timeline_fusion;
  if (!Array.isArray(frames) || frames.length === 0) return null;
  const best = frames
    .map((frame) => ({ frame, distance: Math.abs(Number(frame.lead_hours || 0) - leadHours) }))
    .sort((a, b) => a.distance - b.distance)[0]?.frame;
  if (!best?.values) return null;
  return {
    leadHours: Number(best.lead_hours || leadHours),
    providerCount: Number(best.provider_count || 0),
    providers: Array.isArray(best.providers) ? best.providers : [],
    confidence: best.confidence,
    values: best.values
  };
}

function closestHourlyIndex(times, leadHours) {
  if (!Array.isArray(times) || times.length === 0) return -1;
  const target = Date.now() + leadHours * 3600 * 1000;
  let best = -1;
  let bestDelta = Number.POSITIVE_INFINITY;
  times.forEach((time, index) => {
    const parsed = new Date(time).getTime();
    const delta = Math.abs(parsed - target);
    if (delta < bestDelta) {
      best = index;
      bestDelta = delta;
    }
  });
  return best;
}

function fallbackWeather() {
  return {
    sourceOk: false,
    temperature: null,
    windSpeedKmh: null,
    windDirection: null,
    windGustKmh: null,
    precipitationMm: null,
    rainMm: null,
    showersMm: null,
    precipitationProbability: null,
    time: null
  };
}

function fallbackMarine() {
  return {
    sourceOk: false,
    waveHeight: null,
    waveDirection: null,
    wavePeriod: null,
    seaSurfaceTemperature: null,
    currentVelocityKmh: null,
    currentDirection: null,
    time: null
  };
}

function calculateConfidence({ weatherOk, backendProviderCount = 0, marineOk, seedOk, leadHours }) {
  const backendScore = backendProviderCount >= 2 ? 16 : backendProviderCount > 0 ? 8 : 0;
  const sourceScore = (weatherOk ? 18 : 0) + backendScore + (marineOk ? 18 : 0) + (seedOk ? 10 : 0);
  const leadPenalty = Math.min(18, Math.max(0, leadHours - 6) * 0.55);
  const truthBonus = seedOk ? 8 : 0;
  const score = Math.round(42 + sourceScore + truthBonus - leadPenalty);
  let cap = backendProviderCount >= 2 ? 78 : 72;
  if (!weatherOk || !marineOk) cap = Math.min(cap, 55);
  if (!seedOk) cap = Math.min(cap, 60);
  if (leadHours >= 24) cap = Math.min(cap, 56);
  return Math.max(20, Math.min(cap, score));
}

function currentFusionWeights(frame) {
  const leadFactor = Math.max(0.55, 1 - frame.hours * 0.012);
  const raw = {
    weather: frame.weather.sourceOk ? 0.42 * leadFactor : 0,
    marine: frame.marine.sourceOk ? 0.42 * leadFactor : 0,
    seed: frame.fallback ? 0.16 : 0
  };
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0) || 1;
  return Object.fromEntries(
    Object.entries(raw).map(([name, value]) => [name, (value / total).toFixed(2)])
  );
}

function describeConditionKey(weather, marine, confidence) {
  const windKn = kmhToKnots(weather.windSpeedKmh);
  const wave = marine.waveHeight;
  if (confidence < 45) return "condition.trend";
  if (windKn !== null && windKn >= 24) return "condition.wind";
  if (wave !== null && wave >= 1.2) return "condition.wave";
  if (windKn !== null && wave !== null) return "condition.usable";
  return "condition.partial";
}

function buildQuickEvents(weather, marine) {
  const rainValues = weather?.hourly?.precipitation || weather?.hourly?.rain || weather?.hourly?.showers || [];
  const rainPoints = hourlySeries(
    weather?.hourly?.time,
    rainValues,
    (_value, index) => ({
      value: rainIntensityFromValues(
        weather?.hourly?.precipitation?.[index],
        weather?.hourly?.rain?.[index],
        weather?.hourly?.showers?.[index]
      ),
      probability: asNumber(weather?.hourly?.precipitation_probability?.[index])
    })
  );
  const windPoints = hourlySeries(
    weather?.hourly?.time,
    weather?.hourly?.wind_speed_10m,
    (value) => {
      const speed = asNumber(value);
      return speed === null ? null : kmhToKnots(speed);
    }
  );
  const wavePoints = hourlySeries(
    marine?.hourly?.time,
    marine?.hourly?.wave_height,
    (value) => asNumber(value)
  );
  const rainCandidates = rainPoints.filter((point) => (
    point.value >= RAIN_ALERT_MM_PER_H ||
    (point.probability >= RAIN_ALERT_PROBABILITY && point.value > 0)
  ));
  return {
    nextRain: rainCandidates[0] || null,
    peakRain: maxBy(rainPoints, "value"),
    windPeak: maxBy(windPoints, "value"),
    wavePeak: maxBy(wavePoints, "value")
  };
}

function hourlySeries(times, values, transform) {
  if (!Array.isArray(times) || !Array.isArray(values)) return [];
  const now = Date.now();
  return times
    .map((time, index) => {
      const timestamp = new Date(time).getTime();
      const transformed = transform(values[index], index);
      const value = typeof transformed === "object" && transformed !== null
        ? asNumber(transformed.value)
        : transformed;
      const leadHours = (timestamp - now) / 3600000;
      return Number.isFinite(timestamp) && value !== null
        ? { time, timestamp, leadHours, value, ...(typeof transformed === "object" && transformed !== null ? transformed : {}) }
        : null;
    })
    .filter((point) => point && point.leadHours >= -0.5 && point.leadHours <= 48)
    .sort((a, b) => a.timestamp - b.timestamp);
}

function maxBy(points, key) {
  if (!Array.isArray(points) || points.length === 0) return null;
  return points.reduce((best, point) => (
    !best || Number(point[key]) > Number(best[key]) ? point : best
  ), null);
}

function renderQuickSituation(frame) {
  if (!frame) return;
  const events = state.quickEvents || {};
  const rainText = formatRainEvent(events.nextRain, events.peakRain);
  const windText = events.windPeak ? formatPeakEvent(events.windPeak, "kn", 0) : "--";
  const waveText = events.wavePeak ? formatPeakEvent(events.wavePeak, "m", 1) : "--";
  if (el.nextRain) el.nextRain.textContent = rainText;
  if (el.rainTiming) el.rainTiming.textContent = rainText;
  if (el.windTiming) el.windTiming.textContent = windText;
  if (el.waveTiming) el.waveTiming.textContent = waveText;
  if (el.eventSummary) el.eventSummary.textContent = priorityEventText(frame, events);
  if (el.updateState) el.updateState.textContent = state.liveLoadedAt ? shortClock(state.liveLoadedAt) : "--";
}

function formatRainEvent(nextRain, peakRain) {
  if (nextRain) {
    const label = nextRain.leadHours <= 0.5 ? t("event.now") : shortClock(nextRain.timestamp);
    const probability = Number.isFinite(Number(nextRain.probability)) ? ` / ${Math.round(nextRain.probability)}%` : "";
    return formatText("event.at", { time: label, value: `${Number(nextRain.value).toFixed(1)} mm/h${probability}` });
  }
  if (peakRain && peakRain.value > 0) {
    return `${t("event.none48")} (${Number(peakRain.value).toFixed(1)} mm/h max)`;
  }
  return t("event.none48");
}

function formatPeakEvent(point, unit, digits) {
  const label = point.leadHours <= 0.5 ? t("event.now") : shortClock(point.timestamp);
  const value = `${Number(point.value).toFixed(digits)} ${unit}`;
  return formatText("event.peak", { time: label, value });
}

function priorityEventText(frame, events) {
  if (frame.confidence < 45) return t("event.lowConfidence");
  if (events.nextRain && events.nextRain.leadHours <= 6) {
    return `${t("event.rain")} ${events.nextRain.leadHours <= 0.5 ? t("event.now") : shortClock(events.nextRain.timestamp)}`;
  }
  const windPeak = Number(events.windPeak?.value);
  if (Number.isFinite(windPeak) && windPeak >= 24) return `${t("event.wind")} ${Math.round(windPeak)} kn`;
  const wavePeak = Number(events.wavePeak?.value);
  if (Number.isFinite(wavePeak) && wavePeak >= 1.2) return `${t("event.wave")} ${wavePeak.toFixed(1)} m`;
  return t("event.stable");
}

function shortClock(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat(state.language, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function toggleTimelinePlayback() {
  if (state.isPlaying) {
    stopTimelinePlayback();
  } else {
    startTimelinePlayback();
  }
}

function startTimelinePlayback() {
  if (state.isPlaying) return;
  if (state.selectedFrame >= TIMELINE.length - 1) selectFrame(0);
  state.isPlaying = true;
  updatePlayButton();
  state.playTimer = window.setInterval(advanceTimelinePlayback, playbackIntervalMs());
}

function stopTimelinePlayback() {
  state.isPlaying = false;
  if (state.playTimer) {
    window.clearInterval(state.playTimer);
    state.playTimer = null;
  }
  updatePlayButton();
}

function advanceTimelinePlayback() {
  const nextIndex = state.selectedFrame + 1;
  if (nextIndex >= TIMELINE.length) {
    stopTimelinePlayback();
    return;
  }
  selectFrame(nextIndex);
  if (nextIndex >= TIMELINE.length - 1) {
    window.setTimeout(stopTimelinePlayback, playbackIntervalMs());
  }
}

function updatePlayButton() {
  if (!el.playButton) return;
  el.playButton.textContent = state.isPlaying ? t("play.pause") : t("play.play");
  el.playButton.dataset.playing = String(state.isPlaying);
}

function playbackIntervalMs() {
  return Math.max(320, Math.round(PLAYBACK_INTERVAL_MS / Math.max(1, state.playbackSpeed || 1)));
}

function setPlaybackSpeed(speed, options = {}) {
  const normalized = [1, 2, 4].includes(speed) ? speed : 1;
  state.playbackSpeed = normalized;
  el.speedButtons?.forEach((button) => {
    button.dataset.active = String(Number(button.dataset.playSpeed) === normalized);
  });
  if (!options.silent && state.isPlaying) {
    stopTimelinePlayback();
    startTimelinePlayback();
  }
}

function zoomChart(delta) {
  if (!state.chart?.map) return;
  const map = state.chart.map;
  map.setZoom(map.getZoom() + delta, { animate: true });
}

function fitMediterranean() {
  if (!state.chart?.map || !window.L) return;
  state.chart.map.fitBounds(MEDITERRANEAN_BOUNDS, {
    padding: [18, 18],
    animate: true
  });
  state.mapFocus = true;
  updateMapFocusState();
  window.setTimeout(() => state.chart?.map?.invalidateSize(), 80);
}

function toggleMapFocus() {
  state.mapFocus = !state.mapFocus;
  updateMapFocusState();
  document.querySelectorAll(".control-menu[open]").forEach((menu) => {
    menu.open = false;
  });
  window.setTimeout(() => state.chart?.map?.invalidateSize(), 80);
}

function updateMapFocusState() {
  document.body.classList.toggle("map-focus", state.mapFocus);
  if (!el.mapFocusButton) return;
  el.mapFocusButton.textContent = state.mapFocus ? t("mode.focusExit") : t("mode.focus");
  el.mapFocusButton.dataset.active = String(state.mapFocus);
}

function selectFrame(index) {
  state.selectedFrame = index;
  el.timelineSlider.value = String(index);
  document.querySelectorAll(".timeline-ticks [data-index]").forEach((tick) => {
    tick.dataset.active = String(Number(tick.dataset.index) === index);
  });
  renderFrame();
}

function renderFrame() {
  const frame = state.frames[state.selectedFrame];
  if (!frame) return;
  const windKn = kmhToKnots(frame.weather.windSpeedKmh);
  const gustKn = kmhToKnots(frame.weather.windGustKmh);
  const currentKn = kmhToKnots(frame.marine.currentVelocityKmh);

  el.placeTitle.textContent = state.location.routeName || state.location.name;
  el.frameLabel.textContent = `${frame.label} ${t("frame.suffix")}`;
  el.conditionText.textContent = t(frame.conditionKey || "condition.loading");
  el.windMetric.textContent = windKn === null ? "--" : `${dirText(frame.weather.windDirection)} ${windKn} kn${gustKn ? ` G${gustKn}` : ""}`;
  el.waveMetric.textContent = valueText(frame.marine.waveHeight, "m", 1);
  el.currentMetric.textContent = currentKn === null ? "--" : `${dirText(frame.marine.currentDirection)} ${currentKn} kn`;
  el.seaMetric.textContent = valueText(frame.marine.seaSurfaceTemperature, "C", 1);
  el.globalConfidence.textContent = String(frame.confidence);
  el.sourceCount.textContent = String(frame.sources);
  el.freshnessState.textContent = frame.weather.sourceOk || frame.marine.sourceOk ? t("quality.live") : t("quality.seed");
  el.truthState.textContent = frame.fallback ? t("quality.seed") : t("quality.none");

  renderSourceHealth();
  renderQualityDashboard(frame);
  renderCalculation(frame);
  renderVectors(frame);
  renderQuickSituation(frame);
  updateChart(frame);
}

function renderSourceHealth() {
  el.sourceHealth.replaceChildren();
  state.sourceHealth.forEach((source) => {
    const row = document.createElement("div");
    row.className = "source-row";
    const text = document.createElement("div");
    const name = source.nameKey ? t(source.nameKey) : source.name;
    text.innerHTML = `<b>${escapeHtml(name)}</b><span>${escapeHtml(source.message)}</span>`;
    const pill = document.createElement("span");
    pill.className = `pill ${source.ok ? "" : "warn"}`;
    pill.textContent = source.mode;
    row.append(text, pill);
    el.sourceHealth.append(row);
  });
}

function renderQualityDashboard(frame) {
  if (!el.qualityDashboard || !frame) return;
  el.qualityDashboard.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "quality-summary";
  [
    [t("quality.forecast"), `${frame.confidence}/100`],
    [t("quality.sources"), `${frame.sources}/4`],
    [t("quality.gps"), state.location.id === "gps" ? t("quality.live") : t("quality.limited")],
    [t("quality.archive"), String(state.forecastArchiveCount)]
  ].forEach(([label, value]) => {
    const chip = document.createElement("div");
    chip.className = "quality-chip";
    const strong = document.createElement("b");
    strong.textContent = value;
    const caption = document.createElement("span");
    caption.textContent = label;
    chip.append(strong, caption);
    summary.append(chip);
  });

  el.qualityDashboard.append(summary);
  qualityRows(frame).forEach((row) => {
    el.qualityDashboard.append(qualityMeter(row));
  });
}

function qualityRows(frame) {
  return [
    {
      label: t("quality.wind"),
      value: variableQuality(frame.weather.sourceOk, Boolean(frame.fallback), frame.hours, 85),
      detail: frame.weather.sourceOk ? t("quality.live") : t("quality.seed")
    },
    {
      label: t("quality.wave"),
      value: variableQuality(frame.marine.sourceOk, false, frame.hours, 65),
      detail: frame.marine.sourceOk ? t("quality.live") : t("quality.limited")
    },
    {
      label: t("quality.current"),
      value: frame.marine.sourceOk ? Math.min(45, variableQuality(true, false, frame.hours, 55)) : 20,
      detail: t("quality.currentCap")
    },
    {
      label: t("quality.bathymetry"),
      value: chartLayerQuality(),
      detail: t("quality.officialHold")
    }
  ];
}

function variableQuality(sourceOk, seedOk, leadHours, cap) {
  const sourceScore = (sourceOk ? 62 : 18) + (seedOk ? 12 : 0);
  const leadPenalty = Math.min(22, Math.max(0, leadHours - 6) * 0.7);
  return Math.max(12, Math.min(cap, Math.round(sourceScore - leadPenalty)));
}

function chartLayerQuality() {
  if (!state.chart?.ready) return 20;
  const entries = Object.values(state.chartLayerHealth);
  if (!entries.length) return 65;
  const failed = entries.filter((entry) => !entry.ok).length;
  return Math.max(35, 92 - failed * 14);
}

function qualityMeter(row) {
  const value = Math.max(0, Math.min(100, Number(row.value) || 0));
  const wrapper = document.createElement("div");
  wrapper.className = "quality-row";
  const label = document.createElement("div");
  const strong = document.createElement("b");
  strong.textContent = row.label;
  const detail = document.createElement("span");
  detail.textContent = row.detail;
  label.append(strong, detail);

  const track = document.createElement("div");
  track.className = "quality-track";
  const fill = document.createElement("span");
  fill.className = `quality-fill ${qualityBand(value)}`;
  fill.style.width = `${value}%`;
  track.append(fill);

  const score = document.createElement("small");
  score.textContent = `${value}/100`;
  wrapper.append(label, track, score);
  return wrapper;
}

function qualityBand(value) {
  if (value < 45) return "bad";
  if (value < 62) return "warn";
  return "";
}

function renderCalculation(frame) {
  const windKn = kmhToKnots(frame.weather.windSpeedKmh);
  const gustKn = kmhToKnots(frame.weather.windGustKmh);
  const weights = currentFusionWeights(frame);
  const backend = backendFusionLines(frame.backendFusion);
  const sourceLine = `source_count=${frame.sources}, lead=${frame.hours}h`;
  const capLine = frame.sources < 2 ? "cap=60 because fewer than two independent live forecast sources" : "cap=78 prototype cap with backend provider fusion";
  const rainLine = `rain=${frame.weather.precipitationMm ?? "na"}mm/h, probability=${frame.weather.precipitationProbability ?? "na"}%`;
  const weatherLine = `wind=${windKn ?? "na"}kn, gust=${gustKn ?? "na"}kn, temp=${frame.weather.temperature ?? "na"}C`;
  const marineLine = `wave=${frame.marine.waveHeight ?? "na"}m, current=${kmhToKnots(frame.marine.currentVelocityKmh) ?? "na"}kn`;
  const regionalLine = `med_grid=${state.regionalWeather?.points?.length || 0}/${state.regionalWeather?.requested || MEDITERRANEAN_POINTS.length} samples, visual_weight=0.00`;
  const chartLine = `chart=${state.baseMode}, depth=EMODnet, seamarks=OpenSeaMap, satellite=Esri, official_enc=not_bundled`;
  const archiveLine = `archive=${state.forecastArchiveCount}/${MAX_LOCAL_ARCHIVE_SNAPSHOTS} local forecast snapshots`;
  const weightLine = `weights weather=${weights.weather}, marine=${weights.marine}, seed=${weights.seed}`;
  const confidenceLine = `confidence=${frame.confidence}/100, mode=${t(frame.conditionKey || "condition.loading")}`;
  el.calculationBox.textContent = [
    sourceLine,
    capLine,
    weatherLine,
    rainLine,
    marineLine,
    regionalLine,
    backend.summary,
    ...backend.variables,
    chartLine,
    archiveLine,
    weightLine,
    confidenceLine,
    "",
    "planned fusion:",
    "corrected = forecast - bias",
    "loss = EWMA(abs(corrected-observed)/scale)",
    "weight = prior*freshness*availability*diversity*exp(-lambda*loss)"
  ].join("\n");
}

function backendFusionLines(backendFusion) {
  if (!backendFusion?.values) {
    return {
      summary: "backend_fusion=not_available",
      variables: []
    };
  }
  const providers = backendFusion.providers?.length ? backendFusion.providers.join("+") : "unknown";
  const summary = `backend_fusion providers=${providers}, confidence=${backendFusion.confidence ?? "na"}/100`;
  const variables = ["wind_speed_10m", "wind_direction_10m", "temperature_2m", "pressure_msl"]
    .map((variable) => backendFusionVariableLine(variable, backendFusion.values[variable]))
    .filter(Boolean);
  return { summary, variables };
}

function backendFusionVariableLine(variable, item) {
  if (!item) return "";
  const value = item.value ?? "na";
  const unit = item.unit || "";
  const providerValues = Array.isArray(item.provider_values) ? item.provider_values : [];
  const weights = item.weights && typeof item.weights === "object" ? item.weights : {};
  const providerLine = providerValues
    .map((providerValue) => {
      const provider = providerValue.provider || "provider";
      const providerUnit = providerValue.unit || unit;
      return `${provider}:${providerValue.value}${providerUnit}`;
    })
    .join(",");
  const weightLine = Object.entries(weights).map(([name, weight]) => `${name}=${weight}`).join(",");
  const suffix = variable === "wind_speed_10m" && unit === "m/s" ? ` (${mpsToKnots(value) ?? "na"}kn)` : "";
  return `fusion.${variable}=${value}${unit}${suffix} providers=[${providerLine}] weights=[${weightLine}]`;
}

function renderVectors(frame) {
  el.windLayer.replaceChildren();
  el.currentLayer.replaceChildren();
  el.rainSvgLayer?.replaceChildren();
  const windDirection = frame.weather.windDirection ?? 300;
  const currentDirection = frame.marine.currentDirection ?? 42;
  const windStrength = Math.min(46, 22 + (kmhToKnots(frame.weather.windSpeedKmh) || 8) * 0.7);
  const currentStrength = Math.min(32, 14 + (kmhToKnots(frame.marine.currentVelocityKmh) || 2) * 1.2);
  [
    [178, 108], [272, 144], [154, 254], [286, 301], [151, 394], [265, 491]
  ].forEach(([x, y], index) => {
    el.windLayer.append(vectorPath(x, y, windDirection + index * 4, windStrength, "wind-arrow"));
  });
  [
    [224, 382], [336, 252], [205, 552]
  ].forEach(([x, y], index) => {
    el.currentLayer.append(vectorPath(x, y, currentDirection - index * 7, currentStrength, "current-arrow"));
  });
  const warningVisible = frame.confidence < 48 || (frame.weather.precipitationMm ?? 0) >= 3 || (frame.weather.precipitationProbability ?? 0) > 55;
  el.warningZone.style.opacity = warningVisible ? "1" : ".35";
  renderSvgRain(frame);
}

function updateChart(frame) {
  if (!state.chart?.ready || !frame) return;
  const { map, meteo, positionMarker, accuracyCircle } = state.chart;
  const center = [state.location.latitude, state.location.longitude];
  positionMarker.setLatLng(center);
  accuracyCircle.setLatLng(center);
  accuracyCircle.setRadius(state.location.id === "gps" ? Number(accuracyCircle.options.radius || 120) : 180);
  meteo.clearLayers();

  const windKn = kmhToKnots(frame.weather.windSpeedKmh);
  const currentKn = kmhToKnots(frame.marine.currentVelocityKmh);
  if (isControlLayerActive("wind")) {
    renderRegionalWindLayer(frame, meteo);
    addVectorMarker(meteo, destination(center, 315, 3.5), frame.weather.windDirection ?? 300, "wind", `Local wind ${windKn ?? "--"} kn`);
  }
  if (isControlLayerActive("current")) {
    addVectorMarker(meteo, destination(center, 128, 3.5), frame.marine.currentDirection ?? 42, "current", `Current ${currentKn ?? "--"} kn`);
  }
  renderRainLayer(frame);

  const confidenceColor = frame.confidence < 48 ? "#e65b4f" : frame.confidence < 60 ? "#c67b2e" : "#2f8a6f";
  accuracyCircle.setStyle({ color: confidenceColor, fillColor: confidenceColor });
  positionMarker.bindTooltip(
    `<b>${state.location.routeName || state.location.name}</b><br>${frame.label}: ${escapeHtml(t(frame.conditionKey || "condition.loading"))}<br>Wave ${valueText(frame.marine.waveHeight, "m", 1)}`
  );
  if (!map.getBounds().pad(-0.18).contains(center)) {
    map.setView(center, Math.max(map.getZoom(), 10), { animate: false });
  }
  updateChartStatus(frame);
}

function renderRainLayer(frame) {
  if (!state.chart?.ready || !state.chart.rain || !window.L) return;
  const rainLayer = state.chart.rain;
  rainLayer.clearLayers();
  if (!state.chart.map.hasLayer(rainLayer)) return;

  const L = window.L;
  regionalSamplesForFrame(frame).forEach((sample) => {
    const intensity = Number(sample.weather.precipitationMm);
    if (!Number.isFinite(intensity) || intensity < 0.05) return;
    L.circle(sample.coords, {
      radius: rainRadiusM(intensity),
      stroke: false,
      fillColor: rainIntensityColor(intensity),
      fillOpacity: rainOpacity(intensity),
      className: "rain-cell",
      interactive: true
    }).bindTooltip(sampleTooltip(sample)).addTo(rainLayer);
  });
}

function renderSvgRain(frame) {
  if (!el.rainSvgLayer) return;
  const intensity = Number(frame?.weather?.precipitationMm);
  if (!Number.isFinite(intensity) || intensity < 0.05) return;
  const count = Math.min(9, Math.max(2, Math.round(2 + intensity * 1.5)));
  for (let index = 0; index < count; index += 1) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const x = 125 + ((index * 47 + frame.hours * 9) % 230);
    const y = 70 + ((index * 71 + frame.hours * 13) % 430);
    const value = Math.max(0.1, intensity + ((index % 4) - 1.5) * 0.35);
    circle.setAttribute("class", "rain-blob");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", String(18 + Math.min(46, value * 4.2)));
    circle.setAttribute("fill", rainIntensityColor(value));
    circle.setAttribute("opacity", String(rainOpacity(value)));
    el.rainSvgLayer.append(circle);
  }
}

function regionalSamplesForFrame(frame) {
  const points = Array.isArray(state.regionalWeather?.points) ? state.regionalWeather.points : [];
  const samples = points.map((point) => ({
    id: point.id,
    label: point.label,
    coords: [point.latitude, point.longitude],
    weather: pickWeather(point.payload, frame.hours)
  }));
  if (samples.length > 0) return samples;
  return [{
    id: "local",
    label: state.location.routeName || state.location.name,
    coords: [state.location.latitude, state.location.longitude],
    weather: frame.weather
  }];
}

function renderRegionalWindLayer(frame, layer) {
  regionalSamplesForFrame(frame).forEach((sample) => {
    const windKn = kmhToKnots(sample.weather.windSpeedKmh);
    if (windKn === null || windKn < 2) return;
    addWindFieldMarker(layer, sample, windKn);
  });
}

function addWindFieldMarker(layer, sample, windKn) {
  const L = window.L;
  const rotation = Number.isFinite(Number(sample.weather.windDirection)) ? Number(sample.weather.windDirection) : 0;
  const gustKn = kmhToKnots(sample.weather.windGustKmh);
  const label = `${sample.label}: ${dirText(sample.weather.windDirection)} ${windKn} kn${gustKn ? ` G${gustKn}` : ""}`;
  L.marker(sample.coords, {
    icon: L.divIcon({
      className: "",
      html: `<span class="wind-field-marker" style="--wind-color:${windColor(windKn)};--wind-size:${windMarkerSize(windKn)}px" title="${escapeHtml(label)}"><span style="transform:rotate(${rotation}deg)">↑</span><small>${windKn}</small></span>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    })
  }).bindTooltip(`${escapeHtml(label)}<br>${sampleTooltip(sample)}`).addTo(layer);
}

function sampleTooltip(sample) {
  const rain = sample.weather.precipitationMm;
  const probability = sample.weather.precipitationProbability;
  const windKn = kmhToKnots(sample.weather.windSpeedKmh);
  const gustKn = kmhToKnots(sample.weather.windGustKmh);
  const rainText = Number.isFinite(Number(rain)) ? `${Number(rain).toFixed(1)} mm/h` : "--";
  const probabilityText = Number.isFinite(Number(probability)) ? `, ${Math.round(probability)}% probability` : "";
  const windText = windKn === null ? "--" : `${dirText(sample.weather.windDirection)} ${windKn} kn${gustKn ? ` G${gustKn}` : ""}`;
  return `<b>${escapeHtml(sample.label)}</b><br>Rain ${rainText}${probabilityText}<br>Wind ${escapeHtml(windText)}`;
}

function rainRadiusM(value) {
  const intensity = Math.max(0, Number(value) || 0);
  return 12000 + Math.min(66000, intensity * 7800);
}

function rainOpacity(value) {
  const intensity = Math.max(0, Number(value) || 0);
  return Math.min(0.76, 0.24 + intensity * 0.055);
}

function rainIntensityColor(value) {
  if (value >= 15) return "#f5d536";
  if (value >= 8) return "#f06555";
  if (value >= 3) return "#b946e6";
  if (value >= 1) return "#3978e6";
  if (value >= 0.1) return "#30bdf0";
  return "#8deff2";
}

function windColor(value) {
  if (value >= 20) return "#f06555";
  if (value >= 10) return "#f1bd2d";
  return "#49d4b4";
}

function windMarkerSize(value) {
  return Math.max(24, Math.min(42, 22 + Number(value || 0) * 0.7));
}

function isControlLayerActive(name) {
  const button = document.querySelector(`[data-layer="${name}"]`);
  return !button || button.dataset.active === "true";
}

async function queryDepthAt(latlng) {
  if (!state.chart?.ready || !window.L) return;
  const L = window.L;
  const map = state.chart.map;
  const popup = L.popup({ closeButton: true, autoPan: true })
    .setLatLng(latlng)
    .setContent(t("chart.depthQuery"))
    .openOn(map);
  try {
    const response = await fetch(buildDepthInfoUrl(latlng), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const depthText = extractDepthText(text);
    popup.setContent([
      `<b>${escapeHtml(depthText.title)}</b>`,
      escapeHtml(depthText.detail),
      "<small>EMODnet planning data. Verify against official chart before navigation.</small>"
    ].join("<br>"));
    const stateText = depthText.title === "No point depth returned"
      ? "Depth query reached EMODnet, but no numeric point depth was returned; use contours and official chart."
      : "Depth query returned EMODnet point context; official ENC/HHI chart still required for navigation.";
    updateChartDataState(stateText);
  } catch (error) {
    popup.setContent([
      "<b>Depth query unavailable</b>",
      escapeHtml(error.message || "No point value returned"),
      "<small>Keep depth/contour layers as visual planning context only.</small>"
    ].join("<br>"));
    updateChartDataState(t("chart.depthFailed"));
  }
}

function buildDepthInfoUrl(latlng) {
  const map = state.chart.map;
  const point = map.latLngToContainerPoint(latlng, map.getZoom());
  const size = map.getSize();
  const bounds = map.getBounds();
  const crs = map.options.crs;
  const sw = crs.project(bounds.getSouthWest());
  const ne = crs.project(bounds.getNorthEast());
  const params = new URLSearchParams({
    service: "WMS",
    request: "GetFeatureInfo",
    version: "1.3.0",
    layers: "emodnet:mean_multicolour",
    query_layers: "emodnet:mean_multicolour",
    styles: "",
    crs: "EPSG:3857",
    bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
    width: String(size.x),
    height: String(size.y),
    format: "image/png",
    transparent: "true",
    info_format: "application/json",
    i: String(Math.round(point.x)),
    j: String(Math.round(point.y))
  });
  return `https://ows.emodnet-bathymetry.eu/wms?${params}`;
}

function extractDepthText(text) {
  try {
    const data = JSON.parse(text);
    const props = data.features?.[0]?.properties || {};
    const entries = Object.entries(props);
    const candidate = entries.find(([key]) => /depth|mean|value|gray|pixel/i.test(key));
    if (candidate) {
      const value = Number(candidate[1]);
      if (Number.isFinite(value)) {
        const sign = value > 0 ? -value : value;
        return { title: "EMODnet point depth", detail: `approx ${Math.abs(sign).toFixed(1)} m below reference surface` };
      }
      return { title: "EMODnet point attribute", detail: `${candidate[0]}=${String(candidate[1])}` };
    }
  } catch {
    const compact = text.replace(/\s+/g, " ").trim();
    if (compact) return { title: "EMODnet response", detail: compact.slice(0, 120) };
  }
  return { title: "No point depth returned", detail: "Use visible depth colour, contours and official chart cross-check." };
}

function addVectorMarker(layer, coords, direction, kind, label) {
  const L = window.L;
  const rotation = Number.isFinite(Number(direction)) ? Number(direction) : 0;
  L.marker(coords, {
    icon: L.divIcon({
      className: "",
      html: `<span class="vector-marker ${kind}" title="${label}"><span style="display:block;transform:rotate(${rotation}deg)">↑</span></span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }).bindTooltip(label).addTo(layer);
}

function destination(center, bearingDegrees, distanceKm) {
  const radiusKm = 6371;
  const bearing = bearingDegrees * Math.PI / 180;
  const lat1 = center[0] * Math.PI / 180;
  const lon1 = center[1] * Math.PI / 180;
  const angular = distanceKm / radiusKm;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angular) +
    Math.cos(lat1) * Math.sin(angular) * Math.cos(bearing)
  );
  const lon2 = lon1 + Math.atan2(
    Math.sin(bearing) * Math.sin(angular) * Math.cos(lat1),
    Math.cos(angular) - Math.sin(lat1) * Math.sin(lat2)
  );
  return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

function updateChartStatus(frame, override) {
  if (!el.chartStatus) return;
  if (override) {
    el.chartStatus.textContent = override;
    return;
  }
  if (!frame) {
    el.chartStatus.textContent = t("chart.initial");
    return;
  }
  const windKn = kmhToKnots(frame.weather.windSpeedKmh);
  const activeLayers = state.chart?.layers
    ? Object.entries(state.chart.layers)
      .filter(([, layer]) => state.chart.map.hasLayer(layer))
      .map(([name]) => name)
      .filter((name) => !["streetBase", "satelliteBase"].includes(name))
      .join("/")
    : "na";
  el.chartStatus.textContent = formatText("chart.status", {
    base: state.baseMode,
    frame: frame.label,
    confidence: frame.confidence,
    layers: activeLayers || "base",
    wind: windKn ?? "--",
    wave: valueText(frame.marine.waveHeight, "m", 1)
  });
  updateChartDataState();
}

function vectorPath(x, y, directionDegrees, length, className) {
  const radians = (directionDegrees - 90) * Math.PI / 180;
  const x2 = x + Math.cos(radians) * length;
  const y2 = y + Math.sin(radians) * length;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", className);
  path.setAttribute("d", `M${x} ${y}L${x2.toFixed(1)} ${y2.toFixed(1)}`);
  return path;
}

function useGps() {
  if (!navigator.geolocation) {
    updateGpsState("gps.unavailable");
    return;
  }
  if (state.gpsWatchId !== null) {
    navigator.geolocation.clearWatch(state.gpsWatchId);
    state.gpsWatchId = null;
    updateGpsState("gps.idle");
    updateLocateButton();
    return;
  }
  updateGpsState("gps.loading");
  navigator.geolocation.getCurrentPosition(
    (position) => applyGpsPosition(position, true),
    () => updateGpsState("gps.blocked"),
    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
  );
  state.gpsWatchId = navigator.geolocation.watchPosition(
    (position) => applyGpsPosition(position, false),
    () => updateGpsState("gps.blocked"),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
  );
}

function centerOnGpsPosition() {
  const cached = state.lastGpsPosition || (state.location.id === "gps" ? {
    latitude: state.location.latitude,
    longitude: state.location.longitude,
    accuracy: 120
  } : null);
  if (cached) {
    centerChartOnPosition(cached.latitude, cached.longitude, cached.accuracy, { zoom: GPS_CENTER_ZOOM, animate: true });
    updateGpsState("gps.live");
    updateLocateButton();
    return;
  }
  if (!navigator.geolocation) {
    updateGpsState("gps.unavailable");
    return;
  }
  updateGpsState("gps.loading");
  navigator.geolocation.getCurrentPosition(
    (position) => applyGpsPosition(position, true, { centerZoom: GPS_CENTER_ZOOM }),
    () => updateGpsState("gps.blocked"),
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 }
  );
}

function centerChartOnPosition(latitude, longitude, accuracy, options = {}) {
  if (!state.chart?.map) return;
  const center = [latitude, longitude];
  const radius = Math.max(25, Math.min(1500, Number.isFinite(accuracy) ? accuracy : 120));
  const { map, positionMarker, accuracyCircle } = state.chart;
  if (positionMarker) positionMarker.setLatLng(center);
  if (accuracyCircle) {
    accuracyCircle.setLatLng(center);
    accuracyCircle.setRadius(radius);
  }
  const targetZoom = Math.max(map.getZoom(), options.zoom || GPS_CENTER_ZOOM);
  if (typeof map.flyTo === "function" && options.animate !== false) {
    map.flyTo(center, targetZoom, { animate: true, duration: 0.55 });
  } else {
    map.setView(center, targetZoom, { animate: options.animate !== false });
  }
  if (el.chartMap) {
    el.chartMap.dataset.gpsCentered = "true";
    el.chartMap.dataset.gpsZoom = String(targetZoom);
  }
  window.setTimeout(() => map.invalidateSize(), 80);
}

async function applyGpsPosition(position, forceReload, options = {}) {
  const { latitude, longitude, accuracy } = position.coords;
  const shouldReload = forceReload || shouldReloadGpsForecast(latitude, longitude);
  state.lastGpsPosition = {
    latitude,
    longitude,
    accuracy,
    timestamp: Date.now()
  };
  state.location = {
    id: "gps",
    name: "GPS Position",
    routeName: "GPS Sailing Position",
    latitude,
    longitude,
    timezone: DEFAULT_LOCATION.timezone
  };
  el.positionDot.setAttribute("cx", "126");
  el.positionDot.setAttribute("cy", "308");
  el.accuracyRing.setAttribute("cx", "126");
  el.accuracyRing.setAttribute("cy", "308");
  el.accuracyRing.setAttribute("r", String(Math.max(18, Math.min(70, accuracy / 8))));
  centerChartOnPosition(latitude, longitude, accuracy, { zoom: forceReload ? (options.centerZoom || GPS_CENTER_ZOOM) : 12 });
  updateGpsState("gps.live");
  updateLocateButton();
  if (shouldReload) {
    state.lastGpsForecastAt = Date.now();
    state.lastGpsForecastLocation = { latitude, longitude };
    await loadForecast();
  } else {
    renderFrame();
  }
}

function shouldReloadGpsForecast(latitude, longitude) {
  if (!state.lastGpsForecastAt || !state.lastGpsForecastLocation) return true;
  const age = Date.now() - state.lastGpsForecastAt;
  const moved = distanceMeters(state.lastGpsForecastLocation, { latitude, longitude });
  return age > GPS_RELOAD_INTERVAL_MS || moved > GPS_RELOAD_DISTANCE_M;
}

function distanceMeters(a, b) {
  const radiusM = 6371000;
  const lat1 = a.latitude * Math.PI / 180;
  const lat2 = b.latitude * Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * radiusM * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function updateGpsState(keyOrText) {
  if (!el.gpsButton) return;
  const isKey = Boolean(I18N.en[keyOrText]);
  state.gpsLabelKey = isKey ? keyOrText : null;
  const text = isKey ? t(keyOrText) : keyOrText;
  const dot = document.createElement("span");
  dot.className = "gps-dot";
  dot.setAttribute("aria-hidden", "true");
  el.gpsButton.replaceChildren(dot, document.createTextNode(text));
}

function updateLocateButton() {
  if (!el.locateButton) return;
  el.locateButton.textContent = t("gps.center");
  el.locateButton.title = t("gps.centerTitle");
  el.locateButton.setAttribute("aria-label", t("gps.centerTitle"));
  el.locateButton.dataset.ready = String(Boolean(state.lastGpsPosition || state.location.id === "gps"));
}

function renderLoadingState() {
  state.frames = TIMELINE.map((item) => ({
    label: item.label,
    hours: item.hours,
    weather: fallbackWeather(),
    marine: fallbackMarine(),
    fallback: null,
    backendFusion: null,
    sources: 0,
    confidence: 20,
    conditionKey: "condition.loading"
  }));
  selectFrame(0);
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function rainIntensityFromValues(precipitation, rain, showers) {
  const total = asNumber(precipitation);
  if (total !== null) return total;
  const rainValue = asNumber(rain) || 0;
  const showerValue = asNumber(showers) || 0;
  const combined = rainValue + showerValue;
  return combined > 0 ? combined : null;
}

function kmhToKnots(value) {
  if (value === null || value === undefined) return null;
  return Math.round(Number(value) * 0.539957);
}

function mpsToKnots(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Math.round(Number(value) * 1.943844);
}

function valueText(value, unit, digits) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return `${Number(value).toFixed(digits)} ${unit}`;
}

function dirText(degrees) {
  if (degrees === null || degrees === undefined || Number.isNaN(Number(degrees))) return "--";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(Number(degrees) / 45) % 8];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

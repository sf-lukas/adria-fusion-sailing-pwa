const DEFAULT_LOCATION = {
  id: "split",
  name: "Split",
  routeName: "Split - Brac Window",
  latitude: 43.5081,
  longitude: 16.4402,
  timezone: "Europe/Zagreb"
};

const TIMELINE = [
  { label: "Now", hours: 0 },
  { label: "+1h", hours: 1 },
  { label: "+3h", hours: 3 },
  { label: "+6h", hours: 6 },
  { label: "+12h", hours: 12 },
  { label: "+24h", hours: 24 },
  { label: "+48h", hours: 48 }
];

const FORECAST_ARCHIVE_KEY = "adria_fusion_forecast_archive_v1";
const MAX_LOCAL_ARCHIVE_SNAPSHOTS = 180;
const GPS_RELOAD_INTERVAL_MS = 15 * 60 * 1000;
const GPS_RELOAD_DISTANCE_M = 500;

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
  lastGpsForecastLocation: null
};

const el = {
  mapCard: document.querySelector(".map-card"),
  chartMap: document.getElementById("chartMap"),
  weatherMap: document.getElementById("weatherMap"),
  chartStatus: document.getElementById("chartStatus"),
  placeTitle: document.getElementById("placeTitle"),
  gpsButton: document.getElementById("gpsButton"),
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
  timelineButtons: document.getElementById("timelineButtons"),
  timelineSlider: document.getElementById("timelineSlider"),
  sourceHealth: document.getElementById("sourceHealth"),
  calculationBox: document.getElementById("calculationBox"),
  windLayer: document.getElementById("windLayer"),
  currentLayer: document.getElementById("currentLayer"),
  positionDot: document.getElementById("positionDot"),
  accuracyRing: document.getElementById("accuracyRing"),
  warningZone: document.getElementById("warningZone")
};

init();

async function init() {
  registerServiceWorker();
  buildTimelineControls();
  wireControls();
  initChartMap();
  renderLoadingState();
  await loadForecast();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => undefined);
  }
}

function buildTimelineControls() {
  el.timelineButtons.replaceChildren();
  TIMELINE.forEach((frame, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = frame.label;
    button.dataset.index = String(index);
    button.setAttribute("aria-pressed", String(index === state.selectedFrame));
    button.addEventListener("click", () => selectFrame(index));
    el.timelineButtons.append(button);
  });
}

function wireControls() {
  el.timelineSlider.max = String(TIMELINE.length - 1);
  el.timelineSlider.addEventListener("input", () => selectFrame(Number(el.timelineSlider.value)));
  el.gpsButton.addEventListener("click", useGps);
  document.querySelectorAll("[data-map-mode]").forEach((button) => {
    button.addEventListener("click", () => setMapMode(button.dataset.mapMode));
  });
  document.querySelectorAll("[data-base-mode]").forEach((button) => {
    button.addEventListener("click", () => setBaseMode(button.dataset.baseMode));
  });
  document.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.dataset.active !== "true";
      button.dataset.active = String(active);
      const target = document.querySelector(`[data-svg-layer="${button.dataset.layer}"]`);
      if (target) target.style.display = active ? "" : "none";
    });
  });
  document.querySelectorAll("[data-chart-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.dataset.active !== "true";
      button.dataset.active = String(active);
      toggleChartLayer(button.dataset.chartLayer, active);
    });
  });
}

async function loadForecast() {
  state.liveLoadedAt = new Date();
  const seedPromise = loadSeed();
  const weatherPromise = fetchWeather(state.location);
  const marinePromise = fetchMarine(state.location);
  const [seedResult, weatherResult, marineResult] = await Promise.allSettled([
    seedPromise,
    weatherPromise,
    marinePromise
  ]);

  state.seed = seedResult.status === "fulfilled" ? seedResult.value : null;
  const weatherPayload = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const marinePayload = marineResult.status === "fulfilled" ? marineResult.value : null;
  state.forecastArchiveCount = archiveForecastSnapshot(weatherPayload, marinePayload);
  const weather = sourceResult("Open-Meteo Weather", weatherResult);
  const marine = sourceResult("Open-Meteo Marine", marineResult);
  const seed = state.seed ? {
    name: "DHMZ Seed Truth",
    ok: true,
    mode: "seed",
    message: `Last local verification ${state.seed.run_id || "available"}`
  } : {
    name: "DHMZ Seed Truth",
    ok: false,
    mode: "offline",
    message: "Seed snapshot not available"
  };
  const localArchive = {
    name: "Local Forecast Archive",
    ok: state.forecastArchiveCount > 0,
    mode: "device",
    message: `${state.forecastArchiveCount} device snapshots retained from this browser`
  };
  const chart = {
    name: "Chart Layers",
    ok: Boolean(state.chart?.ready),
    mode: state.chart?.ready ? "live" : "fallback",
    message: state.chart?.ready ? chartLayerSummary() : "Forecast fallback map active"
  };
  const officialChart = {
    name: "HHI/PRIMAR Official ENC",
    ok: false,
    mode: "licensed",
    message: "Not bundled; requires official Croatian chart license/distributor access"
  };

  state.sourceHealth = [weather, marine, seed, localArchive, chart, officialChart];
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
    updateChartStatus(null, "Live chart library unavailable; using forecast fallback.");
    return;
  }

  const L = window.L;
  const map = L.map(el.chartMap, {
    zoomControl: false,
    attributionControl: true,
    preferCanvas: true
  }).setView([DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude], 11);
  L.control.zoom({ position: "bottomright" }).addTo(map);

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
    layers: { streetBase, satelliteBase, depth, contours, seamarks, shoals, quality, route },
    baseLayers: { streetBase, satelliteBase, emodnetMean, gebcoRelief },
    meteo,
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
  if (!state.chart?.map || !state.chart.layers?.[name]) return;
  setLayerActive(state.chart.layers[name], active);
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
  el.chartDataState.textContent = message || `${chartLayerSummary()}. Official ENC/HHI charts are not bundled.`;
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
      "weather_code"
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "wind_speed_10m",
      "wind_direction_10m"
    ].join(","),
    forecast_days: "3",
    timezone: locationValue.timezone
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

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function sourceResult(name, result) {
  if (result.status === "fulfilled") {
    return { name, ok: true, mode: "live", message: "Live API loaded" };
  }
  return { name, ok: false, mode: "fallback", message: result.reason?.message || "not available" };
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
    const sources = [
      weatherPoint.sourceOk,
      marinePoint.sourceOk,
      Boolean(fallback)
    ].filter(Boolean).length;
    const confidence = calculateConfidence({
      weatherOk: weatherPoint.sourceOk,
      marineOk: marinePoint.sourceOk,
      seedOk: Boolean(fallback),
      leadHours: item.hours
    });
    return {
      label: item.label,
      hours: item.hours,
      weather: weatherPoint,
      marine: marinePoint,
      fallback,
      sources,
      confidence,
      condition: describeCondition(weatherPoint, marinePoint, confidence)
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

function calculateConfidence({ weatherOk, marineOk, seedOk, leadHours }) {
  const sourceScore = (weatherOk ? 20 : 0) + (marineOk ? 20 : 0) + (seedOk ? 10 : 0);
  const leadPenalty = Math.min(18, Math.max(0, leadHours - 6) * 0.55);
  const truthBonus = seedOk ? 8 : 0;
  const score = Math.round(42 + sourceScore + truthBonus - leadPenalty);
  let cap = 72;
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

function describeCondition(weather, marine, confidence) {
  const windKn = kmhToKnots(weather.windSpeedKmh);
  const wave = marine.waveHeight;
  if (confidence < 45) return "Trend only - verify before departure";
  if (windKn !== null && windKn >= 24) return "Wind window is demanding";
  if (wave !== null && wave >= 1.2) return "Wave comfort is reduced";
  if (windKn !== null && wave !== null) return "Usable sailing window";
  return "Partial forecast coverage";
}

function selectFrame(index) {
  state.selectedFrame = index;
  el.timelineSlider.value = String(index);
  document.querySelectorAll(".timeline-buttons button").forEach((button) => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.index) === index));
  });
  renderFrame();
}

function renderFrame() {
  const frame = state.frames[state.selectedFrame];
  if (!frame) return;
  const windKn = kmhToKnots(frame.weather.windSpeedKmh);
  const currentKn = kmhToKnots(frame.marine.currentVelocityKmh);

  el.placeTitle.textContent = state.location.routeName || state.location.name;
  el.frameLabel.textContent = `${frame.label} frame`;
  el.conditionText.textContent = frame.condition;
  el.windMetric.textContent = windKn === null ? "--" : `${dirText(frame.weather.windDirection)} ${windKn} kn`;
  el.waveMetric.textContent = valueText(frame.marine.waveHeight, "m", 1);
  el.currentMetric.textContent = currentKn === null ? "--" : `${dirText(frame.marine.currentDirection)} ${currentKn} kn`;
  el.seaMetric.textContent = valueText(frame.marine.seaSurfaceTemperature, "C", 1);
  el.globalConfidence.textContent = String(frame.confidence);
  el.sourceCount.textContent = String(frame.sources);
  el.freshnessState.textContent = frame.weather.sourceOk || frame.marine.sourceOk ? "live" : "seed";
  el.truthState.textContent = frame.fallback ? "seed" : "none";

  renderSourceHealth();
  renderCalculation(frame);
  renderVectors(frame);
  updateChart(frame);
}

function renderSourceHealth() {
  el.sourceHealth.replaceChildren();
  state.sourceHealth.forEach((source) => {
    const row = document.createElement("div");
    row.className = "source-row";
    const text = document.createElement("div");
    text.innerHTML = `<b>${source.name}</b><span>${source.message}</span>`;
    const pill = document.createElement("span");
    pill.className = `pill ${source.ok ? "" : "warn"}`;
    pill.textContent = source.mode;
    row.append(text, pill);
    el.sourceHealth.append(row);
  });
}

function renderCalculation(frame) {
  const windKn = kmhToKnots(frame.weather.windSpeedKmh);
  const weights = currentFusionWeights(frame);
  const sourceLine = `source_count=${frame.sources}, lead=${frame.hours}h`;
  const capLine = frame.sources < 2 ? "cap=60 because fewer than two independent live forecast sources" : "cap=72 prototype cap";
  const weatherLine = `wind=${windKn ?? "na"}kn, temp=${frame.weather.temperature ?? "na"}C`;
  const marineLine = `wave=${frame.marine.waveHeight ?? "na"}m, current=${kmhToKnots(frame.marine.currentVelocityKmh) ?? "na"}kn`;
  const chartLine = `chart=${state.baseMode}, depth=EMODnet, seamarks=OpenSeaMap, satellite=Esri, official_enc=not_bundled`;
  const archiveLine = `archive=${state.forecastArchiveCount}/${MAX_LOCAL_ARCHIVE_SNAPSHOTS} local forecast snapshots`;
  const weightLine = `weights weather=${weights.weather}, marine=${weights.marine}, seed=${weights.seed}`;
  const confidenceLine = `confidence=${frame.confidence}/100, mode=${frame.condition}`;
  el.calculationBox.textContent = [
    sourceLine,
    capLine,
    weatherLine,
    marineLine,
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

function renderVectors(frame) {
  el.windLayer.replaceChildren();
  el.currentLayer.replaceChildren();
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
  const warningVisible = frame.confidence < 48 || (frame.weather.precipitationProbability ?? 0) > 55;
  el.warningZone.style.opacity = warningVisible ? "1" : ".35";
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
  addVectorMarker(meteo, destination(center, 315, 3.5), frame.weather.windDirection ?? 300, "wind", `Wind ${windKn ?? "--"} kn`);
  addVectorMarker(meteo, destination(center, 128, 3.5), frame.marine.currentDirection ?? 42, "current", `Current ${currentKn ?? "--"} kn`);

  const confidenceColor = frame.confidence < 48 ? "#e65b4f" : frame.confidence < 60 ? "#c67b2e" : "#2f8a6f";
  accuracyCircle.setStyle({ color: confidenceColor, fillColor: confidenceColor });
  positionMarker.bindTooltip(
    `<b>${state.location.routeName || state.location.name}</b><br>${frame.label}: ${frame.condition}<br>Wave ${valueText(frame.marine.waveHeight, "m", 1)}`
  );
  if (!map.getBounds().pad(-0.18).contains(center)) {
    map.setView(center, Math.max(map.getZoom(), 10), { animate: false });
  }
  updateChartStatus(frame);
}

async function queryDepthAt(latlng) {
  if (!state.chart?.ready || !window.L) return;
  const L = window.L;
  const map = state.chart.map;
  const popup = L.popup({ closeButton: true, autoPan: true })
    .setLatLng(latlng)
    .setContent("Depth query...")
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
    updateChartDataState("Depth point query failed; map layers remain visual planning context.");
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
    el.chartStatus.textContent = "Chart layers: OSM/Esri base, OpenSeaMap seamarks, EMODnet depth/contours.";
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
  el.chartStatus.textContent = [
    `Map ${state.baseMode} ${frame.label}: confidence ${frame.confidence}/100`,
    `layers ${activeLayers || "base"}`,
    `wind ${windKn ?? "--"} kn`,
    `wave ${valueText(frame.marine.waveHeight, "m", 1)}`,
    "depth/shallows are planning context"
  ].join(" | ");
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
    updateGpsState("GPS unavailable");
    return;
  }
  if (state.gpsWatchId !== null) {
    navigator.geolocation.clearWatch(state.gpsWatchId);
    state.gpsWatchId = null;
    updateGpsState("GPS");
    return;
  }
  updateGpsState("GPS...");
  navigator.geolocation.getCurrentPosition(
    (position) => applyGpsPosition(position, true),
    () => updateGpsState("GPS blocked"),
    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
  );
  state.gpsWatchId = navigator.geolocation.watchPosition(
    (position) => applyGpsPosition(position, false),
    () => updateGpsState("GPS blocked"),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
  );
}

async function applyGpsPosition(position, forceReload) {
  const { latitude, longitude, accuracy } = position.coords;
  const shouldReload = forceReload || shouldReloadGpsForecast(latitude, longitude);
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
  if (state.chart?.accuracyCircle) {
    state.chart.accuracyCircle.setRadius(Math.max(25, Math.min(1500, accuracy)));
    state.chart.map.setView([latitude, longitude], Math.max(state.chart.map.getZoom(), 12));
  }
  updateGpsState("GPS live");
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

function updateGpsState(text) {
  if (!el.gpsButton) return;
  const dot = document.createElement("span");
  dot.className = "gps-dot";
  dot.setAttribute("aria-hidden", "true");
  el.gpsButton.replaceChildren(dot, document.createTextNode(text));
}

function renderLoadingState() {
  state.frames = TIMELINE.map((item) => ({
    label: item.label,
    hours: item.hours,
    weather: fallbackWeather(),
    marine: fallbackMarine(),
    fallback: null,
    sources: 0,
    confidence: 20,
    condition: "Loading forecast"
  }));
  selectFrame(0);
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function kmhToKnots(value) {
  if (value === null || value === undefined) return null;
  return Math.round(Number(value) * 0.539957);
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

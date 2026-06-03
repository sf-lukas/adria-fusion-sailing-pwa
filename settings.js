const FORECAST_SOURCE_IDS = new Set([
  "open_meteo_weather",
  "met_no_locationforecast",
  "open_meteo_marine",
  "dhmz_xml_cap",
  "mediterranean_open_meteo_grid"
]);
const MAP_SOURCE_IDS = new Set([
  "openstreetmap_tiles",
  "esri_world_imagery",
  "rainviewer_radar",
  "openseamap_seamarks",
  "emodnet_bathymetry",
  "gebco_wms",
  "hhi_primar_official_enc"
]);

const WEIGHTS = [
  {
    name: "Open-Meteo Weather",
    weight: 0.42,
    role: "Local live weather: temperature, wind, gusts, rain amount and rain probability.",
    status: "active"
  },
  {
    name: "Open-Meteo Marine",
    weight: 0.42,
    role: "Local live sea state: waves, sea temperature and coarse ocean-current context.",
    status: "active, coastal confidence capped"
  },
  {
    name: "Backend fusion seed",
    weight: 0.16,
    role: "Latest local fusion/truth snapshot, including MET Norway when the backend snapshot is available.",
    status: "seed verification"
  },
  {
    name: "RainViewer Radar",
    weight: 0,
    role: "Near-now radar visualization only. It confirms active rain structure but does not raise forecast confidence.",
    status: "active map layer, no forecast weight"
  },
  {
    name: "Mediterranean forecast grid",
    weight: 0,
    role: "Map visualization only: batched Open-Meteo sea-area grid for rain and wind field awareness.",
    status: "not used to raise confidence"
  }
];

const els = {
  forecastSourceCount: document.getElementById("forecastSourceCount"),
  mapSourceCount: document.getElementById("mapSourceCount"),
  backendFusionState: document.getElementById("backendFusionState"),
  truthStateSettings: document.getElementById("truthStateSettings"),
  weightList: document.getElementById("weightList"),
  sourceListSettings: document.getElementById("sourceListSettings"),
  calculationContract: document.getElementById("calculationContract")
};

initSettings();

async function initSettings() {
  try {
    const [sources, split] = await Promise.all([
      fetchJson("data/sources.json"),
      fetchJson("data/split_latest.json")
    ]);
    renderSummary(sources, split);
    renderWeights();
    renderSources(sources);
    renderCalculationContract(split);
  } catch (error) {
    els.calculationContract.textContent = `Settings data unavailable: ${error.message || error}`;
  }
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} HTTP ${response.status}`);
  return response.json();
}

function renderSummary(sources, split) {
  const all = Array.isArray(sources.sources) ? sources.sources : [];
  const forecastSources = all.filter((source) => FORECAST_SOURCE_IDS.has(source.id));
  const mapSources = all.filter((source) => MAP_SOURCE_IDS.has(source.id));
  const fusedFrames = Array.isArray(split.timeline_fusion) ? split.timeline_fusion : [];
  const twoProviderFrames = fusedFrames.filter((frame) => Number(frame.provider_count || 0) >= 2);

  els.forecastSourceCount.textContent = `${forecastSources.length}`;
  els.mapSourceCount.textContent = `${mapSources.length}`;
  els.backendFusionState.textContent = twoProviderFrames.length ? `${twoProviderFrames.length} frames` : "seed only";
  els.truthStateSettings.textContent = split.run_id ? `seed ${split.run_id}` : "seed snapshot";
}

function renderWeights() {
  els.weightList.replaceChildren();
  WEIGHTS.forEach((item) => {
    const row = document.createElement("article");
    row.className = "settings-row";
    const header = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = item.name;
    const role = document.createElement("span");
    role.textContent = item.role;
    header.append(title, role);
    const meter = document.createElement("div");
    meter.className = "settings-meter";
    const fill = document.createElement("i");
    fill.style.width = `${Math.round(item.weight * 100)}%`;
    meter.append(fill);
    const value = document.createElement("strong");
    value.textContent = `${Math.round(item.weight * 100)}%`;
    const status = document.createElement("small");
    status.textContent = item.status;
    row.append(header, meter, value, status);
    els.weightList.append(row);
  });
}

function renderSources(sources) {
  els.sourceListSettings.replaceChildren();
  (sources.sources || []).forEach((source) => {
    const row = document.createElement("article");
    row.className = "settings-row source-settings-row";
    const body = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = source.name;
    const role = document.createElement("span");
    role.textContent = source.role;
    const variables = document.createElement("small");
    variables.textContent = Array.isArray(source.variables) ? source.variables.join(", ") : "";
    body.append(title, role, variables);
    const status = document.createElement("strong");
    status.textContent = source.prototype_status || "unknown";
    const link = document.createElement("a");
    link.href = source.url;
    link.rel = "noopener";
    link.textContent = "source";
    row.append(body, status, link);
    els.sourceListSettings.append(row);
  });
}

function renderCalculationContract(split) {
  const frames = Array.isArray(split.timeline_fusion) ? split.timeline_fusion : [];
  const providerNames = [...new Set(frames.flatMap((frame) => Array.isArray(frame.providers) ? frame.providers : []))];
  els.calculationContract.textContent = [
    `provider_count=${providerNames.length || "seed_unknown"} providers=[${providerNames.join(",") || "none"}]`,
    "current_prototype_weights: weather=0.42, marine=0.42, seed=0.16, mediterranean_grid=0.00",
    "confidence cap: <=78 until independent live forecast fusion and truth verification are both present",
    "rain radar: RainViewer tiles are near-now observation context only, confidence_weight=0.00",
    "rain forecast map: color/radius from Open-Meteo precipitation/rain/showers in mm per hour, probability only as label context",
    "wind map: dense Mediterranean Open-Meteo grid arrows from wind_speed_10m, wind_direction_10m and wind_gusts_10m, displayed in knots",
    "animation: 49 hourly frames from now to +48h; slider/playback uses each hour",
    "future adaptive formula:",
    "corrected = forecast - bias",
    "loss = EWMA(abs(corrected-observed)/scale)",
    "weight = prior*freshness*availability*diversity*exp(-lambda*loss)"
  ].join("\n");
}

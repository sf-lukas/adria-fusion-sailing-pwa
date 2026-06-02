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

const state = {
  location: { ...DEFAULT_LOCATION },
  selectedFrame: 0,
  frames: [],
  sourceHealth: [],
  seed: null,
  liveLoadedAt: null
};

const el = {
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
  document.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.dataset.active !== "true";
      button.dataset.active = String(active);
      const target = document.querySelector(`[data-svg-layer="${button.dataset.layer}"]`);
      if (target) target.style.display = active ? "" : "none";
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

  state.sourceHealth = [weather, marine, seed];
  state.frames = buildFrames(
    weatherResult.status === "fulfilled" ? weatherResult.value : null,
    marineResult.status === "fulfilled" ? marineResult.value : null,
    state.seed
  );
  selectFrame(0);
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
  const sourceLine = `source_count=${frame.sources}, lead=${frame.hours}h`;
  const capLine = frame.sources < 2 ? "cap=60 because fewer than two independent live forecast sources" : "cap=72 prototype cap";
  const weatherLine = `wind=${windKn ?? "na"}kn, temp=${frame.weather.temperature ?? "na"}C`;
  const marineLine = `wave=${frame.marine.waveHeight ?? "na"}m, current=${kmhToKnots(frame.marine.currentVelocityKmh) ?? "na"}kn`;
  const confidenceLine = `confidence=${frame.confidence}/100, mode=${frame.condition}`;
  el.calculationBox.textContent = [
    sourceLine,
    capLine,
    weatherLine,
    marineLine,
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
  updateGpsState("GPS...");
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
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
      updateGpsState("GPS fix");
      await loadForecast();
    },
    () => updateGpsState("GPS blocked"),
    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
  );
}

function updateGpsState(text) {
  el.gpsButton.textContent = text;
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

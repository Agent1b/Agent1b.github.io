const scenarios = {
  clear: {
    label: "Perimeter clear",
    targets: "0",
    risk: "Low",
    evidence: "Idle",
    drone: "Standby",
    visible: [],
  },
  unknown: {
    label: "Unknown person tracked",
    targets: "1",
    risk: "Medium",
    evidence: "Recording",
    drone: "Ready",
    visible: ["person", "drone"],
  },
  vehicle: {
    label: "Vehicle and plate detected",
    targets: "2",
    risk: "High",
    evidence: "Clip saved",
    drone: "Patrol",
    visible: ["person", "vehicle", "drone"],
  },
};

const tabs = document.querySelectorAll("[data-scenario]");
const targets = document.querySelectorAll("[data-target]");
const scenarioLabel = document.querySelector("#scenario-label");
const metricTargets = document.querySelector("#metric-targets");
const metricRisk = document.querySelector("#metric-risk");
const metricEvidence = document.querySelector("#metric-evidence");
const metricDrone = document.querySelector("#metric-drone");
const missionState = document.querySelector("#mission-state");
const clock = document.querySelector("#clock");

function setScenario(name) {
  const scenario = scenarios[name];
  if (!scenario) return;

  tabs.forEach((tab) => {
    const active = tab.dataset.scenario === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  targets.forEach((target) => {
    target.hidden = !scenario.visible.includes(target.dataset.target);
  });

  scenarioLabel.textContent = scenario.label;
  metricTargets.textContent = scenario.targets;
  metricRisk.textContent = scenario.risk;
  metricEvidence.textContent = scenario.evidence;
  metricDrone.textContent = scenario.drone;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setScenario(tab.dataset.scenario));
});

document.querySelectorAll("[data-mission]").forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.textContent.trim().toLowerCase();
    missionState.textContent = label;
    metricDrone.textContent = label === "emergency" ? "Stop" : "Active";

    window.clearTimeout(window.__missionTimer);
    window.__missionTimer = window.setTimeout(() => {
      missionState.textContent = "ready";
      metricDrone.textContent = "Standby";
    }, 2400);
  });
});

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

setScenario("clear");
updateClock();
window.setInterval(updateClock, 1000);

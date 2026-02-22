import * as api from "./api.js";
import * as ui from "./ui.js";

let analyticsData = null;   //object, not array
let sumData = [];
let insightsData = null;

document.addEventListener("DOMContentLoaded", refreshAnalytics);

async function refreshAnalytics() {
    try {
        analyticsData = await api.loadAnalytics();
        ui.renderCharts(analyticsData);

        sumData = await api.loadSum();
        highlightCritical(sumData.critical);
        ui.renderSummary(sumData);

        insightsData = await api.loadInsights();
        ui.renderInsights(insightsData);
    } catch (err) {
        alert(err.message);
    }
}

function highlightCritical(count) {
    const card = document.getElementById("criticalTasks")
        .closest(".summary-card");

    if (count > 0) {
        card.classList.add("critical");
    } else {
        card.classList.remove("critical");
    }
}
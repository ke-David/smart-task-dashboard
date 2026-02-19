import * as api from "./api.js";
import * as ui from "./ui.js";

let analyticsData = null;   //object, not array
let sumData = [];

document.addEventListener("DOMContentLoaded", refreshAnalytics);

async function refreshAnalytics() {
    try {
        analyticsData = await api.loadAnalytics();
        ui.renderCharts(analyticsData);
        sumData = await api.loadSum();
        ui.renderSummary(sumData);
    } catch (err) {
        alert(err.message);
    }
}
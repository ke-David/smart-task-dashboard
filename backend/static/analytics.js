import * as api from "./api.js";
import * as ui from "./ui.js";

let analyticsData = null;   //object, not array

document.addEventListener("DOMContentLoaded", refreshAnalytics);

async function refreshAnalytics() {
    try {
        analyticsData = await api.loadAnalytics();
        ui.renderCharts(analyticsData);
    } catch (err) {
        alert(err.message);
    }
}
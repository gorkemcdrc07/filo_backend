const axios = require("axios");

const client = axios.create({
    baseURL: process.env.MOBILIZ_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "Mobiliz-Token": process.env.MOBILIZ_TOKEN,
    },
});

async function get(url, params = {}) {
    try {
        const { data } = await client.get(url, { params });
        return data;
    } catch (error) {
        console.error("========== MOBILIZ ==========");
        console.error("URL:", url);
        console.error("PARAMS:", params);

        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        console.error("=============================");

        throw error;
    }
}

module.exports = {
    getVehicles() {
        return get("/vehicles");
    },

    getFleets() {
        return get("/fleets");
    },

    getGroups() {
        return get("/groups");
    },

    getActivityLast(params) {
        return get("/activity/last", params);
    },

    getActivityDetail(params) {
        return get("/activity/detail", params);
    },

    getLocations(params) {
        return get("/locations", params);
    },

    getDailySummary(params) {
        return get("/dailysummary", params);
    },

    getActivityTotal(params) {
        return get("/activity/total", params);
    },
};
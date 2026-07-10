const express = require("express");

const router = express.Router();

const mobiliz = require("../services/mobiliz.service");

function getMobilizPayload(response) {
    if (Array.isArray(response)) return response;
    return response?.data || response?.Data || response?.result || [];
}

function handleMobilizError(res, e, fallbackMessage) {
    console.error("Mobiliz hata:", e.response?.data || e.message);

    return res.status(e.response?.status || 500).json({
        success: false,
        message: fallbackMessage,
        error: e.message,
        detail: e.response?.data || null,
    });
}

/**
 * Araç Listesi
 */
router.get("/vehicles", async (req, res) => {
    try {
        const response = await mobiliz.getVehicles();
        const vehicles = getMobilizPayload(response);

        const result = vehicles.map((v) => ({
            id: v.id,
            plate: v.plate,
            gsmNumber: v.gsmNumber,
            brand: v.brandName || v.brand,
            model: v.modelName || v.model,
            vendorCode: v.vendorCode,
            fleetId: v.fleetId,
            fleetName: v.fleetName,
            groupId: v.groupId,
            groupName: v.groupName,
            networkId: v.networkId,
            deviceId: v.deviceId,
            firstDataTime: v.firstDataTime,
        }));

        res.json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz araç listesi alýnamadý.");
    }
});

/**
 * Filolar
 */
router.get("/fleets", async (req, res) => {
    try {
        const data = await mobiliz.getFleets();

        res.json({
            success: true,
            data: getMobilizPayload(data),
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz filo bilgileri alýnamadý.");
    }
});

/**
 * Gruplar
 */
router.get("/groups", async (req, res) => {
    try {
        const data = await mobiliz.getGroups();

        res.json({
            success: true,
            data: getMobilizPayload(data),
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz grup bilgileri alýnamadý.");
    }
});

/**
 * Son Aktivite
 */
router.get("/activity-last", async (req, res) => {
    try {
        const data = await mobiliz.getActivityLast(req.query);
        const payload = getMobilizPayload(data);

        res.json({
            success: true,
            count: Array.isArray(payload) ? payload.length : undefined,
            data: payload,
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz son aktivite alýnamadý.");
    }
});

/**
 * Aktivite Detayý
 */
router.get("/activity-detail", async (req, res) => {
    try {
        const data = await mobiliz.getActivityDetail(req.query);

        res.json({
            success: true,
            data: getMobilizPayload(data),
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz aktivite detayý alýnamadý.");
    }
});

/**
 * Konum Geçmiþi
 */
router.get("/locations", async (req, res) => {
    try {
        const data = await mobiliz.getLocations(req.query);

        res.json({
            success: true,
            data: getMobilizPayload(data),
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz konum geçmiþi alýnamadý.");
    }
});

/**
 * Günlük Özet
 */
router.get("/daily-summary", async (req, res) => {
    try {
        const data = await mobiliz.getDailySummary(req.query);

        res.json({
            success: true,
            data: getMobilizPayload(data),
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz günlük özet alýnamadý.");
    }
});

/**
 * Toplam Aktivite
 */
router.get("/activity-total", async (req, res) => {
    try {
        const data = await mobiliz.getActivityTotal(req.query);

        res.json({
            success: true,
            data: getMobilizPayload(data),
        });
    } catch (e) {
        return handleMobilizError(res, e, "Mobiliz toplam aktivite alýnamadý.");
    }
});

module.exports = router;
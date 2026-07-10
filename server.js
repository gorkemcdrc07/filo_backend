require("dotenv").config();

const express = require("express");
const cors = require("cors");

const mobilizRoutes = require("./routes/mobiliz.routes");

const app = express();

// CORS için izin verilen kaynaklar
const allowedOrigins = [
    "https://fts-psi.vercel.app",
    "https://fts-git-main-gorkems-projects-f9c4a0e9.vercel.app",
    "https://fts-ya39ieb0j-gorkems-projects-f9c4a0e9.vercel.app",
    "https://filo-backend-57wx.onrender.com",
    "https://fleet-tracking-system-psi.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("CORS policy does not allow this origin."),
                false
            );
        },
    })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Mobiliz
|--------------------------------------------------------------------------
*/

app.use("/api/mobiliz", mobilizRoutes);

/*
|--------------------------------------------------------------------------
| Mevcut TMS Proxy
|--------------------------------------------------------------------------
*/

const API_URL =
    "https://api.odaklojistik.com.tr/api/tmsdespatches/getall";

const API_TOKEN = process.env.API_TOKEN;

app.get("/api/proxy/tmsdespatches", (req, res) => {
    res.send("GET isteği başarılı");
});

app.post("/api/proxy/tmsdespatches", async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify(req.body),
        });

        const text = await response.text();

        if (!response.ok) {
            console.error(text);

            return res.status(response.status).json({
                error: "API isteği başarısız oldu",
            });
        }

        const json = JSON.parse(text);

        res.json(json);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Proxy sunucu hatası",
        });
    }
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Sunucu hatası",
    });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server ${PORT} portunda çalışıyor`);
});
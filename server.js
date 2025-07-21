require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// CORS için izin verilen kaynaklar
const allowedOrigins = [
    'https://fts-psi.vercel.app',
    'https://fts-git-main-gorkems-projects-f9c4a0e9.vercel.app',
    'https://fts-ya39ieb0j-gorkems-projects-f9c4a0e9.vercel.app',
    'https://filo-backend-57wx.onrender.com',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Postman gibi araçlara izin
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS policy does not allow this origin.'), false);
    }
}));

app.use(express.json());

const API_URL = 'https://api.odaklojistik.com.tr/api/tmsdespatches/getall';
const API_TOKEN = process.env.API_TOKEN;

// Test endpoint
app.get('/api/proxy/tmsdespatches', (req, res) => {
    res.send('GET isteği başarılı');
});

// Proxy POST endpoint
app.post('/api/proxy/tmsdespatches', async (req, res) => {
    console.log('Proxyye gelen body:', req.body);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify(req.body)
        });

        const responseText = await response.text();
        console.log('API yanıtı:', responseText);

        if (!response.ok) {
            console.error('API hata:', response.status, responseText);
            return res.status(500).json({ error: 'API isteği başarısız oldu' });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('JSON parse hatası:', e);
            return res.status(500).json({ error: 'Geçersiz JSON yanıtı' });
        }

        res.json(data);
    } catch (error) {
        console.error('Proxy sunucu hatası:', error);
        res.status(500).json({ error: 'Proxy sunucu hatası' });
    }
});

// Global hata yakalayıcı
app.use((err, req, res, next) => {
    console.error('💥 Express hata:', err.stack || err.message);
    res.status(500).send('Sunucu hatası');
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server ${PORT} portunda çalışıyor`);
});

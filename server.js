const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // Docker'da veya lokalde bu dosya olmalı
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Helper: Tarih formatı (DD.MM.YYYY)
function formatDate(dateStr) {
  // Gelen format 2024-01-01 (HTML date input)
  // Çıktı: 01.01.2024
  if (!dateStr) return new Date().toLocaleDateString('tr-TR');
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

// Middleware: Auth (Basit Şifre Koruması)
const checkAuth = (req, res, next) => {
    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword) return next(); // Eğer .env'de şifre yoksa koruma kapalıdır
    
    // Auth header "Bearer <password>" veya custom header
    const providedPw = req.headers['x-app-password'];
    if (providedPw === appPassword) {
        next();
    } else {
        res.status(401).json({ error: 'Yetkisiz erişim' });
    }
};

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (!process.env.APP_PASSWORD || password === process.env.APP_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Yanlış şifre' });
    }
});

// API: Kategorileri Getir (Auth Gerektirir)
app.get('/api/categories', checkAuth, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Settings!A2:B', // A: Gider, B: Gelir
    });

    const rows = response.data.values || [];

    // A sütunu: Gider, B sütunu: Gelir
    const categories = {
      expense: [],
      income: []
    };

    rows.forEach(row => {
      if (row[0]) categories.expense.push(row[0]); // A sütunu
      if (row[1]) categories.income.push(row[1]);  // B sütunu
    });

    res.json(categories);
  } catch (error) {
    console.error('Kategoriler çekilemedi:', error);
    res.status(500).json({ error: 'Kategoriler alınamadı' });
  }
});

// API: Son İşlemleri Getir (Dashboard için)
app.get('/api/transactions', checkAuth, async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Transactions!A2:E',
        });
        
        const rows = response.data.values || [];
        // Satır numarasını da ekliyoruz ki silebilelim (A1=1, A2=2 vb. yani index+2)
        const transactions = rows.map((row, index) => ({
            rowId: index + 2,
            date: row[0] || '',
            description: row[1] || '',
            category: row[2] || '',
            type: row[3] || '',
            amount: parseFloat((row[4] || '0').replace(',', '.'))
        })).reverse().slice(0, 50); // Sadece son 50 işlem
        
        res.json(transactions);
    } catch (error) {
        console.error('İşlemler çekilemedi:', error);
        res.status(500).json({ error: 'İşlemler alınamadı' });
    }
});

// API: İşlem Ekle
app.post('/api/transactions', checkAuth, async (req, res) => {
  try {
    const { date, amount, description, type, category } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ error: 'Tutar ve Kategori zorunludur' });
    }

    const formattedDate = formatDate(date);
    
    // Ondalık için . yerine , koy: "15.50" -> "15,50"
    const amountStr = String(amount).replace('.', ',');

    // Transactions sırası: Tarih | Açıklama | Kategori | Tür | Tutar
    // Kullanıcının mevcut yapısı: Tarih, Açıklama, Kategori, Tür, Tutar
    const values = [
      [formattedDate, description || '', category, type, amountStr]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Transactions!A:E',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    res.json({ status: 'Success' });
  } catch (error) {
    console.error('İşlem eklenemedi:', error);
    res.status(500).json({ error: 'İşlem eklenemedi' });
  }
});

// API: İşlem Sil (Sadece satır içeriğini temizler)
app.delete('/api/transactions/:row', checkAuth, async (req, res) => {
    try {
        const rowId = req.params.row;
        // Satırı tamamen silmek yerine içeriğini temizler (Diğer formülleri bozmamak için daha güvenli)
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: `Transactions!A${rowId}:E${rowId}`,
        });
        res.json({ status: 'Success' });
    } catch (error) {
        console.error('İşlem silinemedi:', error);
        res.status(500).json({ error: 'İşlem silinemedi' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

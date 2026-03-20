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
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Helper: Tarih formatı (DD.MM.YYYY)
function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('tr-TR');
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

// Middleware: Auth (Basit Şifre Koruması)
const checkAuth = (req, res, next) => {
    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword) return next();
    
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

// API: Kategorileri ve Hızlı Butonları Getir
app.get('/api/categories', checkAuth, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Settings!A2:H', // A: Gider, B: Gelir, D-H: Hızlı Butonlar
    });

    const rows = response.data.values || [];

    const categories = { expense: [], income: [] };
    const quickActions = [];

    rows.forEach(row => {
      if (row[0]) categories.expense.push(row[0]);
      if (row[1]) categories.income.push(row[1]);
      
      // Hızlı Butonlar (D: Label, E: Amt, F: Desc, G: Type, H: Cat)
      if (row[3]) {
        quickActions.push({
          label: row[3],
          amount: row[4] || 0,
          description: row[5] || '',
          type: row[6] || 'Gider',
          category: row[7] || ''
        });
      }
    });

    res.json({ categories, quickActions });
  } catch (error) {
    console.error('Veriler çekilemedi:', error);
    res.status(500).json({ error: 'Veriler alınamadı' });
  }
});

// API: İşlemleri Getir (Dashboard için 1000 satır)
app.get('/api/transactions', checkAuth, async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Transactions!A2:E1000',
        });
        
        const rows = response.data.values || [];
        const transactions = rows.map((row, index) => ({
            rowId: index + 2,
            date: row[0] || '',
            description: row[1] || '',
            category: row[2] || '',
            type: row[3] || '',
            amount: parseFloat(String(row[4] || '0').replace(',', '.'))
        })).reverse();
        
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
    const amountStr = String(amount).replace('.', ',');
    const values = [[formattedDate, description || '', category, type, amountStr]];

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

// API: İşlem Sil
app.delete('/api/transactions/:row', checkAuth, async (req, res) => {
    try {
        const rowId = req.params.row;
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

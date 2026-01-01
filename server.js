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

// API: Kategorileri Getir
app.get('/api/categories', async (req, res) => {
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

// API: İşlem Ekle
app.post('/api/transactions', async (req, res) => {
  try {
    const { date, amount, description, type, category } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ error: 'Tutar ve Kategori zorunludur' });
    }

    const formattedDate = formatDate(date);

    // Transactions sırası: Tarih | Açıklama | Kategori | Tür | Tutar
    // Kullanıcının mevcut yapısı: Tarih, Açıklama, Kategori, Tür, Tutar
    const values = [
      [formattedDate, description || '', category, type, amount]
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

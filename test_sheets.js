const { google } = require('googleapis');
require('dotenv').config();
const fs = require('fs');

async function testSheets() {
    try {
        console.log('1. Kimlik bilgileri kontrol ediliyor...');
        if (!fs.existsSync('credentials.json')) {
            throw new Error('credentials.json dosyası bulunamadı!');
        }
        console.log('credentials.json mevcut.');

        console.log('2. Env kontrol ediliyor...');
        const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
        if (!SPREADSHEET_ID) {
            throw new Error('SPREADSHEET_ID .env dosyasında yok!');
        }
        console.log('SPREADSHEET_ID:', SPREADSHEET_ID);

        console.log('3. Kimlik doğrulama başlatılıyor...');
        const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const client = await auth.getClient();
        console.log('Service Account Email:', client.credentials ? client.credentials.client_email : 'Bilinmiyor');

        const sheets = google.sheets({ version: 'v4', auth });

        console.log('4. "Settings" sayfasından veri çekiliyor...');
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Settings!A2:A',
        });

        console.log('BAŞARILI! Veriler:', response.data.values);

    } catch (error) {
        console.error('HATA DETAYI:');
        console.error(error.message);
        if (error.response) {
            console.error('API Yanıtı:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testSheets();

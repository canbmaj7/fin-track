# Teknik Bağlam

## Teknoloji Yığını
- **Backend**: Node.js (v18+), Express.js
- **Frontend**: HTML5, JavaScript (ES6+), Tailwind CSS (CDN)
- **Veritabanı**: Google Sheets (API v4)
- **Altyapı**: Docker, Coolify

## Geliştirme Kurulumu
1.  **Bağımlılıklar**: `npm install`
2.  **Ortam Değişkenleri**: `.env` dosyası (PORT, SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL)
3.  **Kimlik Doğrulama**: `credentials.json` (Google Service Account Key)

## Kısıtlamalar
- Google Sheets API kotaları (Dakikada okuma/yazma limiti). Bireysel kullanım için yeterince yüksektir.
- Soğuk başlangıç (Coolify/Docker container uyku moduna geçerse ilk açılış yavaş olabilir).

## Bağımlılıklar
- `googleapis`: Google servisleri ile iletişim.
- `express`: Web sunucusu.
- `cors`: Cross-origin kaynak paylaşımı.
- `dotenv`: Çevresel değişken yönetimi.

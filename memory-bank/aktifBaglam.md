# Aktif Bağlam

## Mevcut Odak
Projenin temel kurulumu, API entegrasyonu ve dinamik kategori özelliği tamamlandı. Şu an proje dokümantasyonu (Bellek Bankası) oluşturuluyor.

## Son Değişiklikler
- **Backend**: `server.js` üzerinden Google Sheets API bağlantısı ve yetkilendirme (Service Account) sağlandı.
- **API**: `/api/categories` endpoint'i A (Gider) ve B (Gelir) sütunlarını ayrıştırarak döndürecek şekilde güncellendi.
- **Frontend**: `index.html`'de Tür seçimine (Gelir/Gider) göre kategori listesinin dinamik değişmesi sağlandı.
- **Doğrulama**: `test_connection.js` ve `test_sheets.js` ile bağlantı ve veri akışı doğrulandı.

## Sonraki Adımlar
- Proje dokümantasyonunu tamamlamak.
- Kullanıcıdan gelen ek özellik taleplerini beklemek (örneğin: geçmiş işlemleri listeleme, dashboard özeti vb.).

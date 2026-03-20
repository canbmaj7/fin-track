# Aktif Bağlam

## Mevcut Odak
Faz 2 iyileştirmeleri tamamlandı. Dashboard hesaplama hatası giderildi ve hızlı butonlar dinamik hale getirildi.

## Son Değişiklikler
- **Dashboard**: "Bu Ayki Özet" artık sadece içinde bulunulan ayın ve yılın verilerini toplayacak şekilde düzeltildi (Frontend logic).
- **Hızlı Butonlar**: `Settings!D2:H` arasından okunacak şekilde dinamik yapıldı. Kullanıcı bu hücreleri Google Sheets üzerinden düzenleyebilir.
- **Backend**: `server.js` üzerinden `/api/categories` endpoint'i artık Quick Actions verilerini de dönüyor. `/api/transactions` daha fazla (1000) satır çekiyor.

## Sonraki Adımlar
- Kullanıcının Google Sheets'te Hızlı Buton ayarlarını yapması.
- Sunucunun yeniden deploy edilmesi.

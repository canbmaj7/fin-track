# Aktif Bağlam

## Mevcut Odak
Faz 2 yeni özellik paketi (Login, Dashboard, Geçmiş, PWA) tamamlandı. Kullanıcıya kodların güncellendiği bildirilecek.

## Son Değişiklikler
- **Güvenlik**: `.env` dosyası için `APP_PASSWORD` eklendi ve `server.js` korumaya alındı, frontend `x-app-password` gönderecek.
- **Frontend Yenilendi**: `index.html` alt sekmelerle (Ekle, Geçmiş, Özet) tamamen yeniden yazıldı.
- **PWA**: `manifest.json` ve `sw.js` eklendi, iOS Safari PWA desteği doğrulandı.
- **Veri Sildirme**: `/api/transactions/:row` oluşturuldu; hücre formatını bozmamak adına row'u tamamen 'delete' etmek yerine `clear` fonksiyonu kullanıldı.

## Sonraki Adımlar
- Kullanıcının `git push` ile kodu GitHub'a taşıyıp Coolify'ın AutoDeploy ile güncel versiyonu canlıya alması.
- Uygulamanın iOS'a kurulup test edilmesi.

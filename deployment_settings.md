# Coolify Dağıtım Ayarları

Görseldeki ayarlarınız büyük oranda doğru. İşte önerilen yapılandırma:

1.  **Branch**: `main` (Doğru ✅)
2.  **Base Directory**: `/` (Doğru ✅)
3.  **Port**: `3000` (Doğru ✅)
4.  **Build Pack**: `Nixpacks` (Seçili olan) yerine **Dockerfile** seçmenizi öneririm.
    *   *Neden?*: Proje için özel hazırlanmış `Dockerfile` dosyamız var. Bu daha güvenilir ve hafif bir kurulum sağlar.

## Ortam Değişkenleri (Environment Variables)
Coolify panelinde "Environment Variables" sekmesine gidip şunları eklediğinizden emin olun:

- `SPREADSHEET_ID`: (Google Sheets ID'niz)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: (Service Account Email adresiniz)
- `credentials.json`: (Credentials dosyasının içeriği - Value kısmına yapıştırın veya 'File' olarak yükleyin)

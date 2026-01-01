FROM node:18-alpine

WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları kur
RUN npm install --production

# Kaynak kodları kopyala
COPY . .

# Portu dışa aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "server.js"]

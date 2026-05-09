# Backend Apotek - Microservice

Backend sistem manajemen apotek yang dibangun menggunakan arsitektur microservice dengan Node.js. Sistem ini mencakup autentikasi berbasis JWT, manajemen inventaris obat, pemrosesan transaksi, komunikasi asinkron menggunakan RabbitMQ, dan satu titik akses terpusat melalui API Gateway.

## Arsitektur Sistem

```
Client
  -> API Gateway         :4072
      -> Auth Service        :4172
      -> Inventory Service   :4272
      -> Transaction Service :4372

Transaction Service -> RabbitMQ queue: stock_update_queue -> Message Worker
```

## Daftar Service

| Service             | Port | Tanggung Jawab                                      |
|---------------------|-----:|-----------------------------------------------------|
| API Gateway         | 4072 | Logging request, rate limiting, routing             |
| Auth Service        | 4172 | Register, login, penerbitan JWT                     |
| Inventory Service   | 4272 | Manajemen kategori dan data obat                    |
| Transaction Service | 4372 | Pembuatan transaksi, riwayat, publish ke RabbitMQ   |
| Message Worker      | -    | Consumer RabbitMQ untuk update stok                 |

## Prasyarat

- Node.js dan npm
- MySQL
- RabbitMQ

Proyek ini mengasumsikan MySQL dan RabbitMQ sudah terinstall dan berjalan di server.

## Setup Database

Jalankan schema SQL yang tersedia di folder `docs/`:

```bash
mysql -u mahasiswa -p < docs/schema.sql
```

File `schema.sql` sudah mencakup perintah `CREATE DATABASE` dan `USE`, sehingga database akan otomatis terbuat beserta seluruh tabelnya.

## Variabel Environment

Salin file `.env.example` di masing-masing service menjadi `.env`:

```bash
cp auth-service/.env.example auth-service/.env
cp inventory-service/.env.example inventory-service/.env
cp transaction-service/.env.example transaction-service/.env
cp api-gateway/.env.example api-gateway/.env
cp message-worker/.env.example message-worker/.env
```

Sesuaikan nilai variabel di masing-masing file `.env` dengan konfigurasi server, terutama `DB_NAME`, `DB_USER`, `DB_PASS`, dan `JWT_SECRET`.

## Instalasi

Install dependencies di masing-masing service:

```bash
cd auth-service && npm install
cd ../inventory-service && npm install
cd ../transaction-service && npm install
cd ../api-gateway && npm install
cd ../message-worker && npm install
```

## Menjalankan Service

Semua service dijalankan sekaligus menggunakan PM2:

```bash
pm2 start ecosystem.RakhaDwiPrayoga.config.js
```

Untuk menghentikan:

```bash
pm2 stop rakha
```

Untuk restart:

```bash
pm2 restart rakha
```

Cek status semua service:

```bash
pm2 status
```

Gunakan API Gateway sebagai titik akses utama:

```
http://localhost:4072
```

## Autentikasi

Endpoint yang dilindungi membutuhkan token JWT di header:

```
Authorization: Bearer <token>
```

Token diperoleh setelah login berhasil. Payload JWT berisi:

```json
{
  "id": 1,
  "role": "admin"
}
```

Role yang tersedia:

- `admin`
- `kasir`

## Hak Akses per Role

| Aksi                        | Admin | Kasir |
|-----------------------------|-------|-------|
| Register dan login          | Ya    | Ya    |
| Tambah, ubah, hapus kategori| Ya    | Tidak |
| Lihat kategori              | Ya    | Ya    |
| Tambah, ubah, hapus obat    | Ya    | Tidak |
| Lihat obat                  | Ya    | Ya    |
| Buat transaksi              | Ya    | Ya    |
| Lihat riwayat transaksi     | Ya    | Ya    |

## Daftar Endpoint

Seluruh endpoint dipanggil melalui API Gateway di `http://localhost:4072`.

### Auth

| Method | Endpoint               | Auth | Role | Deskripsi       |
|--------|------------------------|------|------|-----------------|
| POST   | `/api/auth/register`   | Tidak| -    | Registrasi user |
| POST   | `/api/auth/login`      | Tidak| -    | Login dan dapat JWT |

Contoh body register:

```json
{
  "username": "rakha",
  "password": "rahasia123",
  "role": "admin"
}
```

Contoh body login:

```json
{
  "username": "rakha",
  "password": "rahasia123"
}
```

Contoh response login berhasil:

```json
{
  "message": "Login Berhasil!",
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "rakha",
    "role": "admin"
  }
}
```

### Kategori Obat

| Method | Endpoint                  | Auth | Role         | Deskripsi           |
|--------|---------------------------|------|--------------|---------------------|
| GET    | `/api/categories`         | Ya   | Admin, Kasir | Lihat semua kategori|
| POST   | `/api/categories`         | Ya   | Admin        | Tambah kategori     |
| PUT    | `/api/categories/:id`     | Ya   | Admin        | Ubah kategori       |
| DELETE | `/api/categories/:id`     | Ya   | Admin        | Hapus kategori      |

Contoh body tambah/ubah kategori:

```json
{
  "name": "Antibiotik"
}
```

### Obat

| Method | Endpoint              | Auth | Role         | Deskripsi           |
|--------|-----------------------|------|--------------|---------------------|
| GET    | `/api/medicines`      | Ya   | Admin, Kasir | Lihat semua obat    |
| POST   | `/api/medicines`      | Ya   | Admin        | Tambah obat         |
| PUT    | `/api/medicines/:id`  | Ya   | Admin        | Ubah semua field    |
| PATCH  | `/api/medicines/:id`  | Ya   | Admin        | Ubah sebagian field |
| DELETE | `/api/medicines/:id`  | Ya   | Admin        | Hapus obat          |

Contoh body tambah obat:

```json
{
  "category_id": 1,
  "name": "Paracetamol 500mg",
  "price": 3000,
  "stock": 100
}
```

Contoh body PATCH (hanya field yang ingin diubah):

```json
{
  "stock": 80
}
```

Contoh response PATCH:

```json
{
  "message": "Data obat berhasil diperbarui sebagian!",
  "updatedFields": ["stock"],
  "changes": {
    "stock": {
      "before": 100,
      "after": 80
    }
  }
}
```

### Transaksi

| Method | Endpoint                    | Auth | Role         | Deskripsi              |
|--------|-----------------------------|------|--------------|------------------------|
| POST   | `/api/transactions`         | Ya   | Admin, Kasir | Buat transaksi baru    |
| GET    | `/api/transactions`         | Ya   | Admin, Kasir | Lihat riwayat transaksi|
| GET    | `/api/transactions/:id`     | Ya   | Admin, Kasir | Lihat detail transaksi |

Contoh body buat transaksi:

```json
{
  "customer_name": "Budi",
  "items": [
    { "medicine_id": 1, "quantity": 2 },
    { "medicine_id": 3, "quantity": 1 }
  ]
}
```

Contoh response transaksi berhasil:

```json
{
  "message": "Transaksi berhasil diproses!",
  "transaction_id": 5,
  "customer_name": "Budi",
  "items": [
    {
      "medicine_id": 1,
      "medicine_name": "Paracetamol 500mg",
      "quantity": 2,
      "price": 3000,
      "subtotal": 6000
    }
  ],
  "total_bayar": 6000
}
```

## Alur RabbitMQ

Ketika transaksi berhasil dibuat:

1. Transaction Service memvalidasi token JWT pengguna.
2. Transaction Service memvalidasi data obat dan menghitung total harga.
3. Transaction Service menyimpan transaksi dan detailnya ke database dalam satu transaksi atomik.
4. Transaction Service menerbitkan pesan ke RabbitMQ queue `stock_update_queue`.
5. Message Worker menerima pesan dan memproses update stok secara asinkron.

Format pesan ke broker:

```json
{
  "transactionId": 5,
  "customer_name": "Budi",
  "items": [
    {
      "medicine_id": 1,
      "medicine_name": "Paracetamol 500mg",
      "quantity": 2,
      "price": 3000,
      "subtotal": 6000
    }
  ]
}
```
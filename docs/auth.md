Berikut adalah contoh file `auth.md` yang mendokumentasikan endpoint-endpoint pada auth router dalam Bahasa Indonesia. Anda dapat menyesuaikan atau memperluas dokumentasi ini sesuai dengan kebutuhan proyek Anda.

---

```markdown
# Dokumentasi Router Autentikasi (Auth Router)

Dokumen ini menjelaskan secara lengkap endpoint-endpoint autentikasi yang disediakan oleh auth router.

> **Catatan:**  
> Semua endpoint diawali dengan prefix `/api/auth`.

---

## Daftar Isi

- [Endpoint](#endpoint)
  - [POST /signin](#post-signin)
  - [POST /signup](#post-signup)
  - [GET /profile](#get-profile)
  - [POST /refresh-token](#post-refresh-token)
  - [POST /reset-password](#post-reset-password)
  - [POST /verify-otp](#post-verify-otp)
  - [POST /update-password](#post-update-password)
  - [POST /logout](#post-logout)
- [Penanganan Error](#penanganan-error)
- [Middleware Autentikasi](#middleware-autentikasi)
- [Informasi Tambahan](#informasi-tambahan)

---

## Endpoint

### POST /signin

*Deskripsi:*
Endpoint ini digunakan untuk melakukan autentikasi pengguna menggunakan kredensial lokal (email dan password). Jika berhasil, sistem akan menghasilkan _access token_ dan _refresh token_.  
Endpoint ini menggunakan middleware `authenticateLocal`.

**Header Permintaan:**  
- `Content-Type: application/json`

**Contoh Body Permintaan:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Sukses - 200 OK):**

- **Cookies yang Ditetapkan:**
  - `substack-clone-accessToken` (masa berlaku 15 menit)
  - `substack-clone-refreshToken` (masa berlaku 30 hari)

- **Body JSON:**

```json
{
  "success": true,
  "status": 200,
  "message": "Login successful"
}
```

**Error yang Mungkin Terjadi:**
- `401 Unauthorized` jika kredensial tidak valid.
- `404 Not Found` jika akun pengguna belum diverifikasi.

---

### POST /signup

**Deskripsi:**  
Endpoint ini digunakan untuk mendaftarkan pengguna baru. Data yang diterima akan divalidasi, password akan di-hash, dan data pengguna baru disimpan ke dalam basis data. Selain itu, sistem juga akan mengirim OTP ke email yang didaftarkan.

**Header Permintaan:**  
- `Content-Type: application/json`

**Contoh Body Permintaan:**

```json
{
  "name": "Nama Pengguna",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (Sukses - 201 Created):**

```json
{
  "success": true,
  "status": 201,
  "message": "Registration successful, otp sent to your email, Maximum 1 day to reset password",
  "data": {
    "otp": 1234
  }
}
```

**Error yang Mungkin Terjadi:**
- `400 Bad Request` untuk kesalahan validasi atau jika email sudah terdaftar.

---

### GET /profile

**Deskripsi:**  
Mengambil detail profil pengguna yang sudah terautentikasi. Endpoint ini dilindungi oleh middleware `authenticate` (JWT-based).

**Header Permintaan:**  
- Diperlukan token JWT yang valid (misalnya dikirim melalui cookie atau header).

**Response (Sukses - 200 OK):**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      // Properti pengguna (tanpa password)
    }
  }
}
```

**Error yang Mungkin Terjadi:**
- `401 Unauthorized` jika token tidak ada atau tidak valid.

---

### POST /refresh-token

**Deskripsi:**  
Endpoint untuk merefresh token JWT. Menggunakan refresh token yang disimpan di cookie untuk menghasilkan _access token_ dan _refresh token_ baru.

**Header Permintaan:**  
- Refresh token harus terdapat pada cookie: `substack-clone-refreshToken`.

**Response (Sukses - 200 OK):**

- **Cookies yang Diperbarui:**
  - `substack-clone-accessToken` (masa berlaku 15 menit)
  - `substack-clone-refreshToken` (masa berlaku 7 hari)

- **Body JSON:**

```json
{
  "success": true,
  "status": 200,
  "message": "Token refreshed successfully"
}
```

**Error yang Mungkin Terjadi:**
- `401 Unauthorized` jika refresh token tidak ada.
- `403 Forbidden` jika refresh token tidak valid.

---

### POST /reset-password

**Deskripsi:**  
Memulai proses reset password dengan mengirim OTP ke alamat email pengguna.

**Header Permintaan:**  
- `Content-Type: application/json`

**Contoh Body Permintaan:**

```json
{
  "email": "user@example.com"
}
```

**Response (Sukses - 200 OK):**

```json
{
  "success": true,
  "status": 200,
  "message": "OTP sent to your email, please check your email. Maximum 1 day to reset password",
  "data": {
    "otp": 1234
  }
}
```

**Error yang Mungkin Terjadi:**
- `400 Bad Request` untuk kesalahan validasi.
- `404 Not Found` jika pengguna tidak ditemukan.

---

### POST /verify-otp

**Deskripsi:**  
Memverifikasi OTP yang dikirimkan ke email pengguna untuk reset password atau verifikasi akun.

**Header Permintaan:**  
- `Content-Type: application/json`

**Contoh Body Permintaan:**

```json
{
  "email": "user@example.com",
  "otp": 1234
}
```

**Response (Sukses - 200 OK):**

```json
{
  "success": true,
  "status": 200,
  "message": "OTP verified successfully"
}
```

**Error yang Mungkin Terjadi:**
- `400 Bad Request` jika OTP tidak valid atau sudah kadaluarsa.
- `404 Not Found` jika tidak ada data OTP untuk email tersebut.

---

### POST /update-password

**Deskripsi:**  
Memperbarui password pengguna setelah verifikasi OTP berhasil dilakukan.

**Header Permintaan:**  
- `Content-Type: application/json`

**Contoh Body Permintaan:**

```json
{
  "email": "user@example.com",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (Sukses - 200 OK):**

```json
{
  "success": true,
  "status": 200,
  "message": "Password updated successfully"
}
```

**Error yang Mungkin Terjadi:**
- `400 Bad Request` untuk kesalahan validasi.
- `400 Bad Request` jika proses verifikasi OTP belum selesai.

---

### POST /logout

**Deskripsi:**  
Mengeluarkan (logout) pengguna dengan menghapus cookie autentikasi.

**Response (Sukses - 204 No Content):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

> **Catatan:**  
> Meskipun status 204 No Content biasanya tidak menyertakan body, contoh di atas menyertakan JSON untuk kejelasan dokumentasi.

---

## Penanganan Error

Seluruh error ditangani oleh middleware error global. Format response error adalah sebagai berikut:

```json
{
  "success": false,
  "status": <kode_status>,
  "message": "<pesan_error>",
  "errors": [
    {
      "path": "nama_field",
      "message": "pesan validasi"
    }
  ]
}
```

---

## Middleware Autentikasi

- **`authenticateLocal`**  
  - Digunakan pada endpoint `/signin`.  
  - Mengautentikasi pengguna menggunakan strategi lokal Passport (email dan password).

- **`authenticate`**  
  - Melindungi endpoint seperti `/profile`.  
  - Menggunakan autentikasi berbasis JWT untuk memastikan bahwa pengguna telah login.

---

## Informasi Tambahan

- **Masa Berlaku Token:**
  - **Access Token:** Berlaku selama 15 menit.
  - **Refresh Token:** Berlaku selama 30 hari.
  
- **Cookies:**
  - Token disimpan sebagai HTTP-only cookies dengan opsi `secure` dan `sameSite` (diaktifkan di lingkungan produksi).

- **Keamanan Password:**
  - Password di-hash menggunakan `argon2` sebelum disimpan ke dalam basis data.

- **Masa Berlaku OTP:**
  - OTP berlaku maksimum 1 hari untuk proses reset password.

import nodemailer from "nodemailer";
import ENVDATA from "./env-file";

const transporterEmail = nodemailer.createTransport({
  host: ENVDATA.email.host!,
  port: ENVDATA.email.port!,
  service: ENVDATA.email.service!,
  secure: false, 
  auth: {
    user: ENVDATA.email.auth.user!,
    pass: ENVDATA.email.auth.pass!,
  },
} as nodemailer.TransportOptions);

// Fungsi untuk membuat template email dengan OTP yang diberikan
const getEmailTemplate = (otp: string): string => {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .header img {
      max-width: 150px;
    }
    .content {
      text-align: center;
      padding: 20px;
    }
    .otp-code {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      font-size: 12px;
      color: #777777;
    }
    @media (max-width: 600px) {
      .container {
        margin: 20px;
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Ganti src dengan logo perusahaan Anda -->
      <img src="https://via.placeholder.com/150x50?text=Logo" alt="Logo Perusahaan">
    </div>
    <div class="content">
      <h2>Verifikasi OTP</h2>
      <p>Gunakan kode OTP di bawah ini untuk melakukan verifikasi email Anda:</p>
      <div class="otp-code">
        ${otp}
      </div>
      <p>Kode ini berlaku selama 1hari.</p>
      <p>Jika Anda tidak merasa melakukan permintaan ini, mohon abaikan email ini.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Xninetzy. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

const createEmail = (to: string, subject: string, data:any ) => {
  const template = getEmailTemplate(data);
  return {
    from: ENVDATA.email.auth.user,
    to,
    subject,
    html: template,
  };
};

export { createEmail, transporterEmail };

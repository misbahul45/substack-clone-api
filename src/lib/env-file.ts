import dotenv from "dotenv";

dotenv.config();

const ENVDATA = {
  ARJECT_API_KEY: process.env.ARJECT_SECRET_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  AUTH_SECRET: process.env.AUTH_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  email: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),  
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_APP_PASS, 
    },
  },
};

export default ENVDATA;

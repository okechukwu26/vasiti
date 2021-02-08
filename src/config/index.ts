import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const ENVIRONMENT = process.env.NODE_ENV;
export const APP_URL = process.env.APP_URL;
export const BASE_PATH = process.env.BASE_PATH;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME;
export const TWILIO_SID = process.env.TWILIO_SID;
export const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
export const SMS_FROM = process.env.SMS_FROM;
export const SMS_RETRIEVE_TOKEN = process.env.SMS_RETRIEVE_TOKEN;
export const APP_NAME = process.env.APP_NAME;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

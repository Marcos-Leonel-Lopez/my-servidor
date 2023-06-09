import nodemailer from 'nodemailer';
import { config } from './config.js';

//Credenciales
const adminEmail = config.admin_email;
const adminPass = config.admin_pass;

//config. canal de comunicacion node-gmail

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth:{
        user:adminEmail,
        pass:adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized: false
    }
})
export { transporter }
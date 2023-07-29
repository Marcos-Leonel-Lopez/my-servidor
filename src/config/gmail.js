import nodemailer from 'nodemailer';
import { config } from './config.js';
//Credenciales
const adminEmail = config.gmail.admin_email;
const adminPass = config.gmail.admin_pass;
//config. canal de comunicacion node-gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

export const sendTiketCompleted = async (ticket) => {
    await transporter.sendMail({
        from: 'Ecomerce',
        to: ticket.purchaser,
        subject: 'Compra exitosa',
        html:   `<section>
                    <h1>Compra Realizada por ${ticket.purchaser}</h1>
                    <h2>Monto a pagar: $${ticket.amount}</h2>
                    <h2>Codigo de referencia : ${ticket.code}</h2>
                </section>`
    })
}

export const sendRecoveryPass = async (email,token) =>{
    const link = `http://localhost:8080/resetPassword?token=${token}`
    await transporter.sendMail({
        from: 'Ecomerce',
        to: email,
        subject: 'Reestablecer contraseña',
        html:   `<section>
                    <h1>Cambio de contraseña</h1>
                    <h2>Podra cambiar su contraseña en el siguiente link</h2>
                    <a href="${link}"><button> Reestablecer contraseña </button></a>
                </section>`
    })
}





export { transporter }
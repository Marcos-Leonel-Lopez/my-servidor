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

export const sendProductDelete = async (email) =>{
    console.log(`gmail.js recibe ${email}`);
    await transporter.sendMail({
        from: 'Ecomerce',
        to: email,
        subject: 'Cuenta eliminada',
        html:   `<section>
                    <h1>Su cuenta fue eliminada por inactividad</h1>
                    <h2>Sus productos tambien fueron eliminados de nuesta base de datos</h2>
                </section>`
    })
    return
}
export const sendNotificationProductDelete = async (email,title) =>{
    console.log(`gmail.js recibe ${email} y ${title}`);
    await transporter.sendMail({
        from: 'Ecomerce',
        to: email,
        subject: 'Producto eliminado',
        html:   `<section>
                    <h1>El producto ${title} se elimino de nuestra base de datos</h1>
                </section>`
    })
    return
}


export { transporter }
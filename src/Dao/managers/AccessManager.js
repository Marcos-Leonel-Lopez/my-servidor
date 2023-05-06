import fs from 'fs';
import __dirname from '../../utils.js';

export default class AccessManager{

    createRecords = async (method) => {
        const date = new Date().toLocaleDateString();
        const hour = new Date().toLocaleTimeString();
        const message = `Fecha: ${date} - Hora: ${hour} - Accion: ${method} \n`
        await fs.promises.appendFile(__dirname + '/Dao/files/logs.txt', message, (err)=>{ 
            return err})
    }
}
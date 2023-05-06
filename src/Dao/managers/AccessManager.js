import fs from 'fs';
import __dirname from '../../utils';

export default class AccessManager{

    createRecords(method){
        const date = new Date().toLocaleDateString();
        const hour = new Date().toLocaleTimeString();
        const message = `\n Fecha: ${date} - Hora: ${hour} - Accion: ${method}`

        fs.appendFile(__dirname + '/Dao/files/logs.txt', message, (err)=>{ 
            return err})
    }
}
import { config } from "../config/config.js";

const persistence = config.persistence;
let contactDao;

switch (persistence) {
    case 'mongo':
        const {ConnectionDB} = await import('../config/connectionDB.js')
        ConnectionDB();
        const {ContactMongo} = await import('')
        contactDao = new ContactMongo();
        break;
    case 'memory':
        //
        break;
    case 'SQL':
        //
        break;
    default:
        break;
}



export {contactDao}
import { config } from "../config/config.js";

const persistence = config.persistence.persistence;

let productPersistence;
let cartPersistence;
let sessionPersistence;
let ticketPersistence;

switch (persistence) {
    case 'mongo':
        const {ConnectionDB} = await import('../config/connectionDB.js')
        ConnectionDB.getInstance();
        const {ProductMongo} = await import('./managers/mongo/product.mongo.js'); //error al importar cuando en el product.mongo.js lo exporto por default
        productPersistence = new ProductMongo();
        const {SessionMongo} = await import('./managers/mongo/session.mongo.js');
        sessionPersistence = new SessionMongo();
        const {CartMongo} = await import('./managers/mongo/cart.mongo.js');
        cartPersistence = new CartMongo();
        const {TicketMongo} = await import('./managers/mongo/ticket.mongo.js');
        ticketPersistence = new TicketMongo();
        break;
    case 'memory':
        //
        break;
    case 'sql':
        //
        break;
    default:
        break;
}

export {productPersistence, sessionPersistence, cartPersistence, ticketPersistence}
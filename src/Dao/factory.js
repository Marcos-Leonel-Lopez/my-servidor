import { config } from "../config/config.js";

const persistence = config.persistence;

let productPersistence;

switch (persistence) {
    case 'mongo':
        const {ConnectionDB} = await import('../config/connectionDB.js')
        ConnectionDB.getInstance();
        const {ProductMongo} = await import('./managers/mongo/product.mongo.js'); //error al importar cuando en el product.mongo.js lo exporto por default
        productPersistence = new ProductMongo();
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

export {productPersistence}
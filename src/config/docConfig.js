import __dirname from '../utils.js';
import swaggerJSDoc from 'swagger-jsdoc';
import path from "path";

const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentacion api venta de comestibles",
            version:"1.0.0",
            desciption:"Definicion de endpoints para la api venta de comestibles"
        }
    },
    apis:[`${path.join(__dirname,"./docs/**/*.yaml")}`]
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
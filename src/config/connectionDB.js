import mongoose from "mongoose";
import { config } from "./config.js";

const MONGO = config.url_mongo;  

class ConnectionDB {
    static #instance
    constructor(){
        mongoose.connect(MONGO);
    }
    static async getInstance(){
        if(ConnectionDB.#instance){
            console.log('Ya estabas conectado!');
            return ConnectionDB.#instance
        }else{
            this.#instance = new ConnectionDB();
            console.log('Ahora estas conectado');
            return this.#instance
        }
    }
}
export {ConnectionDB};
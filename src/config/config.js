import dotenv from 'dotenv';
import __dirname from '../utils.js';
import  path  from 'path';
import { Command } from 'commander';

const program = new Command();

program
.option('-mode <modo>', 'modo de inicio', 'dev')
program.parse();

const enviroment = program.opts();
const pathEnviroment = enviroment.Mode === "prod" ? path.join(__dirname, '../.env.production') : path.join(__dirname, '../.env.development')

dotenv.config({path: pathEnviroment});
console.log(pathEnviroment);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PERSISTENCE = process.env.PERSISTENCE;

export const config = {
    port: PORT,
    persistence: PERSISTENCE,
    url: MONGO_URL,
    admin_email: ADMIN_EMAIL,
    admin_pass : ADMIN_PASSWORD
}
import dotenv from 'dotenv';
import __dirname from '../utils.js';
import  path  from 'path';
import { Command } from 'commander';

const program = new Command();

program.option('-mode <modo>', 'modo de inicio', 'dev');
program.parse();

const enviroment = program.opts();
const pathEnviroment = enviroment.Mode === "prod" ? path.join(__dirname, '../.env.production') : path.join(__dirname, '../.env.development');

console.log(pathEnviroment);
dotenv.config({path: pathEnviroment});


const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_GITHUB = process.env.CLIENT_GITHUB;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PERSISTENCE = process.env.PERSISTENCE;
const NODE_ENV = process.env.NODE_ENV;

export const config = {
    port: PORT,
    url_mongo: MONGO_URL,
    secret_session: SESSION_SECRET,
    client_github:CLIENT_GITHUB,
    admin_email: ADMIN_EMAIL,
    admin_pass : ADMIN_PASSWORD,
    persistence: PERSISTENCE,
    node_env: NODE_ENV
}
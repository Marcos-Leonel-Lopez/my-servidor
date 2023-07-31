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
const ID_GITHUB = process.env.ID_GITHUB;
const URL_GITHUB = process.env.URL_GITHUB;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PERSISTENCE = process.env.PERSISTENCE;
const NODE_ENV = process.env.NODE_ENV;

export const config = {
    node_env: NODE_ENV,
    server:{
        port: PORT,
        secret_session: SESSION_SECRET,
    },
    mongo:{
        url: MONGO_URL,
    },
    gmail:{
        admin_email: ADMIN_EMAIL,
        admin_pass : ADMIN_PASSWORD,
    },
    github:{
        clientSecret:CLIENT_GITHUB,
        clientID: ID_GITHUB,
        url: URL_GITHUB
    },
    persistence:{
       persistence: PERSISTENCE, 
    },
    jwt:{
        private_key: PRIVATE_KEY
    }
}
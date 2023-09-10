import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Faker, en, es} from "@faker-js/faker";
import { config } from './config/config.js';


export const generateEmailToken = (mail,expireTime) =>{
    const token = jwt.sign({mail},config.jwt.private_key,{expiresIn:expireTime});
    return token;
}
export const verifyEmailToken = (token) =>{
    try {
        const info = jwt.verify(token,config.jwt.private_key);
        console.log(info);
        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}
export const date = async () =>{
    const currentDate = new Date(Date.now());
    return currentDate
}

export const authToken = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({
            status: 'error',
            error: 'No autorizado'
        })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error){
            return res.status(401).send({
                status: 'error',
                error: 'No autorizado'
            })
        }
        req.user = credentials.user;
        next();
    })
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePass = (password, user) => bcrypt.compareSync(password, user.password);

export const customFaker = new Faker({
    locale: [en]
})

const { commerce, string, number, image } = customFaker

export const generateProduct = () =>{
     return {
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: commerce.price({ min: 1000, max: 5000 }),
        thumbnail: image.urlLoremFlickr({category: 'food'}),
        code: string.uuid(),
        stock: number.int({ min: 3, max: 50 }),
        category: commerce.department()
     }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from "../Dao/models/user.model.js";
import {createHash, validatePass} from '../utils.js';
import { cartService } from "../repository/index.repository.js";
import { config } from "./config.js";
import { date } from "../utils.js";


const LocalStrategy = local.Strategy;

const initializePassport = () =>{

    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) =>{
        const user = await userModel.findById(id);
        done(null, user)
    });

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true,usernameField:'mail'},
        async (req, username, password, done)=>{
            const newCart = await cartService.addCart();            
            const {first_name, last_name, mail, age} = req.body;
            const avatar = req.file.path
            try{ 
                const exist = await userModel.findOne({ mail:username });
                if (exist) {
                    req.logger.debug('Usuario existente');
                    return done(null, false)
                }
                const user = {first_name, last_name, mail, age, password:createHash(password), cart:newCart.message.payload._id, avatar };
                const result = await userModel.create(user);
                return done(null, result)
            }catch(err){
                return done("error al registrar usuario: "+ err)
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField:'mail'},
    async (username, password, done)=>{
        try{
            const user = await userModel.findOne({ mail:username });
            if (!user) {
                return done(null, false);
            }
            if(!validatePass(password, user)){
                return done(null, false);
            }
            user.last_connection = await date();
            await user.save()
            return done(null, user)
        }catch(err){
            return done("error al intentar ingresar: "+ err)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID:config.github.clientID,
        clientSecret:config.github.clientSecret,
        callbackURL: config.github.url
    } , async ( accessToken, refreshTocken, profile, done) =>{
        try{
            let email = profile._json.email;
            if(!email){
                email = profile._json.login
            }
            // console.log(profile); //para ver como llega
            const exist = await userModel.findOne({ mail:email });
            console.log(exist);
            
            if(!exist){
                //req.logger.verbose('Usuario creado con github');
                console.log('Usuario creado con github');
                const newCart = await cartService.addCart(); 
                const user = {
                    first_name:profile._json.name,
                    last_name:'',
                    mail:email ,
                    age: 18,
                    password:'',
                    cart:newCart.message.payload._id,
                };
                const result = await userModel.create(user);
                return done(null, result)
            }else{
                console.log('Usuario existente con github');
                //req.logger.verbose('Usuario existente con github');
                done(null,exist)
            }

        }catch(err){
            return done("error al intentar ingresar: "+ err)
        }
    }

    ))

}

export default initializePassport;
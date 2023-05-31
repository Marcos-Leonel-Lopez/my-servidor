import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from "../Dao/models/user.model.js";
import {createHash, validatePass} from '../utils.js';

const LocalStrategy = local.Strategy;

const iniitializePassport = () =>{

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
            const {first_name, last_name, mail, age} = req.body;
            try{
                const exist = await userModel.findOne({ mail:username });
                if (exist) {
                    console.log('Usuario existente');
                    return done(null, false)
                }
                const user = {first_name, last_name, mail, age, password:createHash(password)};
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
                console.log('Usuario inexistente');
                return done(null, false);
            }
            if(!validatePass(password, user)){
                return done(null, false);
            }
            return done(null, user)

        }catch(err){
            return done("error al intentar ingresar: "+ err)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.bef6d883ed8174ca',
        clientSecret:'5ebe7d7fa17ab6bd6d43fd4062ec9c09c0d6d6c5',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    } , async (accessToken, refreshTocken, profile, done) =>{
        try{
            // console.log(profile); //para ver como llega
            const exist = await userModel.findOne({ mail:profile._json.email });
            if(!exist){
                console.log('Usuario creado con github');
                const user = {
                    first_name:profile._json.name,
                    last_name:'',
                    mail:profile._json.email ,
                    age: 18,
                    password:''
                };
                const result = await userModel.create(user);
                return done(null, result)
            }else{
                console.log('Usuario existente con github');
                done(null,exist)
            }

        }catch(err){
            return done("error al intentar ingresar: "+ err)
        }
    }

    ))

}

export default iniitializePassport;
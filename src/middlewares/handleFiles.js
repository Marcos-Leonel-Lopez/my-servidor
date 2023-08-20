import multer from "multer";
import __dirname from "../utils.js";
import path from 'path';


const validFields = (body) =>{
    const {first_name, last_name, mail, age} = body
    if(!first_name || !last_name || !mail || !age){
        return false
    }else{
        return true
    }
}

const multerFilterProfile = (req, file, cb) =>{
   const isValid = validFields(req.body)
   if(isValid){
    cb(null, true)
   }else{
    cb(null, false)
   }
//    return
}
//avatar
const profileStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"/multer/users/images"))
    },
    filename: function(req, file, cb){
        console.log();
        cb(null,`${req.body.mail}-perfil-${file.originalname}`)
    }
})
export const uploaderProfile = multer({storage:profileStorage,fileFilter:multerFilterProfile});
//documentos
const documentStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"/multer/users/documents"))
    },
    filename: function(req, file, cb){
        cb(null,`${req.session.user.mail}-document-${file.originalname}`)
    }
})
export const uploaderdocument = multer({storage:documentStorage});
//img de productos
const productStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"/multer/products/images"))
    },
    filename: function(req, file, cb){
        cb(null,`${req.params.code}-image-${file.originalname}`)
    }
})
export const uploaderProduct = multer({storage:productStorage});
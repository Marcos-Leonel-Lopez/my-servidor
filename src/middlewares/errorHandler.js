import { EEror } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) =>{
    switch (error.code) {
        case EEror.INVALID_JSON:
            res.status(400).send({
                status:error,
                error: error.cause,
                message: error.message
            })
        break;
        case EEror.AUTH_ERROR:
            res.status(400).send({
                status:error,
                error: error.cause,
                message: error.message
            })
        break;
        case EEror.DATABASE_ERROR:
            res.status(400).send({
                status:error,
                error: error.cause,
                message: error.message
            })
        break;
        case EEror.INVALID_PARAMS:
            res.status(400).send({
                status:error,
                error: error.cause,
                message: error.message
            })
        break;
        case EEror.ROUTING_ERROR:
            res.status(400).send({
                status:error,
                error: error.cause,
                message: error.message
            })
        break;
        default:
            res.status(400).send({
                status:error,
                message: "Error. Contact support"
            })
            break;
    }
    next();
}
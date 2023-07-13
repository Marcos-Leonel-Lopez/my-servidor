import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EError.INVALID_JSON:
            res.status(400).send({
                status:error,
                error: error.cause,
                message: error.message
            })
            break;
        case EError.AUTH_ERROR:
            res.status(400).send({
                status: error,
                error: error.cause,
                message: error.message
            })
            break;
        case EError.DATABASE_ERROR:
            res.status(400).send({
                status: error,
                error: error.cause,
                message: error.message
            })
            break;
        case EError.INVALID_PARAMS:
            res.status(400).send({
                status: error,
                error: error.cause,
                message: error.message
            })
            break;
        case EError.ROUTING_ERROR:
            res.status(400).send({
                status: error,
                error: error.cause,
                message: error.message
            })
            break;
        default:
            res.status(400).send({
                status: error,
                message: "Error. Contact support"
            })
            break;
    }
    next();
}
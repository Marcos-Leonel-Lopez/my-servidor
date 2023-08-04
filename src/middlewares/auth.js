export const onlyClient = async (req, res, next)=>{
    try {
        req.logger.debug('entra al middle onlyClient');
        if(req.user?.role != 'client' && req.user?.role !== 'premium') return res.redirect('/profile');
        next()
    } catch (error) {
        next(error);
    }
}

export const publicAccess = (req, res, next) => {
    try {
        req.logger.debug('entra al middle publicAccess');
        if (req.session.user) return res.redirect('/products');
        next()
    } catch (error) {
        next(error);
    }
}
export const exclusiveAccess = async (req, res, next) => {
    try {
        req.logger.debug('entra al middle exclusiveAccess');
        req.logger.debug(req.user.role);
        if(req.user.role !== 'admin' && req.user.role !== 'premium') return res.redirect('/profile');
        next();
    } catch (error) {
        next(error);
    }
}

export const privateAccess = (req, res, next) => {
    try {
        req.logger.debug('entra al middle privateAccess');
         if (!req.session.user) return res.redirect('/login');
        next();   
    } catch (error) {
        next(error);
    }
}
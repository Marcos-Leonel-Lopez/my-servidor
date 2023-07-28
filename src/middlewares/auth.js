export const onlyClient = async (req, res, next)=>{
    try {
        req.logger.debug('entra al middle onlyClient');
        if(req.user?.role != 'client') return res.redirect('/profile');
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

export const adminAccess = async (req, res, next) => {
    try {
        req.logger.debug('entra al middle adminAccess');
        if(req.user.role != 'admin') return res.redirect('/profile');
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
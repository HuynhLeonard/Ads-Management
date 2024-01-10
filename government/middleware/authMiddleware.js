export const checkAuth = (req, res, next) => {
    if (!req.isAuthenticated() || !req.user || req.user.position === 0) {
        return res.redirect(`/?reqUrl=${req.originalUrl}`);
    }
    const desRoute = req.originalUrl;
    if (desRoute.includes('/imgur')) {
        return next();
    }
    if (req.user.position === 1 && desRoute.includes('/district')) {
        return next();
    }
    if (req.user.position === 2 && desRoute.includes('/ward')) {
        return next();
    }
    if (req.user.username === 'admin' && desRoute.includes('/department')) {
        return next();
    }

    // stay on the current page
    return res.redirect('/');
}

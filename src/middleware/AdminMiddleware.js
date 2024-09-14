export function checkAdmin(req, res, next) {
    const user = req.user; 

    if (user && user.role === 'admin') {
        // Si el usuario tiene el rol de administrador, permite continuar
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
}

export default checkAdmin;
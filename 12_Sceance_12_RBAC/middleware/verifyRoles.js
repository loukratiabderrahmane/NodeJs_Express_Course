const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles]
        const result = req.roles.some(role => rolesArray.includes(role))
        // some() : est-ce qu'il existe au moins 1 role aui match
        if (!result) return res.sendStatus(403)
        next()
    }
}

module.exports = verifyRoles
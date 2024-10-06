const config = require('../../config/config')

function adminToken(req, res, next) {
    const adminToken = req.query.admintoken;
	
    const token = adminToken;
	

    if (!token) {
        return res.status(403).send({
            error: true,
            message: 'admintoken Nao fornecido via get ',
        })
    }

    if (config.adminToken !== token) {
        return res
            .status(403)
            .send({ error: true, message: 'Token de Admin inválido' })
    }
    next()
}

module.exports = adminToken

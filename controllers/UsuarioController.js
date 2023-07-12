const Usuario  = require('../models/Usuario');
const Neo4jController = require('./Neo4jController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const neo4j = new Neo4jController();

class UsuarioController {
    async login(req, res){
        const { email, senha } = req.body;
        const usuarioCheck = await Usuario.findOne({ email }).collation({
            locale: "pt",
            strength: 2,
        });
        if(usuarioCheck){
            return res.sendStatus(409)
        } 
        const hash = await bcrypt.hash(senha, 10);
        const novoUsuario = {
            email: email,
            password: hash,
        };
        try {
            const result = await Usuario.create(novoUsuario);
            await neo4j.salvarUsuario(result.id);
            return res.sendStatus(201);
        } catch (error) {
            return res.sendStatus(500);
        }
        
    }

    async signin(req, res){
        const { nome, email, password } = req.body;
        const usuarioCheck = await Usuario.findOne({ nome, email }).collation({
            locale: "pt",
            strength: 2,
        });
        if(!usuarioCheck){
            return res.sendStatus(404);
        } else {
            try {
                const check = bcrypt.compare(password, usuarioCheck.password);
                if(check){
                    const token = jwt.sign({
                        id: usuarioCheck.id, 
                        email: usuarioCheck.email}, 
                        process.env.JWT_SECRET, 
                        {expiresIn: 3600}
                    );
                    return res.json({token: `Bearer ${token}`});
                } else return res.sendStatus(401);
            } catch (error) {
                return res.sendStatus(500);
            }
        }
    }
}

module.exports = UsuarioController;
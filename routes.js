const express = require ('express');
const router = express.Router();
const EventoController = require('./controllers/EventoController');
const UsuarioController = require('./controllers/UsuarioController');
const Neo4jController = require('./controllers/Neo4jController');
const evento = new EventoController();
const usuario = new UsuarioController();
const neo4j = new Neo4jController();

router.post('/evento', evento.create);
router.get('/evento', evento.read);
router.get('/search/:content', evento.find);
router.get('/evento/:id', evento.findById);
router.put('/evento/:id', evento.update);
router.delete('/evento/:id', evento.delete);

router.post('/login', usuario.login);


router.get('/like/:id', neo4j.curtirEvento);
router.get('/liked/:id', neo4j.eventosCurtidos);

module.exports = router;
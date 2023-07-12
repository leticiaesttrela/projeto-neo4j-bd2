const Evento = require ('../models/Evento');
const Neo4jController = require('./Neo4jController');

const neo4j = new Neo4jController();

class EventosController{
    async create(req, res){
        const body = req.body;
        if(body.titulo && body.lat && body.lng) {
            try {
                const result = await Evento.create(body);
                await neo4j.salvarEvento(result.id);
                res.sendStatus(201)
            } catch (error) {
                res.sendStatus(400);
            }
        }else res.sendStatus(400)
    }
    async read(req, res){
        try {
            const eventos = await Evento.find({},{_id:true, __v:false});
            res.json(eventos);
        } catch (error) {
            res.sendStatus(404);
        }
    }
    async find(req, res){
        const content = req.params.content;
        try {
            const eventos = await Evento.find(
                { $text: { $search: `%${content}%` } },
                { _id: true, __v: false },
              );
            if(eventos.length >= 0) res.json(eventos)
            else res.sendStatus(204);
        } catch (error) {
            res.sendStatus(404);
        }
    }

    async findById(req, res){
        const id = req.params.id;
        try {
            const result = await Evento.findById(id);
            if(result) res.json(result);
            else sendStatus(400)
        } catch (error) {
            res.sendStatus(404);
        }
    }

    async update(req, res){
        const body = req.body;
        const id = req.params.id;
        try {
            const result = await Evento.findByIdAndUpdate({_id: id}, {...body});
            if(result) res.sendStatus(200)
            else sendStatus(400)
        } catch (error) {
            res.sendStatus(404);
        }
    }
    async delete(req, res){
        const id = req.params.id;
        try {
            const result = await Evento.findByIdAndDelete({_id: id});
            if(result) res.sendStatus(200)
            else sendStatus(400)
        } catch (error) {
            res.sendStatus(404);
        }
    }
};

module.exports = EventosController;

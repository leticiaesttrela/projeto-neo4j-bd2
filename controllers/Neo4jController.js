const driver = require('../database/neo4j');
const Evento  = require('../models/Evento');
const jwt = require('jsonwebtoken');

class Neo4jController {
    async salvarEvento(id){
        const session = driver.session();
        try {
        const result = await session.run("CREATE (:Evento{id:$id})", { id });
        console.log(result.summary.counters._stats.nodesCreated);
        session.close();
        } catch (error) {
            console.log(error);
        }
    }

    async salvarUsuario(id){
        const session = driver.session();
        try {
            const result = await session.run("CREATE (:Usuario{id:$id})", { id });
            console.log(result.summary.counters._stats?.nodesCreated);
            await session.close();
        } catch (error) {
            console.log(error);
        }
    }

    async curtirEvento(req, res){
        const session = driver.session();
        try {
          const id = req.params.id;
          const authorization = req.get("authorization");
          const user = await jwt.decode(authorization, process.env.JWT_SECRET);
          if (user) {
              const result = await session.run(
              "MATCH (u:Usuario{id:$idUser}) OPTIONAL MATCH (e:Evento{id:$idEvent}) MERGE (u)-[:Subscribed]->(e)",
                  {
                      idUsuario: usuario.id,
                      idEvento: id,
                  }
              );
              console.log(result.summary.counters._stats.relationshipsCreated);
          } else return res.sendStatus(404);
          session.close();
          return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }

    async eventosCurtidos(req, res){
        const id = req.params.id;
        const session = driver.session();
        try {
          const result = await session.run(
            "MATCH (e1:Evento)<-[:Subscribed]-(u:Usuario)-[s:Subscribed]->(e2:Evento) WHERE e1.id = $id RETURN e2.id as events, count(e2) as quantity ORDER BY quantity desc LIMIT 3",
            {
              id: id,
            },
          );
          const events = [];
          await Promise.all(
            result.records.map(async (e) => {
              const event = await Evento.findById(e._fields[0]);
              events.push({
                _id: event._id,
                titulo: event.titulo,
                quantity: e._fields[1].low,
              });
            }),
          );
          session.close();
          return res.json(events);
        } catch (error) {
          console.log(error);
          res.sendStatus(500);
        }
    }

    close() {
        driver.close();
    }
}

module.exports = Neo4jController;
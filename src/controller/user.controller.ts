import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from "../services/user.service";

class UserController {

    async create(req: FastifyRequest, res: FastifyReply) {
        try {
            const user = await new UserService().create(req.body)
            res.code(201).send(`user: ${user.name} created, with id: ${user.id} !`);
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(req: FastifyRequest, res: FastifyReply) {
        try {
            const users = await new UserService().getAll();
            res.code(200).send(users);
        } catch (error) {
            console.log(error)
        }
    }

    async getById(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const user = await new UserService().getById(id);
            res.code(200).send(user);
        } catch (error) {
            console.log(error)
        }
    }

    async update(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id;
            const user = await new UserService().update(id, req.body);
            res.code(202).send(`user: ${user.name} updated, with id: ${user.id} !`);
        } catch (error) {
            console.log(error)
        }
    }

    async delete(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const code = await new UserService().delete(id);
            res.code(code).send(`user deleted`);
        } catch (error) {
            console.log(error)
        }
    }
    
}

export default new UserController();
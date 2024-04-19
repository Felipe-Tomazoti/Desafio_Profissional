import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoryService } from "../services/category.service";

class CategoryController {

    async create(req: FastifyRequest, res: FastifyReply) {
        try {
            const category = await new CategoryService().create(req.body)
            res.code(201).send(`category: ${category.name} created, with id: ${category.id} !`);
        } catch (error) {
            console.log(error)
        }
    }

    async getAll(req: FastifyRequest, res: FastifyReply) {
        try {
            const category = await new CategoryService().getAll()
            res.code(200).send(category);
        } catch (error) {
            console.log(error)
        }
    }

    async getAllById(req: FastifyRequest<{ Params: {id: string}}>, res: FastifyReply) {
        try {
            const id = req.params.id
            const category = await new CategoryService().getAllById(id)
            res.code(200).send(category);
        } catch (error) {
            console.log(error)
        }
    }

    async getById(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const category = await new CategoryService().getById(id)
            res.code(200).send(category);
        } catch (error) {
            console.log(error)
        }
    }

    async update(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const category = await new CategoryService().update(id, req.body)
            res.code(202).send(`category: ${category.name} updated, with id: ${category.id} !`);
        } catch (error) {
            console.log(error)
        }
    }

    async delete(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const code = await new CategoryService().delete(id)
            res.code(code).send(`category deleted`)
        } catch (error) {
            console.log(error)
        }
    }

}

export default new CategoryController();
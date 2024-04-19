import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskSerivce } from '../services/task.service'

class TaskController {

    async create(req: FastifyRequest, res: FastifyReply) {
        try {
            const task = await new TaskSerivce().create(req.body)
            res.code(201).send(`task: ${task.title} created, with id: ${task.id} !`);
        } catch (error) {
            console.log(error)
        }
    }

    async getAll(req: FastifyRequest, res: FastifyReply) {
        try {
            const task = await new TaskSerivce().getAll();
            res.code(200).send(task);
        } catch (error) {
            console.log(error)
        }
    }

    async getAllByUser(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const task = await new TaskSerivce().getAllByUser(id);
            res.code(200).send(task);
        } catch (error) {
            console.log(error)
        }
    }

    async getById(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id;
            const task = await new TaskSerivce().getById(id);
            res.code(200).send(task);
        } catch (error) {
            console.log(error)
        }
    }

    async update(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const task = await new TaskSerivce().update(id, req.body);
            res.code(202).send(`task: ${task.title} updated, with id: ${task.id} !`)
        } catch (error) {
            console.log(error)
        }
    }

    async delete(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const code = await new TaskSerivce().delete(id)
            res.code(code).send(`task deleted`);
        } catch (error) {
            console.log(error)
        }
    }

    async taskByCategory(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
        try {
            const id = req.params.id
            const task = await new TaskSerivce().taskByCategory(id)
            res.code(200).send(task);
    } catch (error) {
            console.log(error)
        }
    }

    async taskCompleted(req: FastifyRequest, res: FastifyReply){
        try{
            const task = await new TaskSerivce().taskCompleted()
            res.code(200).send(task);
        }catch(error){
            console.log(error)
        }
    }

    async taskPending(req: FastifyRequest, res: FastifyReply){
        try{
            const task = await new TaskSerivce().taskPending()
            res.code(200).send(task);
        }catch(error){
            console.log(error)
        }
    }

    async tasksToBeCompleted(req: FastifyRequest, res:FastifyReply){
        try{
            const task = await new TaskSerivce().tasksToBeCompleted()
            res.code(200).send(task);
        }catch(error){
            console.log(error)
        }
    }

    async taskCounterByUser(req: FastifyRequest<{Params: {id: string}}>, res:FastifyReply){
        try{
            const id = req.params.id
            const task = await new TaskSerivce().taskCounterByUser(id)
            res.code(200).send(task);
        }catch(error){
            console.log(error)
        }
    }

    async taskMostRecentByUser(req: FastifyRequest<{ Params: {id: string}}>, res: FastifyReply){
        try{
            const id = req.params.id
            const task = await new TaskSerivce().taskMostRecentByUser(id)
            res.code(200).send(task);
        }catch(error){
            throw error
        }
    }

    async taskAverageCompleted(req: FastifyRequest, res: FastifyReply){
        try{
            const task = await new TaskSerivce().taskAverageCompleted()
            res.code(200).send(task);
        }catch(error){
            console.log(error)
        }
    }

    async taskWithGreaterDescription(req: FastifyRequest, res: FastifyReply){
        try{
            const task = await new TaskSerivce().taskWithGreaterDescription()
            res.code(200).send(task);
        }catch(error){
            throw error
        }
    }

    async taskAgroupByCategory(req: FastifyRequest, res: FastifyReply){
        try{
            const task = await new TaskSerivce().taskAgroupByCategory()
            res.code(200).send(task);
        }catch(error){
            throw error
        }
    }

    async taskOldestByUser(req: FastifyRequest<{ Params: {id: string}}>, res: FastifyReply){
        try{
            const id = req.params.id
            const task = await new TaskSerivce().taskOldestByUser(id)
            res.code(200).send(task);
        }catch(error){
            console.log(error)
        }
    }
}   

export default new TaskController();
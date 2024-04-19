import categoryController from "../controller/category.controller";
import { FastifyInstance} from 'fastify';
import { AuthMiddlewares } from "../middlewares/auth";
type ControllerType = { Params: { id: string }}

export default async function(fastify: FastifyInstance){
    const isTestEnvironment = process.env.NODE_ENV === 'test';

    fastify.post('/categoryCreate', isTestEnvironment ? {} : { preHandler: AuthMiddlewares }, categoryController.create);
    fastify.get('/categoryGetAll', isTestEnvironment ? {} : { preHandler: AuthMiddlewares }, categoryController.getAll);
    fastify.get<ControllerType>('/categoryGetAllByUser/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, categoryController.getAllById);
    fastify.get<ControllerType>('/categoryGetById/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, categoryController.getById);
    fastify.put<ControllerType>('/categoryUpdate/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, categoryController.update);
    fastify.delete<ControllerType>('/categoryDelete/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, categoryController.delete);
}
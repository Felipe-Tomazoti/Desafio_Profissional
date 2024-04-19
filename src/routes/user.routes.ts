import userController from "../controller/user.controller";
import { AuthMiddlewares } from "../middlewares/auth";
import { FastifyInstance} from 'fastify';
type ControllerType = { Params: { id: string }}

export default async function (fastify: FastifyInstance) {
    const isTestEnvironment = process.env.NODE_ENV === 'test';

    fastify.post('/userCreate', userController.create);
    fastify.get('/userGetAll', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, userController.getAll);
    fastify.get<ControllerType>('/userGetById/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, userController.getById);
    fastify.put<ControllerType>('/userUpdate/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, userController.update);
    fastify.delete<ControllerType>('/userDelete/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, userController.delete);
}
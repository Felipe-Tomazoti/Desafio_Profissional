import taskController from "../controller/task.controller";
import { FastifyInstance} from 'fastify';
import { AuthMiddlewares } from "../middlewares/auth";
type ControllerType = { Params: { id: string }}

export default async function (fastify: FastifyInstance){
    const isTestEnvironment = process.env.NODE_ENV === 'test';

    fastify.post('/taskCreate', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.create);
    fastify.get('/taskGetAll', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.getAll);
    fastify.get<ControllerType>('/taskGetAllByUser/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.getAllByUser);
    fastify.get<ControllerType>('/taskGetById/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.getById);
    fastify.put<ControllerType>('/taskUpdate/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.update);
    fastify.delete<ControllerType>('/taskDelete/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.delete);
    fastify.get<ControllerType>('/taskFilterByCategory/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskByCategory);
    fastify.get('/taskCompleted', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskCompleted);
    fastify.get('/taskPending', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskPending);
    fastify.get('/taskToBeCompleted', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.tasksToBeCompleted);
    fastify.get<ControllerType>('/taskCounterByUser/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskCounterByUser);
    fastify.get<ControllerType>('/taskMostRecentByUser/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskMostRecentByUser);
    fastify.get('/taskAverageCompleted', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskAverageCompleted);
    fastify.get('/taskWithGreaterDescription', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskWithGreaterDescription);
    fastify.get('/taskAgroupByCategory', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskAgroupByCategory);
    fastify.get<ControllerType>('/taskOldestByUser/:id', isTestEnvironment ? {} : {preHandler: AuthMiddlewares}, taskController.taskOldestByUser);
}
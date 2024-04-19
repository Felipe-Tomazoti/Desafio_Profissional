import authController from "../controller/auth.controller";
import { FastifyInstance} from 'fastify';

export default async function(fastify: FastifyInstance){
    fastify.post('/auth', authController.auth);
}
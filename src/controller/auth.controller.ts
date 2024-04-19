import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from "../services/auth.service";

class AuthController {

    async auth(req: FastifyRequest<{ Body: {email: string, password: string}}>, res: FastifyReply){
        try{
            const { email, password} = req.body
            const authUser = await new AuthService().auth(email, password)
            res.code(200).send(authUser)
        }catch(error){
            console.log(error)
        }
    }

}

export default new AuthController();
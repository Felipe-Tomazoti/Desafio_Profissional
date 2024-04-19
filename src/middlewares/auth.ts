import { NextFunction } from "@fastify/middie";
import { verify } from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

export function AuthMiddlewares(req: FastifyRequest, res: FastifyReply, next: NextFunction): void{
    const { authorization } = req.headers;
    if (!authorization) {
        throw res.status(401).send("Token not provided");
    }
    const [, token] = authorization.split(" ");
    try{    
        const decode = verify(token, "secret");
        const { id } = decode as TokenPayload;
        req.userId = id;
        next();
    }catch(error){
        res.status(401).send("Token Invalid");
    }
}

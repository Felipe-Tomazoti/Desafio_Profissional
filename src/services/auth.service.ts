import { prisma } from "../lib/prisma"
import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";

export class AuthService{

    async auth(email: string, password: string){
        try{
            const user = await prisma.user.findUnique({ where: {
                email: email
            } as Prisma.UserWhereUniqueInput
        })
        
        if(!user){
            return 'User not found'
        }
        const isValuePassword = await compare(password, user.password)
        if (!isValuePassword){
            return 'Password invalid'
        }
        const id = user.id
        const token = sign({id: user.id}, "secret", {expiresIn: "1d"})

        return ({ user: {id, email}, token});

        }catch(error){
            throw error
        }
    }

}
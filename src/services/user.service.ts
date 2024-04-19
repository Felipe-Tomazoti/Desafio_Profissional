import { prisma } from "../lib/prisma"
import { hash } from "bcryptjs";

export class UserService {

    async create(user: any) {
        try {
            const hash_password = await hash(user.password, 8)
            const createdUser = await prisma.user.create({
                data: {
                    name: user.name,
                    weight: parseFloat(user.weight),
                    email: user.email,
                    password: hash_password
                }
            });
            return createdUser;
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const getUsers = (await prisma.user.findMany({}))
            return getUsers
        } catch (error) {
            throw error
        }
    }

    async getById(user: string) {
        try {
            const getUser = await prisma.user.findUnique({
                where: {
                    id: user,
                },
            })
            return getUser
        } catch (error) {
            throw error
        }
    }

    async update(id: string, body: any) {
        try {
            const getUser = await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    name: body.name,
                    weight: parseFloat(body.weight),
                    email: body.email,
                    password: body.password
                }
            })
            return getUser
        } catch (error) {
            throw error
        }
    }

    async delete(user: string) {
        try {
            await prisma.task.deleteMany({
                where: {
                    userId: user,
                },
            })
            await prisma.user.delete({
                where: {
                    id: user,
                },
            })
            return 204;
        } catch (error) {
            throw error
        }
    }

}
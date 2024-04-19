import { prisma } from "../lib/prisma"

export class CategoryService {
    
    async create(category: any) {
        try {
            const newCategory = await prisma.category.create({
                data: {
                    name: category.name,
                    color: category.color
                }
            })
            return newCategory
        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            const category = await prisma.category.findMany()
            return category
        } catch (error) {
            throw error
        }
    }

    async getAllById(id: string) {
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    userId: id,
                },
            })
            const categoryIds = tasks.map(task => task.categoryId).filter(Boolean).map(String)
            const categories = await prisma.category.findMany({
                where: {
                    id: {
                        in: categoryIds
                    }
                }
            })
            return categories
        } catch (error) {
            throw error
        }
    }

    async getById(categoryId: string) {
        try {
            const category = await prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            })
            return category
        } catch (error) {
            throw error
        }
    }

    async update(categoryId: string, body: any) {
        try {
            const category = await prisma.category.update({
                where: {
                    id: categoryId,
                },
                data: {
                    name: body.name,
                    color: body.color
                }
            })
            return category
        } catch (error) {
            throw error
        }
    }

    async delete(categoryId: string) {
        try {
            const category = await prisma.category.delete({
                where: {
                    id: categoryId,
                },
            })
            return 204;
        } catch (error) {
            throw error
        }
    }

}
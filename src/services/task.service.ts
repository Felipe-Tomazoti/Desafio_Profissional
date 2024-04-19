import { prisma } from "../lib/prisma"

export class TaskSerivce {

    async create(task: any) {
        try {
            const newTask = await prisma.task.create({
                data: {
                    title: task.title,
                    description: task.description,
                    type: task.type,
                    status: task.status,
                    categoryId: task.categoryId,
                    userId: task.userId
                }
            })
            return newTask;
        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            const tasks = await prisma.task.findMany()
            return tasks
        } catch (error) {
            throw error
        }
    }

    async getAllByUser(id: any) {
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    userId: id
                }
            })
            return tasks
        } catch (error) {
            throw error
        }
    }

    async getById(id: string) {
        try {
            const task = await prisma.task.findUnique({
                where: {
                    id: id,
                },
            })
            return task
        } catch (error) {
            throw error
        }
    }

    async update(id: string, task: any) {
        try {
            const tasks = await prisma.task.update({
                where: {
                    id: id,
                },
                data: {
                    title: task.title,
                    description: task.description,
                    type: task.type,
                    status: task.status,
                    categoryId: task.categoryId ? task.categoryId : null,
                    userId: task.userId
                }
            })
            return tasks
        } catch (error) {
            throw error
        }
    }

    async delete(task: string) {
        try {
            await prisma.task.delete({
                where: {
                    id: task,
                },
            })
            return 204;
        } catch (error) {
            throw error
        }
    }

    async taskByCategory(id: string) {
        try {
            const task = await prisma.task.findMany({
                where: {
                    categoryId: id,
                },
            })
            return task
        } catch (error) {
            throw error
        }
    }

    async taskCompleted() {
        try {
            const task = (await prisma.task.findMany()).filter(task => task.status === "COMPLETED")
            return task
        } catch (error) {
            throw error
        }
    }

    async taskPending() {
        try {
            const task = (await prisma.task.findMany()).filter(task => task.status === "PENDING")
            return task
        } catch (error) {
            throw error
        }
    }

    async calculatorTime(timeEnd: any, timeIni: Date): Promise<string> {
        const endDate = new Date(timeEnd).getTime()
        const startDate = new Date(timeIni).getTime()

        let time = endDate - startDate

        if (time === null || time === undefined) {
            return 'Tempo restante desconhecido';
        }

        let aux = time / 1000;
        let formattedTime = '';

        if (aux >= 86400) {
            const days = Math.floor(aux / 86400);
            formattedTime += `${days} DAY `
            aux -= days * 86400

            if (aux >= 3600) {
                const hours = Math.floor(aux / 3600);
                formattedTime += `${hours} HOURS `;
                aux -= hours * 3600;

                if (aux >= 60) {
                    const minutes = Math.floor(aux / 60);
                    formattedTime += `${minutes} MINUTES `;
                    aux -= minutes * 60;

                    if (aux > 0) {
                        formattedTime += `${aux.toFixed(2)} SECONDS `;
                    }
                } else if (aux > 0) {
                    formattedTime += `${aux.toFixed(2)} SECONDS `;
                }

            } else if (aux >= 60) {
                const minutes = Math.floor(aux / 60);
                formattedTime += `${minutes} MINUTES `;
                aux -= minutes * 60;

                if (aux > 0) {
                    formattedTime += `${aux} SECONDS `;
                }

            } else if (aux > 0) {
                formattedTime += `${aux} SECONDS `;
            }
        } else {
            if (aux >= 3600) {
                const hours = Math.floor(aux / 3600);
                formattedTime += `${hours} HOURS `;
                aux -= hours * 3600;

                if (aux >= 60) {
                    const minutes = Math.floor(aux / 60);
                    formattedTime += `${minutes} MINUTES `;
                    aux -= minutes * 60;

                    if (aux > 0) {
                        formattedTime += `${aux.toFixed(2)} SECONDS `;
                    }
                } else if (aux > 0) {
                    formattedTime += `${aux.toFixed(2)} SECONDS `;
                }

            } else if (aux >= 60) {
                const minutes = Math.floor(aux / 60);
                formattedTime += `${minutes} MINUTES `;
                aux -= minutes * 60;

                if (aux > 0) {
                    formattedTime += `${aux.toFixed(2)} SECONDS `;
                }

            } else if (aux > 0) {
                formattedTime += `${aux.toFixed(2)} SECONDS `;
            } else {
                formattedTime = 'Completion date not infomed';
            }
        }
        return formattedTime;
    }

    async tasksToBeCompleted() {
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    OR: [
                        { status: 'PENDING' },
                        { status: 'IN_PROGRESS' },
                    ],
                },
            });
            const tasksWithTimes = await Promise.all(tasks.map(async (task) => {
                const temp = await this.calculatorTime(task.completionDate, task.createdAt);
                return {
                    task,
                    temp
                }
            }
            ))

            return tasksWithTimes

        } catch (error) {
            throw error;
        }
    }

    async taskCounterByUser(id: string) {
        try {
            const tasks = await prisma.task.findMany({
                where: {
                    userId: id,
                },
            })
            return `Quantity of tasks: ${tasks.length}`
        } catch (error) {
            throw error
        }
    }

    async taskMostRecentByUser(id: string) {
        try {
            const task = await prisma.task.findFirst({
                where: {
                    userId: id,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return task
        } catch (error) {
            throw error
        }
    }

    async taskAverageCompleted() {
        try {
            const allTasks = (await prisma.task.findMany()).length
            const completedTasks = (await prisma.task.findMany()).filter(task => task.status === "COMPLETED").length
            const average = (completedTasks / allTasks) * 100
            return `The averarge of the tasks completed is: ${average.toFixed(0)}%`
        } catch (error) {
            throw error
        }
    }

    async taskWithGreaterDescription() {
        try {
            const firstTask = await prisma.task.findFirst()
            const allTasks = await prisma.task.findMany()

            if (!firstTask) {
                throw new Error('No tasks found')
            }

            let biggerTask = firstTask
            let biggerDesc = firstTask?.description.length

            for (const task of allTasks) {
                if (task.description.length > biggerDesc) {
                    biggerTask = task
                    biggerDesc = task.description.length
                }
            }

            return biggerTask

        } catch (error) {
            throw error
        }
    }

    async taskAgroupByCategory() {
        try {
            const categories = await prisma.category.findMany();
            const formattedResults: Array<{ categoryName: string; tasks: string[] }> = [];

            for (const category of categories) {
                const tasks = await prisma.task.findMany({
                    where: {
                        categoryId: category.id
                    }
                });

                const formattedResult = {
                    categoryName: category.name,
                    tasks: tasks.map(task => task.title)
                }

                formattedResults.push(formattedResult)
            }
            const finalResult = formattedResults.map(result => `Name of Category: ${result.categoryName}, Tasks: ${result.tasks.join(', ')}`).join('\n');
            return finalResult;
        } catch (error) {
            throw error
        }
    }

    async taskOldestByUser(id: string) {
        try {
            const task = await prisma.task.findFirst({
                where: {
                    userId: id,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            })
            return task
        } catch (error) {
            throw error
        }
    }

}
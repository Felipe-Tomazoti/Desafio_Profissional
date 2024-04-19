import 'dotenv/config';
import { users } from './users';
import { prisma } from "../lib/prisma"

const isTestEnv = process.env.NODE_ENV === 'test';

const log = (...args: any) => {
    if (isTestEnv) return;
    console.log(...args);
}

async function runSeed() {
    try {
        log(`Db connected successfully to api !`);
        
        await prisma.task.deleteMany({})
        await prisma.user.deleteMany({})

        await Promise.all(users.map(i => prisma.user.create({
            data: {
                name: i.name,
                weight: parseFloat(i.weight),
                email: i.email,
                password: i.password,
            },
        })));

        log(await prisma.user.findMany());
    } catch (error) {
        console.error('Cannot connect to database, error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (!isTestEnv) runSeed();

export { runSeed };

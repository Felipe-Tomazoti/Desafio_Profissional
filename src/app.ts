import 'dotenv/config'
import fastify from "fastify"
import { prisma } from "./lib/prisma"

class App {
    public fastify = fastify()
    public constructor() {
        this.routes()
        this.database()
    }

    private async database() {
        try {
            await prisma.$connect();
                console.log('Connect database success');
        } catch (error) {
            console.error('Cannot connect to database, error:', error);
        }
    }

    private routes(): void {
        this.fastify.register(require('./routes/user.routes').default);
        this.fastify.register(require('./routes/task.routes').default);
        this.fastify.register(require('./routes/category.routes').default);
        this.fastify.register(require('./routes/auth.routes').default);
    }
}

export default new App().fastify;
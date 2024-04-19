import { deepStrictEqual } from 'node:assert'
import { runSeed } from '../src/config/runSeed'
import { prisma } from "../src/lib/prisma"

describe('API (Users, Tasks, Categories) Workflow', () => {
    let _testServer: any
    let _testServerAddress: string

    function createUser(User: any) {
        return _testServer.inject({
            method: 'POST',
            url: `${_testServerAddress}/userCreate`,
            payload: User,
        })
    }

    async function userGetAll() {
        return await _testServer.inject({
            method: 'GET',
            url: `${_testServerAddress}/userGetAll`,
        })
    }

    async function userGetById(Id: any) {
        return await _testServer.inject({
            method: 'GET',
            url: `${_testServerAddress}/userGetById/${Id}`,
            payload: Id,
        })
    }

    async function userUpdate(Id: string, Body: any) {
        return await _testServer.inject({
            method: 'PUT',
            url: `${_testServerAddress}/userUpdate/${Id}`,
            payload: Body
        })
    }

    async function userDelete(Id: String) {
        return await _testServer.inject({
            method: 'DELETE',
            url: `${_testServerAddress}/userDelete/${Id}`,
            payload: Id
        })
    }

    beforeAll(async () => {
        const { server }: any = await import('../src/main')
        _testServer = await server
        _testServerAddress = 'http://localhost:5432';
    })

    beforeEach(async () => {
        await runSeed();
    })

    afterAll(async () => {
        await prisma.category.deleteMany({});
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});
        if (_testServer) {
            await _testServer.close();
        }
    })

    describe('POST /userCreate', () => {
        it('should create user', async () => {
            const input = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(input);
            const statusCode = body.statusCode;
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;
            const expected = `user: ${input.name} created, with id: ${id} !`;

            deepStrictEqual(statusCode, 201);
            deepStrictEqual(body.body, expected)
        })
    });

    describe(`GET /userGetAll`, () => {
        it('Given 3 different users it should have valid list', async () => {
            const users2 = [
                {
                    name: 'Joao Palo',
                    weight: '56',
                    email: 'joao@gmail.com.br',
                    password: 'jjoao1'
                },
                {
                    name: 'Maurilio',
                    weight: '80',
                    email: 'maurilio@gmail.com.br',
                    password: 'MAumau'
                },
                {
                    name: 'Cassiano',
                    weight: '70',
                    email: 'cassiano@gmail.com.br',
                    password: 'leiteP'
                }
            ]
            const usersResponses = await Promise.all(
                users2.map(async user => await createUser(user))
            );

            const userIDs = usersResponses.map(response => {
                const idMatch = response.body.match(/with id: (.+?) !/);
                return idMatch ? idMatch[1] : undefined
            })

            const userDetailsReponses = await Promise.all(
                userIDs.map(async id => await userGetById(id))
            )

            const userDetails = userDetailsReponses.map(obj => JSON.parse((obj.body)));

            const reply = await userGetAll();
            const json = await reply.json().filter(Boolean).slice(-3);
            const userDetailsSorted = userDetails.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1);
            const jsonSorted = json.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1);

            const statusCode = reply.statusCode;
            deepStrictEqual(statusCode, 200)
            deepStrictEqual(jsonSorted, userDetailsSorted);
        })
    })

    describe(`GET /userGetById`, () => {
        it(`Given a userID it should have get this user`, async () => {
            const userNew = {
                name: 'Espeto',
                weight: '60',
                email: 'espeto@gmail.com.br',
                password: 'espeto'
            }

            const result = await createUser(userNew)
            const resultBody = result.body;
            const idMatch = resultBody.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined
            const user = await userGetById(id);
            const userBody = JSON.parse(user.body);
            const expectedId = userBody.id;
            const statusCode = user.statusCode;
            deepStrictEqual(statusCode, 200);
            deepStrictEqual(id, expectedId);
        })
    })

    describe(`PUT /userUpdate`, () => {
        it(`Given a userID and userBody, you update the user`, async () => {
            const userNew = {
                name: 'Talita',
                weight: '45',
                email: 'talita@gmail.com.br',
                password: 'tata99'
            }

            const result = await createUser(userNew)
            const resultBody = result.body;
            const idMatch = resultBody.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined
            const user = await userGetById(id);
            const userBody = JSON.parse(user.body)
            const realId = userBody.id;

            const userUpdat = {
                name: 'Talita Da Silva',
                weight: parseFloat('50'),
                email: 'talita@gmail.com.br',
                password: 'tata99'
            }

            const updateNow = await userUpdate(realId, userUpdat);
            const resultBodyUP = updateNow.body; // result.body padrao
            const idMatchUP = resultBodyUP.match(/with id: (.+?) !/);
            const idUP = idMatchUP ? idMatchUP[1] : undefined
            const userUP = await userGetById(idUP);
            const userBodyUP = JSON.parse(userUP.body);
            const realIdUP = userBodyUP.id;

            const obj = {
                name: userBodyUP.name,
                weight: userBodyUP.weight,
                email: userBodyUP.email,
                password: userBodyUP.password
            }
            const statusCode = updateNow.statusCode;
            deepStrictEqual(id, realIdUP);
            deepStrictEqual(userUpdat, obj);
            deepStrictEqual(statusCode, 202);

        })
    })

    describe(`DELETE /userDelete`, () => {
        it(`Given a userID, you delete the user`, async () => {
            const userNew = {
                name: 'Ronaldinho Gaucho',
                weight: '80',
                email: 'ronaldinho@gmail.com.br',
                password: 'r10r10'
            }

            const result = await createUser(userNew)
            const resultBody = result.body; // result.body padrao
            const idMatch = resultBody.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined
            const user = await userGetById(id);
            const userBody = JSON.parse(user.body)
            const realId: any = userBody.id;

            const response = await userDelete(realId);
            deepStrictEqual(response.statusCode, 204);
        })
    })

    // TASKS

    function createTask(Task: any) {
        return _testServer.inject({
            method: 'POST',
            url: `${_testServerAddress}/taskCreate`,
            payload: Task,
        })
    }

    async function taskGetAll() {
        return await _testServer.inject({
            method: 'GET',
            url: `${_testServerAddress}/taskGetAll`,
        })
    }

    async function taskGetById(Id: any) {
        return await _testServer.inject({
            method: 'GET',
            url: `${_testServerAddress}/taskGetById/${Id}`,
            payload: Id,
        })
    }

    async function taskUpdate(Id: string, Body: any) {
        return await _testServer.inject({
            method: 'PUT',
            url: `${_testServerAddress}/taskUpdate/${Id}`,
            payload: Body
        })
    }

    async function taskDelete(Id: String) {
        return await _testServer.inject({
            method: 'DELETE',
            url: `${_testServerAddress}/taskDelete/${Id}`,
            payload: Id
        })
    }


    describe('POST /taskCreate', () => {
        it('should create task', async () => {
            const user = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(user);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;
            const input = {
                title: 'Jogador de Volei',
                description: 'Treinar para partida de volei',
                type: 'volei',
                status: 'PENDING',
                categoryId: null,
                userId: id
            }

            const taskBody = await createTask(input);
            const statusCode = body.statusCode;
            const idTaskMatch = taskBody.body.match(/with id: (.+?) !/);
            const idTask = idTaskMatch ? idTaskMatch[1] : undefined;
            const expected = `task: ${input.title} created, with id: ${idTask} !`;

            deepStrictEqual(statusCode, 201);
            deepStrictEqual(taskBody.body, expected)
        })
    });

    describe(`GET /taskGetAll`, () => {
        it('Given 3 different tasks it should have valid list', async () => {
            const user = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(user);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;

            const tasks2 = [
                {
                    title: 'Jogador de Volei',
                    description: 'Treinar para partida de volei',
                    type: 'volei',
                    status: 'PENDING',
                    categoryId: null,
                    userId: id
                },
                {
                    title: 'Jogador de Basquete',
                    description: 'Treinar para partida de basquete',
                    type: 'basquete',
                    status: 'IN_PROGRESS',
                    categoryId: null,
                    userId: id
                },
                {
                    title: 'Jogador de Futebol',
                    description: 'Treinar para partida de futebol',
                    type: 'futebol',
                    status: 'COMPLETED',
                    categoryId: null,
                    userId: id
                }
            ]

            const tasksResponses = await Promise.all(
                tasks2.map(async task => await createTask(task))
            );

            const taskIDs = tasksResponses.map(response => {
                const idMatch = response.body.match(/with id: (.+?) !/);
                return idMatch ? idMatch[1] : undefined
            })

            const taskDetailsReponses = await Promise.all(
                taskIDs.map(async id => await taskGetById(id))
            )

            const taskDetails = taskDetailsReponses.map(obj => JSON.parse((obj.body)));

            const reply = await taskGetAll();
            const json = await reply.json().filter(Boolean).slice(-3);
            const taskDetailsSorted = taskDetails.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1);
            const jsonSorted = json.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1);

            const statusCode = reply.statusCode;
            deepStrictEqual(statusCode, 200)
            deepStrictEqual(jsonSorted, taskDetailsSorted);
        })
    })

    describe(`GET /taskGetById`, () => {
        it(`Given a taskID it should have get this task`, async () => {
            const user = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(user);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;

            const taskNew = {
                title: 'Jogador de Futebol',
                description: 'Treinar para partida de futebol',
                type: 'futebol',
                status: 'COMPLETED',
                categoryId: null,
                userId: id
            }

            const result = await createTask(taskNew)
            const resultBody = result.body; // result.body padrao
            const idTaskMatch = resultBody.match(/with id: (.+?) !/);
            const idtask = idTaskMatch ? idTaskMatch[1] : undefined
            const task = await taskGetById(idtask);
            const taskBody = JSON.parse(task.body);
            const expectedId = taskBody.id;
            const statusCode = task.statusCode;

            deepStrictEqual(statusCode, 200);
            deepStrictEqual(idtask, expectedId);
        })
    })

    describe(`PUT /taskUpdate`, () => {
        it(`Given a taskID and taskBody, you update the task`, async () => {
            const user = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(user);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;

            const input = {
                title: 'Jogador de Volei',
                description: 'Treinar para partida de volei',
                type: 'volei',
                status: 'PENDING',
                categoryId: null,
                userId: id
            }

            const taskBody = await createTask(input);
            const idTaskMatch = taskBody.body.match(/with id: (.+?) !/);
            const idTask = idTaskMatch ? idTaskMatch[1] : undefined;

            const taskUpdat = {
                title: 'Jogador de Baseboll',
                description: 'Treinar para partida de Baseboll',
                type: 'basebol',
                status: 'COMPLETED',
                categoryId: null,
                userId: id
            }

            const updateNow = await taskUpdate(idTask, taskUpdat);
            const resultBodyUP = updateNow.body; // result.body padrao
            const idMatchUP = resultBodyUP.match(/with id: (.+?) !/);
            const idUP = idMatchUP ? idMatchUP[1] : undefined
            const taskUP = await taskGetById(idUP);
            const taskBodyUP = JSON.parse(taskUP.body);
            const realIdUP = taskBodyUP.id;

            const obj = {
                title: taskBodyUP.title,
                description: taskBodyUP.description,
                type: taskBodyUP.type,
                status: taskBodyUP.status,
                categoryId: taskBodyUP.categoryId ? taskBodyUP.categoryId : null,
                userId: taskBodyUP.userId
            }

            const statusCode = updateNow.statusCode;
            deepStrictEqual(idTask, realIdUP);
            deepStrictEqual(taskUpdat, obj);
            deepStrictEqual(statusCode, 202);

        })
    })

    describe(`DELETE /taskDelete`, () => {
        it(`Given a taskID, you delete the task`, async () => {
            const user = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(user);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;

            const input = {
                title: 'Jogador de Volei',
                description: 'Treinar para partida de volei',
                type: 'volei',
                status: 'PENDING',
                categoryId: null,
                userId: id
            }

            const result = await createTask(input)
            const resultBody = result.body; // result.body padrao
            const idTaskMatch = resultBody.match(/with id: (.+?) !/);
            const idTask = idTaskMatch ? idTaskMatch[1] : undefined
            const task = await taskGetById(idTask);
            const taskBody = JSON.parse(task.body)
            const realId: any = taskBody.id;

            const response = await taskDelete(realId);
            deepStrictEqual(response.statusCode, 204);
        })
    })

    // CATEGORY 

    function createCategory(Task: any) {
        return _testServer.inject({
            method: 'POST',
            url: `${_testServerAddress}/categoryCreate`,
            payload: Task,
        })
    }

    async function categoryGetAll() {
        return await _testServer.inject({
            method: 'GET',
            url: `${_testServerAddress}/categoryGetAll`,
        })
    }

    async function categoryGetById(Id: any) {
        return await _testServer.inject({
            method: 'GET',
            url: `${_testServerAddress}/categoryGetById/${Id}`,
            payload: Id,
        })
    }

    async function categoryUpdate(Id: string, Body: any) {
        return await _testServer.inject({
            method: 'PUT',
            url: `${_testServerAddress}/categoryUpdate/${Id}`,
            payload: Body
        })
    }

    async function categoryDelete(Id: String) {
        return await _testServer.inject({
            method: 'DELETE',
            url: `${_testServerAddress}/categoryDelete/${Id}`,
            payload: Id
        })
    }


    describe('POST /categoryCreate', () => {
        it('should create category', async () => {
            const category = {
                name: 'Esporte',
                color: 'white'
            }

            const body = await createCategory(category);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;

            const expected = `category: ${category.name} created, with id: ${id} !`;
            const statusCode = body.statusCode;
            deepStrictEqual(statusCode, 201);
            deepStrictEqual(body.body, expected)
        })
    });

    describe(`GET /categoryGetAll`, () => {
        it('Given 3 different category it should have valid list', async () => {
            const category2 = [
                {
                    name: 'Fabrica',
                    color: 'green'
                },
                {
                    name: 'Estudar',
                    color: 'black'
                },
                {
                    name: 'Casa',
                    color: 'blue'
                }
            ]

            const categoryResponses = await Promise.all(
                category2.map(async category => await createCategory(category))
            );

            const categoryIDs = categoryResponses.map(response => {
                const idMatch = response.body.match(/with id: (.+?) !/);
                return idMatch ? idMatch[1] : undefined
            })

            const categoryDetailsReponses = await Promise.all(
                categoryIDs.map(async id => await categoryGetById(id))
            )

            const categoryDetails = categoryDetailsReponses.map(obj => JSON.parse((obj.body)));

            const reply = await categoryGetAll();
            const json = await reply.json().filter(Boolean).slice(-3);
            const categoryDetailsSorted = categoryDetails.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1);
            const categorySorted = json.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1);

            const statusCode = reply.statusCode;
            deepStrictEqual(statusCode, 200)
            deepStrictEqual(categorySorted, categoryDetailsSorted);
        })
    })

    describe(`GET /categoryGetById`, () => {
        it(`Given a categoryID it should have get this category`, async () => {
            const categoryNew = {
                name: 'Esporte',
                color: 'white'
            }

            const body = await createCategory(categoryNew);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;
            
            const category = await categoryGetById(id);
            const categoryBody = JSON.parse(category.body);
            const expectedId = categoryBody.id;
            const statusCode = category.statusCode;

            deepStrictEqual(statusCode, 200);
            deepStrictEqual(id, expectedId);
        })
    })

    describe(`PUT /categoryUpdate`, () => {
        it(`Given a categoryID and categoryBody, you update the category`, async () => {
            const category = {
                name: 'Esporte',
                color: 'white'
            }

            const body = await createCategory(category);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;
            const categoryUpdat = {
                name: 'Esporte',
                color: 'orange'
            }

            const updateNow = await categoryUpdate(id, categoryUpdat);
            const resultBodyUP = updateNow.body;
            const idMatchUP = resultBodyUP.match(/with id: (.+?) !/);
            const idUP = idMatchUP ? idMatchUP[1] : undefined

            const categoryUP = await categoryGetById(idUP);
            const categoryBodyUP = JSON.parse(categoryUP.body);
            const realIdUP = categoryBodyUP.id;

            const obj = {
                name: categoryBodyUP.name,
                color: categoryBodyUP.color
            }

            const statusCode = updateNow.statusCode;
            deepStrictEqual(id, realIdUP);
            deepStrictEqual(categoryUpdat, obj);
            deepStrictEqual(statusCode, 202);
        })
    })

    describe(`DELETE /categoryDelete`, () => {
        it(`Given a categoryID, you delete the category`, async () => {
            const input = {
                name: 'Esporte',
                color: 'white'
            }

            const body = await createCategory(input);
            const idMatch = body.body.match(/with id: (.+?) !/);
            const id = idMatch ? idMatch[1] : undefined;

            const category = await categoryGetById(id);
            const categoryBody = JSON.parse(category.body)
            const realId: any = categoryBody.id;

            const response = await categoryDelete(realId);
            deepStrictEqual(response.statusCode, 204);
        })
    })

// AUTH

    function auth(email: string, password: string ){
        return _testServer.inject({
            method: 'POST',
            url: `${_testServerAddress}/auth`,
            payload: {email, password}
        })
    }


    describe(`AUTH /authentication`, () => {
        it(`Given a email and password, you will create a token`, async () => {
            const input = {
                name: 'Jose',
                weight: '100',
                email: 'jose32@gmail.com.br',
                password: 'jose12'
            }

            const body = await createUser(input);
            const result = await auth(body.body.email, body.body.password)
            const statusCode = result.statusCode;

            deepStrictEqual(statusCode, 200);
        })
    })
});

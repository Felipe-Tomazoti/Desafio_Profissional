# Desafio Profissional

O Desafio em si, é uma máteria da faculdade onde temos que desenvolver um projeto, utilizando: Node.JS, TypeScript, Fastify/Express, Prisma/Mongoose. 
A função desta matéria, é o desenvolvimento de uma API focada no gerencimento de usuários, tarefas e categorias. 
Partindo do zero, até a implementenção das regras de negócio, autenticação, testes e muito mais.
## Instalação
<a href="https://www.docker.com/">Docker</a> - Para criar o container do banco de dados - PostgreSQL
## Iniciando o projeto
#### Clone o projeto para sua máquina local: 
`$ git clone https://github.com/Felipe-Tomazoti/Desafio_Profissional.git`
#### Instale as dependências
`(npm i -D (nome da dependência)`
#### Suba o docker-compose.yml para executar o PostgreSQL em um container: 
`docker-compose up`
### Testes (e2e + Bancos de dados)
#### Para executar os testes do backend, na pasta raiz do projeto execute o comando:
`npm test`

Após este comando, o servidor é inicializado, e antes de CADA teste o Banco de dados é "limpo" e é feito a inserção de 3 usuários padrões, 
onde esses podem ser utilizados para demais testes...
Além disso, após a execução de todos os testes, o Banco de dados é "limpo" novamente e no terminal você tem o resultado dos testes.  

## Build de Desenvolvimento
#### O projeto atual contém somente o ambiente de desenvolvimento, para executar o projeto:
`npm run dev`

## Utilizando a API
Após a execução em modo de desenvolvimento, para ter acesso a todas as rotas, primeiramente você deve criar um usuário na rota: userCreate , 
depois autenticar este usuário na rota: auth , com isso será gerado um TOKEN, e para as demais rotas, você deve utilizar esse TOKEN para execução.

#

# Professional Challenge

The Challenge itself is a college assignment where we have to develop a project using: Node.JS, TypeScript, Fastify/Express, Prisma/Mongoose. 
The purpose of this assignment is to develop an API focused on managing users, tasks and categories. 
Starting from scratch, through to implementing business rules, authentication, testing and much more.
## Installation
<a href="https://www.docker.com/">Docker</a> - To create the database container - PostgreSQL
## Starting the project
#### Clone the project to your local machine: 
`$ git clone https://github.com/Felipe-Tomazoti/Desafio_Profissional.git`
#### Install the dependencies
`(npm i -D (dependency name)`
#### Upload docker-compose.yml to run PostgreSQL in a container: 
`docker-compose up`
### Tests (e2e + Databases)
#### To run the backend tests, in the root folder of the project run the command:
`npm test`

After this command, the server is initialized, and before EACH test the database is "cleaned" and 3 standard users are inserted, 
which can be used for other tests...
In addition, after running all the tests, the database is "cleaned" again and the terminal displays the results of the tests. 

## Development Build
#### The current project contains only the development environment for running the project:
`npm run dev`

## Using the API
After running in development mode, to have access to all the routes, you must first create a user in the route: userCreate , 
then authenticate this user in the route: auth , this will generate a TOKEN, and for the other routes, you must use this TOKEN for execution.

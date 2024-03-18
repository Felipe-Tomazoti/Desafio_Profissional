import { Router } from 'express'
import bookController from './src/books/book.controller'

const routes = Router()
routes.get('/booksGetAll', bookController.getAll);
routes.get('/booksById/:id', bookController.getById);
routes.post('/books', bookController.create);
routes.put('/booksUpdate/:id', bookController.put);
routes.delete('/booksDelete/:id', bookController.delete);

export {
    routes
}
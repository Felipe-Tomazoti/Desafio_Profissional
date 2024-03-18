import { Request, Response } from 'express'
import { BookService } from './book.service'
import { request } from 'http'
import mongoose from 'mongoose'

class BookController {

    async create(req: Request, res: Response) {
        try {
            const book = await new BookService().create(req.body)
            res.status(201).json(book);
        } catch(error){
            console.log(error);
            return res.status(400).json({ message: 'Bad Request' });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const books = await BookService.prototype.getAll();
            res.status(200).json(books);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Bad Request' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const bookById = await BookService.prototype.getById(id);
            res.status(200).json(bookById);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Bad Request' });
        }
    }

    async put(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body;
            const updatedBook = await BookService.prototype.put(id, body);
            res.status(201).json(updatedBook);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Bad Request' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteBook = await BookService.prototype.delete(id);
            res.status(204).json(deleteBook);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Bad Request' });
        }
    }
}

export default new BookController()
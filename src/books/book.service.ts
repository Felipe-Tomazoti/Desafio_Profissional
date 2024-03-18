import bookModel from './book.schema'

export class BookService {

    async create(book: any) {
        try {
            const createdBook = bookModel.create(book)
            return createdBook
        } catch (error) {
            throw error;
        }

    }

    async getAll() {
        try {
            const books = await bookModel.find({});
            return books;
        } catch (error) {
            throw error;
        }
    }

    async getById(book: string) {
        try {
            const foundBook = await bookModel.findById(book);
            return foundBook;
        } catch (error) {
            throw error;
        }
    }

    async put(id: any, body: any){
        try{
            const foundBook = await bookModel.findByIdAndUpdate(id, body);
            return foundBook;
        } catch(error){
            throw error;
        }
    }

    async delete(id: any){
        try{
           await bookModel.findByIdAndDelete(id);
        } catch(error){
            throw error;
        }
    }
}

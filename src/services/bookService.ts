import { Sequelize } from "sequelize"
import { Book, BorrowedBook, User } from "../models"
import { BookModel } from "../models/bookModel"
import AppError from "../utils/appError"

interface ISingleBook extends BookModel {
    score?: number
}


export class BookService {
    constructor() { }

    public async getBooks(): Promise<BookModel[]> {
        const data = await Book.findAll()
        return data
    }

    public async getBookById(id: number): Promise<ISingleBook | null> {
        const data: ISingleBook | null = await Book.findOne({
            where: { id },
            attributes: [
                'id',
                'name',
                [Sequelize.literal(`
                    COALESCE(
                        CAST
                        (
                            ROUND(
                            (
                                SELECT AVG(score) FROM "borrowed_books" 
                                WHERE "borrowed_books"."book_id" = ${id}), 2
                            ) AS FLOAT
                        ), 
                        -1::integer
                        )
                    `), 'score'
                ]
            ]
        })


        if (!data) throw new AppError(404, 'The book not found.')

        return data
    }

    public async createBook(name: string): Promise<{}> {
        const bookExist = await Book.findOne({ where: { name } })
        if (bookExist) throw new AppError(400, 'Book already exist.')

        await Book.create({ name })
        return {}
    }
}
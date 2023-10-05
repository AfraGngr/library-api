import { QueryTypes } from "sequelize";
import db, { Book, BorrowedBook } from "../models";
import User, { UserModel } from "../models/userModel";
import AppError from "../utils/appError";

interface ISingleUser {
    id: number
    name: string
    books: {
        past: { name: string, userScore: number }[]
        present: { name: string, userScore: number }[]
    }
}

export class UserService {
    constructor() { }

    public async getUsers(): Promise<UserModel[]> {
        const data = await User.findAll()
        return data
    }

    public async getUserById(id: number): Promise<ISingleUser | null> {
        const [data] = await db.query(`
            SELECT 
                u.id,
                u.name,
                json_build_object(
                    'past', COALESCE((
                        SELECT json_agg(
                            json_build_object('name', b.name, 'userScore', bb.score)
                        )
                        FROM borrowed_books bb
                        JOIN books b ON bb.book_id = b.id
                        WHERE bb.user_id = u.id AND bb.returned
                    ), '[]'::json),
                    'present', COALESCE((
                        SELECT json_agg(
                            json_build_object('name', b.name)
                        )
                        FROM borrowed_books bb
                        JOIN books b ON bb.book_id = b.id
                        WHERE bb.user_id = u.id AND NOT bb.returned
                    ), '[]'::json)
                ) AS books
            FROM users u
            WHERE u.id = :id
            GROUP BY u.id;
            `,
            {
                replacements: { id },
                raw: true,
                type: QueryTypes.SELECT
            }
        ) as [ISingleUser, unknown]

        if (!data) throw new AppError(404, 'User not found.')

        return data
    }

    public async createUser(name: string): Promise<{}> {
        const userExist = await User.findOne({ where: { name } })
        if (userExist) throw new AppError(400, 'User already exist !')

        await User.create({ name })

        return {}
    }

    public async borrowBook(userId: number, bookId: number): Promise<{}> {
        const userExist = await User.findByPk(userId)
        if (!userExist) throw new AppError(400, 'There is no such user.')

        const bookExist = await Book.findByPk(bookId)
        if (!bookExist) throw new AppError(400, 'Book not found.')

        const bookBorrowed = await BorrowedBook.findOne({
            where: {
                bookId,
                returned: false
            },
            attributes: ['userId']
        })

        if (bookBorrowed) {
            if (bookBorrowed.userId === userId) throw new AppError(400, 'You have already borrowed this book.')
            throw new AppError(400, 'This book has already been borrowed.')
        }

        await BorrowedBook.create({
            userId,
            bookId,
        })

        return {}
    }

    public async returnBook(userId: number, bookId: number, score: number): Promise<{}> {
        const userExist = await User.findByPk(userId)
        if (!userExist) throw new AppError(400, 'There is no such user.')

        const bookExist = await Book.findByPk(bookId)
        if (!bookExist) throw new AppError(400, 'Book can not be found.')

        const returned = await BorrowedBook.findOne({
            where: {
                userId,
                bookId,
                returned: true
            }
        })

        if (returned) throw new AppError(400, 'You have already returned this book.')

        await BorrowedBook.update(
            {
                score,
                returned: true
            },
            {
                where: {
                    userId,
                    bookId
                }
            }
        )

        return {}
    }
}
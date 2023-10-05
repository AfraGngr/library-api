import { Sequelize } from "sequelize";

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    logging: false,
    define: {
        underscored: true,
        timestamps: false
    }
})

export default db

import Book from "./bookModel";
import User from "./userModel";
import BorrowedBook from "./borrowedBooks";

User.belongsToMany(Book, { through: BorrowedBook })
Book.belongsToMany(User, { through: BorrowedBook, as: 'borrowed' })

export {
    Book,
    User,
    BorrowedBook
}


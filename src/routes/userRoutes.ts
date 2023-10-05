import { Router } from 'express'
import { borrowBook, createUser, getUserById, getUsers, returnBook } from '../controllers/userController'

const router = Router()

router
    .get('/', getUsers)
    .get('/:id', getUserById)
    .post('/', createUser)
    .post('/:userId/borrow/:bookId', borrowBook)
    .post('/:userId/return/:bookId', returnBook)


export { router as userRoutes }
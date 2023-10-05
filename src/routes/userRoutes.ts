import { Router } from 'express'
import { borrowBook, createUser, getUserById, getUsers, returnBook } from '../controllers/userController'
import { validateBodyMiddleware, validateParamsMiddleware } from '../middlewares/validateMiddleware'
import { bookActionSchema, scoreSchema, userIdSchema, userSchema } from '../utils/schemas'

const router = Router()

router
    .get('/', getUsers)
    .get('/:userId', validateParamsMiddleware(userIdSchema), getUserById)
    .post('/', validateBodyMiddleware(userSchema), createUser)
    .post('/:userId/borrow/:bookId', validateParamsMiddleware(bookActionSchema), borrowBook)
    .post('/:userId/return/:bookId', validateParamsMiddleware(bookActionSchema), validateBodyMiddleware(scoreSchema), returnBook)


export { router as userRoutes }
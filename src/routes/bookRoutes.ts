import { Router } from 'express'
import { createBook, getBookById, getBooks } from '../controllers/booksController'
import { validateBodyMiddleware, validateParamsMiddleware } from '../middlewares/validateMiddleware'
import { bookSchema, bookIdSchema } from '../utils/schemas'

const router = Router()

router
    .get('/', getBooks)
    .get('/:bookId', validateParamsMiddleware(bookIdSchema), getBookById)
    .post('/', validateBodyMiddleware(bookSchema), createBook)


export { router as bookRoutes }
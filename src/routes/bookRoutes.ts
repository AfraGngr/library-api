import { Router } from 'express'
import { createBook, getBookById, getBooks } from '../controllers/booksController'

const router = Router()

router
    .get('/', getBooks)
    .get('/:id', getBookById)
    .post('/', createBook)


export { router as bookRoutes }
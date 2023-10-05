import { RequestHandler } from "express";
import catchAsync from "../utils/catchAsync";
import { BookService } from "../services/bookService";

const bookService = new BookService()

export const getBooks: RequestHandler = catchAsync(async (req, res) => {
    const data = await bookService.getBooks()
    res.status(200).send(data)
})

export const getBookById: RequestHandler = catchAsync(async (req, res) => {
    const data = await bookService.getBookById(+req.params.id)
    res.status(200).send(data)
})

export const createBook: RequestHandler = catchAsync(async (req, res) => {
    const data = await bookService.createBook(req.body.name)
    res.status(201).send()
})


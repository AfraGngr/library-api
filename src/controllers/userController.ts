import { RequestHandler } from "express";
import catchAsync from "../utils/catchAsync";
import { UserService } from "../services/userService";

const userService = new UserService()

export const getUsers: RequestHandler = catchAsync(async (req, res) => {
    const data = await userService.getUsers()
    res.status(200).send(data)
})

export const getUserById: RequestHandler = catchAsync(async (req, res) => {
    const data = await userService.getUserById(+req.params.id)
    res.status(200).send(data)
})

export const createUser: RequestHandler = catchAsync(async (req, res) => {
    const data = await userService.createUser(req.body.name)
    res.status(201).send()
})

export const borrowBook: RequestHandler = catchAsync(async (req, res) => {
    const data = await userService.borrowBook(+req.params.userId, +req.params.bookId)
    res.status(204).send()
})

export const returnBook: RequestHandler = catchAsync(async (req, res) => {
    const data = await userService.returnBook(+req.params.userId, +req.params.bookId, req.body.score)
    res.status(204).send()
})
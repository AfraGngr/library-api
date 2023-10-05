import httpStatus from 'http-status'
import { Request, Response, NextFunction } from 'express'
import { ValidationError, ValidationErrorItem, UniqueConstraintError } from "sequelize"
import AppError from '../utils/appError'


export default class ErrorHandler {
    static convert = () => {
        return async (err: any, req: Request, res: Response, next: NextFunction) => {
            let error = err
            if (!(error instanceof AppError)) {
                switch (error.name) {
                    case "SequelizeValidationError":
                        error = this.convertValidationError(error)
                        error.statusCode = httpStatus.BAD_REQUEST
                        break
                    case "SequelizeUniqueConstraintError":
                        error = this.convertUniqueConstraintError(error)
                        error.statusCode = httpStatus.BAD_REQUEST
                        break
                    case 'AxiosError':
                        error.statusCode = error?.response?.data?.error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR
                        error.message = error?.response?.data?.message || httpStatus[error.statusCode] || 'Something went wrong'
                        error.isOperational = false
                        break
                    default:
                        error.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
                        error.message = error.message || httpStatus[error.statusCode]
                        error.isOperational = false
                        break
                }
                error = new AppError(error.statusCode, error.message, error.isOperational, error.name, error.stack)
            }
            next(error)
        }
    }

    static handle = () => {
        return async (err: AppError, req: Request, res: Response, next: NextFunction) => {
            if (process.env.NODE_ENV === 'production') {
                this.sendErrorProd(err, req, res)
            } else {
                this.sendErrorDev(err, res)
            }
        }
    }

    private static sendErrorDev = (err: AppError, res: Response) => {
        console.log(`💥💥💥💥💥💥💥💥💥💥💥💥💥${err.name}💥💥💥💥💥💥💥💥💥💥💥💥💥`)
        console.log("headersSent: ?", res.headersSent)
        console.log("isOperational: ?", err.isOperational)
        console.log(err.message)
        console.log("-------------stack----------------")
        console.log(err.stack)
        console.log("💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥")

        if (res.headersSent) return
        res.status(err.statusCode).send({
            status: err.status,
            error: err,
            name: err.name,
            message: err.message,
            stack: err.stack
        })
    }

    private static sendErrorProd = (err: AppError, req: Request, res: Response) => {
        console.log(err)
        if (err.isOperational) {
            if (res.headersSent) {
                console.log(`💥💥💥💥💥💥💥💥💥💥💥💥💥${err.name}💥💥💥💥💥💥💥💥💥💥💥💥💥`)
                console.log("headersSent: ?", res.headersSent)
                console.log("isOperational: ?", err.isOperational)
                console.log(err.message)
                console.log("-------------stack----------------")
                console.log(err.stack)
                console.log("💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥")
            } else {
                res.status(err.statusCode).send({
                    status: err.status,
                    message: err.message
                })
            }
        } else {
            console.log(`💥💥💥💥💥💥💥💥💥💥💥💥💥${err.name}💥💥💥💥💥💥💥💥💥💥💥💥💥`)
            console.log("headersSent: ?", res.headersSent)
            console.log("isOperational: ?", err.isOperational)
            console.log(err.message)
            console.log("-------------stack----------------")
            console.log(err.stack)
            console.log("💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥")
            if (!res.headersSent) {
                res.status(500).send({
                    status: 'error',
                    message: 'Something went very wrong!'
                })
            }
        }
    }

    private static convertValidationError = (error: ValidationError) => {
        let concattedMessage = error.errors.map((e: ValidationErrorItem) => e.message).join('. ')
        error.message = `Invalid input: ${concattedMessage}`
        return error
    }

    private static convertUniqueConstraintError = (error: UniqueConstraintError) => {
        let concattedMessage = error.errors.map((e: ValidationErrorItem) => e.message).join('. ')
        error.message = `${concattedMessage}`
        return error
    }
}
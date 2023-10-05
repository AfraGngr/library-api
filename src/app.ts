import express, { Application, Request, Response } from 'express';
import { userRoutes } from './routes/userRoutes';
import { bookRoutes } from './routes/bookRoutes';
import ErrorHandler from './utils/errorHandler';

const app: Application = express()

app.use(express.json())


app.use('/users', userRoutes)
app.use('/books', bookRoutes)

app.use('*', (req: Request, res: Response) => {
    res.status(404).end()
})


app.use(ErrorHandler.convert())
app.use(ErrorHandler.handle())

export { app }


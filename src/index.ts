process.on("uncaughtException", err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.log(err.stack)
    process.exit(1)
})

import dotenv from 'dotenv'
dotenv.config({ path: './.config.env' })

import db from './models'

db.authenticate()
    .then(() => console.log(`Connected to ${db.config.database} successfully`))
    .catch((err) => console.log(`Unable to connect ${db.config.database}:`, err.message))

db.sync({ force: false })
    .then(() => console.log(`Synced ${db.config.database} successfully`))
    .catch((err) => console.log(`Unable to sync ${db.config.database}:`, err))

import { app } from './app'

const server = app.listen(process.env.PORT, () => {
    console.log(`Api is awake on port: ${process.env.PORT}`)
})


process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.log(reason.name, reason.message, reason.stack)
    server.close(() => {
        process.exit(1)
    })
})
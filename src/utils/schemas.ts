import { z } from "zod"

export const userSchema = z.object({
    name: z
        .string({ required_error: 'Name is required.', invalid_type_error: 'You must enter a valid name' })
        .min(2, { message: 'Name contain at least 2 character' })
        .max(30)
})

export const userIdSchema = z.object({
    userId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z
            .number({ invalid_type_error: 'User id must be a number' })
            .positive()
    ),
})

export const bookSchema = z.object({
    name: z
        .string({ required_error: 'Book name is required', invalid_type_error: 'You must enter a valid book name' })
        .min(1, { message: 'Book must contain at least 1 character' })
})


export const bookIdSchema = z.object({
    bookId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z
            .number({ invalid_type_error: 'Book id must be a number' })
            .positive()
    ),
})


export const bookActionSchema = z.object({
    userId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z
            .number({ invalid_type_error: 'User id must be a number' })
            .positive()
    ),

    bookId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z
            .number({ invalid_type_error: 'Book id must be a number' })
            .positive()
    )
})

export const scoreSchema = z.object({
    score: z
        .number({ required_error: 'You have to score this book.', invalid_type_error: 'The score should be a whole number between 1 and 10' })
        .int()
        .gte(1, { message: 'Score cannot be lower than 1' })
        .lte(10, { message: 'The highest score is 10' })
})


import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "./index";

export interface BookModel extends Model<InferAttributes<BookModel>, InferCreationAttributes<BookModel>> {
    id?: number
    name?: string
}

export const Book = db.define<BookModel>('book',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Book name is required.'
                },
            }
        }
    },
    {
        timestamps: false,
    }
);

export default Book;
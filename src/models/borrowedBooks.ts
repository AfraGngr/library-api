import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "./index";

export interface BorrowedBookModel extends Model<InferAttributes<BorrowedBookModel>, InferCreationAttributes<BorrowedBookModel>> {
    id?: number
    userId?: number
    bookId?: number
    score?: number
    returned?: boolean
}

export const BorrowedBook = db.define<BorrowedBookModel>('borrowedBook',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: {
                    args: [1],
                    msg: 'Score cannot be lower than 1'
                },
                max: {
                    args: [10],
                    msg: 'Score cannot be higher than 10'
                }

            }
        },
        returned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: false,
    }
);

export default BorrowedBook;
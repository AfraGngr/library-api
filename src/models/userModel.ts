import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "./index";

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    id?: number
    name?: string
}

export const User = db.define<UserModel>('user',
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Name is required.'
                },
                len: {
                    args: [1, 50],
                    msg: 'Name must be between 1 and 50 characters.'
                }

            },
            unique: true
        }
    },
    {
        timestamps: false,
    }
);

export default User;
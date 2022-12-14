const {Model, DataTypes} = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
    async checkPassword(loginPw){
        return await bcrypt.compare(loginPw, this.password);
    }
}

User.init(
    {
        userID:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [6],
            },
        },
        isEmployee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            },
    },
    {
        hooks: {
            async beforeCreate(user) {
                user.password = await bcrypt.hash(user.password,10);
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: "user",
    }
);

module.exports = User;
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const Role = require('./role.model');

class User extends Model {}

User.init(
    {
        id: {
            primaryKey: true,

            type: DataTypes.INTEGER,
            autoIncrementIdentity: true,
            allowNull: false
        },
        register: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(140),
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: 'User',
    }
);

User.belongsToMany(Role, { through: 'user_role' });

module.exports = User;

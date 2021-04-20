const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const User = require('./user.model');

class Subject extends Model {}

Subject.init(
    {
        id: {
            primaryKey: true,

            type: DataTypes.INTEGER,
            autoIncrementIdentity: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        workload: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Subject',
    }
);

Subject.hasOne(User);

module.exports = Subject;

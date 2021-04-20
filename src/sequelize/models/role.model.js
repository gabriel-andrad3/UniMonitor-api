const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const User = require('./user.model');

class Role extends Model {}

Role.init(
	{
		id: {
			primaryKey: true,

			type: DataTypes.INTEGER,
			autoIncrementIdentity: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		}
	}, 
	{
		sequelize,
		modelName: 'Role',
  	}
);

Role.belongsToMany(User, { through: 'user_role' });

module.exports = Role;

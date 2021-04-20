'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'users_seq',
      {
        id: {
          primaryKey: true,

          type: Sequelize.DataTypes.INTEGER,
          autoIncrementIdentity: true,
          allowNull: false
      },
        register: {
          type: Sequelize.DataTypes.STRING(10),
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false,
        },
        email: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true,
          unique: true,
        },
        password: {
          type: Sequelize.DataTypes.STRING(140),
          allowNull: true,
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users_seq');
  }
};

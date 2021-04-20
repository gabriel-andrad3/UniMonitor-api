'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'roles_seq', 
      {
        id: {
          primaryKey: true,
    
          type: Sequelize.DataTypes.INTEGER,
          autoIncrementIdentity: true,
          allowNull: false
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true,
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles_seq');
  }
};

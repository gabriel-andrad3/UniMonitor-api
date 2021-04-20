'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'user_roles_seq',
      {
        user_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users_seq', key: 'id' }
        },
        role_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'roles_seq', key: 'id' }
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_roles_seq');
  }
};

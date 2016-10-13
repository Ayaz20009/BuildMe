'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Homeowners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ho_id: {
        type: Sequelize.INT
      },
      ho_fn: {
        type: Sequelize.STRING
      },
      ho_ln: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phn_num: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Homeowners');
  }
};
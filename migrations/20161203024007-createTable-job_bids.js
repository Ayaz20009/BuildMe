'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('job_bids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      hoID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      coID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      estCost: {
         type: Sequelize.INTEGER
      },
      estDays: {
         type: Sequelize.INTEGER
      },
      estHours: {
         type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      comment: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('job_bids');
  }
};
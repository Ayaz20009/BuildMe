'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('homeowner_jobs', {
      jobID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hoID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      jobDesc: {
        type: Sequelize.TEXT
      },
      street: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.INTEGER
      },
      hours: {
         type: Sequelize.INTEGER
      },
      salary : {
         type: Sequelize.DOUBLE
      },
      coID: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('homeowner_jobs');
  }
};
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('job_process', {
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
      percentage: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue:0
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

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('job_process');
    
  }
};

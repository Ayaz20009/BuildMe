'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var job_process = sequelize.define('job_process', {
    jobID: DataTypes.INTEGER,
    percentage : DataTypes.DOUBLE,
    createAt: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return job_process;
};
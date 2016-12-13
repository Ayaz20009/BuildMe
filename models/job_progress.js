'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var job_progress = sequelize.define('job_progress', {
    jobID: DataTypes.INTEGER,
    percentage : DataTypes.DOUBLE,
    confirmed : DataTypes.BOOLEAN,
    createAt: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return job_progress;
};
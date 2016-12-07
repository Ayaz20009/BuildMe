'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return [
     queryInterface.addColumn('homeowner_jobs',
        "startDate",
        {
          type: Sequelize.DATE
        }
      ),
     
      queryInterface.addColumn('homeowner_jobs',
        "numBids",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),

      queryInterface.addColumn('homeowner_jobs',
        "bidID",
        {
          type: Sequelize.INTEGER
        }
      )

      ];
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return [
      queryInterface.removeColumn('homeowner_jobs', 'startDate'),
      queryInterface.removeColumn('homeowner_jobs', 'numBids'),
      queryInterface.removeColumn('homeowner_jobs', 'bidID')

    ];
  }
};

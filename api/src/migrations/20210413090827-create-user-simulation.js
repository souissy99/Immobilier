'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('userSimulations', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			revenusEmp: {
				type: Sequelize.FLOAT
			},
			revenusCoemp: {
				type: Sequelize.FLOAT
			},
			primesEmp: {
				type: Sequelize.FLOAT
			},
			primesCoemp: {
				type: Sequelize.FLOAT
			},
			totalCharges: {
				type: Sequelize.FLOAT
			},
			totalRevenus: {
				type: Sequelize.FLOAT
			},
			pension: {
				type: Sequelize.FLOAT
			},
			loyer: {
				type: Sequelize.FLOAT
			},
			pretLocatif: {
				type: Sequelize.FLOAT
			},
			pretImmo: {
				type: Sequelize.FLOAT
			},
			creditConso: {
				type: Sequelize.FLOAT
			},
			creditAuto: {
				type: Sequelize.FLOAT
			},
			autreCredit: {
				type: Sequelize.FLOAT
			},
			revenusFin: {
				type: Sequelize.FLOAT
			},
			alloc: {
				type: Sequelize.FLOAT
			},
			revenusLoc: {
				type: Sequelize.FLOAT
			},
			result: {
				type: Sequelize.FLOAT
			},
			UserId: {
				allowNull: false,
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
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('userSimulations');
	}
};

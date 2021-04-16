'use strict';
const bcrypt = require('bcrypt');
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate (models) {
			User.belongsTo(models.userSimulation);
		}
	}
	User.init({
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set (value) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			}
		}
	}, {
		sequelize,
		modelName: 'User'
	});
	return User;
};

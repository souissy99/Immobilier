'use strict';
const bcrypt = require('bcrypt');
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class appUser extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate (models) {
			// define association here
		}
	}
	appUser.init({
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		email: DataTypes.STRING,
		adresse: DataTypes.TEXT,
		password: {
			type: DataTypes.STRING,
			allowNull: true,
			set (value) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			}
		}
	}, {
		sequelize,
		modelName: 'appUser'
	});
	return appUser;
};
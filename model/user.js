const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const user = sequelize.define('user', {
	userId: {
		type: Sequelize.STRING,
		field: 'user_id'
	},
	account: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				args: true,
				msg: '请输入账号'
			},
			len:  {
				args: [2, 10],
				msg: '账号为2~10位'
			},
		}
	},
	password: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				args: true,
				msg: '请输入密码'
			},
			len:  {
				args: [4, 16],
				msg: '密码为4~16位'
			},
		}
	},
	name: {
		type: Sequelize.STRING,
	},
	avatar: {
		type: Sequelize.STRING,
	},
	time: {
		type: Sequelize.DATE,
	},
	lastTime: {
		type: Sequelize.DATE,
		field: 'last_time'
	},
	creatTime: {
		type: Sequelize.DATE,
		field: 'creat_time'
	},
	location: {
		type: Sequelize.STRING,
	},
	lastLocation: {
		type: Sequelize.STRING,
		field: 'last_location'
	},
	status:{
		type: Sequelize.STRING,
		defaultValue: 1
	},
	level:{
		type: Sequelize.STRING,
	}
});

module.exports = user;
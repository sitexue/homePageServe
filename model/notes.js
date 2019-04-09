const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const notes = sequelize.define('notes', {
	title: {
		type: Sequelize.TEXT,
		validate: {
			len: {
				args: [1, 50],
				msg: '标题不能为空，且不超过50个字'
			},
		}
	},
	intro: {
		type: Sequelize.TEXT,
	},
	md: {
		type: Sequelize.TEXT,
		validate: {
			notEmpty: {
				args: true,
				msg: '内容不能为空'
			}
		}
	},
	html: {
		type: Sequelize.TEXT,
		validate: {
			notEmpty: {
				args: true,
				msg: '内容不能为空'
			}
		}
	},
	tag: {
		type: Sequelize.TEXT,
		validate: {
			notEmpty: {
				args: true,
				msg: '标签不能为空'
			},
		}
	},
	creatTime: {
		type: Sequelize.DATE,
		field: 'creat_time'
	},
	updateTime: {
		type: Sequelize.DATE,
		field: 'update_time'
	},
	status: {
		type: Sequelize.STRING,
		defaultValue: 1
	},
});

module.exports = notes;
const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const photo = sequelize.define('photo', {
    albumId: {
        type: Sequelize.STRING,
		field: 'album_id'
	},
	name: {
		type: Sequelize.STRING
	},
	url: {
		type: Sequelize.STRING
	},
	createTime: {
		type: Sequelize.DATE,
		field: 'create_time'
	},
	deleteTime: {
		type: Sequelize.DATE,
		field: 'delete_time'
	},
	status: {
		type: Sequelize.STRING,
		defaultValue: 1
	},
});

module.exports = photo;
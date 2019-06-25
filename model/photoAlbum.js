const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const photoAlbum = sequelize.define('photo_album', {
	title: {
		type: Sequelize.TEXT,
		validate: {
			len: {
				args: [1, 50],
				msg: '标题不能为空，且不超过50个字'
			},
		}
	},
	coverImg: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				msg: '相册封面不能为空'
			},
        },
        field: 'cover_img'
	},
	createTime: {
		type: Sequelize.DATE,
		field: 'create_time'
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

module.exports = photoAlbum;
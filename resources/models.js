var	mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://localhost/test');

require("./models/user")(mongoose);

exports.User = db.model('User');

module.exports = function(mongoose) {

	function User_validator_name (v) {
		var expression = new RegExp("[0-9A-Za-z]","g");
		return (v.length > 3 && v.length < 16 && expression.test(v));
	};

	function User_validator_pass (v) {
		var expression = new RegExp("[^\s]","g");
		return (v.length > 7 && v.length < 16 && expression.test(v));
	};

	var User = new mongoose.Schema({
		_id	: mongoose.Schema.ObjectId,
		name	: {
			type: String,
			index: true,
			validate: [User_validator_name, 'Invalid Name']
		},
		pass	: {
			type: String,
			validate: [User_validator_pass, 'Invalid password']
		},
		date_registered	: {
			type: Date,
			default: Date.now
		},
		date_lastLogin	: {
			type: Date,
			default: Date.now
		}
	});
	mongoose.model('User', User);

}

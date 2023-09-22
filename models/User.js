const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			trim: true,
			required: true,
		},
		last_name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
			max: 64,
		},
		picture: {
			type: String,
			default: "/avatar.png",
		},
		role: {
			type: [String],
			default: ["Subscriber"],
			enum: ["Subscriber", "Admin"],
		},
		passwordResetCode: {
			data: String,
			default: ''
		},
	},
	{ 
        timestamps: true
    }
);

userSchema.virtual('full_name').get(function() {
    return this.first_name + ' ' + this.last_name;
})

userSchema.virtual('id').get(function() {
    return this._id;
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema);
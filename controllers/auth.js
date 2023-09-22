const express = require("express")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require("../models/user")
const validationResult = require("express-validator")
const HttpError = require("../models/httpError")

const createToken = (userId, email) => {
	return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
		expiresIn: "24h",
	});
};

const signupUser = async (req, res, next) => {
    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid input passed", 422));
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await UserModel.findOne({ email });
	} catch (error) {
		return next(new HttpError("Signing up failed", 500));
	}

	if (existingUser) {
		return next(
			new HttpError("User already exists, please login instead", 422)
		);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (error) {
		return next(
			new HttpError("Could not create user, please try again", 500)
		);
	}

	const createdUser = new UserModel({
		name,
		email: email.toLowerCase(),
		password: hashedPassword,
	});

	try {
		await createdUser.save();

		// create token
		// const token = createToken(user._id, user.email);
		// send token as cookie
		// res.cookie("token", token, {
		// 	httpOnly: true,
		// 	secure: true,  // only works on https
		// });

		// res.status(200).json({ user });
	} catch (error) {
		return next(new HttpError("Could not save user in database", 500));
	}

	let token;
	try {
		token = createToken(createdUser.id, createdUser.email);
	} catch (error) {
		return next(new HttpError("Signing up failed", 500));
	}

	createdUser.password = ''

	return res.status(201).json({ user: createdUser, token });
}

module.exports = {
	signupUser
}
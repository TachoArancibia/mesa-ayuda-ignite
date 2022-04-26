

var express = require('express');
const msal = require('@azure/msal-node');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });

//const { config, tokenRequest, loginRequest } = require("./authConfig");
var validator = require('express-validator');
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

const config = {
	auth: {
		clientId: "dc8ca382-164e-4fdb-b39a-93f3d0eab8ed",
		authority: "https://login.microsoftonline.com/253861ec-a123-4b78-b200-9c73c3a2bf21/",
		clientSecret: "o757Q~cG9kevx-vdGy8CF5IIXmB8a8~-shfoe",
		redirectUri: "http://localhost:8000/redirecttest",
	},
	system: {
		loggerOptions: {
			loggerCallback(loglevel, message, containsPii) {
				console.log(message);
			},
			piiLoggingEnabled: false,
			logLevel: msal.LogLevel.Verbose,
		}
	}
};

const cca = new msal.ConfidentialClientApplication(config);



//const myMSALObj = new Msal.UserAgentApplication(msalConfig);

// This sets the mock adapter on the default instance
//var mock = new MockAdapter(axios);

let users = [
	{ id: 1, username: 'admin', password: '123456', email: 'admin@ignitelatam.com' },
	{ id: 2, username: 'jarancibia', password: '123456', email: 'jarancibia@ignitelatam.com'},
	{ id: 3, username: 'rnunez', password: 'admin', email: 'rnunez@ignitelatam.com'}
];

// Mock GET request to /users when param `searchText` is 'John'
//mock.onGet("/users", { params: { searchText: "John" } }).reply(200, {
//	users: users,
//});

module.exports = function (app) {

	// Inner Auth
	app.get('/pages-login', function (req, res) {
		res.locals = { title: 'Login' };
		res.render('AuthInner/pages-login');
	});
	app.get('/pages-register', function (req, res) {
		res.locals = { title: 'Register' };
		res.render('AuthInner/pages-register');
	});
	app.get('/pages-recoverpw', function (req, res) {
		res.locals = { title: 'Recover Password' };
		res.render('AuthInner/pages-recoverpw');
	});
	app.get('/pages-lock-screen', function (req, res) {
		res.locals = { title: 'Lock Screen' };
		res.render('AuthInner/pages-lock-screen');
	});
	app.get('/pages-login-2', function (req, res) {
		res.locals = { title: 'Login 2' };
		res.render('AuthInner/pages-login-2');
	});
	app.get('/pages-register-2', function (req, res) {
		res.locals = { title: 'Register 2' };
		res.render('AuthInner/pages-register-2');
	});
	app.get('/pages-recoverpw-2', function (req, res) {
		res.locals = { title: 'Recover Password 2' };
		res.render('AuthInner/pages-recoverpw-2');
	});
	app.get('/pages-lock-screen-2', function (req, res) {
		res.locals = { title: 'Lock Screen 2' };
		res.render('AuthInner/pages-lock-screen-2');
	});


	// Auth Pages

	app.get('/pages-maintenance', function (req, res) {
		res.locals = { title: 'Pages Maintenance' };
		res.render('Pages/pages-maintenance');
	});
	app.get('/pages-coming-soon', function (req, res) {
		res.locals = { title: 'Pages Comingsoon' };
		res.render('Pages/pages-coming-soon');
	});


	app.get('/register', function (req, res) {
		if (req.user) { res.redirect('Dashboard/index'); }
		else {
			res.render('Auth/auth-register', { 'message': req.flash('message'), 'error': req.flash('error') });
		}
	});

	app.post('/post-register', urlencodeParser, function (req, res) {
		let tempUser = { username: req.body.username, email: req.body.email, password: req.body.password };
		users.push(tempUser);

		// Assign value in session
		sess = req.session;
		sess.user = tempUser;

		res.redirect('/');
	});


	app.get('/login', function (req, res) {
		res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') });
		const authCodeUrlParameters = {
			scopes: ["user.read"],
			redirectUri: "http://localhost:8000/",
		};

		// get url to sign user in and consent to scopes needed for application
		cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
			res.redirect(response);
		}).catch((error) => console.log(JSON.stringify(error)));
	});

		app.get('/logintest', (req, res) => {
			const authCodeUrlParameters = {
				scopes: ["user.read"],
				redirectUri: "http://localhost:8000/redirecttest",
			};

			// get url to sign user in and consent to scopes needed for application
			cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
				res.redirect(response);
			}).catch((error) => console.log(JSON.stringify(error)));
		});

	app.get('/redirecttest', (req, res) => {
			const tokenRequest = {
				code: req.query.code,
				scopes: ["user.read"],
				redirectUri: "http://localhost:8000/redirecttest",
			};

			cca.acquireTokenByCode(tokenRequest).then((response) => {
				console.log("\nResponse: \n:", response);
				//res.sendStatus(200);
				sess = req.session;
				sess.user = response;
				console.log(response);

				res.redirect('/');

			}).catch((error) => {
				console.log(error);
				res.status(500).send(error);
			});
		});

	app.get('/login-test', function (req, res) {
		const tokenRequest = {
			code: req.query.code,
			scopes: ["user.read"],
			redirectUri: "http://localhost:8000/",
		};

		cca.acquireTokenByCode(tokenRequest).then((response) => {
			console.log("\nResponse: \n:", response);
			res.sendStatus(200);
		}).catch((error) => {
			console.log(error);
			res.status(500).send(error);
		});
	});
	app.post('/add-ticket', urlencodeParser, function (req, res) {
		let ticket = { ...req.body };
		//console.log(req.body.name);
		//console.log(req.body);
		axios
				.post('http://localhost:8090/api/ticket', {
					name: ticket.name,
					description: ticket.description,
					attachment: "None",
					requester: ticket.requester,
					company_requester: ticket.company_requester
				})
			.then(result => {
				if (result.status == 201) {
					req.flash('message', 'Se ha creado el requerimiento');
					res.redirect('/form-test')
				}
					}
				)
			.catch(error => {
				console.error(error)
			})

	});

	app.post('/post-login', urlencodeParser, function (req, res) {
		const validUser = users.filter(usr => usr.email === req.body.email && usr.password === req.body.password);
		if (validUser['length'] === 1) {

			// Assign value in session
			sess = req.session;
			sess.user = validUser;

			res.redirect('/');

		} else {
			req.flash('error', 'Incorrect email or password!');
			res.redirect('/login');
		}
	});

	//app.post('/post-azure-login', urlencodeParser, function (req, res) {
	//	myMSALObj.loginPopup(loginRequest)
	//		.then(function(loginResponse){
	//			console.log('id_token acquired at: ' + new Date().toString());
	//			console.log(loginResponse);

	//			if (myMSALObj.getAccount()) {
	//				console.log(myMSALObj.getAccount())//showWelcomeMessage(myMSALObj.getAccount());
	//			}
	//		}).catch(error => {
	//			console.log(error);
	//	});
	//});

	app.get('/forgot-password', function (req, res) {
		res.render('Auth/auth-forgot-password', { 'message': req.flash('message'), 'error': req.flash('error') });
	});

	app.post('/post-forgot-password', urlencodeParser, function (req, res) {
		const validUser = users.filter(usr => usr.email === req.body.email);
		if (validUser['length'] === 1) {
			req.flash('message', 'We have e-mailed your password reset link!');
			res.redirect('/forgot-password');
		} else {
			req.flash('error', 'Email Not Found !!');
			res.redirect('/forgot-password');
		}
	});

	app.get('/logout', function (req, res) {

		// Assign  null value in session
		sess = req.session;
		sess.user = null;

		res.redirect('/login');
	});


};
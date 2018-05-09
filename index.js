// FMRS - Film & Media Reservation System
// By: Alice Shen, Andrew Nyhus, Duncan Botti, Nazmul Hossain
// Author of ~/index.js: Andrew Nyhus
//This file was inspired from this source: https://blog.risingstack.com/your-first-node-js-http-server/


const path = require('path')
const express = require('express')
const multer = require('multer');
const exphbs = require('express-handlebars')
const mysql = require('mysql')
const request = require('request')

const bodyParser = require('body-parser')

//const config  = require('configure')

const app = express()  
const port = 3000


//app.use(bodyParser.urlencoded({
//    extended: true
//}));
app.use(bodyParser());


var multipart = require('connect-multiparty');

app.use(multipart({
    uploadDir: "/static/images/"
}));


// ---------------------------------------------------------------------
// create & manage db connection, credit: http://tecadmin.net/node-with-mysql-examples/#



        const dbconn = mysql.createConnection({
                port: 3306,
                host: 'fmrs.bucknell.edu',
                user: 'fmrs',
                password: 'eu0ie5uWieVi',
                database: 'fmrs'

        });

	dbconn.connect(function(err){
		if(err){
			console.log("DB Connection Error");
			console.error(err.stack);
		}else{
			console.log("DB Connection Successful");

		}
	});


	//dbconn.end(function(err){
	//	console.log("DB Connection Closed.");
	//});


require('./page_requests')(app,dbconn);
require('./db_interactions')(app, dbconn);


// ---------------------------------------------------------------------

	app.engine('.hbs', exphbs({
		defaultLayout: 'main',
		extname: '.hbs',
		layoutsDir: path.join(__dirname, 'views/layouts')
	}))

	app.set('view engine', '.hbs')
	app.set('views', path.join(__dirname, 'views'))



// ---------------------------------------------------------------------
// link static folder
	app.use('/static', express.static(__dirname + '/static'));



 /**
  * Create file upload
  * **/
exports.create = function (req, res, next) {
    var data = _.pick(req.body, 'type')
        , uploadPath = path.normalize(cfg.data + '/uploads')
        , file = req.files.file;

        console.log(file.name); //original name (ie: sunset.png)
        console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
};


// ---------------------------------------------------------------------
// begin listening	
	app.listen(port, (err) => {

		if(err) {
			return console.log('A server error has occurred', err)
		}
				
		console.log('Server listening on port: ${port}')	

	})



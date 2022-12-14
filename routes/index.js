const express = require('express');
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { I18n } = require('i18n');
const dbRoot = path.join(__dirname, "/database", "dbAdmin.db");
const dbAdmin = new sqlite3.Database(dbRoot, (err) => {
	let question = err ? 'Error' : 'Base de datos creada correctamente.';
	console.log(question);
  
});

/*Creacion de la Base de Datos*/
const sqlCreateTableUsers ="CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,email VARCHAR(20),password VARCHAR(20));";
dbAdmin.run(sqlCreateTableUsers, (err) => {
  let question = err ? 'Error' : 'Tabla creada correctamente.';
  console.log(question);
});


/*Multi-Language configuration*/

const i18n = new I18n({
  locales: ['es', 'en'],
  directory: path.join(__dirname, '/locales'),
  defaultLocale: 'es',
});

/*Envio post del login*/
router.post('/login', async (req,res) => {
	const email = req.body.email;
	const password = req.body.password;
	dbAdmin.all('SELECT * FROM users WHERE email="'+email+'" AND password="'+password+'"',(err,data) => {
		if(data.length === 1){
			const id = data[0].id;
            const token = jwt.sign({ id: id },'token');
            res.cookie('jwt',token);
			res.render('login',{
				alert: true,
				alertTitle: "Conexión exitosa",
				alertMessage: "¡Usted ingreso de manera correcta!",
				alertIcon:'success',
				showConfirmButton:false,
				timer:2200,
				ruta:''
			  })
		}else{
			res.render('login', {
				alert: true,
				alertTitle: "!Ha ocurrido un error¡",
				alertMessage: "Email y/o Password Incorrectas",
				alertIcon:'error',
				showConfirmButton:false,
				timer:2200,
				ruta: 'login'
			})
		}
	})
})

router.post('/register', async (req,res) => {
	const email = req.body.email;
	const password = req.body.password;
	dbAdmin.all('SELECT email FROM users WHERE email="'+email+'"',(err,data) => {
		if(data.length === 1) {
			res.render('login', {
				alert: true,
				alertTitle: "!Ha ocurrido un error¡",
				alertMessage: "Este email ya existe!",
				alertIcon:'error',
				showConfirmButton:false,
				timer:2200,
				ruta: 'login'
			})
		}
		else {
			dbAdmin.run('INSERT INTO users(email,password) VALUES("'+email+'","'+password+'")',(err) => {
					if(!err){
						res.render('login',{
							alert: true,
							alertTitle: "Conexión exitosa",
							alertMessage: "¡Usted se registro de manera correcta!",
							alertIcon:'success',
							showConfirmButton:false,
							timer:2200,
							ruta:'login'
						  })
					}else{
						return err;
					}
				}
			)
		}
	})
})

/*Proteger la ruta raíz*/ 
protectRoute = async (req, res, next) => {
	if (req.cookies.jwt) {
	  try {
		const tokenAuthorized = await promisify(jwt.verify)(req.cookies.jwt,'token');
		if (tokenAuthorized) {
		  return next();
		}
		req.user = data[0].id;
	  } catch (error) {
		console.log(error);
		return next();
	  }
	} else {
	  res.redirect("/login");
	}
  };


/*Proteger el login*/
protectRouteLogin = async (req, res, next) => {
	if (req.cookies.jwt) {
	  try {
		const tokenAuthorized = await promisify(jwt.verify)(req.cookies.jwt,'token');
		if (tokenAuthorized) {
		res.redirect("/");
		}
	  } catch (error) {
		console.log(error);
		res.redirect("/");
	  }
	} else {
	  return next();
	}
  };

logout = async (req, res) => {
	res.clearCookie("jwt");
	return res.redirect("/login");
};

router.get('/logout',logout);

//Renderizar el archivo raiz "index" para mostrarse
router.get('/',protectRoute,(req,res) => {
	i18n.init(req, res);
  	translate = req.acceptsLanguages('es');
	res.render('index.ejs',{
	IMG:'images/estados-unidos.png',
})});

/*Renderizar la vista login*/
router.get('/login',protectRouteLogin,(req, res, next) => {
	res.render('login',{
		alert:false,
	});
  });

let translate = false;
router.get('/translate',(req,res,next) => {
	if(translate){
	  i18n.init(req, res)
	  translate = false;
	  res.setLocale('en');
	  res.render('index.ejs',{
	  IMG:'images/spain.png',
	})
	}else if(!translate){
	  i18n.init(req, res);
	  res.setLocale('es');
	  translate = true;
	  res.render('index',{
	  IMG:'images/estados-unidos.png',
	  })
	}
})


  module.exports = router;
  




/* GET home page. */

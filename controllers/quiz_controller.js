var models = require('../models/models.js');


//cargar Autoload 
exports.load = function(req,res,next,quizId){
    models.Quiz.find({
    		where: { id: Number(quizId) },
    		include: [{model: models.Comment }]
    	}).then(function(quiz){
            if (quiz) {
                req.quiz = quiz;
                next();
            }else { next(new Error('No existe quizId=' + quizId));}
        }
        ).catch(function(error){next(error);});
};

//GET /quizes
exports.question = function(req,res){
	models.Quiz.findAll().success(function(quiz){
		res.render('quizes/question',{pregunta: quiz[0].pregunta})
	})
	
};



//SHOW
exports.show = function(req,res){
	res.render('quizes/show.ejs', { quiz: req.quiz, errors: []});
};

//get answer
exports.answer = function(req, res){
	
		var resultado = "Incorrecto";
		if (req.query.respuesta === req.quiz.respuesta){
	
			resultado = 'Correcto'
			
	} 
		res.render(
			'quizes/answer', 
			{ quiz: req.quiz, 
			  respuesta: resultado,
			  errors: []
			}
			);	
};


exports.index = function(req, res){
if (req.query.search){
		var busqueda = req.query.search.replace(/\s+/g, '%');
		models.Quiz.findAll({where: ["upper(pregunta like ?)", "%" + busqueda.toUpperCase() + "%"],order: 'pregunta ASC'}).then(
			function(quizes){
				res.render('quizes/index',{quizes:quizes, errors: []});

			}
			).catch(function(error){next(error);})

	}else{
		models.Quiz.findAll().then(
			function(quizes){
				res.render('quizes/index', {quizes:quizes, errors: []});
			}
			).catch(function(error) {next(error);});
	}
};


exports.search = function(req,res){
    
};




exports.new = function(req, res) {
	var quiz = models.Quiz.build(
	{ pregunta: "Pregunta", respuesta: "Respuesta", tema:"Tema"}
	);
	res.render('quizes/new', { quiz: quiz, errors: []});
};


exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz//save guardar en bd
				.save({fields: ["pregunta", "respuesta", "tema"]})
				.then(function(){ res.redirect('/quizes')})
			}
		}
	
	);
};


exports.edit = function( req , res) {
	var quiz = req.quiz;

	res.render('quizes/edit', { quiz: quiz, errors: []});
};

exports.update = function(req, res) {
	 req.quiz.pregunta = req.body.quiz.pregunta;
	 req.quiz.respuesta = req.body.quiz.resultado;
	 req.quiz.tema = req.body.quiz.tema;


	 req.quiz
	 .validate()
	 .then(
	 	function(err){
	 		if (err) {
	 			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
	 		} else {
	 			req.quiz
	 			.save( {fields: ["pregunta", "respuesta", "tema"]})
	 			.then( function(){ res.redirect('/quizes');});
	 		}
	 	});
};




exports.destroy = function( req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');

	}).catch(function(error){next(error)});
};
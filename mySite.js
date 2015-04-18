var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helper: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

var facts = require('./lib/randomFact.js');
var projects = require('./lib/myProjects.js');

// register handlebars engine with express app
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//define route for static files
app.use(express.static(__dirname + '/public'));

//set up global page testing
app.use(function(req, res, next){
    //if the expression is true, then res.locals.showTests = true
    res.locals.showTests = (app.get('env') !== 'production' && req.query.test === '1');
    next();
});

//use partial
app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.projects = projects.getProjects();
    next();
});

app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {
        fact: facts.getFact(),
        pageTestScript: '/qa/tests-about.js' //for testing purposes on About page
    });
});

app.get('/contracting/webdev', function (req, res){
    res.render('contracting/webdev');
});

app.get('/contracting/android', function (req, res){
    res.render('contracting/android');
});

app.get('/contracting/request-rate', function(req, res){
    res.render('contracting/request-rate');
});

app.get('/jquery-test', function(req, res){
    res.render('jquery-test');
});

app.get('/tech-course', function(req, res){
    res.render('tech-course');
});

app.get('/data/tech-course', function(req, res){
    res.json({
        eInstitution: 'CodeSchool',
        cName: 'Learning JavaScript',
        cDescription: 'JavaScript for Beginners'
    });
});

// custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});
//express module
var express = require('express');
var app = express();

//route middleware
var userRoute = require('./routes/userRoute');

//custom modules
var facts = require('./lib/randomFact.js');
var projects = require('./lib/myProjects.js');

// register handlebars engine with express app
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//define route for static files
app.use(express.static(__dirname + '/public'));

//add body-parse middleware
app.use(require('body-parser')());

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


app.get('/newsletter', function(req, res){
   res.render('newsletter', {csrf: 'CRSF token goes here'})
});

app.post('/process', function(req, res){
    if(req.xhr || req.accepts('json,html')==='json'){
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page

        //print data recieved from form
        console.log('Form (from querystring): ' + req.query.form); //should print out newsletter as defined in newsletter.handlebars
        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from visible form field): ' + req.body.name);
        console.log('Email (from visible form field): ' + req.body.email);

        //usually we would save the information into the database at this point

        //redirect
        res.redirect(303, '/thank-you');
    }
})

//mount middleware (userRoute)
app.use('/user', userRoute);

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
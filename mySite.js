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

//set port
app.set('port', process.env.PORT || 3000);

//file upload module
var formidable = require('formidable');

//credentials
var credentials = require('./private/credentials.js');

//cookie and session
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

//database configuration
var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongoDB.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongoDB.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}


//flash message middleware
app.use(function(req, res, next){
// if there's a flash message, transfer it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

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


//form submission
app.get('/thank-you', function(req, res){
    res.render('thank-you');
});
app.get('/newsletter', function(req, res){
   res.render('newsletter', { csrf: 'CRSF token goes here' })
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


//file uploads
app.get('/contest/doppelganger-photo',function(req,res){
    var now = new Date();
    console.log("year:" + now.getFullYear() + ", month:" + now.getMonth());
    res.render('contest/doppelganger-photo',{
        year: now.getFullYear(), month: now.getMonth()
    });
});
app.post('/contest/doppelganger-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

//mount middleware (userRoute)
app.use('/users', userRoute);

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
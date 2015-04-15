var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });

var facts = [
    "Graduated Rutgers University with Computer Science and Economics.",
    "Loves art.",
    "Took Japanese course at local community college while in high school.",
    "Avid learner.",
    "Passionate about doing."
];

// register handlebars engine with express app
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//define route for static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('home'); //how does it know that home is in views/layout
})

//this would never be seen if the above had a wildcard:  '/*'
app.get('/about', function(req, res){
    var randomFact =
        facts[Math.floor(Math.random() * facts.length)];
    res.render('about', { fact: randomFact });
})

//app.use: express knows the difference between 404 and 500 route
//because their functions have different parameters

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
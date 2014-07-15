
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var eloConfig = {
    arr: [{}, {}, {}],
    current: {
        book1: 0,
        book2: 1
    },
    next: function(){
        this.current.book1++;
        this.current.book2++;
    }
};

app.get('/review', function (req, res) {

    console.log(req.query);

    res.render('review', {
        book1:arr[eloConfig.current.book1],
        book2: {
            isbn: '12356-889526516',
            title: 'The Luminaries: A Novel (Man Booker Prize)',
            ranking: 1500,
            src: 'book1.jpg'
        }
    });
});

var cheerio = require('cheerio');

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

    var books = [];


    http.get('',
        function (res) {
            var str;
            res
            .on('data', function(chunk){
                str += chunk;
            }).on('end', function(){

                    var $ = cheerio.load(str);
                    var img_urls = [];
                    var titles = [];
                    $('img.productImage').each(function () {
                        img_urls.push($(this).attr('src'));
                    });
                    console.log(img_urls.length);
                    $('h3.newaps').each(function () {
                        titles.push($(this).text().replace('\n','').trim());
                    });
                    console.log(titles.length);
                    var data = titles.map(function(title, index){
                        return {
                            title: title,
                            src: img_urls[index]
                        }
                    });
                    console.log(data);
                    fs.writeFileSync(__dirname + '/books.json', JSON.stringify(data));
            });
        });

});

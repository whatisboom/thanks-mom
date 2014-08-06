var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db')
var queueItem = require('./app/models/queueItem');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 8888;

var router = express.Router();

mongoose.connect(db.url);

router.use(function(request, response, next) {
    console.log('%s %s %s', request.method, request.url, request.path);
    next();
});

router.route('/names')
    .get(function(request, response) {
        queueItem.find(function(error, items){
            var context = {};

            if (error) {
                context.errors = [error];
            }
            else {
                context.data = {
                    names: items
                }
            }

            response.json(context);

        });
    })
    .post(function(request, response) {
        var item = new queueItem();
        item.name = request.body.name;
        item.text = request.body.text;
        item.hashtags = request.body.hashtags;

        var context = {};

        item.save(function(error) {
            if (error) {
                context.result = "failure";
                context.errors = [error];
            }
            else {
                context.meta = {
                    message: "Name saved successfully"
                };
                context.result = "success";
            }
            response.json(context);
        });
    });

router.route('/names/:nameId')
    .get(function(request, response) {
        queueItem.findById(request.params.nameId, function(error, item) {
            var context = {};
            if (error) {
                context.errors = [error];
            }
            else {
                context.result = "success";
                context.data = item;
            }
            response.json(context);
        });
    })
    .put(function(request, response) {
        queueItem.findById(request.params.nameId, function(error, item) {
            var context = {};
            if (error) {
                context.errors = [error];
                response.json(context);
            }
            else {
                item.name = request.body.name || item.name;
                item.text = request.body.text || item.text;
                item.hashtags = request.body.hashtags || item.hashtags;

                item.save(function(error) {
                    if (error) {
                        context.errors = [error];
                    }
                    else {
                        context.result = "success";
                        context.meta = {
                            message: "Changes saved successfully."
                        };
                        context.data = item;
                    }
                    response.json(context);
                });
            }
        });
    })
    .delete(function(request, response) {
        queueItem.remove({
            _id: request.params.nameId
        }, function(error, name) {
            var context = {};
            if (error) {
                context.result = "failure";
                context.errors = [error];
            }
            else {
                context.result = "success";
                context.meta = {
                    message: "Successfully deleted."
                };
            }

            queueItem.find(function(error, items) {
                context.data = {
                    names: items
                };
                response.json(context);    
            });
            
        });
    });

app.use('/api', router);

app.use('/public', express.static(__dirname + '/public'));

app.use('*', function(request, response) {
    response.sendfile('./public/index.html');
});

app.listen(port);
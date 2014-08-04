var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db')
var queueItem = require('./app/models/queueItem');

var port = process.env.PORT || 8888;

var router = express.Router();

mongoose.connect(db.url);

app.use(bodyParser.json());

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
        var name = new queueItem();
        name.text = request.body.text;
        name.hashtags = request.body.hashtags;

        var context = {};

        name.save(function(error) {
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

router.route('/names/:name_id')
    .get(function(request, response) {
        queueItem.findById(request.params.name_id, function(error, name) {
            var context = {};
            if (error) {
                context.errors = [error];
            }
            else {
                context.result = "success";
                context.data = name;
            }
            response.json(context);
        });
    })
    .put(function(request, response) {
        queueItem.findById(request.params.name_id, function(error, name) {
            var context = {};
            if (error) {
                context.errors = [error];
                response.json(context);
            }
            else {
                name.text = request.body.text || name.text;
                name.hashtags = request.body.hashtags || name.hashtags;

                name.save(function(error) {
                    if (error) {
                        context.errors = [error];
                    }
                    else {
                        context.result = "success";
                        context.meta = {
                            message: "Changes saved successfully."
                        };
                        context.data = name;
                    }
                    response.json(context);
                });
            }
        });
    })
    .delete(function(request, response) {
        queueItem.remove({
            _id: request.params.name_id
        }, function(error, name) {
            var context = {};
            if (error) {
                context.result = "failure";
                context.errors = [error];
            }
            else {
                context.result = "success";
                context.data = name;
                context.meta = {
                    message: "Successfully deleted."
                };
            }
            response.json(context);
        });
    });

app.use('/api', router);

app.use('/public', express.static(__dirname + '/public'));

app.use('*', function(request, response) {
    response.sendfile('./public/index.html');
});

app.listen(port);
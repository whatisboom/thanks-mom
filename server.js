var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
var q = require('q');
var db = require('./config/db')
var Tweet = require('./app/models/Tweet');
var Queue = require('./app/models/Queue');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 8888;

var router = express.Router();

mongoose.connect(db.url);

router.use(function(request, response, next) {
    console.log('%s %s %s', request.method, request.url, request.path);
    next();
});

router.route('/tweets')
    .get(function(request, response) {
        var context = {
            meta: {},
            errors: [],
            data: {}
        };

        async.parallel(
            [
                function(callback) {
                    Queue.find(function(error, items) {

                        if (error) {
                            context.errors.push(error);
                        }
                        else {
                            context.data.queues = items;
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    Tweet.find(function(error, items) {
                        if (error) {
                            context.errors.push(error);
                        }
                        else {
                            context.data.tweets = items;
                        }
                        callback(null);
                    });
                }
            ], 
            function(error) {
                response.json(context);
            });
        
    })
    .post(function(request, response) {
        var item = new Tweet();

        item.queue_id = request.body.queue_id;
        item.text = request.body.text;

        var context = {};

        item.save(function(error) {
            if (error) {
                context.result = "failure";
                context.errors = [error];
            }
            else {
                context.data = {
                    tweet: item
                };
                context.meta = {
                    message: "Name saved successfully"
                };
                context.result = "success";
            }
            response.json(context);
        });
    });

router.route('/tweets/:tweetId')
    .get(function(request, response) {
        Tweet.findById(request.params.nameId, function(error, item) {
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
        Tweet.findById(request.params.tweetId, function(error, item) {
            var context = {};
            if (error) {
                context.errors = [error];
                response.json(context);
            }
            else {
                item.text = request.body.text || item.text;

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
        Tweet.remove({
            _id: request.params.tweetId
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

            Tweet.find(function(error, items) {
                context.data = {
                    tweets: items
                };
                response.json(context);    
            });
            
        });
    });


router.route('/queues')
    .get(function(request, response) {

        var context = {
            meta: {},
            errors: [],
            data: {}
        };

        Queue.find(function(error, items) {

            if (error) {
                context.errors.push(error);
            }
            else {
                context.data.queues = items;
            }
            response.json(context);
        });

    })
    .post(function(request, response) {
        var queue = new Queue();

        queue.name = request.body.name;
        queue.hashtags.content = request.body.hashtags;
        queue.hashtags.length = request.body.hashtags.length;

        var context = {};

        queue.save(function(error){
            if (error) {
                context.errors = [error];
            }
            else {
                context.data = {
                    queue: queue
                };
                context.meta = {
                    message: "Queue added successfully"
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
var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var async = require('async');
var extend = require('extend');
var q = require('q');
var cron = require('cron').CronJob;
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var db = require('./config/db');
var secret = require('./config/secret');
var twitterApi = require('./config/twitter-api');
var formatter = require('./app/modules/formatter');
var Tweet = require('./app/models/Tweet');
var Queue = require('./app/models/Queue');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secret));
app.use(
    session(
        {
            secret: secret,
            resave: true,
            saveUninitialized: true
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy(
    {
        consumerKey: twitterApi.consumerKey,
        consumerSecret: twitterApi.consumerSecret,
        callbackURL: twitterApi.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        console.log(profile.id);
        done(null, profile);
    }
));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/twitter', failureRedirect: '/login'}));

var router = express.Router();

mongoose.connect(db.url);

router.use(function(request, response, next) {
    console.log('%s %s %s', request.method, request.url, request.path);
    next();
});

function initContext() {
    var context = {
        meta: {},
        errors: [],
        data: {}
    };
    return context;
}

router.route('/tweets')
    .get(function(request, response) {
        var context = initContext();

        async.parallel(
            [
                function(callback) {
                    Queue.find(function(error, queues) {

                        if (error) {
                            context.errors.push(error);
                        }
                        else {
                            context.data.queues = queues;
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    Tweet.find(function(error, tweets) {
                        if (error) {
                            context.errors.push(error);
                        }
                        else {
                            context.data.tweets = tweets;
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
        var tweet = extend(new Tweet(), request.body.tweet);

        var context = initContext();

        tweet.save(function(error) {
            if (error) {
                context.result = "failure";
                context.errors.push(error);
            }
            else {
                context.data = {
                    tweet: tweet
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
            var context = initContext();

            if (error) {
                context.errors.push(error);
            }
            else {
                context.result = "success";
                context.data = item;
            }
            response.json(context);
        });
    })
    .put(function(request, response) {

        //make this async

        Tweet.findById(request.params.tweetId, function(error, tweet) {
            var context = initContext();
            if (error) {
                context.errors.push(error);
                response.json(context);
            }
            else {
                tweet.text = request.body.text || tweet.text;

                tweet.save(function(error) {
                    if (error) {
                        context.errors.push(error);
                    }
                    else {
                        context.result = "success";
                        context.meta = {
                            message: "Changes saved successfully."
                        };
                        context.data = tweet;
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
            var context = initContext();
            if (error) {
                context.result = "failure";
                context.errors.push(error);
            }
            else {
                context.result = "success";
                context.meta = {
                    message: "Successfully deleted."
                };
            }

            Tweet.find(function(error, tweets) {
                context.data = {
                    tweets: tweets
                };
                response.json(context);    
            });
            
        });
    });

router.route('/queues')
    .get(function(request, response) {

        var context = initContext();

        Queue.find(function(error, queues) {

            if (error) {
                context.errors.push(error);
            }
            else {
                context.data.queues = queues;
            }
            response.json(context);
        });

    })
    .post(function(request, response) {
        var queue = new Queue();

        var queue = extend(new Queue(), request.body.queue);
        console.log(request.body.queue);
        queue.hashtags.length = request.body.queue.hashtags.content.length;

        var context = initContext();

        queue.save(function(error){
            if (error) {
                context.errors.push(error);
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
    response.sendFile(process.cwd() + '/public/index.html');
});

app.listen( process.env.PORT || 8888 );

Queue.find(function(error, queues) {
    var crons = [];
    for (var i = 0; i < queues.length; i++) {
        var queue = queues[i];
        var cronpattern = formatter.cronPattern(queue);
        crons[i] = new cron(cronpattern, function() {
            console.log('cron tick: ' + queue.interval);
        });
        console.log('Starting ' + queue.interval.toLowerCase() + ' job with pattern ' + cronpattern);
        crons[i].start();
    }
});
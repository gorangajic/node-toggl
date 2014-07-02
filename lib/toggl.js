

/*
 * export module
 */
module.exports = Toggl;


/*
 * Module dependencies.
 */
var Promise = require('bluebird');
var request = require('request');

Promise.promisifyAll(request);


function Toggl(API_TOKEN) {
    this.auth = {
        user: API_TOKEN,
        password: 'api_token'
    };
};


/**
 * start a new toggl task
 * @param  {String} name task name
 * @return {Promise}
 */
Toggl.prototype.start = function(name) {
    return request.postAsync({
        url: 'https://www.toggl.com/api/v8/time_entries/start',
        json: {
            time_entry: {
                description: name,
                start: new Date(),
                duration: -1,
                created_with: 'node-toggl'
            }
        },
        auth: this.auth
    }).spread(function(res, body) {
        return body.data;
    });
};

/**
 * stop in progress task
 * @return {Promise}
 */
Toggl.prototype.stop = function() {
    return this.getEntry().bind(this).then(function(entry) {
        var id = entry.id;
        var url = 'https://www.toggl.com/api/v8/time_entries/'+id+'/stop';
        return request.putAsync({
            url: url,
            auth: this.auth
        }).spread(function(res, body){
            return JSON.parse(body).data;
        });
    });
};


/**
 * Get time entry details
 * @return {Promise}
 */
Toggl.prototype.getEntry = function() {
    return request.getAsync({
        url: 'https://www.toggl.com/api/v8/time_entries/current',
        auth: this.auth
    }).spread(function(res, body){
        body = JSON.parse(body);
        if ( !body.data) {
            throw new Error('No entry in progress')
        }
        return body.data;
    });
};
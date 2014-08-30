var cronPattern = function(queue) {
    var pattern = '';
    // %s %m %h %dom %mon %dow
    switch (queue.interval) {
        case 'Hourly':
            pattern = '0 %m * * * *';
            break;
        case 'Daily':
            pattern = '0 %m %h * * *'; //1-5  for M-F
            break;
        case 'Weekly':
            pattern = '0 %m %h * * %dow';
            break;
        default:
            console.log('¯\\_(ツ)_/¯');
    }

    return pattern.replace('%m', queue.minuteOfHour)
        .replace('%h', queue.hourOfDay)
        .replace('%dow', queue.dayOfWeek);
};

module.exports = {
    cronPattern: cronPattern
};
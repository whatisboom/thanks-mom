module.exports = {
    name: function(name) {
        return name || false;
    },
    hashtags: function(hashtags) {
        var pieces = hashtags.split(' ');
        for (var i = pieces.length - 1; i >= 0; i--) {
            var piece = pieces[i];
            pieces[i] = (piece.charAt(0) !== '#') ? '#' + piece : piece;
        };
        return (pieces.length) ? pieces.join(' ') : false;
    }
};
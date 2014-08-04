angular.module('fnthanksmom')
    .factory('Name', ['$resource', function($resource) {
        return $resource('/api/names/:nameId', {}, {
            query: {
                method: 'GET',
                params: { nameId: 'names' },
                isArray: true
            }
        });
    }]);
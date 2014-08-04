function NamesController($scope, Name) {

    $scope.data = Name.query().data;

}

angular.module('fnthanksmom')
    .controller('NamesController', ['$scope', 'Name', NamesController]);
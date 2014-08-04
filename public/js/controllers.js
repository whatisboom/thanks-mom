function NamesController($scope) {

    $scope.title = "This is a test";
    $scope.body = "This is a test";

}

angular.module('fnthanksmom')
    .controller('NamesController', ['$scope', NamesController]);
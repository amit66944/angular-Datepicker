var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMaterial', 'ngAria', 'amPicker']);

app.controller('myCtrl',function($scope,$filter){
    $scope.date = $filter('date')(new Date(),'dd MMM yyyy');

    $scope.getDate = function(){
        console.log($scope.date1);
        console.log($scope.date2);
    };
});
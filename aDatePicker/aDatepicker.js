(function(){
    'use strict';
    var app;

    app = angular.module('amPicker',[]);

    app.directive('amDatePicker', [
        '$filter','$document',function($filter,$document){
            return {
                restrict: "E",
                templateUrl: "template/calendar.html",
                require: 'ngModel',
                scope: {
                    selected: "=",
                    labelName: "@label"
                },
                link: function (scope,element,attr,ngModelCtrl) {
                    scope.dateValue = element.val();
                    scope.activeDate = false;
                    scope.level = 0; // zero level is month view can increase max to 2 level more
                    scope.yearFrom = null;
                    scope.yearTo = null;
                    scope.showPicker = function (e) {
                        scope.activeDate = true;
                    };
                    scope.outOfDatePicker = function () {
                        scope.activeDate = false;
                    };
                    scope.weeksList = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                    scope.monthList = [
                        ['January','February','March'],
                        ['April','May','June'],
                        ['July','August','September'],
                        ['October','November','December']
                    ];
                    var date = new Date();
                    setCalendarValue(date);
                    scope.goDownToDate = function(){
                        if(scope.level == 0){
                            date = new Date(date.setMonth(date.getMonth() - 1));
                            setCalendarValue(date);
                        }
                        else
                        if(scope.level == 1){
                            date = new Date(date.setMonth(date.getMonth() - 120));
                            setCalendarYears(date);
                        }
                        else
                        if(scope.level == 2){
                            date = new Date(date.setMonth(date.getMonth() - 120));
                            calenderYearsRanges(date);
                        }
                    };
                    scope.goUpToDate = function(){
                        if(scope.level == 0){
                            date = new Date(date.setMonth(date.getMonth() + 1));
                            setCalendarValue(date);
                        }
                        else
                        if(scope.level == 1){
                            date = new Date(date.setMonth(date.getMonth() + 120));
                            setCalendarYears(date);
                        }
                        else
                        if(scope.level == 2){
                            date = new Date(date.setMonth(date.getMonth() + 120));
                            calenderYearsRanges(date);
                        }
                    };
                    function setCalendarValue(date) {
                        scope.calenderDays = [];
                        scope.monthName = $filter('date')(date, 'MMMM');
                        scope.yearName = $filter('date')(date, 'yyyy');
                        scope.yearFrom = (parseInt(scope.yearName / 10) * 10);
                        scope.yearTo = (scope.yearFrom) + 10;
                        var noOfDays = daysInMonth(($filter('date')(date, 'M') - 1), scope.yearName);
                        var k = -1;
                        for (var i = 1; i <= noOfDays;) {
                            k++;
                            !(angular.isArray(scope.calenderDays[k])) ? scope.calenderDays[k] = [] : '';
                            angular.forEach(scope.weeksList, function (week) {
                                if ($filter('date')(new Date(scope.yearName + '/' + scope.monthName + '/' + i), 'EEE') == week) {
                                    scope.calenderDays[k].push(i);
                                    i++;
                                }
                                else {
                                    scope.calenderDays[k].push('NaN');
                                }
                            });
                        }
                    }
                    function setCalendarYears(date){
                        scope.calenderYears = [];
                        scope.yearName = $filter('date')(date, 'yyyy');
                        scope.yearFrom = (parseInt(scope.yearName / 10) * 10);
                        scope.yearTo = (scope.yearFrom) + 10;
                        var startFrom = scope.yearName - 15;
                        for (var i = 0; i < 6;i++) {
                            !(angular.isArray(scope.calenderYears[i])) ? scope.calenderYears[i] = [] : '';
                            for(var j=0;j<5;j++) {
                                scope.calenderYears[i].push(startFrom);
                                startFrom++;
                            }
                        }
                    }
                    function calenderYearsRanges(date){
                        scope.calenderYearsRanges = [];
                        scope.yearName = $filter('date')(date, 'yyyy');
                        scope.yearFrom = (parseInt(scope.yearName / 10) * 10) + 1;
                        scope.yearTo = (scope.yearFrom) + 9;
                        var startFromRange = scope.yearFrom - 50;
                        var startToRange = scope.yearTo - 50;
                        for (var i = 0; i < 5;i++) {
                            !(angular.isArray(scope.calenderYearsRanges[i])) ? scope.calenderYearsRanges[i] = [] : '';
                            for(var j=0;j<3;j++) {
                                scope.calenderYearsRanges[i].push({from: startFromRange, to: startToRange});
                                startFromRange = parseInt(startFromRange) + 10;
                                startToRange = parseInt(startToRange) + 10;
                            }
                        }
                    }
                    scope.setDateClicked = function(date){
                        if(angular.isNumber(date)){
                            scope.dateValue = date+' '+scope.monthName+' '+scope.yearName;
                            ngModelCtrl.$setViewValue(scope.dateValue);
                            ngModelCtrl.$render();
                            scope.outOfDatePicker();
                        }
                    };
                    scope.increaseLevel = function () {
                        scope.level++;
                        if(scope.level ==  1) {
                            setCalendarYears(date);
                        }
                        else {
                            calenderYearsRanges(date)
                        }
                    };
                    scope.onYearRangeClick = function(range){
                        var midYear = range["from"] + 5;
                        date = new Date(date.setYear(midYear));
                        setCalendarYears(date);
                        scope.level--;
                    };
                    scope.onYearClick = function(year){
                        date = new Date(year+'/'+scope.monthName+'/1');
                        setCalendarValue(date);
                        scope.level--;
                    };
                    scope.showMonthList = function(){
                        scope.level = 4;
                    };
                    scope.monthSelected = function (month) {
                        date = new Date(scope.yearName+'/'+month+'/1');
                        scope.monthName = $filter('date')(date, 'MMMM');
                        scope.level = 0;
                    };
                    function daysInMonth(iMonth, iYear)
                    {
                        return 32 - new Date(iYear, iMonth, 32).getDate();
                    }
                    element.bind('click',function(e){
                        e.stopPropagation();
                    });
                    $document.bind('click', function(e){
                        scope.activeDate = false;
                        scope.$apply(attr['div.calender-box']);
                    });
                }
            };
        }
    ]);

}).call(this);
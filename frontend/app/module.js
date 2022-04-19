'use strict';

var app = angular.module('app', ['ngResource','ui.bootstrap','ngRoute','ngCookies','ngSanitize','ngTouch','ngFileUpload','datatables', 'datatables.light-columnfilter', 'angularFileUpload','angularUtils.directives.dirPagination','datatables.buttons','ngPrint']);
// Spinner Service
app.factory('spinnerService', function () {  
    // create an object to store spinner APIs.
    var spinners = {};
     return {
        // private method for spinner registration.
        _register: function (data) {
            if (!data.hasOwnProperty('name')) {
                throw new Error("Spinner must specify a name when registering with the spinner service.");
            }
            if (spinners.hasOwnProperty(data.name) == spinners.hasOwnProperty(data.name)) {
                spinners[data.name] = data;
            }
            spinners[data.name] = data;
        },
        // unused private method for unregistering a directive,
        // for convenience just in case.
        _unregister: function (name) {
            if (spinners.hasOwnProperty(name)) {
                delete spinners[name];
            }
        },
        _unregisterGroup: function (group) {
            for (var name in spinners) {
                if (spinners[name].group === group) {
                    delete spinners[name];
                }
            }
        },
        _unregisterAll: function () {
            for (var name in spinners) {
                delete spinners[name];
            }
        },
        show: function (name) {
            var spinner = spinners[name];
            if (!spinner) {
                throw new Error("No spinner named '" + name + "' is registered.");
            }
            spinner.show();
        },
        hide: function (name) {
            var spinner = spinners[name];
            if (!spinner) {
                throw new Error("No spinner named '" + name + "' is registered.");
            }
            spinner.hide();
        },
        showGroup: function (group) {
            var groupExists = false;
            for (var name in spinners) {
                var spinner = spinners[name];
                if (spinner.group === group) {
                    spinner.show();
                    groupExists = true;
                }
            }
            if (!groupExists) {
                throw new Error("No spinners found with group '" + group + "'.")
            }
        },
        hideGroup: function (group) {
            var groupExists = false;
            for (var name in spinners) {
                var spinner = spinners[name];
                if (spinner.group === group) {
                    spinner.hide();
                    groupExists = true;
                }
            }
            if (!groupExists) {
                throw new Error("No spinners found with group '" + group + "'.")
            }
        },
        showAll: function () {
            for (var name in spinners) {
                spinners[name].show();
            }
        },
        hideAll: function () {
            for (var name in spinners) {
                spinners[name].hide();
            }
        }
    };
});

// Spinner Directive
app.directive('spinner', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            name: '@?',
            group: '@?',
            show: '=?',
            imgSrc: '@?',
            register: '@?',
            onLoaded: '&?',
            onShow: '&?',
            onHide: '&?'
        },
        template: [
            '<span ng-show="show">',
            '  <img ng-show="imgSrc" ng-src="{{imgSrc}}" />',
            '  <span ng-transclude></span>',
            '</span>'
        ].join(''),
        controller: function ($scope, spinnerService) {

            // register should be true by default if not specified.
            if (!$scope.hasOwnProperty('register')) {
                $scope.register = true;
            }else {
                $scope.register = !!$scope.register;
            }

            // Declare a mini-API to hand off to our service so the 
            // service doesn't have a direct reference to this
            // directive's scope.
            var api = {
                name: $scope.name,
                group: $scope.group,
                show: function () {
                    $scope.show = true;
                },
                hide: function () {
                    $scope.show = false;
                },
                toggle: function () {
                    $scope.show = !$scope.show;
                }
            };

            // Register this spinner with the spinner service.
            if ($scope.register === true) {
                spinnerService._register(api);
            }

            // If an onShow or onHide expression was provided,
            // register a watcher that will fire the relevant
            // expression when show's value changes.
            if ($scope.onShow || $scope.onHide) {
                $scope.$watch('show', function (show) {
                    if (show && $scope.onShow) {
                        $scope.onShow({
                            spinnerService: spinnerService,
                            spinnerApi: api
                        });
                    } else if (!show && $scope.onHide) {
                        $scope.onHide({
                            spinnerService: spinnerService,
                            spinnerApi: api
                        });
                    }
                });
            }

            // This spinner is good to go.
            // Fire the onLoaded expression if provided.
            if ($scope.onLoaded) {
                $scope.onLoaded({
                    spinnerService: spinnerService,
                    spinnerApi: api
                });
            }
        }
    };
});

//Select2
app.directive("select2", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            $(elem).select2();
            $(elem).on('select2:select', function (e) {
                var data = e.params.data.id;
                updateModel(data) 
            });
        }
    }
});

// Capitalize first
app.filter('capitalize_first', function() {
    return function(input) {
        return (!!input) ? input.split(' ').map(function(wrd){return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();}).join(' ') : '';
    }
});

// Numbers only
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

// Float Numbers
app.directive('numberFloat', function() {
    return function(scope, element, attrs) {
      element.bind("keydown", function(event) {
        if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 ||			
              // Allow: .
              (event.keyCode === 190 || event.keyCode === 110) ||
              // Allow: home, end, left, right
              (event.keyCode >= 35 && event.keyCode <= 39)) {
              // let it happen, but check for excessive periods
              if ((event.keyCode === 190 || event.keyCode === 110) && element.val().indexOf('.') !== -1) {
                  event.preventDefault();
              }
              return;
          } else {
              // Ensure that it is a number and stop the keypress
              if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                  event.preventDefault();
              }
          }
  
      });
    };
  });

// Datepicker
app.directive("datepicker", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                'format': "yyyy-mm-dd",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            $(elem).datepicker(options).on('changeDate', function(e) {
                $(this).datepicker('hide');
            });
        }
    }
});

// Image upload
app.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

// Alphabet only
app.directive('lettersOnly', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
            var transformedInput = text.replace(/[0-9!@#$%^&*)(]*/g, '');
            //console.log(transformedInput);
            if(transformedInput !== text){
                ngModelCtrl.$setViewValue(transformedInput);
                ngModelCtrl.$render();
            }
            return transformedInput;
        }
        ngModelCtrl.$parsers.push(fromUser);
        }
    }; 
});

//Letters, Numbers, Dash Only
app.directive('lettersnumberdashOnly', function () {
    return function(scope, element, attrs) {
	element.bind("keypress", function(event) {
        
        var inputValue = event.charCode;
        if(!(inputValue >= 65 && inputValue <= 122) && ((inputValue != 32 && inputValue != 0 && inputValue != 8 && inputValue != 45 && inputValue != 48 && inputValue != 49 && inputValue != 50 && inputValue != 51 && inputValue != 52 && inputValue != 53 && inputValue != 54 && inputValue != 55 && inputValue != 56 && inputValue != 57) || (inputValue == 32)) || (inputValue>=91 && inputValue<=96) ){
            event.preventDefault();
        }

    });
  };
});

// Timepicker
app.directive("timepick", function($compile){
    return function(scope, element, attrs){
        $(element).bootstrapMaterialDatePicker({
            date: false,
            format: 'HH:mm', 
            shortTime: true,
            clearButton: true
        });
    }
});

// Particulars - Add View
app.directive("addparticulars", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){

            var particularCtr = document.getElementsByClassName("particular_id").length;
            scope.entry.voucher.particulars[particularCtr] = '';
            scope.entry.voucher.amount[particularCtr] = '';
            scope.$apply();
    
            var eleDOM = '<div class="col-xs-12 particular_id particular_id_add">';
                    eleDOM = eleDOM + '<div class="col-xs-9 paddingZero">';
                        eleDOM = eleDOM + '<textarea style="resize:vertical;width:90%;" ng-model="entry.voucher.particulars['+particularCtr+']" name="entry.voucher.particulars['+particularCtr+']" class="form-control input_type" ng-disabled="isSaving" required/></textarea>';
                    eleDOM = eleDOM + '</div>';
                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero">';
                        eleDOM = eleDOM + '<input type="text" ng-model="entry.voucher.amount['+particularCtr+']" class="form-control input_type" number-float step="0.01" name="entry.voucher.amount['+particularCtr+']" ng-disabled="isSaving"/>';
                    eleDOM = eleDOM + '</div>';
                eleDOM = eleDOM + '</div>';

            angular.element(document.getElementById('particular-button')).before($compile(eleDOM)(scope));
        });
	}
});

// Particulars - Edit View
app.directive("editparticulars", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){

            var particularCtr = document.getElementsByClassName("particular_id_edit").length;
            scope.entry.voucher.particulars[particularCtr] = '';
            scope.entry.voucher.amount[particularCtr] = '';
            scope.$apply();
    
            var eleDOM = '<div class="col-xs-12 particular_id_edit">';
                    eleDOM = eleDOM + '<div class="col-xs-9 paddingZero">';
                        eleDOM = eleDOM + '<textarea style="resize:vertical;width:90%;" ng-model="entry.voucher.particulars['+particularCtr+']" name="entry.voucher.particulars['+particularCtr+']" class="form-control input_type" ng-disabled="isSaving" required/></textarea>';
                    eleDOM = eleDOM + '</div>';
                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero">';
                        eleDOM = eleDOM + '<input type="text" ng-model="entry.voucher.amount['+particularCtr+']" class="form-control input_type" number-float step="0.01" name="entry.voucher.amount['+particularCtr+']" ng-disabled="isSaving"/>';
                    eleDOM = eleDOM + '</div>';
                eleDOM = eleDOM + '</div>';

            angular.element(document.getElementById('editparticular-button')).before($compile(eleDOM)(scope));
        });
	}
});

// Name - Add View
app.directive("addname", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){

            var nameCtr = document.getElementsByClassName("name_id").length;
            scope.entry.cashadvance.employee[nameCtr] = '';
            scope.entry.cashadvance.amount[nameCtr] = '';
            scope.$apply();
    
            var eleDOM = '<div class="col-xs-12 name_id name_id_add">';
                    eleDOM = eleDOM + '<div class="col-xs-9 paddingZero">';
                        eleDOM = eleDOM + '<select style="width:90%;" class="form-control select2" select2 ng-model="entry.cashadvance.employee['+nameCtr+']" name="entry.cashadvance.employee['+nameCtr+']"  required ng-disabled="isSaving">';
                            eleDOM = eleDOM + '<option ng-repeat="employee in get_all_employee track by $index" value="{{employee.employee_id}}">{{employee.fullname}}</option>';
                        eleDOM = eleDOM + '</select>';
                    eleDOM = eleDOM + '</div>';
                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero">';
                        eleDOM = eleDOM + '<input type="text" ng-model="entry.cashadvance.amount['+nameCtr+']" class="form-control input_type" number-float step="0.01" name="entry.cashadvance.amount['+nameCtr+']" ng-disabled="isSaving"/>';
                    eleDOM = eleDOM + '</div>';
                eleDOM = eleDOM + '</div>';

            angular.element(document.getElementById('name-button')).before($compile(eleDOM)(scope));
        });
    }
});

// Name - Edit View
app.directive("editname", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){

            var nameCtr = document.getElementsByClassName("name_id_edit").length;
            scope.entry.cashadvance.employee[nameCtr] = '';
            scope.entry.cashadvance.amount[nameCtr] = '';
            scope.$apply();
    
            var eleDOM = '<div class="col-xs-12 name_id_edit">';
                    eleDOM = eleDOM + '<div class="col-xs-9 paddingZero">';
                        eleDOM = eleDOM + '<input type="hidden" ng-model="entry.cashadvance.employee_name['+nameCtr+']">';
                        eleDOM = eleDOM + '<select style="width:90%;" class="form-control select2" select2 ng-model="entry.cashadvance.employee['+nameCtr+']" name="entry.cashadvance.employee['+nameCtr+']"  required ng-disabled="isSaving">';
                            eleDOM = eleDOM + '<option ng-repeat="employee in get_all_employee track by $index" value="{{employee.employee_id}}">{{employee.fullname}}</option>';
                        eleDOM = eleDOM + '</select>';
                    eleDOM = eleDOM + '</div>';
                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero">';
                        eleDOM = eleDOM + '<input type="text" ng-model="entry.cashadvance.amount['+nameCtr+']" class="form-control input_type" number-float step="0.01" name="entry.cashadvance.amount['+nameCtr+']" ng-disabled="isSaving"/>';
                    eleDOM = eleDOM + '</div>';
                eleDOM = eleDOM + '</div>';

            angular.element(document.getElementById('editname-button')).before($compile(eleDOM)(scope));
        });
    }
});

// Add Duty Detail Order
app.directive("adddutydetail", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){

            var dutyCtr = document.getElementsByClassName("duty_detail").length;
            scope.entry.duty.ddo_employee[dutyCtr] = '';
            scope.entry.duty.ddo_place_of_duty[dutyCtr] = '';
            scope.entry.duty.ddo_firearms_issued[dutyCtr] = '';
            scope.$apply();

            var eleDOM = '<div class="col-md-12 duty_detail duty_detail_add">';

                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero text-center hidden-xs hidden-sm">';
                        eleDOM = eleDOM + '<select style="width:100%;padding:5px;" class="form-control select2" select2 ng-model="entry.duty.ddo_employee['+dutyCtr+']" ng-change="getEmployeePostingArea();" name="entry.duty.ddo_employee['+dutyCtr+']" required ng-disabled="isSaving"">';
                            eleDOM = eleDOM + '<option value="">Select Employee</option>';
                            eleDOM = eleDOM + '<option ng-repeat="employee in get_all_employee track by $index" value="{{employee.employee_id}}">{{employee.fullname}}</option>';
                        eleDOM = eleDOM + '</select>';
                    eleDOM = eleDOM + '</div>';

                    eleDOM = eleDOM + '<div class="col-xs-6 paddingZero text-center hidden-xs hidden-sm">';
                        eleDOM = eleDOM + '<textarea style="resize:vertical;height:35px;" ng-model="entry.duty.ddo_place_of_duty['+dutyCtr+']" name="entry.duty.ddo_place_of_duty['+dutyCtr+']" class="form-control" ng-disabled="isSaving" required/></textarea>';
                    eleDOM = eleDOM + '</div>';

                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero text-center hidden-xs hidden-sm">';
                        eleDOM = eleDOM + '<input type="text" class="form-control" name="entry.duty.ddo_firearms_issued['+dutyCtr+']" ng-model="entry.duty.ddo_firearms_issued['+dutyCtr+']" required ng-disabled="isSaving"/>';
                    eleDOM = eleDOM + '</div>'   
                    
                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero text-center visible-xs visible-sm">';
                        eleDOM = eleDOM + '<select style="width:100%;padding:5px;" class="form-control select2" select2 ng-model="entry.duty.ddo_employee['+dutyCtr+']" ng-change="getEmployeePostingArea();" name="entry.duty.ddo_employee['+dutyCtr+']" required ng-disabled="isSaving"">';
                            eleDOM = eleDOM + '<option value="">Select Employee</option>';
                            eleDOM = eleDOM + '<option ng-repeat="employee in get_all_employee track by $index" value="{{employee.employee_id}}">{{employee.fullname}}</option>';
                        eleDOM = eleDOM + '</select>';
                    eleDOM = eleDOM + '</div>';

                    eleDOM = eleDOM + '<div class="col-xs-6 paddingZero text-center visible-xs visible-sm">';
                        eleDOM = eleDOM + '<textarea style="resize:vertical;height:35px;" ng-model="entry.duty.ddo_place_of_duty['+dutyCtr+']" name="entry.duty.ddo_place_of_duty['+dutyCtr+']" class="form-control" ng-disabled="isSaving" required/></textarea>';
                    eleDOM = eleDOM + '</div>';

                    eleDOM = eleDOM + '<div class="col-xs-3 paddingZero text-center visible-xs visible-sm">';
                        eleDOM = eleDOM + '<input type="text" class="form-control" name="entry.duty.ddo_firearms_issued['+dutyCtr+']" ng-model="entry.duty.ddo_firearms_issued['+dutyCtr+']" required ng-disabled="isSaving"/>';
                    eleDOM = eleDOM + '</div>'   
                    
                eleDOM = eleDOM + '</div>';

            angular.element(document.getElementById('buttons-dutydetail')).before($compile(eleDOM)(scope));
        });
    }
});

// Add Timekeeping
app.directive("addtk", function($compile){
	return function(scope, element, attrs){ 
        element.bind("click", function(){

            var tkCtr = document.getElementsByClassName("item_tk").length;
            scope.entry.tk.employee_id[tkCtr] = '';                          
            scope.entry.tk.day_one[tkCtr] = '';                              
            scope.entry.tk.day_two[tkCtr] = '';                              
            scope.entry.tk.day_three[tkCtr] = '';                            
            scope.entry.tk.day_four[tkCtr] = '';                             
            scope.entry.tk.day_five[tkCtr] = '';                             
            scope.entry.tk.day_six[tkCtr] = '';                              
            scope.entry.tk.day_seven[tkCtr] = '';                            
            scope.entry.tk.day_eight[tkCtr] = '';                            
            scope.entry.tk.day_nine[tkCtr] = '';                             
            scope.entry.tk.day_ten[tkCtr] = '';                              
            scope.entry.tk.day_eleven[tkCtr] = '';                           
            scope.entry.tk.day_twelve[tkCtr] = '';                           
            scope.entry.tk.day_thirteen[tkCtr] = '';                         
            scope.entry.tk.day_fourteen[tkCtr] = '';                         
            scope.entry.tk.day_fifteen[tkCtr] = '';                          
            scope.entry.tk.first_row_overtime[tkCtr] = '';                   
            scope.entry.tk.first_row_hours[tkCtr] = '';                      
            scope.entry.tk.first_row_no_of_days[tkCtr] = '';                 

            scope.entry.tk.day_sixteen[tkCtr] = '';                          
            scope.entry.tk.day_seventeen[tkCtr] = '';                        
            scope.entry.tk.day_eighteen[tkCtr] = '';                         
            scope.entry.tk.day_nineteen[tkCtr] = '';                         
            scope.entry.tk.day_twenty[tkCtr] = '';                           
            scope.entry.tk.day_twenty_one[tkCtr] = '';                       
            scope.entry.tk.day_twenty_two[tkCtr] = '';                       
            scope.entry.tk.day_twenty_three[tkCtr] = '';                     
            scope.entry.tk.day_twenty_four[tkCtr] = '';                      
            scope.entry.tk.day_twenty_five[tkCtr] = '';                      
            scope.entry.tk.day_twenty_six[tkCtr] = '';                       
            scope.entry.tk.day_twenty_seven[tkCtr] = '';                     
            scope.entry.tk.day_twenty_nine[tkCtr] = '';                      
            scope.entry.tk.day_thirty[tkCtr] = '';                           
            scope.entry.tk.day_thirty_one[tkCtr] = '';                       
            scope.entry.tk.day_overtime2[tkCtr] = '';                        
            scope.entry.tk.second_row_hours[tkCtr] = '';                     
            scope.entry.tk.second_row_days[tkCtr] = '';                      
            scope.entry.tk.total_overtime[tkCtr] = '';                       
            scope.entry.tk.total_work_hours[tkCtr] = '';                     
            scope.entry.tk.total_no_days[tkCtr] = '';   
            
            scope.$apply();

            var eleDOM = '<div class="col-md-12 table-responsive item_tk item_tk_add" style="margin-top:10px;">';
                eleDOM = eleDOM + '<div class ="cold-md-12">';

                    eleDOM = eleDOM + '<div class="col-md-6" style="padding-bottom:1%;">';
                        eleDOM = eleDOM + '<label class="control-label" for="add_guard_name">Employee Name:</label><br/>';
                        eleDOM = eleDOM + '<select style="width:100%;" class="form-control select2" select2 ng-model="entry.tk.employee_id['+tkCtr+']" name="employee_name" required ng-disabled="isSaving"">';
                            eleDOM = eleDOM + '<option value="">Select Employee</option>';
                            eleDOM = eleDOM + '<option ng-repeat="employee in get_all_employee track by $index" value="{{employee.employee_id}}">{{employee.fullname}}</option>';
                        eleDOM = eleDOM + '</select>';
                    eleDOM = eleDOM + '</div>';

                eleDOM = eleDOM + '</div>';
                eleDOM = eleDOM + '<table class="table table-bordered" style="text-align:center;">';
                    eleDOM = eleDOM + '<tr>';
                        eleDOM = eleDOM + '<td>Day 1';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_one['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_one" id="day_one" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 2';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_two['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_two" id="day_two" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 3';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_three['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_three" id="day_three" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 4';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_four['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_four" id="day_four" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 5';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_five['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_five" id="day_five" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 6';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_six['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_six" id="day_six" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 7';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_seven['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_seven" id="day_seven" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 8';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_eight['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_eight" id="day_eight" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 9';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_nine['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_nine" id="day_nine" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 10';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_ten['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_ten" id="day_ten" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 11';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_eleven['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_eleven" id="day_eleven" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 12';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twelve['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twelve" id="day_twelve" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 13';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_thirteen['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_thirteen" id="day_thirteen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 14';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_fourteen['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_fourteen" id="day_fourteen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 15';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_fifteen['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_fifteen" id="day_fifteen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td style="font-size:9px">Overtime';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.first_row_overtime['+tkCtr+']" class="form-control input_type1" number-float step="0.01" name="first_row_overtime" id="first_row_overtime" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td style="font-size:9px">Hours';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.first_row_hours['+tkCtr+']" class="form-control input_type1" number-float step="0.01" name="first_row_hours" id="first_row_hours" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td style="font-size:8px">No. Of Days';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.first_row_no_of_days['+tkCtr+']" class="form-control input_type1" number-float step="0.01" name="first_row_no_of_days" id="first_row_no_of_days" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                    eleDOM = eleDOM + '</tr>';
                    eleDOM = eleDOM + '<tr>';
                        eleDOM = eleDOM + '<td>Day 16';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_sixteen['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_sixteen" id="day_sixteen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 17';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_seventeen['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_seventeen" id="day_seventeen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 18';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_eighteen['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_eighteen" id="day_eighteen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 19';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_nineteen['+tkCtr+']" class="form-control input_type" number-float step="0.01"  name="day_nineteen" id="day_nineteen" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 20';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty" id="day_twenty" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 21';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_one['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_one" id="day_twenty_one" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 22';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_two['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_two" id="day_twenty_two" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 23';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_three['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_three" id="day_twenty_three" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 24';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_four['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_four" id="day_twenty_four" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 25';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_five['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_five" id="day_twenty_five" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 26';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_six['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_six" id="day_twenty_six" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 27';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_seven['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_seven" id="day_twenty_seven" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 28';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_eight['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_eight" id="day_twenty_eight" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 29';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_twenty_nine['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_twenty_nine" id="day_twenty_nine" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 30';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_thirty['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_thirty" id="day_thirty" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td>Day 31';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_thirty_one['+tkCtr+']" class="form-control input_type" number-float step="0.01" name="day_thirty_one" id="day_thirty_one" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td style="font-size:9px">Overtime';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.day_overtime2['+tkCtr+']" class="form-control input_type1" number-float step="0.01" name="day_overtime2" id="day_overtime2" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td style="font-size:9px">Hours';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.second_row_hours['+tkCtr+']" class="form-control input_type1" number-float step="0.01" name="second_row_hours" id="second_row_hours" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '<td style="font-size:8px">No. Of Days';
                            eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.second_row_days['+tkCtr+']" class="form-control input_type1" number-float step="0.01" name="second_row_days" id="second_row_days" ng-disabled="isSaving"/>';
                        eleDOM = eleDOM + '</td>';
                    eleDOM = eleDOM + '</tr>';
                eleDOM = eleDOM + '</table>';
                eleDOM = eleDOM + '<div class="col-md-12" style = "padding-bottom:1%;">';
                    eleDOM = eleDOM + '<table>';
                        eleDOM = eleDOM + '<tr style = "padding-bottom:1%;">';
                            eleDOM = eleDOM + '<td style="padding-right:20px">';
                                eleDOM = eleDOM + '<b style="font-size:13px;">Total Overtime: </b>';
                            eleDOM = eleDOM + '</td>';
                            eleDOM = eleDOM + '<td style="padding-bottom:5px">';
                                eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.total_overtime['+tkCtr+']" name="total_overtime" id="total_overtime" class="form-control input_type2" placeholder="Overtime" ng-disabled="isSaving" readonly>';  
                            eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '</tr>';
                        eleDOM = eleDOM + '<tr>';
                            eleDOM = eleDOM + '<td style="padding-right:20px">';
                                eleDOM = eleDOM + '<b style="font-size:13px;">Total Work Hours: </b>';
                            eleDOM = eleDOM + '</td>';
                            eleDOM = eleDOM + '<td style="padding-bottom:5px">';
                                eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.total_work_hours['+tkCtr+']" name="total_work_hours" id="total_work_hours" class="form-control input_type2" placeholder="Work Hours" ng-disabled="isSaving" readonly>';
                            eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '</tr>';
                        eleDOM = eleDOM + '<tr>';
                            eleDOM = eleDOM + '<td style="padding-right:20px">';
                                eleDOM = eleDOM + '<b style="font-size:13px;">Total No. Of Days: </b>';
                            eleDOM = eleDOM + '</td>';
                            eleDOM = eleDOM + '<td>';
                                eleDOM = eleDOM + '<input type="text" ng-model="entry.tk.total_no_days['+tkCtr+']" name="total_no_days" id="total_no_days" class="form-control input_type2" placeholder="No. of Days" ng-disabled="isSaving" readonly>';
                            eleDOM = eleDOM + '</td>';
                        eleDOM = eleDOM + '</tr>';
                    eleDOM = eleDOM + '</table>';
                eleDOM = eleDOM + '</div>';
            eleDOM = eleDOM + '</div>';

            angular.element(document.getElementById('entrybutton-tk')).before($compile(eleDOM)(scope));

        });
    }
});







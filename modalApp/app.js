'use strict';

angular.module('myApp', [
	'ngRoute',
	'ui.bootstrap',
	'myapp.controllers.app',
	'myapp.controllers.home'
])
.config([
	'$routeProvider',
	'$locationProvider',
	function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'modalApp/home.html',
			controller: 'HomeCtrl'
		})
		.otherwise({redirectTo: '/'});
	}
]);

angular.module('myapp.controllers.home', [
  'ui.bootstrap'
])
.controller('HomeCtrl', [
	'$rootScope',
	'$scope',
	'$modal',
	function($rootScope, $scope, $modal) {
	  var modalInstance = $modal.open({
	    templateUrl: 'modalApp/_modal.html',
	    controller: ModalCtrl,
	    resolve: {
        title: function () {
            return $rootScope.fname;
        },
        message: function () {
            return $scope.lname;
        }
	    }
	  });
	}
]);

angular.module('myapp.controllers.app', [])
.controller('AppCtrl', [
	'$rootScope',
	'$scope',
	function($rootScope, $scope) {
	  $rootScope.fname = "Amresh";
	  $scope.lname = "Kadian";
	}
]);

var ModalCtrl = function($rootScope, $scope, $modalInstance, title, message) {
	  $scope.title = title;
	  $scope.message = message;
	};


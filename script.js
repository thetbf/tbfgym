var module = angular.module('tbfApp', 
  ['ngMockE2E','ngRoute', 'firebase'
  , 'myapp.controllers.home'
  , 'ui.bootstrap'
  //, 'mgcrea.ngStrap'
  ])
.constant('FIREBASE_URL', 'https://crackling-fire-8854.firebaseio.com/')
.config(['$provide', '$routeProvider', '$locationProvider',
function($provide, $routeProvider, $locationProvider) {
  $provide.decorator('$httpBackend', function($delegate) {
    var proxy = function(method, url, data, callback, headers) {
      var interceptor = function() {
        var _this = this,
          _arguments = arguments;
        setTimeout(function() {
          callback.apply(_this, _arguments);
        }, 1000);  //setTimeout
      }; //interceptor
      return $delegate.call(this, method, url, data, interceptor, headers);
    }; // proxy
    for(var key in $delegate) {
      proxy[key] = $delegate[key];
    } //decorator
    return proxy;
  }); // function-config
  
  $routeProvider
  .when('/', {
    templateUrl: 'home.tpl.html',
    controller: 'HomeCtrl'
  })
  .when('/login', {
    templateUrl: 'user.tpl.html',
    controller: 'UserCtrl'
  })
  .when('/logout', {
    templateUrl: 'home.tpl.html',
    controller: 'HomeCtrl'
  })
  .when('/register', {
    templateUrl: 'signup.tpl.html',
    controller: 'SignupCtrl'
  })
  .when('/subscription', {
    templateUrl: 'subscription.tpl.html',
    controller: 'SubscriptionCtrl'
  })
  .when('/report', {
    templateUrl: 'report.tpl.html',
    controller: 'ReportCtrl',
    resolve: {
      reportdata: ['$http', function($http) {
        return $http.get('/report').then(function(data) {
          return data.data;
        }) //promise then
      }]  // reportdata
    } // resolve
  }) // when-report
  .when('/profile', {
    templateUrl: 'profile.tpl.html',
    controller: 'TabsDemoCtrl'
  })
  .otherwise({redirectTo: '/'}); // routeprovider

  
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

}]) // config ends here
.run(function($httpBackend){
  $httpBackend.whenPOST('/login').respond(function(method, url, data) {
    var details = angular.fromJson(data);
    if(details.email && details.email === 'test@test.com' && details.password && details.password === "test")
       return [200, {loggedIn: true, userid: 'testid'}, {}];
    else return [200, {loggedIn: false}, {}];
  });
  $httpBackend.whenGET(/.*/i).passThrough();
  $httpBackend.whenPUT(/.*/i).passThrough();


})
;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  THIS SERVICE IS FOR AUTHENTICATION -------------------------------------------------------
  THIS WILL ALLOW THE USERS TO REGISTER INTO THE TBF APP -----------------------------------
  AND ALSO ALLOW THE APP TO AUTHENTICATE THE USER'S  ---------------------------------------
  CREDENTIALS. -----------------------------------------------------------------------------
 * * * * * * * * *  * * * * * * * * *  * * * * * * * * *  * * * * * * * * *  * * * * * * * */
module.factory('Authentication', 
  ['$rootScope', '$firebaseAuth', '$location', '$http',
   // '$firebaseObject', 
  function($rootScope, $firebaseAuth, $location, $http ) {

  var ref = new Firebase('https://crackling-fire-8854.firebaseio.com/');
  var auth = $firebaseAuth(ref);

  return {
    login: function(user) {
      auth.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function(regUser){
        user.loading = true;
        user.postResult = 1;
        $rootScope.email = user.email;
        $rootScope.uid = regUser.uid;
        $location.url('/report');
      }).catch(function(error) {
        user.postResult = 2;
      });
    }, // login

    logout: function() {
        console.log("LOGOUT FUNCTION!!!");
        $rootScope.email = '';
        $rootScope.uid = '';
      return auth.$unauth();
    }, // logout

    // requireAuth: function() {
    //   return auth.$requireAuth();
    // }, // require Authentication

    // register: function(user) {
    //   auth.$createUser({
    //     email: user.email,
    //     password: user.password
    //   }).then(function(regUser) {
    //     var regRef = new Firebase(FIREBASE_URL + 'users')
    //       .child(regUser.uid)
    //       .set({
    //         date: Firebase.ServerValue.TIMESTAMP,
    //         regUser: regUser.uid,
    //         firstname: user.firstname,
    //         lastname: user.lastname,
    //         email: user.email
    //       });
    //     $rootScope.message = "Hi! " + user.firstname + ", Thanks for registring with us."
    //   }).catch(function(error) {
    //     $rootScope.message = error.message;
    //   }); // createUser     
    // } //register

    payment: function(t) {
      console.log("Amount: "+t);
      var uData = {
        uid: t.uid,
        amt: t.amt
      }
    $http.get('/payment', {params: uData}) // PASS THE DATA AS THE SECOND PARAMETER
        .success(
            function(success){
                console.log(success)
            })
        .error(
            function(error){
                console.log(error)
    });
      return ;
    }, // payment
  };

}]); // factory

module.factory('UserData', function() { 
    var data = {
      email: '',
      password: '',
      loading: true,
      postResult: 0
    };
    return data;
  });

module.factory('HomeData', function() {
    var homedata = {
      location: '',
      state: ''
    };
    return homedata;
  });

module.factory('SignupData', function() {
    var signupdata = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      pwd: '',
      mobile: '',
      address: '',
      message: ''
    };
    // factory function body that constructs shinyNewServiceInstance
    return signupdata;
  });

module.factory('AuthData', 
  ['$rootScope', '$firebaseAuth', '$firebaseObject', 
  function($rootScope, $firebaseAuth, $firebaseObject) {
    var ref = new Firebase('https://crackling-fire-8854.firebaseio.com/');
    var auth = $firebaseAuth(ref);

    auth.$onAuth(function(data) {
      if(data) {
        var userRef = new Firebase('https://crackling-fire-8854.firebaseio.com/' + 'users/' + data.uid);
        var userObj = $firebaseObject(userRef);
        $rootScope.currentUser = userObj;
      } else {
        $rootScope.currentUser = '';
      }
    });
    // return data;
  }]);

module.controller('MainCtrl', 
  ['$rootScope', '$scope', 'Authentication', 
  function($rootScope, $scope, Authentication){
}]); //MainCtrl

module.controller('SubscriptionCtrl', 
  ['$rootScope', '$scope', '$http', '$modal', 
  function($rootScope, $scope, $http, $modal){
  $scope.message = "amresh.kadian@gmail.com";
  $rootScope.message2 = "Amresh";

 
    $scope.open = function () {
      console.log("SubscriptionCtrl   001");
            $scope.contact = {
              name: "Amresh Kadian is the name...."
            };
    };// end-open


  $scope.subscribe = function() {
    console.log("Hello------");
    var data = {
       email: $scope.message, 
       namefirst: $rootScope.message2,
       namelast: "Kadian"
      
    };

    console.log("dataObj" + data.email + data.namefirst + data.namelast);
    $http.get('/subscribeme', {params: data}) // PASS THE DATA AS THE SECOND PARAMETER
        .success(
            function(success){
                console.log(success)
            })
        .error(
            function(error){
                console.log(error)
    });
  };

}]); //SubscriptionCtrl

module.controller('HomeCtrl', 
  ['$scope', 'HomeData', 'Authentication', 
  function($scope, HomeData, Authentication){
    $scope.homedata = HomeData;
    $scope.homedata.location = "Jhajjar";
    $scope.homedata.state = "Haryana";
    $scope.logout = function() {
      Authentication.logout();
    };
}]);

module.controller('SignupCtrl', 
  ['$scope', '$location', '$http', '$firebaseAuth', 'FIREBASE_URL', 'SignupData', 
  function($scope, $location, $http, $firebaseAuth, FIREBASE_URL, SignupData){
  
  var ref = new Firebase('https://crackling-fire-8854.firebaseio.com/');
  var auth = $firebaseAuth(ref);
  var regRef = null;
  var regUid = null;

  $scope.signupdata = SignupData;

  $scope.register = function() {
    auth.$createUser({
      email: $scope.signupdata.email,
      password: $scope.signupdata.password
    }).then(function(regUser) {
      var s = {
              uid: regUser.uid,
              email: $scope.signupdata.email,
              fname: $scope.signupdata.firstname,
              lname: $scope.signupdata.lastname,
                pwd: "asdf", 
             mobile: 1345623491, 
            address: "Arya Nagar, Jhajjar HR"
      };
    $http.put('/signup', 
        {}, 
        {params: s}) // PASS THE DATA AS THE SECOND PARAMETER
        .success(
            function(success){
                console.log(success)
            })
        .error(
            function(error){
                console.log(error)
    });
      $scope.signupdata.message = "Hi " + 
        $scope.signupdata.firstname + 
        ", Thanks for registering at TBF.";
        $location.path('/login');
    }).catch(function(error) {
      $scope.signupdata.message = error.message;
    }); // createUser
  }; // register
}]); // controller

angular.module('myapp.controllers.home', [
  'ui.bootstrap'
])
// module
.controller('ReportCtrl', 
  ['$scope', '$modal', '$http', '$location', '$route', 'reportdata', 'UserData', 'Authentication', 
  function($scope, $modal, $http, $location, $route, reportdata, UserData, Authentication){
  $scope.data = reportdata;
  $scope.userdata = UserData; 
    var dataObj = JSON.stringify({
      message1: $scope.message
    });
  $scope.modalInstanceAttendance = function(rowUid) {
    console.log("Inside makePayment");
    $modal.open({
      templateUrl: 'partials/markattendance.tpl.html',
      controller: ModalCtrl,
      resolve: {
        uid: function () {
            return rowUid;
        }
      }
    }); //end of $modal.open()
  };
  $scope.modalInstance = function(rUid) {
    console.log("Inside modalInstance");
    $modal.open({
      templateUrl: 'partials/makepayment.tpl.html',
      controller: ModalCtrl,
      resolve: {
        uid: function () {
            return  rUid;
        }
      }
        // console.log("MAKING THE PAYMENT NOW...."+amount);
        // Authentication.payment(t);
    }); //end of $modal.open()
  }; //end of modalInstance()

  $scope.markAttendence = function(uid) {
      var uData = {
        uid: uid
      }
    $http.get('/attendence', {params: uData}) // PASS THE DATA AS THE SECOND PARAMETER
        .success(
            function(success){
              // console.log("PAYMENT DONE " + retValue);
                console.log("ATTENDENCE DONE " + success);
                // $location.path('/report');
                $route.reload();
            })
        .error(
            function(error){
                console.log(error)
    });
  };
}]);

module.controller('UserCtrl', [
    '$rootScope', '$scope', 
    // '$firebaseAuth', '$firebaseObject', '$http', '$location', 
    'UserData', 'Authentication',
    function($rootScope, $scope, 
      // $firebaseAuth, $firebaseObject, $http, $location, 
      UserData, Authentication){
      $scope.submit = function() {
      console.log("UserCtrl Controller: "+$scope.data);
      Authentication.login($scope.data);
    };
}]);

var ModalCtrl = function($rootScope, $scope, $http, $route, $modalInstance, uid) {
    $scope.uid = uid;
    console.log("IN the ModalCtrl Now!!");
    $scope.ok = function(amt) {
      $scope.amount = amt;
      var uData = {
        uid: $scope.uid,
        amt: $scope.amount
      }
    $http.get('/payment', {params: uData}) // PASS THE DATA AS THE SECOND PARAMETER
        .success(
            function(success){
                $route.reload();
                $modalInstance.close();
            })
        .error(
            function(error){
                console.log(error)
    });
      return ;
    };
  };


angular.module('mgcrea.ngStrap.tab', [
  'mgcrea.ngStrap'
]).controller('TabsDemoCtrl', function ($scope) {
  console.log("WE ARE IN TabsDemoCtrl ");

  $scope.tabs = [
    {title: "one", page: "profile.one.html"},
    {title: "two", page: "profile.two.html"}
  ];

});
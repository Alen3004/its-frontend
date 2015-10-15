'use strict';

/**
 * @ngdoc function
 * @name itsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the itsFrontendApp
 */
angular.module('itsFrontendApp')
  .controller('LoginCtrl', function ($scope, $localStorage, authFactory, $timeout, userFactoryHttp) {
    $scope.token = $localStorage.token;
    var setUser = function (userName){
      userFactoryHttp.getUserByUserName(userName).then(function(res){
        $localStorage.user = res.data;
        window.location = '../#/team/' + $localStorage.user.teamnumber +'/board';
      },
        function () {
        });
    };
    var showAlertMessage = function (isError, message) {
      //reset
      $scope.showAlert = false;
      $scope.doAlertFade = false;
      $scope.alertType = isError ? 'alert-danger' : 'alert-success';
      $scope.alertMessage = message;
      $scope.showAlert = true;

      $timeout(function () {
        $scope.doAlertFade = true;
      }, 2500);
    };
    $scope.signin = function () {
      var formData = {
        username: $scope.name,
        password: $scope.password
      };
      authFactory.signin(formData)
        .then(function (res) {
            $localStorage.token = res.data.value;
            setUser($scope.name);
          },
          function (res) {
            $scope.name = '';
            $scope.password = '';
            if(res.status === 401){
              showAlertMessage(false, 'wrong username or password');
            }else{
              showAlertMessage(false, 'the user is already logged on');
            }
          }
        );
    };
  });

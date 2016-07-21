angular.module('angular-ssh', [])
.factory('$ssh', ['$q', '$window', function ($q, $window) {

    return {
      openSession: function (hostname,username,password,cols,rows) {
        var q = $q.defer();
        $window.sshClient.sshOpenSession(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },hostname,username,password,cols,rows);
        return q.promise;
      },
      read: function() {
        var q = $q.defer();
        $window.sshClient.sshR(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        });
        return q.promise;
      },
      write: function(line){
        var q = $q.defer();
        $window.sshClient.sshW(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },line);
        return q.promise;
      },
      closeSession: function() {
        var q = $q.defer();
        $window.sshClient.sshCloseSession(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        });
        return q.promise;
      },
      verifyHost: function(hostname,addhost){
        var q = $q.defer();
        $window.sshClient.sshVerifyHost(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },hostname,addhost);
        return q.promise;
      },
      resizeWindow: function(x,y,pixels_x,pixels_y){
        var q = $q.defer();
        $window.sshClient.sshSetXY(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },x,y,pixels_x,pixels_y);
        return q.promise;
      },

    };

}]);

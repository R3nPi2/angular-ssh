/*!
 * angular-ssh v0.1
 * Project: https://github.com/R3nPi2/angular-ssh
 * Author: R3n Pi2 <r3npi2@gmail.com>
 * See LICENSE in this repository for license information
 *
 * A Angular module for cordova-plugin-ssh
 * cordova-plugin-ssh project: https://github.com/R3nPi2/cordova-plugin-ssh
 *
 */
angular.module('angular-ssh', [])
.factory('$ssh', ['$q', '$window', function ($q, $window) {

  var cordovaSshClientIsPresent = function() {
    if ($window && ($window.sshClient !== undefined)) {
      return true;
    } else {
      return false;
    }
  }

  var sessions = {};

  return {

    getSession: function (id) {
      return sessions[id];
    },

    getSessions: function () {
      return sessions;
    },

    storeSession: function (sessionID,alias,hostname,user,terminal) {
      sessions[sessionID] = {
        alias: alias,
        hostname: hostname,
        user: user,
        terminal: terminal,
      }
      return true;
    },

    openSession: function (hostname,port,username,password,cols,rows,width,height) {
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshOpenSession(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },hostname,port,username,password,cols,rows);
      }
      return q.promise;
    },

    read: function(sessionID) {
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshRead(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },sessionID);
      }
      return q.promise;
    },

    write: function(sessionID,line){
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshWrite(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },sessionID,line);
      }
      return q.promise;
    },

    closeSession: function(sessionID) {
      delete sessions[sessionID];
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshCloseSession(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },sessionID);
      }
      return q.promise;
    },

    verifyHost: function(hostname,port,addhost){
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshVerifyHost(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },hostname,port,addhost);
      }
      return q.promise;
    },

    resizeWindow: function(sessionID,cols,rows,width,height){
      var width = width || 0;
      var height = height || 0;
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshResizeWindow(function(response){
          q.resolve(response);
        },function(error){
          q.reject(error);
        },sessionID,cols,rows,width,height);
      }
      return q.promise;
    },

    getKnownHosts: function() {
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        $window.sshClient.sshGetKnownHosts(function(response){
          var hostKeys = {};
          var lines = response.split("\n");
          lines.forEach(function(e,i){
            if (e.length) {
              var k = e.split(" ");
              hostKeys[i] = {
                host: k[0],
                type: k[1],
                key: k[2],
              }
            }
          });
          q.resolve(hostKeys);
        },function(error){
          q.reject(error);
        });
      }
      return q.promise;
    },

    setKnownHosts: function(keys) {
      var q = $q.defer();
      if (!cordovaSshClientIsPresent()) {
        q.reject('cordova-plugin-sshclient not present');
      } else {
        var known_hosts = "";
        for(var index in keys) { 
          known_hosts += keys[index].host+" "+keys[index].type+" "+keys[index].key+"\n";
        }
        $window.sshClient.sshSetKnownHosts(function(response){
          var hostKeys = {};
          var lines = response.split("\n");
          lines.forEach(function(e,i){
            if (e.length) {
              var k = e.split(" ");
              hostKeys[i] = {
                host: k[0],
                type: k[1],
                key: k[2],
              }
            }
          });
          q.resolve(hostKeys);
        },function(error){
          q.reject(error);
        },known_hosts);
      }
      return q.promise;
    },

  };

}]);

# Angular SSH Client

An Angular SSH Client implementation using [Cordova SSH Client Plugin](https://github.com/R3nPi2/cordova-plugin-sshclient).

## Supported Platforms

  - This package should be multiplatform, but the fact is that it depends on `cordova-plugin-sshclient`, and this plugin **only works on Android platform**.

## Dependencies

  - [AngularJS 1.1.4 + ](http://angularjs.org/)
  - [cordova-plugin-sshclient](https://github.com/R3nPi2/cordova-plugin-sshclient)

## Installation

  - Install depencencies.
  
  - Install component: bower install https://github.com/R3nPi2/angular-ssh.git

  - Add javascript file to your app html file (e.g. index.html): 

```html
<script src="[bower_components/]angular-ssh/angular-ssh.js"></script>
```

## Example usage

```html
angular.module('myApp', ['angular-ssh']).
.controller('myCtrl', function($scope,$ssh) {
  
  $scope.host = "127.0.0.1";
  $scope.user = "me";
  $scope.password = "mypassword";
  $scope.cols = "80";
  $scope.rows = "25";

  // We have to make shure to run our code after 'deviceready' or 'cordova-plugin-sshclient' 
  // could not be loaded yet. We can do it like this (with our code inside 'deviceready' listener) 
  // or any other way. "$scope.$watch('openSessionFin', ... " could be a good idea, or launch angular 
  // bootstrap inside 'deviceready' listener, like this: 
  // "angular.bootstrap(document.querySelector('body'), ['myApp'])".

  document.addEventListener('deviceready', function() {

    $ssh.verifyHost($scope.host,"false").then(function(resp){

      var connect = false;
      var save = false;

      // Host key is not in known_hosts
      if (resp != "OK") {

        connect = confirm(resp);
        save = connect;

      } else {

        connect = true;

      }

      if (connect) {

        if (save) {
          // Save hostkey in known_hosts
          $ssh.verifyHost($scope.host,"true").then(function(resp){
            console.log("hostkey saved into known_hosts");
          },function(error){
            alert(error);
          });
        }

        $ssh.openSession($scope.host,$scope.user,$scope.password,$scope.cols,$scope.rows).then(function(resp){

          console.log("connected");

          $ssh.write("ls -latr\n").then(function(resp){

            // Ssh connection output is asynchronous buffered so, to get full response, 
            // we can do it with a short timeout, a read loop, etc.
            setTimeout(function(){

              $ssh.read().then(function(resp){

                $ssh.closeSession();
                // Here we have connection and "ls -latr" response
                alert(resp);

              },function(error){
                $ssh.closeSession();
                alert(error);
              });

            },500);

          },function(error){
            $ssh.closeSession();
            alert(error);
          });

        },function(error){
          alert(error);
        });

      }

    }, function(error){
      alert(error); 
    });

  });

});
```

## Service `$ssh` Methods

All methods return a AngularJS Promise. For more information about promises read [AngularJS documentation](https://docs.angularjs.org/api/ng/service/$q).

All methods are based on cordova-plugin-sshclient methods, so read [plugin documentation](https://github.com/R3nPi2/cordova-plugin-sshclient) if your need more information.

### `$ssh.openSession(hostname,user,password,cols,rows).then(function(success){...},function(error){...})`

Connects to host, request a new PTY and starts a Shell.

**Arguments**

  - `hostname` – Hostname or IP.
  - `user` – Username.
  - `password` – Password.
  - `cols` – PTY columns.
  - `rows` – PTY rows.

**Success response**

  - Returns "0". It means everithing was ok.

**Error response**

  - Returns a string describing the error.

### `$ssh.verifyHost(hostname,saveHostKey).then(function(success){...},function(error){...})`

We should use this method to verify hostkeys.

**Arguments**

  - `hostname` – Hostname or IP.
  - `saveHostKey` – This argument should be a string matching "true" or "false". If "false", the verification should be done but hostkey will not be saved into known\_hosts database. If "true", hostkey should be saved into known\_hosts.

**Success response**

  - If `saveHostKey` was set to "true": returns "ADD\_OK" string if everithing goes fine and hostkey is saved into known\_hosts file.
  - If `saveHostKey` was set to "false", and hostkey allready exists into known\_hosts, and hostkey is valid: returns "OK" string.
  - If `saveHostKey` was set to "false", and hostkey allready exists into known\_hosts, but hostkey has changed: returns describing the situation.
  - If `saveHostKey` was set to "false", and hostkey does not exists into known\_hosts, returns a string with hostkey.

**Error response**

  - Returns a string describing the error.

### `$ssh.resizeWindow(cols,rows,width,height).then(function(success){...},function(error){...})`

We can use this method to resize PTY created on `$ssh.openSession`.

**Arguments**

  - `cols` – PTY columns.
  - `rows` – PTY rows.
  - `width` – PTY pixels width. You can set it to 0 to ignore pixels width.
  - `height` – PTY pixels height. You can set it to 0 to ignore pixels height.

**Success response**

  - A string with PTY dimensions.

**Error response**

  - Returns a string describing the error.

### `$ssh.read().then(function(success){...},function(error){...})`

Read stdout and stderr buffers output.

**Success response**

  - Returns characters read from stdout and stderr buffers.

**Error response**

  - Returns a string describing the error.

### `$ssh.write(string).then(function(success){...},function(error){...})`

Write a string to stdin buffer.

**Arguments**

  - `string` – String that will be written to stdin buffer. If you want to send a `ls` command, you should write "ls\n".

**Success response**

  - Returns written command.

**Error response**

  - Returns a string describing the error.

### `$ssh.closeSession().then(function(success){...},function(error){...})`

Close ssh session.

**Success response**

  - Returns "0". It means everithing was ok.

**Error response**

  - Returns a string describing the error.

## Author

  - R3n Pi2 <r3npi2@gmail.com> (https://github.com/R3nPi2)

## License

  - Angular SSH Client is released under the GNU Affero General Public License version 3. Read LICENSE file.

## Issues

Report at the github [issue tracker](https://github.com/R3nPi2/angular-ssh/issues)


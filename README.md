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
  $scope.port = "22";
  $scope.user = "me";
  $scope.password = "mypassword";
  $scope.cols = "80";
  $scope.rows = "25";
  $scope.sessionID = null;

  // We have to make shure to run our code after 'deviceready' or 'cordova-plugin-sshclient' 
  // could not be loaded yet. We can do it like this (with our code inside 'deviceready' listener) 
  // or any other way. "$scope.$watch('openSessionFin', ... " could be a good idea, or launch angular 
  // bootstrap inside 'deviceready' listener, like this: 
  // "angular.bootstrap(document.querySelector('body'), ['myApp'])".

  document.addEventListener('deviceready', function() {

    $ssh.verifyHost($scope.host,$scope.port,"false").then(function(resp){

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
          $ssh.verifyHost($scope.host,$scope.port,"true").then(function(resp){
            console.log("hostkey saved into known_hosts");
          },function(error){
            alert(error);
          });
        }

        $ssh.openSession($scope.host,$scope.port,$scope.user,$scope.password,$scope.cols,$scope.rows).then(function(resp){

          $scope.sessionID = resp;

          console.log("Session opended: ".resp);

          $ssh.write($scope.sessionID,"ls -latr\n").then(function(resp){

            // Ssh connection output is asynchronous buffered so, to get full response, 
            // we can do it with a short timeout, a read loop, etc.
            setTimeout(function(){

              $ssh.read($scope.sessionID).then(function(resp){

                $ssh.closeSession($scope.sessionID);

                // Here we have connection and "ls -latr" response
                alert(resp);

              },function(error){
                $ssh.closeSession($scope.sessionID);
                alert(error);
              });

            },500);

          },function(error){
            $ssh.closeSession($scope.sessionID);
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

All methods except `storeSession`, `getSessions` and `getSession`, return a AngularJS Promise. For more information about promises read [AngularJS documentation](https://docs.angularjs.org/api/ng/service/$q).

All methods except `storeSession`, `getSessions` and `getSession`, are based on cordova-plugin-sshclient methods, so read [plugin documentation](https://github.com/R3nPi2/cordova-plugin-sshclient) if your need more information.

### `$ssh.openSession(hostname,port,user,password,cols,rows,width,height).then(function(success){...},function(error){...})`

Connects to host, request a new PTY and starts a Shell.

**Arguments**

  - `hostname` – Hostname or IP.
  - `port` – SSH port.
  - `user` – Username.
  - `password` – Password.
  - `cols` – PTY columns.
  - `rows` – PTY rows.
  - `width` – (optional: if empty, set to 0) PTY pixels width.
  - `height` – (optional: if empty, set to 0) PTY pixels height.

**Success response**

  - Returns an integer corresponding to a unique session ID.

**Error response**

  - Returns a string describing the error.

### `$ssh.verifyHost(hostname,ports,aveHostKey).then(function(success){...},function(error){...})`

We should use this method to verify hostkeys.

**Arguments**

  - `hostname` – Hostname or IP.
  - `port` – SSH port.
  - `saveHostKey` – This argument should be a string matching "true" or "false". If "false", the verification should be done but hostkey will not be saved into known\_hosts database. If "true", hostkey should be saved into known\_hosts.

**Success response**

  - If `saveHostKey` was set to "true": returns "ADD\_OK" string if everithing goes fine and hostkey is saved into known\_hosts file.
  - If `saveHostKey` was set to "false", and hostkey allready exists into known\_hosts, and hostkey is valid: returns "OK" string.
  - If `saveHostKey` was set to "false", and hostkey allready exists into known\_hosts, but hostkey has changed: returns describing the situation.
  - If `saveHostKey` was set to "false", and hostkey does not exists into known\_hosts, returns a string with hostkey.

**Error response**

  - Returns a string describing the error.

### `$ssh.resizeWindow(sessionID,cols,rows,width,height).then(function(success){...},function(error){...})`

We can use this method to resize PTY created on `$ssh.openSession`.

**Arguments**

  - `sessionID` – The ID returned by `openSession`.
  - `cols` – PTY columns.
  - `rows` – PTY rows.
  - `width` – (optional: if empty, set to 0) PTY pixels width.
  - `height` – (optional: if empty, set to 0) PTY pixels height.

**Success response**

  - A string with PTY dimensions.

**Error response**

  - Returns a string describing the error.

### `$ssh.read(sessionID).then(function(success){...},function(error){...})`

Read stdout and stderr buffers output.

**Arguments**

  - `sessionID` – The ID returned by `openSession`.

**Success response**

  - Returns characters read from stdout and stderr buffers.

**Error response**

  - Returns a string describing the error.

### `$ssh.write(sessionID,string).then(function(success){...},function(error){...})`

Write a string to stdin buffer.

**Arguments**

  - `sessionID` – The ID returned by `openSession`.
  - `string` – String that will be written to stdin buffer. If you want to send a `ls` command, you should write "ls\n".

**Success response**

  - Returns written command.

**Error response**

  - Returns a string describing the error.

### `$ssh.closeSession(sessionID).then(function(success){...},function(error){...})`

Close ssh session.

**Arguments**

  - `sessionID` – The ID returned by `openSession`.

**Success response**

  - Returns "0". It means everithing was ok.

**Error response**

  - Returns a string describing the error.

### `$ssh.getKnownHosts().then(function(success){...},function(error){...})`

Builds an array from `known_hosts` file.

**Success response**

  - Returns an array with known hosts found in `known_hosts` file.

**Error response**

  - Returns a string describing the error.

### `$ssh.setKnownHosts(knownHosts).then(function(success){...},function(error){...})`

Set `known_hosts` file.

**Arguments**

  - `knownHosts` – An array like the one returned from `getKnownHosts`: `knownHosts = [ { host: "example.com", type: "ssh-rsa", key: "AAAAB3NzaC1yc2EAAAA..." }, ... ]`

**Success response**

  - Returns an array with known hosts found in `known_hosts` file.

**Error response**

  - Returns a string describing the error.

### `$ssh.storeSession(sessionID,alias,hostname,user,terminal)`

Pending documentation.
  
**Arguments**

  - `sessionID` – The ID returned by `openSession`.
  - `alias` – A free string.
  - `hostname` – Hostname or IP.
  - `user` – User name.
  - `terminal` – Current terminal content. This is a multiprupose field where we could store a javascript object, string, or whaterver we want. We can use this field later to get session state with `getSession`.

**Returned values**

  - Returns `true`.

### `$ssh.getSession(sessionID)`

Pending documentation.

**Arguments**

  - `sessionID` – The ID returned by `openSession`.

**Returned values**

  - An object with session info: `{ alias: "myServer", hostname: "myserver.com", user: "me", terminal: "The terminal content..." }`

### `$ssh.getSessions()`

Pending documentation.

**Returned values**

  - An array of objects indexed by `sessionID` with session info: `[ "sessionID": { alias: "myServer", hostname: "myserver.com", user: "me", terminal: "The terminal content..." }, ... ]`

## Author

  - R3n Pi2 <r3npi2@gmail.com> (https://github.com/R3nPi2)

## License

  - Angular SSH Client is released under the GNU Affero General Public License version 3. Read LICENSE file.

## Issues

Report at the github [issue tracker](https://github.com/R3nPi2/angular-ssh/issues)


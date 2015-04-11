'use strict';

angular.module('riotApiChallengeApp')
  .controller('MainCtrl', function ($scope, $http, socket, $mdDialog) {

    $scope.awesomeThings = [];

    $http.get('/api/chat').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('chat', $scope.awesomeThings);
      console.log($scope.awesomeThings);
    });

    $scope.addThing = function(champion) {
      localStorage.setItem("LeagueChampion", $scope.information.chosenChampion.key);

      $http.post('/api/chat', { 
        name: $scope.user.name || $scope.user.display_name,
        message: $scope.user.display_name + " chose " + $scope.information.chosenChampion.name +".",
        champion:$scope.information.chosenChampion.name,
        picture: $scope.information.chosenChampion.image.full
      });
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.showAlert = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .title('Error')
            .content('Please choose a champion.')
            .ok('Okay')
            .targetEvent(ev)
        );
      };



    $scope.user ={};

    $scope.information = {};

    $scope.user.name = localStorage.getItem("LeagueName");
    $scope.user.display_name = localStorage.getItem("LeagueName") || "A Summoner"


    $scope.enterName = function(){
      if($scope.user.name){
        localStorage.setItem("LeagueName", $scope.user.name);
        $scope.user.display_name = $scope.user.name
      }

    }
    $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=image&api_key=55275980-c752-47ac-a961-60e522430171').success(function(data){
      console.log(data.data);
      $scope.champions = data.data;
      $scope.information.chosenChampion = $scope.champions[localStorage.getItem("LeagueChampion")];
    });

    $scope.message;

    $scope.submitMessage = function(ev){
      if($scope.message && $scope.information.chosenChampion){
        $http.post('/api/chat', { 
          name:  $scope.user.name || $scope.user.display_name,
          message: $scope.message,
          champion:$scope.information.chosenChampion.name,
          picture: $scope.information.chosenChampion.image.full
        });
        $scope.message="";
      }
      else if(!$scope.information.chosenChampion){
        console.log("Error");
         $scope.showAlert(ev);

      }
    }

    $scope.newAPI = function(){
      console.log(new Date());
      console.log(moment().seconds(0).minute(0))
      console.log(Math.floor(moment().minute(0).seconds(0).toDate().getTime() / 1000));

      var time = Math.floor(moment().minute(0).seconds(0).toDate().getTime() / 1000);
      $http.get('https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=' + time + '&api_key=55275980-c752-47ac-a961-60e522430171')
      .success(function(data){
        console.log(data)
        $scope.urfGames = data;
      })
    }


  })

.filter('championFilter', function(){
    return function(input, query){
      if(!query) return input;
      var result = [];
      
      angular.forEach(input, function(friend){
          if (friend.name.toLowerCase().indexOf(query.toLowerCase()) !== -1){
            result.push(friend);       
          }   
      });
      return result;
    };
  })
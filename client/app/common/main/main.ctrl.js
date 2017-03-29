(function () {
  'use strict';

  angular
    .module('app')
    .controller('MainController', MainController);

  /* @ngInject */
  // MainController.$inject =['$scope'];
  function MainController($scope) {
    var vm = this;
    $scope.dayText = 'a good day.';

    function init() {
      console.log('Greeting from AWSK main controller initial function.');
      $scope.dayText = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

    }
    init();

  }

})();

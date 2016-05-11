(function () {
  'use strict';

  angular
    .module('app')
    .run(runFunction);

  runFunction.$inject = ['$rootScope', '$timeout', '$window'];
  /* @ngInject */
  function runFunction($rootScope, $timeout, $window) {

    console.log('$window.navigator.platform ===> ', $window.navigator.platform);
    // add a class to the body if we are on windows
    if ($window.navigator.platform.indexOf('Win') !== -1) {
      $rootScope.bodyClasses = ['os-windows'];

    }

  }
})();

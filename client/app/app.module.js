(function(){
  'use strict';

  angular
    .module('app', [
      'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
      'ui.router' // , 'uiGmapgoogle-maps'
    ])
    .constant('APP_NAME', 'ANGULAR_WEB_STARTER_KIT')
    .constant('APP_VERSION', '0.0.1-beta');


  angular.element(document).ready(function () {
    // console.log('angular.element(document).ready!');

    // angular.bootstrap(document, ['app']);              // use ng-app="app" instead.
  });

})();

(function () {
  'use strict';

  angular
    .module('app')
    .config(routeConfig);

  /* @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('common', {
        abstract: true,
        url: '',
        templateUrl: 'app/layouts/layout.html'
      })
      .state('common.main', {
        url: '/',
        views: {
          'header@common': {
            templateUrl: 'app/layouts/header/header.tmpl.html',
            controller: 'HeaderController'
          },
          'content@common': {
            templateUrl: 'app/common/main/main.tmpl.html',
            controller: 'MainController'
          },
          'footer@common': {
            templateUrl: 'app/layouts/footer/footer.tmpl.html',
            controller: 'FooterController'
          }
        }
      })

      .state('404', {
        url: '/404',
        templateUrl: '404.tmpl.html',
        controllerAs: 'vm',
        controller: function ($state) {
          var vm = this;

        }
      })
      .state('500', {
        url: '/500',
        templateUrl: '500.tmpl.html',
        controllerAs: 'vm',
        controller: function ($state) {
          var vm = this;

        }
      });


    $urlRouterProvider.otherwise('/');
  }

})();

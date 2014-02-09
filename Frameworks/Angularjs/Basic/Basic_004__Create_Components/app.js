// modified from official sample
/*
    declare module 'app', load after module 'components'
*/
angular.module('app', ['components'])
/*
    add languageSelect service so can
    set/get selected language within different controller
*/
.factory('languageSelect', function() {
  var language;
  return {
    getLanguage: function () {return language;},
    setLanguage: function (lang) {language = lang;}
  }
})
/*
    controller for select language
*/
.controller('LangSelectController', function($scope, languageSelect) {
  // language list for select element
  $scope.languages = [{name: 'en-us', lan: 'en', loc: 'us'},
                    {name: 'en-uk', lan: 'en', loc: 'uk'},
                    {name: 'others', lan: 'n/a', loc: 'n/a'}];
  // function called when selection changed
  $scope.selectLanguage = function () {
    // update selected language if exists
    // $scope.lang: binded to the object of selected option
    if ($scope.lang && $scope.lang.name)
      languageSelect.setLanguage($scope.lang.name);
    else
      languageSelect.setLanguage(null);
  };
})
/*
    controller for diplaying some message
    $locale: see http://docs.angularjs.org/api/ng.$locale
*/
.controller('BeerCounter', function($scope, $locale, languageSelect) {
  $scope.beers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // update beerForms with default language ($locale.id)
  // and selected language
  $scope.updateBeerForms = function () {
    if ($locale.id == 'en-us'
        && (languageSelect.getLanguage() == 'en-us'
            || languageSelect.getLanguage() == 'en-uk')) {
      var beerForms = [];
      angular.forEach($scope.beers, function(beer) {
        beerForms.push(beer == 0? 'no beer' :
                        beer == 1? beer + ' beer' : beer + ' beers');
      });
      $scope.beerForms = beerForms;

    } else {
      var beerForms = [];
      angular.forEach($scope.beers, function(beer) {
        beerForms.push(beer == 0? 'žiadne pivo' :
                        beer == 1? beer + ' pivo' : 
                        beer < 5? beer + ' pivá' : beer + ' pív');
      });
      $scope.beerForms = beerForms;
    }
  };
  // init beerForms
  $scope.updateBeerForms();
  // update beerForms when selected language is changed
  $scope.$watch(
    // This is the listener function
    // see http://docs.angularjs.org/api/ng.$rootScope.Scope#methods_$watch
    function() { return languageSelect.getLanguage(); },
    // This is the change handler
    function () {
      $scope.updateBeerForms();
    }
  );
});
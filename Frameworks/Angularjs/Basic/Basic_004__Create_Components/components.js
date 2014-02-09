// modified from official sample
/*
    declare module 'components'
    see http://docs.angularjs.org/api/ng.$compile for directive api
*/
angular.module('components', [])

.directive('tabs', function() {
return {
  // this directive should be used as an element name ( <my-directive></my-directive> )
  restrict: 'E',
  // transclude the content of the directive
  transclude: true,
  // The scope to be used by the directive for registering watches
  // set to {} (object hash), then a new "isolate" scope is created.
  scope: {},
  // A controller instance if at least one directive on the element defines a controller.
  // will be passed to link function of child directive
  controller: function($scope, $element) {
    // hold all child panes
    var panes = $scope.panes = [];

    // select a pane
    $scope.select = function(pane) {
      // diselect all
      angular.forEach(panes, function(pane) {
        pane.selected = false;
      });
      // select target
      pane.selected = true;
    }

    // add a pane
    this.addPane = function(pane) {
      // select pane if no other panes
      if (panes.length == 0) $scope.select(pane);
      // push it into panes array
      panes.push(pane);
    }
  },
  // replace the current element (the directive tag) with
  // the contents of the HTML (this template)
  //
  // ng-transclude: denotes the insertation point of body content
  // see http://docs.angularjs.org/api/ng.directive:ngTransclude
  template:
    '<div class="tabbable">' +
      '<ul class="nav nav-tabs">' +
        '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
          '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
        '</li>' +
      '</ul>' +
      '<div class="tab-content" ng-transclude></div>' +
    '</div>',
  // specify where the template should be inserted. Defaults to false
  // true - the template will replace the current element
  // false - the template will replace the contents of the current element
  replace: true
};
})

.directive('pane', function() {
return {
  // Require another directive and inject its controller as the fourth argument to the linking function
  // ^ - Locate the required controller by searching the element's parents. Throw an error if not found.
  require: '^tabs',
  restrict: 'E',
  transclude: true,
  // bind a local scope property to the value of DOM attribute.
  // The result is always a string since DOM attributes are strings.
  // If no attr name is specified then the attribute name is assumed
  // to be the same as the local name.
  //
  // i.e. for <pane title="abc">, scope.title will be 'abc'
  scope: { title: '@' },
  link: function(scope, element, attrs, tabsCtrl) {
    tabsCtrl.addPane(scope);
  },
  // Same as template but the template is loaded from the specified URL
  templateUrl: 'pane.html',
  replace: true
};
})
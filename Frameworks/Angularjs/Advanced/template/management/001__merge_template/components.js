// modified from official sample
/*
    declare module 'components'
    see http://docs.angularjs.org/api/ng.$compile for directive api
*/
angular.module('components', [])
// override $templateCache in run function
// similar to https://gist.github.com/vojtajina/3354046
// but use older way so I can understand more details (I guess)
.run(function($templateCache, $http) {
  // the request used to load all template
  var req;
  // store old get method of $templateCache
  $templateCache.oldGet = $templateCache.get;
  // new get method
  $templateCache.get = function (url) {
    var val;
    // if the request url is not ready
    if (!$templateCache.oldGet(url)) {
        // if request not started
        // get all templates by $http.get()
        if (!req) { 
            req = $http.get('templates.html');
            // use 'then' method to register a callback function
            req.then(function(response) {
              // create a div
              var div = document.createElement('div'),
                w;
              // put all loaded content into created div
              div.innerHTML = response.data;
              // append div to body
              document.body.appendChild(div);
              // loop through all children of created div
              w = div.firstChild;
              while (w) {
                // if the child is a template
                if (w.className == 'ng-template') {
                  // put it into templateCache
                  $templateCache.put(w.id, w.innerHTML);
                }
                w = w.nextSibling;
              }
			  document.body.removeChild(div);
            });
        }
        // the '$http' method will return a promise object
        // promise object has the 'then' method and the
        // 'then' method will return a new promise object
        //
        // see http://docs.angularjs.org/api/ng.$q
        //
        // shortly, if you return a promise object with $templateCache.get,
        // the 'data' returned by success function will be the template string
        val = req.then(function(response) {
            return {
              status: response.status,
              data: $templateCache.oldGet(url)
            };
        });
        return val;
    }
    else
        return $templateCache.oldGet(url);
  }
})
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
  // change 'tabs' to use templateUrl
  templateUrl: 'tab.html',
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
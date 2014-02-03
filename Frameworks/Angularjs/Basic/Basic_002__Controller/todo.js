// modified from official document of angularjs
function TodoCtrl($scope) {
  // default todos array
  $scope.todos = [
    {text:'learn angular', done:true},
    {text:'build an angular app', done:false}
  ];
 
  // add element into todos array
  $scope.addTodo = function() {
    // element to add
	// receive todoText as ele.text from input with the form
	// in test.html
	// default ele.done to false
    var ele = {text:$scope.todoText, done:false};
	// push element into array
    $scope.todos.push(ele);
    $scope.todoText = '';
  };
 
  // get the count of remaining todo element
  $scope.remaining = function() {
    var count = 0,
        array = $scope.todos;
    // forEach API of angularjs to go through each element of todos array
    angular.forEach(array, function(ele) {
	  // increase count by 1 if this element is not finished
      count += ele.done ? 0 : 1;
    });
    return count;
  };
 
  // clear all finished element
  $scope.archive = function() {
    // store old todos array
	var oldTodos = $scope.todos;
	// assign a new array to $scope.todos
    $scope.todos = [];
	// for each element in old array
    angular.forEach(oldTodos, function(ele) {
	  // push element into new array if it is not finished
      if (!ele.done) $scope.todos.push(ele);
    });
  };
}
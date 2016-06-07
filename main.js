//В этом уроке мы разберем как подписываться на события $routeChangeStart и $routeChangeSuccess в ngRoute.

// попробуем
// добавим для начала app.run - как мы помним run начинает работать как только наше приложение инициализировалось
//app.run(function(){
   // console.log('run'); 
// });
//запустим посмотрим... в консоли появился run все работает
// и теперь в run заиджектим $rootScope
// app.run(function($rootScope){
   // console.log('run'); 
// });
// когда мы используем ngRoute тогда мы можем повесить событие на любой scope повесить event т.е. $on и написать $routeChangeStart вторым параметром у нас будет функция
// у которой будут такие параметры как event, current, previous, reject
// 

  // $rootScope.$on('$routeChangeStart', function (event, current, previous, reject) {
    // console.log('changestart', arguments);
  // });
  
// посмотрим в консоль браузера и увидим что наш changestart выстрелил и у нас есть Четыре  объекта в массиве
// первый  - events которое происходит $routeChangeStart
// вторым параметром  - current которое loadedTemplateUrl: "home.html" 
//тут есть locals c template и params которые мы ему передаем, но в данном случае у нас их  на этом $routeChangeStart нет так ничего не передавали
//
// посмотрим в браузер в консоль и покликаем 
// например если зайдем в один из постов то увидм что при каждом клике у нас выводист новый chagestart 
//и можем через полученные объекты вытащить например из поста контроллер или ориджинал path или любую другую информацию

//точно также как $routeChangeStart есть event $routeChangeSuccess
//    $rootScope.$on('$routeChangeSuccess', function (event, current, previous, reject) {
    // console.log('ChangeSuccess', arguments);
  // });
//   И как мы видим у нас теперь выстреливают два события и это очень удобно 
//мы теперь можем выходить на элемент как до события при старте так и после чтобы implement(снабдить инструментами)-заимплементить какую-то логику абсолютно любого роута

//давайте для примера на $routeChangeSuccess добавим переменную $rootScope.currentPath = current.$$route.originalPath
//теперь давайте в наш index.html добавим <div ng-controller = 'pathCtrl'>Current path is {{currentPath}}</div>
// и опишем этот контроллер
// app.controller('pathCtrl', function(){
    // console.log('pathCtrl');
//     
// }); -нам не надо ничего передавать в этот контроллер поскольку currentPath берется по цепочке прототив из $rootScope и будет здесь нам доступен

// Вот так довольно просто с помощью всего одной переменной мы на $routeChangeSuccess set-сеттим originalPath в переменную currentPath и она доступна у нас абсолютно везде

// поэтому когда вам нужно отловить какое-то событие например успешного перехода на какой-то url или начало перехода и что-то сделать в этот момент то нам помогут эти events

// $rootScope.$on('$routeChangeStart', function (event, current, previous, reject) {
    // console.log('changestart', arguments);
  // });
//   
    // $rootScope.$on('$routeChangeSuccess', function (event, current, previous, reject) {
    // console.log('ChangeSuccess', arguments);
    // $rootScope.currentPath = current.$$route.originalPath;
  // });





var app = angular.module('app', ['ngRoute']);

app.run(function ($rootScope) {
  console.log('run');
  $rootScope.$on('$routeChangeStart', function (event, current, previous, reject) {
    console.log('changestart', arguments);
  });
  
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous, reject) {
    console.log('ChangeSuccess', arguments);
    $rootScope.currentPath = current.$$route.originalPath;
  });
});


app.config(function($routeProvider){
    
    $routeProvider
    .when('/',{
        templateUrl: 'home.html',
        controller: 'homeCtrl' 
    })
    .when('/posts',{
        templateUrl : 'posts.html',
        controller: 'postsCtrl' 
    })
        .when('/posts/:postId',{
        templateUrl : 'post.html',
        controller: 'postCtrl' 
    })
    .otherwise({
        templateUrl : '404.html'
    });
});


app.controller('pathCtrl', function(){
    console.log('pathCtrl');
    
});

app.controller('homeCtrl', function($scope){
    console.log('homeCtrl');
    $scope.model = {
        message: "This is my beautyful HomePage",
    };
});

app.controller('postCtrl', function($scope, $routeParams, postsFactory){
    console.log($routeParams.postId);
    var postId = Number($routeParams.postId);
    $scope.post = _.findWhere(postsFactory, {id: postId});
    
});

app.controller('postsCtrl', function($scope, postsFactory){
    console.log('postsCtrl', postsFactory);
    $scope.posts = postsFactory;
    
});

app.factory('postsFactory', function(){
    return [
    {
        id:1,
        name: "Why AngularJS is good?"
     },
     {
         id:2,
         name: "I love AngularJS!!!"
     },
     {
         id:3,
         name: "Is AngularJS easy to learn?"
     }
     
    ];
});




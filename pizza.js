var pizzaChallenge = angular.module('pizzaChallenge', []);

pizzaChallenge.controller('PizzaController', ['$scope', 'PizzaService', function($scope, PizzaService) {
  var pizzas = {};
  const meats = ['meat', 'ham', 'sausages', 'salami', 'beef', 'kebab', 'tuna', 'shrimps', 'mussels'];
  var groups = []
  for (i = 0; i < 4; i++) {
    groups[i] = {
      pizzas: [],
      percentage: 0,
      cheapest: {}
    };
  }

  function init() {
    PizzaService.getPizzas().success(function(data) {
      pizzas = data.pizzas;
      makeGroups();
    });
  }
  init();

  function makeGroups() {
    groups[0].pizzas = pizzas.filter(pizza => {
      for (attr in pizza) {
        if (attr != 'price' && attr != 'nil') {
          for (index in pizza[attr].ingredients) {
            if (meats.some(meat => pizza[attr].ingredients[index].includes(meat)))
              return true;
          }
        }
      }
    });

    groups[1].pizzas = pizzas.filter(pizza => {
      for (attr in pizza) {
        if (attr != 'price' && attr != 'nil') {
          for (index in pizza[attr].ingredients) {
            if ((pizza[attr].ingredients.filter(ingredient => ingredient.includes('cheese'))).length > 1)
              return true;
          }
        }
      }
    });

    groups[2].pizzas = pizzas.filter(pizza => {
      for (attr in pizza) {
        if (attr != 'price' && attr != 'nil') {
          for (index in pizza[attr].ingredients) {
            if (meats.some(meat => pizza[attr].ingredients[index].includes(meat)) &&
              pizza[attr].ingredients.some(ingredient => ingredient.includes('olives')))
              return true;
          }
        }
      }
    });

    groups[3].pizzas = pizzas.filter(pizza => {
      for (attr in pizza) {
        if (attr != 'price' && attr != 'nil') {
          for (index in pizza[attr].ingredients) {
            if (pizza[attr].ingredients.some(ingredient => ingredient.includes('mozzarella')) &&
              pizza[attr].ingredients.some(ingredient => ingredient.includes('mushrooms')))
              return true;
          }
        }
      }
    });
    computePercentage();
  }

  function computePercentage() {
    for (i = 0; i < 4; i++)
      groups[i].percentage = (groups[i].pizzas.length * 100 / (pizzas.length - 2));
    computeCheapest();
  }

  function computeCheapest() {
    for (i = 0; i < 4; i++) {
      groups[i] = findCheapest(groups[i]);
    }
    makeResult();
  }

  function findCheapest(pizzasType) {
    if (pizzasType.pizzas.length > 0) {
      pizzasType.pizzas.sort((a, b) => a.price - b.price);
      pizzasType.cheapest = pizzasType.pizzas[0];
    }
    return pizzasType;
  }

  function makeResult() {
    var result = {
      personal_info: {
        full_name: "Novica Sarenac",
        email: "novicasarenac@gmail.com",
        code_link: "https://github.com/novicasarenac/pizza_challenge"
      },
      answer: []
    }
    for (i = 1; i < 5; i++) {
      var key = 'group_' + i;
      var obj = {};
      obj[key] = {
        percentage: groups[i - 1].percentage + "%",
        cheapest: groups[i - 1].cheapest
      }
      result.answer.push(obj);
    }

    PizzaService.postPizzas(result).success(function(data) {
      console.log('Poslato');
    });
  }
}]);

pizzaChallenge.factory('PizzaService', ['$http', function($http) {
  var service = {};

  service.getPizzas = function() {
    return $http.get('http://coding-challenge.renderedtext.com/');
  }

  service.postPizzas = function(result) {
    return $http.post('http://coding-challenge.renderedtext.com/submit', result);
  }

  return service;
}]);

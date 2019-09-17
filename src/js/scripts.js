var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  function loadList() {
    return $.ajax(apiUrl, { dataType: "json" })
      .then(function(item) {
        $.each(item.results, function(index, item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(pokemonDetails) {
        item.height = pokemonDetails.height;
        item.weight = pokemonDetails.weight;
        item.types = pokemonDetails.types.map(function(pokemon) {
          return pokemon.type.name;
        });
        item.imageUrl = pokemonDetails.sprites.front_default;
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  var $pokemonList = $(".pokemon-list");

  function addListItem(item) {
    var $listItem = $(
      '<button class="pokemon-list__item list-group-item list-group-item-action" data-toggle="modal" data-target="#pokemon-modal"></button>'
    );
    $listItem.text(item.name);
    $pokemonList.append($listItem);
    $listItem.click(function() {
      showModal(item);
    });
  }

  function showModal(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      var modal = $(".modal-body");

      var nameElement = $(".modal-header").text(pokemon.name);

      var imageElement = $('<img class="pokemon-picture">');
      imageElement.attr("src", pokemon.imageUrl);

      var heightElement = $('<p class="pokemon-height"></p>').text(
        "Height: " + pokemon.height
      );

      var weightElement = $('<p class="pokemon-weight"</p>').text(
        "Weight: " + pokemon.weight
      );

      var typesElement = $('<p class="pokemon-types"></p>').text(
        "Types: " + pokemon.types
      );

      if (modal.children().length) {
        modal.children().remove();
      }

      modal.append(nameElement);
      modal.append(imageElement);
      modal.append(heightElement);
      modal.append(weightElement);
      modal.append(typesElement);
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal
  };
})();

//lists all pokemon on main page//
pokemonRepository.loadList().then(function() {
  var $pokemonList = pokemonRepository.getAll();
  $.each($pokemonList, function(index, value) {
    pokemonRepository.addListItem(value);
  });
});

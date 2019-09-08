var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/";

  function add(pokemon) {
    if (typeof pokemon === "object") {
      repository.push(pokemon);
    } else {
      alert("added content contains incorrect type of data");
    }
  }

  function getAll() {
    return repository;
  }

  var $pokemonList = $(".pokemon-list");

  function addListItem(pokemon) {
    var listItem = $('<button class="pokemon-list__item"></button>');
    listItem.text(pokemon.name);
    $pokemonList.append(listItem);
    listItem.on("click", function(event) {
      showDetails(pokemon);
    });
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
        item.imageUrl = pokemonDetails.sprites.front_default;
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      var modal = $('<div class="modal"></div>');

      var closeButtonElement = $("<button class=modal-close></button>").text(
        "Close"
      );
      closeButtonElement.on("click", function(event) {
        hideModal();
      });

      var nameElement = $('<p class="pokemon-name"></p>').text(pokemon.name);

      var imageElement = $('<img class="pokemon-picture">');
      image.attr("src", pokemon.imageUrl);

      var heightElement = $('<p class="pokemon-height"></p>').text(
        "Height: " + pokemon.height
      );

      if (modal.children().length) {
        modal.children().remove();
      }

      modal.append(nameElement);
      modal.append(imageElement);
      modal.append(heightElement);

      modal.addClass("is-visible");
    });
  }

  function hideModal() {
    var $modalContainer = $("#modal-container");
    $modalContainer.removeClass("is-visible");
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    hideModal: hideModal
  };

  //closes modal when escape key is pressed//
  window.on("keydown", e => {
    var $modalContainer = $("#modal-container");
    if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
      pokemonRepository.hideModal();
    }
  });
})();

//closes modal when clicked outside of it//
var $modalContainer = $(".pokemon-list");
$modalContainer.on("click", e => {
  var target = e.target;
  if (target !== $modalContainer) {
    pokemonRepository.hideModal();
  }
});

//lists all pokemon on main page//
pokemonRepository.loadList().then(function() {
  var pokemonList = pokemonRepository.getAll();
  $.each(pokemonList, function(item) {
    pokemonRepository.addListItem(item);
  });
});

var $ul = $("ul");

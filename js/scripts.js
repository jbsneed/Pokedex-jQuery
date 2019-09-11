var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

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
  var $ul = $("ul");

  function addListItem(item) {
    var $listItem = $('<li class="pokemon-list__item"></li>');
    var button = $('<button class="pokemon-list__item"></button>');
    button.text(item.name);
    $($listItem).append(button);
    $($ul).append($listItem);
    $listItem.click(function() {
      showDetails(item);
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
      showModal(pokemon);
    });
  }

  function showModal(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      var $modalContainer = $("#modal-container");
      var modal = $('<div class="modal"></div>');

      var closeButtonElement = $("<button class='modal-close'></button>").text(
        "Close"
      );
      closeButtonElement.click(function() {
        hideModal();
      });

      var nameElement = $(
        '<h3 class="pokemon-list__item pokemon-name"></h3>'
      ).text(pokemon.name);

      var imageElement = $('<img class="pokemon-list__item pokemon-picture">');
      imageElement.attr("src", pokemon.imageUrl);

      var heightElement = $(
        '<p class="pokemon-list__item pokemon-height"></p>'
      ).text("Height: " + pokemon.height);

      if ($modalContainer.children().length) {
        $modalContainer.children().remove();
      }

      modal.append(closeButtonElement);
      modal.append(nameElement);
      modal.append(imageElement);
      modal.append(heightElement);
      $modalContainer.append(modal);

      $modalContainer.addClass("is-visible");
    });
  }

  function hideModal() {
    var $modalContainer = $("#modal-container");
    $modalContainer.removeClass("is-visible");
  }

  //closes modal when escape key is pressed//
  $(document).on("keydown", function(event) {
    if (event.key === "Escape") {
      pokemonRepository.hideModal();
    }
  });

  //closes modal when clicked outside of it//
  var $bodyContainer = $("body");
  $bodyContainer.click(function(e) {
    var target = e.target;
    if (!$(target).closest("#modal-container").length) {
      pokemonRepository.hideModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    showDetails: showDetails,
    hideModal: hideModal
  };
})();

//lists all pokemon on main page//
pokemonRepository.loadList().then(function() {
  var $pokemonList = pokemonRepository.getAll();
  $.each($pokemonList, function(index, value) {
    pokemonRepository.addListItem(value);
  });
});

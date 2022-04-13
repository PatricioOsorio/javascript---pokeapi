const d = document;
const w = window;

const $main = d.querySelector('main');
const $template = d.querySelector('.pokemons-template').content;
const $fragment = d.createDocumentFragment();

const $loader = d.querySelector('.loader');

let nextPokemons = '';

async function loadPokemons() {
  try {
    $loader.style.display = 'block';

    let urlFetchApi = nextPokemons
      ? nextPokemons
      : 'https://pokeapi.co/api/v2/pokemon/';
    let response = await fetch(urlFetchApi);
    let pokemonsJson = await response.json();

    // console.log(pokemonsJson);

    if (!response.ok)
      throw {
        status: response.status,
        statusText: response.statusText || 'Ocurrió un error',
      };

    for (const pokemon of pokemonsJson.results) {
      try {
        let response = await fetch(pokemon.url);
        let pokemonJson = await response.json();

        // console.log(pokemonJson);

        if (!response.ok)
          throw { status: response.status, statusText: response.statusText };

        $template.querySelector('.pokemon__img').src =
          pokemonJson.sprites.front_default;
        $template.querySelector('.pokemon__img').alt = pokemonJson.name;
        $template.querySelector('.pokemon__name').innerHTML = pokemonJson.name;
      } catch (error) {
        let message = error.statusText || 'Ocurrio un error';

        $template.querySelector(
          '.pokemon__name'
        ).innerHTML = `Error ${error.status}: ${message}`;
      }

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    }

    $loader.style.display = 'none';

    $main.appendChild($fragment);

    nextPokemons = pokemonsJson.next;
    console.log(`nextPokemons : ${nextPokemons}`);
  } catch (error) {
    console.log(error);
    let message = error.statusText || 'Ocurrio un error';
    $main.innerHTML = `<div class="error">Error ${error.status}: ${message}</div>`;
  }
}

d.addEventListener('DOMContentLoaded', (e) => loadPokemons());

w.addEventListener('scroll', (e) => {
  const { scrollTop, clientHeight, scrollHeight } = d.documentElement;


  if (scrollTop + clientHeight === scrollHeight) {
    setTimeout(() => {
      console.log('Cargando mas poquemones');
      loadPokemons();
    }, 1000);
  }
});

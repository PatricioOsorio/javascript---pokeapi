const d = document;
const $main = d.querySelector('main');
const $links = d.querySelector('.links');

const urlPokeapi = 'https://pokeapi.co/api/v2/pokemon/';

async function loadPokemons(url) {
  try {
    $main.innerHTML = `<div class="loader lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

    let response = await fetch(url);
    let pokemons = await response.json();

    let $template = '';
    let $prevLink;
    let $nextLink;

    if (!response.ok)
      throw { status: response.status, statusText: response.statusText };

    for (const pokemon of pokemons.results) {
      try {
        let response = await fetch(pokemon.url);
        let pokemonInfo = await response.json();

        // console.log(pokemonInfo);

        if (!response.ok)
          throw { status: response.status, statusText: response.statusText };

        $template += `
          <figure class="pokemon__card">
            <img src="${pokemonInfo.sprites.front_default}" alt="${pokemonInfo.name}"/>
            <figcaption>${pokemonInfo.name}</figcaption>
          </figure>
        `;
      } catch (error) {
        let message = error.statusText || 'Ocurrio un error';
        $template += `
          <figure class="pokemon__card">
            <figcaption>Error ${error.status}: ${message}</figcaption>
          </figure>
        `;
      }
    }

    $main.innerHTML = $template;

    $prevLink = pokemons.previous ? `<a href="${pokemons.previous}">⏮</a>` : ``;
    $nextLink = pokemons.next ? `<a href="${pokemons.next}">⏩</a>` : ``;

    $links.innerHTML = `${$prevLink} ${$nextLink}`;
  } catch (error) {
    console.log(error);
    let message = error.statusText || 'Ocurrio un error';
    $main.innerHTML = `<div class="error">Error ${error.status}: ${error.statusText}</div>`;
  }
}

d.addEventListener('DOMContentLoaded', (e) => loadPokemons(urlPokeapi));

d.addEventListener('click', (e) => {
  if (e.target.matches('.links a')) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute('href'));
  }
});

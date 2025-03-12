// Definição de constantes e seleção de elementos do DOM
const MAX_POKEMONS = 500;
const listaWrapper = document.querySelector(".lista-wrapper");
const buscaEntrada = document.querySelector("#entrada-busca");
const numeroFiltro = document.querySelector("#numero");
const filtroNome = document.querySelector("#nome");
const filtroRegiao = document.querySelector("#regiao");

const mensagemNaoEncontrado = document.querySelector("#mensagem-nao-encontrado");

// Variáveis globais
let todosPokemons = [];
let pokemonsPorRegiao = {};

// Carregar regiões
async function carregarRegioes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/region/");
    const data = await response.json();
    filtroRegiao.innerHTML = '<option value="todas">Todas</option>';
    
    data.results.forEach(region => {
      const option = document.createElement("option");
      option.value = region.url;
      option.textContent = region.name;
      filtroRegiao.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar regiões:", error);
  }
}

// Carregar Pokémon por região
async function carregarPokemonsPorRegiao(regionUrl) {
  try {
    const response = await fetch(regionUrl);
    const regionData = await response.json();
    const pokedexUrl = regionData.pokedexes[0].url;
    
    const pokedexResponse = await fetch(pokedexUrl);
    const pokedexData = await pokedexResponse.json();
    
    const pokemons = pokedexData.pokemon_entries.map(entry => ({
      name: entry.pokemon_species.name,
      url: `https://pokeapi.co/api/v2/pokemon/${entry.entry_number}/`
    }));
    
    exibirPokemons(pokemons);
  } catch (error) {
    console.error("Erro ao carregar Pokémon da região:", error);
  }
}

// Filtrar Pokémon por região
filtroRegiao.addEventListener("change", () => {
  const regionUrl = filtroRegiao.value;
  if (regionUrl === "todas") {
    exibirPokemons(todosPokemons);
  } else {
    carregarPokemonsPorRegiao(regionUrl);
  }
});

// Carregar todos os Pokémon inicialmente
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMONS}`)
  .then(response => response.json())
  .then(data => {
    todosPokemons = data.results.map((pokemon, index) => ({
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${index + 1}/`
    }));
    exibirPokemons(todosPokemons);
    carregarRegioes();
  });

// Exibir Pokémon na página
function exibirPokemons(pokemons) {
  listaWrapper.innerHTML = "";
  pokemons.forEach(pokemon => {
    const pokemonID = pokemon.url.split("/")[6];
    const listaItem = document.createElement("div");
    listaItem.className = "lista-item";
    listaItem.innerHTML = `
      <div class="numero-wrap">
        <p class="fonte-legenda">#${pokemonID}</p>
      </div>
      <div class="img-wrap">
        <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" 
        alt="${pokemon.name}" />
      </div>
      <div class="nome-wrap">
        <p class="body3-fonts">${pokemon.name}</p>
      </div>
    `;
    listaItem.addEventListener("click", () => {
      window.location.href = `./detalhe.html?id=${pokemonID}`;
    });
    listaWrapper.appendChild(listaItem);
  });
}

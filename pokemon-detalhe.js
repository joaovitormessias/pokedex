let pokemonAtualId = null;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 500;
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonID = urlParams.get("id");

  if (!pokemonID || isNaN(pokemonID)) {
    window.location.href = "./index.html";
    return;
  }

  const id = parseInt(pokemonID, 10);
  if (id < 1 || id > MAX_POKEMONS) {
    window.location.href = "./index.html";
    return;
  }

  pokemonAtualId = id;
  carregarPokemon(id);
});

async function carregarPokemon(id) {
  try {
    const [pokemon, pokemonEspecie] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    if (pokemonAtualId === id) {
      exibirDetalhesPokemon(pokemon);

      const descricaoElemento = document.querySelector(".descricao-pokemon");
      const descricao = getDescricaoEmPortugues(pokemonEspecie);
      if (descricaoElemento) {
        descricaoElemento.textContent =
          descricao || "Descrição não disponível.";
      }
      const[setaEsquerda,setaDireita] = ["#setaEsquerda","#setaDireita"].map((sel) => document.querySelector(sel)
      ); 
      setaEsquerda.removeEventListener("click", navegacaoPokemon); 
      setaDireita.removeEventListener("click", navegacaoPokemon);
      
      if (id !== 1) {
        setaEsquerda.addEventListener("click", () => {
          navegacaoPokemon(id - 1);
        });
      }
      if (id !== 151) {
        setaDireita.addEventListener("click", () => {
          navegacaoPokemon(id + 1);
        });
      }

      window.history.pushState({}, "", `./detalhe.html?id=${id}`);
    }
    return true;
  } catch (error) {
    console.error("Erro ao buscar dados do Pokémon:", error);
    return false;
  }
}

async function navegacaoPokemon(id) {
  pokemonAtualId = id;
  await carregarPokemon(id);
}
const tipoCores = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
};

function definirEstiloElementos(elementos, propriedade, valor) {
  elementos.forEach((elemento) => {
    elemento.style[propriedade] = valor;
  });
}

function rgbaDeHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

function definirCorDeFundo(pokemon) {
  const tipoPrincipal = pokemon.types[0].type.name;
  const cor = tipoCores[tipoPrincipal];

  if (!cor) {
    console.warn(`Cor não definida para o tipo: ${tipoPrincipal}`);
    return;
  }

  const detalheMain = document.querySelector(".detalhe-main");

  if (detalheMain && cor) {
    detalheMain.style.backgroundColor = cor;
  }

  definirEstiloElementos([detalheMain], "backgroundColor", cor);
  definirEstiloElementos([detalheMain], "borderColor", cor);

  definirEstiloElementos(
    document.querySelectorAll(".poder-wrapper > p"),
    "backgroundColor",
    cor
  );

  definirEstiloElementos(
    document.querySelectorAll(".status-wrap p.status"),
    "color",
    cor
  );

  definirEstiloElementos(
    document.querySelectorAll(".status-wrap .barra-progresso"),
    "color",
    cor
  );

  const rgbaCor = rgbaDeHex(cor);
  const estiloTag = document.createElement("style");
  estiloTag.innerHTML = `
    .status-wrap .barra-progresso::-webkit-progress-bar {
        background-color: rgba(${rgbaCor}, 0.5);
    }
    .status-wrap .barra-progresso::-webkit-progress-value {
        background-color: ${cor};
    }
  `;
  document.head.appendChild(estiloTag);
}

function primeiraLetraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function criarEAdicionarElemento(pai, tag, opcoes = {}) {
  const elemento = document.createElement(tag);
  Object.keys(opcoes).forEach((key) => {
    elemento[key] = opcoes[key];
  });
  pai.appendChild(elemento);
  return elemento;
}

function exibirDetalhesPokemon(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const nomeMaiusculo = primeiraLetraMaiuscula(name);

  document.querySelector("title").textContent = nomeMaiusculo;

  const detalheElementoMain = document.querySelector(".detalhe-main");
  detalheElementoMain.classList.add(name.toLowerCase());

  document.querySelector(".nome-wrap .nome").textContent = nomeMaiusculo;

  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imagem = document.querySelector(".detalhe-img-wrapper img");
  imagem.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imagem.alt = name;

  const tipoWrapper = document.querySelector(".poder-wrapper");
  tipoWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    const tipoElemento = document.createElement("p");
    tipoElemento.className = `body3-fonts tipo ${type.name}`;
    tipoElemento.textContent = type.name;
    tipoWrapper.appendChild(tipoElemento);
  });

  document.querySelector(".peso").textContent = `${weight / 10}kg`;
  document.querySelector(".altura").textContent = `${height / 10}m`;

  const habilidadesWrapper = document.querySelector(".movimentacao");
  habilidadesWrapper.innerHTML = "";
  abilities.forEach(({ ability }) => {
    const habilidadeElemento = document.createElement("p");
    habilidadeElemento.className = "body3-fonts";
    habilidadeElemento.textContent = ability.name;
    habilidadesWrapper.appendChild(habilidadeElemento);
  });

  const statusWrapper = document.querySelector(".status-wrapper");
  statusWrapper.innerHTML = "";

  const statusMapeamentoNome = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statusDiv = document.createElement("div");
    statusDiv.className = "status-wrap";

    const nomeStatus = document.createElement("p");
    nomeStatus.className = "body3-fonts status";
    nomeStatus.textContent = statusMapeamentoNome[stat.name] || stat.name;
    statusDiv.appendChild(nomeStatus);

    const valorStatus = document.createElement("p");
    valorStatus.className = "body3-fonts";
    valorStatus.textContent = String(base_stat).padStart(3, "0");
    statusDiv.appendChild(valorStatus);

    const barraProgresso = document.createElement("progress");
    barraProgresso.className = "barra-progresso";
    barraProgresso.value = base_stat;
    barraProgresso.max = 100;
    statusDiv.appendChild(barraProgresso);

    statusWrapper.appendChild(statusDiv);
  });

  definirCorDeFundo(pokemon);
}

function getDescricaoEmPortugues(pokemonEspecie) {
  for (let entry of pokemonEspecie.flavor_text_entries) {
    if (entry.language.name === "pt-BR") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}

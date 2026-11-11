// busca.js - Versão traduzida de search.js
const entradaBusca = document.querySelector("#entrada-busca");
const iconeFechar = document.querySelector("#icone-busca-fechar");
const ordenarWrapper = document.querySelector(".ordenar-wrapper");
entradaBusca.addEventListener("input", () => {
  tratarMudancaEntrada(entradaBusca);
});
iconeFechar.addEventListener("click", tratarCliqueFecharBusca);
ordenarWrapper.addEventListener("click", tratarCliqueOrdenar);

function tratarMudancaEntrada(entradaBusca) {
  const valorEntrada = entradaBusca.value;
  filtrarPokemons();

  if (valorEntrada !== "") {
    document
      .querySelector("#icone-busca-fechar")
      .classList.add("icone-busca-fechar-visivel");
  } else {
    document
      .querySelector("#icone-busca-fechar")
      .classList.remove("icone-busca-fechar-visivel");
  }
}

function tratarCliqueFecharBusca() {
  document.querySelector("#entrada-busca").value = "";
  filtrarPokemons();
  document
    .querySelector("#icone-busca-fechar")
    .classList.remove("icone-busca-fechar-visivel");
}

function tratarCliqueOrdenar() {
  document
    .querySelector(".filtro-wrapper")
    .classList.toggle("filtro-wrapper-aberto");
  document.querySelector("body").classList.toggle("filtro-wrapper-overlay");
}

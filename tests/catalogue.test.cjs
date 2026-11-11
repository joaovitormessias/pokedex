const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function catalogue() {
  const elements = new Map();
  const context = vm.createContext({console, window: {}, document: {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {value: '', checked: false, style: {}, addEventListener() {}, appendChild() {}});
      return elements.get(selector);
    }, createElement() { return {addEventListener() {}}; }
  }, fetch: () => new Promise(() => {})});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../pokemon.js'), 'utf8'), context);
  vm.runInContext('exibirPokemons = items => { globalThis.rendered = items; }', context);
  return {context, elements};
}
test('search uses the visible catalogue and exact national IDs', () => {
  const {context, elements} = catalogue();
  vm.runInContext(`pokemonsVisiveis = [{name:'chikorita',url:'https://pokeapi.co/api/v2/pokemon/152/'}]`, context);
  elements.get('#entrada-busca').value = 'Chiko';
  vm.runInContext('filtrarPokemons()', context);
  assert.equal(context.rendered.length, 1);
  elements.get('#numero').checked = true;
  elements.get('#entrada-busca').value = '15';
  vm.runInContext('filtrarPokemons()', context);
  assert.equal(context.rendered.length, 0);
  assert.equal(elements.get('#mensagem-nao-encontrado').style.display, 'block');
  elements.get('#entrada-busca').value = '152';
  vm.runInContext('filtrarPokemons()', context);
  assert.equal(context.rendered.length, 1);
});
test('regional entry number does not replace the national species ID', async () => {
  const {context, elements} = catalogue();
  elements.get('#regiao').value = 'region';
  context.fetch = async url => ({json: async () => url === 'region' ? {pokedexes:[{url:'dex'}]} : {pokemon_entries:[{entry_number:1,pokemon_species:{name:'chikorita',url:'https://pokeapi.co/api/v2/pokemon-species/152/'}}]}});
  await vm.runInContext('carregarPokemonsPorRegiao("region")', context);
  assert.equal(context.rendered[0].url, 'https://pokeapi.co/api/v2/pokemon/152/');
  elements.get('#regiao').value = 'todas';
  context.rendered = [];
  await vm.runInContext('carregarPokemonsPorRegiao("region")', context);
  assert.equal(context.rendered.length, 0);
});

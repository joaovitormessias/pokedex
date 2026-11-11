# Pokédex

**Explore Pokémon with a lightweight browser application built without a frontend framework.**

An academic project using HTML, CSS, and JavaScript to fetch PokéAPI data, display cards, filter by name/number and region, and inspect species details.

![Application screenshot](https://github.com/user-attachments/assets/37cab9d5-79ac-4bf7-967a-dad14b8efe3f)

## What to explore

| Capability | Implementation |
| --- | --- |
| Initial catalogue | First 500 Pokémon from the API |
| Search | Name substring or exact national number within the selected list |
| Regional catalogue | First Pokédex associated with the selected region; species URLs supply national IDs |
| Details | Types, height, weight, abilities, base stats, and available description |
| Navigation | Previous/next detail handlers are replaced, not accumulated |

## Run locally

```bash
git clone https://github.com/joaovitormessias/pokedex.git
cd pokedex
python -m http.server 8000
```

Open http://localhost:8000. No npm install or API key is required. Internet access is needed for PokéAPI and sprite images. The interface remains in Portuguese.

## Code walkthrough

- [pokemon.js](pokemon.js): catalogue retrieval, regional mapping, filtering, and rendering.
- [search.js](search.js): search controls and filter-menu interaction; listeners are registered once.
- [pokemon-detalhe.js](pokemon-detalhe.js): parallel detail/species requests and detail presentation.
- [style.css](style.css): responsive presentation.

The region-local `entry_number` is not a national Pokémon ID. Resolving the ID from the species URL prevents showing the wrong image/detail for regions beyond Kanto.

## Verify

```bash
node --check pokemon.js
node --check search.js
node --check pokemon-detalhe.js
node --test tests/catalogue.test.cjs
```

The catalogue regression test uses a mocked DOM and API responses. Browser layout, live API availability, and mobile behavior still require manual verification.

Manual walkthrough: search by name; switch to number search; clear the field; select a non-Kanto region; open a card; navigate several times and verify one click changes one entry.

## Limits

The initial list is capped at 500. Regional lists use the first Pokédex returned by the service. Not every sprite or Portuguese description is available. Detail requests beyond available IDs can fail; offline/error UX, pagination, accessibility, and browser history synchronization remain improvement areas.

[MIT license](LICENSE) · [Maintainer](https://github.com/joaovitormessias)

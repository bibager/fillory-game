# Fillory - A Magicians RPG

## Project Overview
A browser-based RPG inspired by the TV series "The Magicians". Players create a character at Brakebills University, choose a magical discipline, learn spells, explore locations, and eventually travel to Fillory to face The Beast.

## Hosting & Infrastructure
- **Live URL**: https://fillory.bibager.com
- **Platform**: DigitalOcean App Platform (static site)
- **GitHub Repo**: https://github.com/bibager/fillory-game
- **Branch**: `main` (auto-deploys on push)
- **Homepage link**: Listed on https://bibager.com

## Tech Stack
- Pure HTML/CSS/JavaScript (no build step, no framework)
- Google Fonts: Cinzel (headings), Inter (body)
- CSS custom properties for theming
- LocalStorage for save/load

## File Structure
```
fillory-game/
├── index.html      # Main HTML shell with all screens
├── style.css       # Full game styling (dark RPG theme)
├── data.js         # Game data: locations, spells, enemies, quests, items, NPCs
├── game.js         # Game engine: screens, combat, inventory, save/load
└── CLAUDE.md       # This file
```

## Game Architecture

### Screens
- **Title Screen** - Start new game or continue
- **Character Creation** - Name + discipline selection (Physical, Knowledge, Nature, Illusion)
- **Game Screen** - Main gameplay with narrative log, action panel, and tabs
- **Combat Screen** - Turn-based combat with spells and items

### Core Systems
- **Narrative Log**: Scrolling text-based story display with typed entries
- **Turn-based Combat**: Player casts spells, enemy attacks, with shields/buffs/dodge
- **Spell System**: Discipline-specific spells unlocked by level and quests
- **Quest System**: Multi-step quests with XP/gold/spell rewards
- **Exploration Events**: Random events when exploring locations
- **Save/Load**: LocalStorage-based persistence

### Locations (progression path)
1. Brakebills (Entrance, Lecture Hall, Maze, Library)
2. The Physical Kids' Cottage
3. The Neitherlands (unlocks at Lv.3)
4. Fillory - Darkling Woods
5. Fillory - Castle Whitespire (boss fight at Lv.5)

### Disciplines & Starting Spells
- **Physical**: Telekinetic Push (+3 Power, +1 Defense)
- **Knowledge**: Arcane Bolt (+3 Intellect, +1 Power)
- **Nature**: Mending Light (+3 Spirit, +1 Defense)
- **Illusion**: Mirror Image (+2 Intellect, +2 Spirit)

## Development Notes
- All game data is in `data.js` - add new content there
- Game logic is in `game.js` under the `Game` object
- To add a new location: add to `LOCATIONS` in data.js, add actions
- To add a new spell: add to `SPELLS` in data.js, assign to a discipline
- To add a new enemy: add to `ENEMIES` in data.js, reference in location actions
- To add a new quest: add to `QUESTS` in data.js, add progress triggers in game.js

## Future Ideas
- Sound effects and music
- More Fillory locations (Ember's Tomb, the Muntjac)
- Multiplayer/leaderboard
- Character portraits/pixel art
- Hedge witch faction storyline
- Alice's niffin arc questline
- Crafting system for magical items

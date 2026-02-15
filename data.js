// ============================================================
// Fillory RPG - Game Data
// All locations, spells, enemies, items, and quests
// ============================================================

const DISCIPLINES = {
    physical: {
        name: 'Physical',
        icon: '\u26A1',
        stats: { power: 3, intellect: 0, spirit: 0, defense: 1 },
        startSpell: 'telekinetic_push'
    },
    knowledge: {
        name: 'Knowledge',
        icon: '\uD83D\uDCDA',
        stats: { power: 1, intellect: 3, spirit: 0, defense: 0 },
        startSpell: 'arcane_bolt'
    },
    nature: {
        name: 'Nature',
        icon: '\uD83C\uDF3F',
        stats: { power: 0, intellect: 0, spirit: 3, defense: 1 },
        startSpell: 'mending_light'
    },
    illusion: {
        name: 'Illusion',
        icon: '\u2728',
        stats: { power: 0, intellect: 2, spirit: 2, defense: 0 },
        startSpell: 'mirror_image'
    }
};

const SPELLS = {
    // Physical spells
    telekinetic_push: {
        name: 'Telekinetic Push',
        description: 'Hurl an enemy backward with raw force.',
        manaCost: 8,
        damage: [12, 18],
        type: 'attack',
        discipline: 'physical'
    },
    force_shield: {
        name: 'Force Shield',
        description: 'Create a barrier that absorbs damage.',
        manaCost: 12,
        shield: [10, 16],
        type: 'defense',
        discipline: 'physical'
    },
    battle_magic: {
        name: 'Battle Magic',
        description: 'Channel devastating offensive power.',
        manaCost: 20,
        damage: [25, 40],
        type: 'attack',
        discipline: 'physical',
        level: 3
    },

    // Knowledge spells
    arcane_bolt: {
        name: 'Arcane Bolt',
        description: 'A focused beam of pure magical energy.',
        manaCost: 10,
        damage: [14, 20],
        type: 'attack',
        discipline: 'knowledge'
    },
    analyze_weakness: {
        name: 'Analyze Weakness',
        description: 'Study an enemy to increase your next attack.',
        manaCost: 8,
        buff: { power: 5, duration: 2 },
        type: 'buff',
        discipline: 'knowledge'
    },
    meta_composition: {
        name: 'Meta-Composition',
        description: 'Rewrite the rules of a spell for massive damage.',
        manaCost: 25,
        damage: [30, 50],
        type: 'attack',
        discipline: 'knowledge',
        level: 3
    },

    // Nature spells
    mending_light: {
        name: 'Mending Light',
        description: 'Restore health with natural energy.',
        manaCost: 10,
        heal: [15, 22],
        type: 'heal',
        discipline: 'nature'
    },
    thornwall: {
        name: 'Thornwall',
        description: 'Summon thorns that damage attackers.',
        manaCost: 12,
        damage: [8, 14],
        shield: [6, 10],
        type: 'attack',
        discipline: 'nature'
    },
    renewal: {
        name: 'Renewal',
        description: 'A powerful healing surge from the earth.',
        manaCost: 22,
        heal: [35, 50],
        type: 'heal',
        discipline: 'nature',
        level: 3
    },

    // Illusion spells
    mirror_image: {
        name: 'Mirror Image',
        description: 'Create a copy of yourself to confuse enemies.',
        manaCost: 8,
        dodge: 0.4,
        type: 'defense',
        discipline: 'illusion'
    },
    psychic_blast: {
        name: 'Psychic Blast',
        description: 'Assault the mind with psychic energy.',
        manaCost: 12,
        damage: [10, 22],
        type: 'attack',
        discipline: 'illusion'
    },
    glamour: {
        name: 'Glamour',
        description: 'A powerful illusion that stuns and damages.',
        manaCost: 22,
        damage: [20, 35],
        stun: true,
        type: 'attack',
        discipline: 'illusion',
        level: 3
    },

    // Universal
    basic_attack: {
        name: 'Basic Attack',
        description: 'A simple magical strike.',
        manaCost: 0,
        damage: [5, 10],
        type: 'attack',
        discipline: 'universal'
    },
    rest: {
        name: 'Rest',
        description: 'Take a moment to recover mana.',
        manaCost: 0,
        manaRestore: [8, 15],
        type: 'utility',
        discipline: 'universal'
    }
};

const LOCATIONS = {
    brakebills_entrance: {
        name: 'Brakebills - Main Entrance',
        description: 'The grand entrance to Brakebills University. Ivy-covered walls rise around a manicured courtyard. Students hurry between buildings, fingers tracing practice gestures in the air.',
        actions: [
            { label: '\uD83C\uDFDB\uFE0F Lecture Hall', action: 'travel', target: 'brakebills_lecture' },
            { label: '\uD83C\uDF33 The Maze', action: 'travel', target: 'brakebills_maze' },
            { label: '\uD83D\uDCDA Library', action: 'travel', target: 'brakebills_library' },
            { label: '\uD83C\uDF19 The Cottage', action: 'travel', target: 'the_cottage' }
        ]
    },
    brakebills_lecture: {
        name: 'Brakebills - Lecture Hall',
        description: 'Rows of old wooden desks face a chalkboard covered in intricate spell diagrams. The air smells of chalk dust and old magic. Professor Sunderland looks up from her notes.',
        actions: [
            { label: '\uD83D\uDCDA Study Spells', action: 'study', xp: 15 },
            { label: '\uD83E\uDD1D Talk to Professor', action: 'talk', npc: 'sunderland' },
            { label: '\u2B05\uFE0F Back to Entrance', action: 'travel', target: 'brakebills_entrance' }
        ]
    },
    brakebills_maze: {
        name: 'Brakebills - The Maze',
        description: 'Tall hedges form a twisting labyrinth behind the main buildings. Strange sounds echo from deeper within. This is where students test their practical magic.',
        actions: [
            { label: '\u2694\uFE0F Practice Combat', action: 'combat', enemy: 'hedge_golem' },
            { label: '\uD83D\uDD0D Explore Deeper', action: 'explore', event: 'maze_event' },
            { label: '\u2B05\uFE0F Back to Entrance', action: 'travel', target: 'brakebills_entrance' }
        ]
    },
    brakebills_library: {
        name: 'Brakebills - Library',
        description: 'Shelves stretch impossibly high, filled with books in languages that predate human civilization. The librarian watches you with suspicious eyes.',
        actions: [
            { label: '\uD83D\uDCD6 Research Magic', action: 'study', xp: 20 },
            { label: '\uD83D\uDD0E Search Restricted Section', action: 'explore', event: 'library_event', level: 2 },
            { label: '\u2B05\uFE0F Back to Entrance', action: 'travel', target: 'brakebills_entrance' }
        ]
    },
    the_cottage: {
        name: 'The Physical Kids\' Cottage',
        description: 'A cozy, slightly run-down cottage on the edge of campus. This is where the Physical Kids hang out. There\'s always someone here with a drink and a story.',
        actions: [
            { label: '\uD83C\uDF7A Rest & Recover', action: 'rest' },
            { label: '\uD83D\uDDE3\uFE0F Talk to Students', action: 'talk', npc: 'students' },
            { label: '\uD83D\uDEAA The Button...', action: 'travel', target: 'neitherlands_fountain', level: 3, label_locked: '\uD83D\uDD12 The Button... (Lv.3)' },
            { label: '\u2B05\uFE0F Back to Entrance', action: 'travel', target: 'brakebills_entrance' }
        ]
    },
    neitherlands_fountain: {
        name: 'The Neitherlands - Fountain Plaza',
        description: 'An endless city of fountains stretches in every direction. Each pool is a portal to a different world. The air is still and timeless. You can feel the weight of infinite possibility.',
        actions: [
            { label: '\uD83C\uDF0A Pool to Fillory', action: 'travel', target: 'fillory_entrance' },
            { label: '\uD83D\uDD0D Explore the City', action: 'explore', event: 'neitherlands_event' },
            { label: '\uD83C\uDF00 Return to Brakebills', action: 'travel', target: 'the_cottage' }
        ]
    },
    fillory_entrance: {
        name: 'Fillory - The Darkling Woods',
        description: 'You step through and the air changes instantly. It smells of pine and something sweeter, more alive. The trees here seem to watch you. Welcome to Fillory.',
        actions: [
            { label: '\uD83C\uDFF0 Castle Whitespire', action: 'travel', target: 'fillory_castle', level: 4 },
            { label: '\u2694\uFE0F Explore the Woods', action: 'combat', enemy: 'fillory_beast_minor' },
            { label: '\uD83E\uDDD9 Talking Animals', action: 'talk', npc: 'talking_animals' },
            { label: '\uD83C\uDF00 Return to Neitherlands', action: 'travel', target: 'neitherlands_fountain' }
        ]
    },
    fillory_castle: {
        name: 'Fillory - Castle Whitespire',
        description: 'The shining towers of Castle Whitespire rise above the forest canopy. This is the seat of Fillory\'s power. Something dark stirs in its halls.',
        actions: [
            { label: '\uD83D\uDC51 Throne Room', action: 'explore', event: 'throne_event' },
            { label: '\u2694\uFE0F Face The Beast', action: 'combat', enemy: 'the_beast', level: 5 },
            { label: '\u2B05\uFE0F Back to the Woods', action: 'travel', target: 'fillory_entrance' }
        ]
    }
};

const ENEMIES = {
    hedge_golem: {
        name: 'Hedge Golem',
        sprite: '\uD83E\uDDCC',
        hp: 30,
        damage: [4, 8],
        xp: 20,
        gold: 5,
        description: 'A golem made of twisted hedge branches, animated by residual magic.'
    },
    rogue_hedgewitch: {
        name: 'Rogue Hedge Witch',
        sprite: '\uD83E\uDDD9',
        hp: 40,
        damage: [6, 12],
        xp: 30,
        gold: 10,
        description: 'A self-taught magician with unpredictable, raw power.'
    },
    fillory_beast_minor: {
        name: 'Shadow Fox',
        sprite: '\uD83E\uDD8A',
        hp: 50,
        damage: [8, 14],
        xp: 40,
        gold: 15,
        description: 'A corrupted creature of Fillory, wreathed in shadow.'
    },
    neitherlands_guardian: {
        name: 'Neitherlands Guardian',
        sprite: '\uD83D\uDC7E',
        hp: 65,
        damage: [10, 18],
        xp: 55,
        gold: 20,
        description: 'An ancient construct that guards the fountain passages.'
    },
    the_beast: {
        name: 'The Beast',
        sprite: '\uD83D\uDC1B',
        hp: 150,
        damage: [15, 30],
        xp: 200,
        gold: 100,
        description: 'Martin Chatwin, consumed by Fillory\'s magic. Moths swirl around the void where his face should be.',
        boss: true
    }
};

const ITEMS = {
    mana_potion: {
        name: 'Mana Elixir',
        description: 'Restores 25 mana.',
        type: 'consumable',
        effect: { mana: 25 },
        price: 10
    },
    health_potion: {
        name: 'Healing Draught',
        description: 'Restores 30 HP.',
        type: 'consumable',
        effect: { hp: 30 },
        price: 10
    },
    power_crystal: {
        name: 'Power Crystal',
        description: 'Permanently increases Power by 1.',
        type: 'permanent',
        effect: { power: 1 },
        price: 50
    },
    fillory_leaf: {
        name: 'Fillory Leaf',
        description: 'A shimmering leaf. Restores 20 HP and 15 mana.',
        type: 'consumable',
        effect: { hp: 20, mana: 15 },
        price: 20
    }
};

const QUESTS = {
    welcome: {
        name: 'Welcome to Brakebills',
        description: 'Attend a lecture and practice in the maze to prove yourself.',
        steps: [
            { description: 'Study at the Lecture Hall', type: 'study', count: 1 },
            { description: 'Win a combat in the Maze', type: 'combat_win', count: 1 }
        ],
        rewards: { xp: 50, gold: 15, spell: 'force_shield' }
    },
    library_secrets: {
        name: 'Library Secrets',
        description: 'Reach Level 2 and investigate the restricted section.',
        steps: [
            { description: 'Reach Level 2', type: 'level', count: 2 },
            { description: 'Search the Restricted Section', type: 'explore_library', count: 1 }
        ],
        rewards: { xp: 80, gold: 25, spell: 'analyze_weakness' }
    },
    journey_beyond: {
        name: 'Journey to the Neitherlands',
        description: 'Find the button and travel beyond Brakebills.',
        steps: [
            { description: 'Reach Level 3', type: 'level', count: 3 },
            { description: 'Travel to the Neitherlands', type: 'visit_neitherlands', count: 1 }
        ],
        rewards: { xp: 120, gold: 40, spell: 'psychic_blast' }
    },
    fillory_calling: {
        name: 'Fillory Calling',
        description: 'Enter the magical land of Fillory.',
        steps: [
            { description: 'Travel through the fountain to Fillory', type: 'visit_fillory', count: 1 },
            { description: 'Defeat a Shadow Fox', type: 'defeat_shadow_fox', count: 1 }
        ],
        rewards: { xp: 150, gold: 50, spell: 'thornwall' }
    },
    defeat_beast: {
        name: 'The Beast',
        description: 'Confront the darkness in Castle Whitespire.',
        steps: [
            { description: 'Reach Level 5', type: 'level', count: 5 },
            { description: 'Defeat The Beast', type: 'defeat_beast', count: 1 }
        ],
        rewards: { xp: 500, gold: 200 }
    }
};

const EVENTS = {
    maze_event: [
        { text: 'You find a hidden alcove behind the hedge. Inside is a small pouch of gold.', reward: { gold: 8 } },
        { text: 'A magical trap triggers! You dodge, but the feedback singes you.', penalty: { hp: -10 } },
        { text: 'You discover old spell notes carved into a stone. You feel your understanding deepen.', reward: { xp: 15 } },
        { text: 'A fellow student challenges you to a quick duel!', combat: 'rogue_hedgewitch' }
    ],
    library_event: [
        { text: 'You find a book on advanced spell theory. The knowledge flows into you.', reward: { xp: 30 }, questProgress: { type: 'explore_library' } },
        { text: 'The restricted section yields an ancient scroll about Fillory. Fascinating.', reward: { xp: 25 }, questProgress: { type: 'explore_library' } },
        { text: 'A book bites you. Yes, literally bites you. Library magic is no joke.', penalty: { hp: -5 }, reward: { xp: 10 }, questProgress: { type: 'explore_library' } }
    ],
    neitherlands_event: [
        { text: 'You find a forgotten fountain with still-active portal magic. The water hums.', reward: { mana: 20 } },
        { text: 'A guardian emerges from between the fountains!', combat: 'neitherlands_guardian' },
        { text: 'You discover ancient markings that describe the nature of the multiverse.', reward: { xp: 40 } }
    ],
    throne_event: [
        { text: 'The throne room is empty but you sense great power here. The crowns of Fillory glow softly.', reward: { xp: 50 } },
        { text: 'You find a stash of Fillorian remedies near the throne.', reward: { item: 'fillory_leaf', quantity: 3 } },
        { text: 'A vision of the Beast flashes before you. You steel your resolve.', reward: { xp: 30 } }
    ]
};

const NPC_DIALOGUE = {
    sunderland: [
        'Professor Sunderland adjusts her glasses. "Magic is about precision. One wrong finger position and you\'re casting a completely different spell... or no spell at all."',
        '"The Circumstances matter more than most students realize. Time of day, phase of the moon, your emotional state - they all affect your casting."',
        '"I\'ve heard rumors of students trying to reach other worlds. I\'d advise extreme caution."'
    ],
    students: [
        '"Did you hear? Someone found the button. THE button. The one from the Fillory books."',
        '"I swear the maze rearranged itself last night. Nearly got lost going for a midnight walk."',
        '"Knowledge students think they\'re so smart. But when things go wrong, you want a Physical Kid at your back."',
        '"Fillory is real. I know it sounds crazy, but... it\'s real."'
    ],
    talking_animals: [
        'A distinguished-looking bear in a waistcoat approaches. "Welcome, Child of Earth. Fillory has been waiting for you."',
        'A bright-eyed fox regards you curiously. "The trees whisper of a darkness in Castle Whitespire. Tread carefully."',
        'A rabbit with spectacles hops by. "The old magic is fading. We need those who can wield new magic to help us."'
    ]
};

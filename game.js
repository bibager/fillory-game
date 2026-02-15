// ============================================================
// Fillory RPG - Game Engine
// ============================================================

const Game = {
    player: null,
    currentLocation: null,
    currentTab: 'explore',
    combatState: null,
    selectedDiscipline: null,

    // ---- Screen Management ----
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById('screen-' + screenId);
        if (screen) screen.classList.add('active');
    },

    // ---- Character Creation ----
    selectDiscipline(el) {
        document.querySelectorAll('.discipline-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        this.selectedDiscipline = el.dataset.discipline;
        this.updateCreateButton();
    },

    updateCreateButton() {
        const name = document.getElementById('player-name').value.trim();
        document.getElementById('btn-create').disabled = !(name && this.selectedDiscipline);
    },

    createCharacter() {
        const name = document.getElementById('player-name').value.trim();
        if (!name || !this.selectedDiscipline) return;

        const disc = DISCIPLINES[this.selectedDiscipline];
        this.player = {
            name: name,
            discipline: this.selectedDiscipline,
            level: 1,
            xp: 0,
            xpToLevel: 60,
            hp: 80,
            maxHp: 80,
            mana: 50,
            maxMana: 50,
            gold: 10,
            stats: {
                power: 5 + disc.stats.power,
                intellect: 5 + disc.stats.intellect,
                spirit: 5 + disc.stats.spirit,
                defense: 3 + disc.stats.defense
            },
            spells: ['basic_attack', 'rest', disc.startSpell],
            inventory: [
                { id: 'health_potion', quantity: 2 },
                { id: 'mana_potion', quantity: 2 }
            ],
            quests: {
                welcome: { active: true, progress: [0, 0] },
                library_secrets: { active: true, progress: [0, 0] },
                journey_beyond: { active: true, progress: [0, 0] },
                fillory_calling: { active: true, progress: [0, 0] },
                defeat_beast: { active: true, progress: [0, 0] }
            },
            flags: {},
            shield: 0,
            buff: null
        };

        this.currentLocation = 'brakebills_entrance';
        this.showScreen('game');
        this.clearNarrative();
        this.addNarrative('story', `Welcome to Brakebills University, ${name}. You\'ve been accepted into the ${disc.name} discipline. Your journey into magic begins now.`);
        this.addNarrative('system', `You learned: ${SPELLS[disc.startSpell].name}`);
        this.updateUI();
    },

    // ---- UI Updates ----
    updateUI() {
        if (!this.player) return;
        const p = this.player;

        // Top bar
        document.querySelector('.player-name-display').textContent = p.name;
        document.querySelector('.player-level').textContent = `Lv. ${p.level} ${DISCIPLINES[p.discipline].icon}`;
        document.querySelector('.location-display').textContent = LOCATIONS[this.currentLocation].name;

        // Bars
        this.updateBar('hp', p.hp, p.maxHp);
        this.updateBar('mana', p.mana, p.maxMana);
        this.updateBar('xp', p.xp, p.xpToLevel);

        // Tab content
        this.renderTab();
    },

    updateBar(type, current, max) {
        const pct = Math.max(0, Math.min(100, (current / max) * 100));
        document.getElementById('bar-' + type).style.width = pct + '%';
        document.getElementById('text-' + type).textContent = `${Math.floor(current)}/${max}`;
    },

    // ---- Narrative ----
    addNarrative(type, text) {
        const log = document.getElementById('narrative-log');
        const entry = document.createElement('div');
        entry.className = `narrative-entry ${type}`;
        entry.textContent = text;
        log.appendChild(entry);
        // Scroll to bottom
        const panel = document.querySelector('.narrative-panel');
        panel.scrollTop = panel.scrollHeight;
    },

    clearNarrative() {
        document.getElementById('narrative-log').innerHTML = '';
    },

    // ---- Tabs ----
    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tabName);
        });
        this.renderTab();
    },

    renderTab() {
        switch (this.currentTab) {
            case 'explore': this.renderExploreTab(); break;
            case 'spells': this.renderSpellsTab(); break;
            case 'inventory': this.renderInventoryTab(); break;
            case 'character': this.renderCharacterTab(); break;
        }
    },

    renderExploreTab() {
        const loc = LOCATIONS[this.currentLocation];
        const narrativeLog = document.getElementById('narrative-log');

        // Show location description if we haven't already
        const lastEntry = narrativeLog.lastElementChild;
        if (!lastEntry || !lastEntry.textContent.includes(loc.description)) {
            this.addNarrative('story', loc.description);
        }

        const panel = document.getElementById('action-panel');
        let html = '<div class="action-buttons">';
        for (const action of loc.actions) {
            const locked = action.level && this.player.level < action.level;
            const label = locked ? (action.label_locked || `\uD83D\uDD12 ${action.label} (Lv.${action.level})`) : action.label;
            const cls = locked ? 'action-btn disabled' : 'action-btn';
            html += `<button class="${cls}" onclick="Game.doAction(${JSON.stringify(action).replace(/"/g, '&quot;')})">${label}</button>`;
        }
        html += '</div>';
        panel.innerHTML = html;
    },

    renderSpellsTab() {
        const panel = document.getElementById('action-panel');
        let html = '<div class="spell-list">';
        for (const spellId of this.player.spells) {
            const spell = SPELLS[spellId];
            html += `<div class="spell-entry">
                <div class="spell-info">
                    <h4>${spell.name}</h4>
                    <p>${spell.description}</p>
                </div>
                <span class="spell-cost">${spell.manaCost > 0 ? spell.manaCost + ' mana' : 'Free'}</span>
            </div>`;
        }
        html += '</div>';
        panel.innerHTML = html;

        // Replace narrative with spell info
        this.clearNarrative();
        this.addNarrative('system', `Known Spells (${this.player.spells.length})`);
        this.addNarrative('story', 'Your magical repertoire. Learn more spells by completing quests and studying.');
    },

    renderInventoryTab() {
        const panel = document.getElementById('action-panel');
        let html = `<div class="item-list">
            <div class="spell-entry" style="border-color: var(--gold);">
                <div class="spell-info"><h4>\uD83D\uDCB0 Gold</h4><p>Currency for the magical world.</p></div>
                <span class="spell-cost" style="color: var(--gold);">${this.player.gold}g</span>
            </div>`;
        for (const item of this.player.inventory) {
            if (item.quantity <= 0) continue;
            const data = ITEMS[item.id];
            html += `<div class="spell-entry">
                <div class="spell-info">
                    <h4>${data.name} (x${item.quantity})</h4>
                    <p>${data.description}</p>
                </div>
                <button class="btn btn-sm btn-success" onclick="Game.useItem('${item.id}')">Use</button>
            </div>`;
        }
        html += '</div>';
        panel.innerHTML = html;

        this.clearNarrative();
        this.addNarrative('system', 'Inventory');
        this.addNarrative('story', 'Your collected items and resources.');
    },

    renderCharacterTab() {
        const p = this.player;
        const disc = DISCIPLINES[p.discipline];
        const panel = document.getElementById('action-panel');
        panel.innerHTML = '';

        let html = '<div class="char-sheet">';
        html += `<h3>${p.name} - ${disc.name} ${disc.icon}</h3>`;
        html += `<div class="stat-row"><span class="stat-label">Level</span><span class="stat-value">${p.level}</span></div>`;
        html += `<div class="stat-row"><span class="stat-label">XP</span><span class="stat-value">${p.xp} / ${p.xpToLevel}</span></div>`;
        html += `<div class="stat-row"><span class="stat-label">Power</span><span class="stat-value">${p.stats.power}</span></div>`;
        html += `<div class="stat-row"><span class="stat-label">Intellect</span><span class="stat-value">${p.stats.intellect}</span></div>`;
        html += `<div class="stat-row"><span class="stat-label">Spirit</span><span class="stat-value">${p.stats.spirit}</span></div>`;
        html += `<div class="stat-row"><span class="stat-label">Defense</span><span class="stat-value">${p.stats.defense}</span></div>`;

        html += '<h3 style="margin-top:24px;">Quests</h3>';
        for (const [qId, qState] of Object.entries(p.quests)) {
            const quest = QUESTS[qId];
            const complete = this.isQuestComplete(qId);
            html += `<div class="quest-entry ${complete ? 'quest-complete' : ''}">
                <h4>${complete ? '\u2705' : '\uD83D\uDCCC'} ${quest.name}</h4>
                <p>${quest.description}</p>`;
            quest.steps.forEach((step, i) => {
                const done = qState.progress[i] >= step.count;
                html += `<p style="font-size:11px;color:${done ? 'var(--success)' : 'var(--text-dim)'};">${done ? '\u2713' : '\u25CB'} ${step.description}</p>`;
            });
            html += '</div>';
        }
        html += '</div>';

        this.clearNarrative();
        const narrativeLog = document.getElementById('narrative-log');
        narrativeLog.innerHTML = html;
    },

    // ---- Actions ----
    doAction(action) {
        switch (action.action) {
            case 'travel':
                this.travel(action.target);
                break;
            case 'study':
                this.study(action.xp || 15);
                break;
            case 'combat':
                this.startCombat(action.enemy);
                break;
            case 'explore':
                this.explore(action.event);
                break;
            case 'rest':
                this.doRest();
                break;
            case 'talk':
                this.talk(action.npc);
                break;
        }
    },

    travel(locationId) {
        this.currentLocation = locationId;
        this.switchTab('explore');
        this.clearNarrative();
        this.addNarrative('action', `You travel to ${LOCATIONS[locationId].name}.`);
        this.updateUI();

        // Quest progress tracking
        if (locationId === 'neitherlands_fountain') {
            this.advanceQuest('journey_beyond', 1);
            this.player.flags.visited_neitherlands = true;
        }
        if (locationId === 'fillory_entrance' || locationId === 'fillory_castle') {
            this.advanceQuest('fillory_calling', 0);
            this.player.flags.visited_fillory = true;
        }
    },

    study(xp) {
        this.addNarrative('action', 'You spend time studying and practicing your magic...');
        this.gainXP(xp);
        this.player.mana = Math.max(0, this.player.mana - 5);
        this.advanceQuest('welcome', 0);
        this.updateUI();
    },

    doRest() {
        const hpGain = Math.min(this.player.maxHp - this.player.hp, 30);
        const manaGain = Math.min(this.player.maxMana - this.player.mana, 20);
        this.player.hp += hpGain;
        this.player.mana += manaGain;
        this.addNarrative('reward', `You rest and recover. +${hpGain} HP, +${manaGain} Mana.`);
        this.updateUI();
    },

    talk(npc) {
        const lines = NPC_DIALOGUE[npc];
        if (!lines) return;
        const line = lines[Math.floor(Math.random() * lines.length)];
        this.addNarrative('story', line);
    },

    explore(eventKey) {
        const events = EVENTS[eventKey];
        if (!events) return;
        const event = events[Math.floor(Math.random() * events.length)];

        this.addNarrative('story', event.text);

        if (event.reward) {
            if (event.reward.xp) this.gainXP(event.reward.xp);
            if (event.reward.gold) {
                this.player.gold += event.reward.gold;
                this.addNarrative('reward', `+${event.reward.gold} gold`);
            }
            if (event.reward.mana) {
                this.player.mana = Math.min(this.player.maxMana, this.player.mana + event.reward.mana);
                this.addNarrative('reward', `+${event.reward.mana} mana`);
            }
            if (event.reward.item) {
                this.addItem(event.reward.item, event.reward.quantity || 1);
                this.addNarrative('reward', `Received ${ITEMS[event.reward.item].name} x${event.reward.quantity || 1}`);
            }
        }

        if (event.penalty) {
            if (event.penalty.hp) {
                this.player.hp = Math.max(1, this.player.hp + event.penalty.hp);
                this.addNarrative('combat', `${event.penalty.hp} HP`);
            }
        }

        if (event.questProgress) {
            this.advanceQuestByType(event.questProgress.type);
        }

        if (event.combat) {
            setTimeout(() => this.startCombat(event.combat), 800);
        }

        this.updateUI();
    },

    // ---- Combat System ----
    startCombat(enemyId) {
        const enemyData = ENEMIES[enemyId];
        if (!enemyData) return;

        this.combatState = {
            enemyId: enemyId,
            enemyHp: enemyData.hp,
            enemyMaxHp: enemyData.hp,
            turn: 'player',
            log: []
        };

        this.player.shield = 0;
        this.player.buff = null;

        this.showScreen('combat');
        document.getElementById('combat-title').textContent = enemyData.boss ? '\u2620\uFE0F BOSS FIGHT' : 'Combat';
        document.getElementById('combat-player-name').textContent = this.player.name;
        document.getElementById('combat-enemy-name').textContent = enemyData.name;
        document.getElementById('combat-enemy-sprite').textContent = enemyData.sprite;
        document.getElementById('combat-log').innerHTML = '';

        this.addCombatLog('story', enemyData.description);
        this.updateCombatUI();
        this.renderCombatActions();
    },

    updateCombatUI() {
        const p = this.player;
        const cs = this.combatState;
        const enemy = ENEMIES[cs.enemyId];

        document.getElementById('combat-player-hp').style.width = (p.hp / p.maxHp * 100) + '%';
        document.getElementById('combat-player-mana').style.width = (p.mana / p.maxMana * 100) + '%';
        document.getElementById('combat-enemy-hp').style.width = (cs.enemyHp / cs.enemyMaxHp * 100) + '%';
    },

    addCombatLog(type, text) {
        const log = document.getElementById('combat-log');
        const entry = document.createElement('div');
        entry.className = `narrative-entry ${type}`;
        entry.textContent = text;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    },

    renderCombatActions() {
        const panel = document.getElementById('combat-actions');
        let html = '';

        for (const spellId of this.player.spells) {
            const spell = SPELLS[spellId];
            const canCast = this.player.mana >= spell.manaCost;
            html += `<button class="action-btn ${canCast ? '' : 'disabled'}" onclick="Game.castSpell('${spellId}')">
                ${spell.name} ${spell.manaCost > 0 ? `(${spell.manaCost}mp)` : ''}
            </button>`;
        }

        // Items
        for (const item of this.player.inventory) {
            if (item.quantity <= 0) continue;
            const data = ITEMS[item.id];
            html += `<button class="action-btn" onclick="Game.useItemCombat('${item.id}')">${data.name} (x${item.quantity})</button>`;
        }

        html += `<button class="action-btn btn-danger" onclick="Game.fleeCombat()">Flee</button>`;
        panel.innerHTML = html;
    },

    castSpell(spellId) {
        if (this.combatState.turn !== 'player') return;
        const spell = SPELLS[spellId];
        if (this.player.mana < spell.manaCost) return;

        this.player.mana -= spell.manaCost;

        switch (spell.type) {
            case 'attack': {
                let dmg = this.rollRange(spell.damage) + Math.floor(this.player.stats.power * 0.5);
                if (this.player.buff) {
                    dmg += this.player.buff.power || 0;
                    this.player.buff.duration--;
                    if (this.player.buff.duration <= 0) this.player.buff = null;
                }
                this.combatState.enemyHp -= dmg;
                this.addCombatLog('combat', `You cast ${spell.name} for ${dmg} damage!`);
                if (spell.shield) {
                    const shieldAmt = this.rollRange(spell.shield);
                    this.player.shield += shieldAmt;
                    this.addCombatLog('action', `Thorns shield absorbs next ${shieldAmt} damage.`);
                }
                if (spell.stun) {
                    this.addCombatLog('action', 'The enemy is stunned!');
                    // Skip enemy turn
                    this.updateCombatUI();
                    this.checkCombatEnd();
                    return;
                }
                break;
            }
            case 'heal': {
                const heal = this.rollRange(spell.heal) + Math.floor(this.player.stats.spirit * 0.5);
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
                this.addCombatLog('reward', `You cast ${spell.name} and restore ${heal} HP.`);
                break;
            }
            case 'defense': {
                if (spell.shield) {
                    const shieldAmt = this.rollRange(spell.shield);
                    this.player.shield += shieldAmt;
                    this.addCombatLog('action', `${spell.name} creates a shield absorbing ${shieldAmt} damage.`);
                }
                if (spell.dodge) {
                    this.player.flags.dodgeChance = spell.dodge;
                    this.addCombatLog('action', `${spell.name} gives you a ${Math.floor(spell.dodge * 100)}% chance to dodge.`);
                }
                break;
            }
            case 'buff': {
                this.player.buff = { ...spell.buff };
                this.addCombatLog('action', `${spell.name} boosts your Power by ${spell.buff.power} for ${spell.buff.duration} turns.`);
                break;
            }
            case 'utility': {
                if (spell.manaRestore) {
                    const restore = this.rollRange(spell.manaRestore);
                    this.player.mana = Math.min(this.player.maxMana, this.player.mana + restore);
                    this.addCombatLog('action', `You rest and recover ${restore} mana.`);
                }
                break;
            }
        }

        this.updateCombatUI();
        if (!this.checkCombatEnd()) {
            this.combatState.turn = 'enemy';
            setTimeout(() => this.enemyTurn(), 600);
        }
    },

    enemyTurn() {
        const enemy = ENEMIES[this.combatState.enemyId];

        // Check dodge
        if (this.player.flags.dodgeChance && Math.random() < this.player.flags.dodgeChance) {
            this.addCombatLog('action', `${enemy.name} attacks but you dodge!`);
            delete this.player.flags.dodgeChance;
            this.combatState.turn = 'player';
            this.renderCombatActions();
            this.updateCombatUI();
            return;
        }
        delete this.player.flags.dodgeChance;

        let dmg = this.rollRange(enemy.damage);
        if (this.player.shield > 0) {
            const absorbed = Math.min(this.player.shield, dmg);
            dmg -= absorbed;
            this.player.shield -= absorbed;
            if (absorbed > 0) {
                this.addCombatLog('action', `Shield absorbs ${absorbed} damage!`);
            }
        }

        dmg = Math.max(0, dmg - Math.floor(this.player.stats.defense * 0.3));
        this.player.hp -= dmg;
        this.addCombatLog('combat', `${enemy.name} attacks for ${dmg} damage!`);

        this.updateCombatUI();
        if (!this.checkCombatEnd()) {
            this.combatState.turn = 'player';
            this.renderCombatActions();
        }
    },

    checkCombatEnd() {
        if (this.combatState.enemyHp <= 0) {
            this.combatVictory();
            return true;
        }
        if (this.player.hp <= 0) {
            this.combatDefeat();
            return true;
        }
        return false;
    },

    combatVictory() {
        const enemy = ENEMIES[this.combatState.enemyId];
        this.addCombatLog('reward', `You defeated ${enemy.name}!`);

        const panel = document.getElementById('combat-actions');
        let rewards = `+${enemy.xp} XP, +${enemy.gold} gold`;
        panel.innerHTML = `<div style="text-align:center;padding:16px;">
            <p style="color:var(--success);font-size:18px;margin-bottom:8px;">Victory!</p>
            <p style="color:var(--text-dim);margin-bottom:16px;">${rewards}</p>
            <button class="btn btn-primary" onclick="Game.endCombat(true)">Continue</button>
        </div>`;

        this.player.gold += enemy.gold;
        this.gainXP(enemy.xp);

        // Quest tracking
        this.advanceQuest('welcome', 1);
        if (this.combatState.enemyId === 'fillory_beast_minor') {
            this.advanceQuest('fillory_calling', 1);
        }
        if (this.combatState.enemyId === 'the_beast') {
            this.advanceQuestByType('defeat_beast');
        }
    },

    combatDefeat() {
        this.addCombatLog('combat', 'You have been defeated...');

        const panel = document.getElementById('combat-actions');
        panel.innerHTML = `<div style="text-align:center;padding:16px;">
            <p style="color:var(--danger);font-size:18px;margin-bottom:8px;">Defeated</p>
            <p style="color:var(--text-dim);margin-bottom:16px;">You wake up back at Brakebills, battered but alive.</p>
            <button class="btn btn-primary" onclick="Game.endCombat(false)">Continue</button>
        </div>`;
    },

    endCombat(victory) {
        if (!victory) {
            this.player.hp = Math.floor(this.player.maxHp * 0.3);
            this.player.mana = Math.floor(this.player.maxMana * 0.3);
            this.currentLocation = 'brakebills_entrance';
        }
        this.combatState = null;
        this.player.shield = 0;
        this.player.buff = null;
        this.showScreen('game');
        this.switchTab('explore');
        this.clearNarrative();
        this.updateUI();
    },

    fleeCombat() {
        if (Math.random() < 0.6) {
            this.addCombatLog('action', 'You successfully flee!');
            setTimeout(() => {
                this.combatState = null;
                this.showScreen('game');
                this.switchTab('explore');
                this.clearNarrative();
                this.addNarrative('action', 'You escaped from combat.');
                this.updateUI();
            }, 600);
        } else {
            this.addCombatLog('combat', 'You failed to escape!');
            this.combatState.turn = 'enemy';
            setTimeout(() => this.enemyTurn(), 600);
        }
    },

    useItemCombat(itemId) {
        if (this.combatState.turn !== 'player') return;
        this.useItem(itemId);
        this.updateCombatUI();
        if (!this.checkCombatEnd()) {
            this.combatState.turn = 'enemy';
            setTimeout(() => this.enemyTurn(), 600);
        }
    },

    // ---- Items ----
    useItem(itemId) {
        const invSlot = this.player.inventory.find(i => i.id === itemId);
        if (!invSlot || invSlot.quantity <= 0) return;

        const item = ITEMS[itemId];
        invSlot.quantity--;

        if (item.effect.hp) {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.effect.hp);
        }
        if (item.effect.mana) {
            this.player.mana = Math.min(this.player.maxMana, this.player.mana + item.effect.mana);
        }
        if (item.effect.power) {
            this.player.stats.power += item.effect.power;
        }

        const msg = `Used ${item.name}. ${item.description}`;
        if (this.combatState) {
            this.addCombatLog('reward', msg);
        } else {
            this.addNarrative('reward', msg);
        }

        this.updateUI();
    },

    addItem(itemId, quantity) {
        const existing = this.player.inventory.find(i => i.id === itemId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.player.inventory.push({ id: itemId, quantity: quantity });
        }
    },

    // ---- XP & Leveling ----
    gainXP(amount) {
        this.player.xp += amount;
        this.addNarrative('reward', `+${amount} XP`);

        while (this.player.xp >= this.player.xpToLevel) {
            this.player.xp -= this.player.xpToLevel;
            this.player.level++;
            this.player.xpToLevel = Math.floor(this.player.xpToLevel * 1.5);
            this.player.maxHp += 15;
            this.player.hp = this.player.maxHp;
            this.player.maxMana += 10;
            this.player.mana = this.player.maxMana;
            this.player.stats.power += 1;
            this.player.stats.intellect += 1;
            this.player.stats.spirit += 1;
            this.player.stats.defense += 1;

            this.addNarrative('reward', `\u2B50 Level Up! You are now level ${this.player.level}!`);

            // Check for new spells from leveling
            this.checkLevelSpells();

            // Quest progress for level-based quests
            this.checkLevelQuests();
        }
    },

    checkLevelSpells() {
        for (const [id, spell] of Object.entries(SPELLS)) {
            if (spell.level && spell.level <= this.player.level &&
                spell.discipline === this.player.discipline &&
                !this.player.spells.includes(id)) {
                this.player.spells.push(id);
                this.addNarrative('reward', `Learned new spell: ${spell.name}!`);
            }
        }
    },

    checkLevelQuests() {
        for (const [qId, qState] of Object.entries(this.player.quests)) {
            const quest = QUESTS[qId];
            quest.steps.forEach((step, i) => {
                if (step.type === 'level' && this.player.level >= step.count) {
                    qState.progress[i] = step.count;
                }
            });
            this.checkQuestCompletion(qId);
        }
    },

    // ---- Quests ----
    advanceQuest(questId, stepIndex) {
        const qState = this.player.quests[questId];
        if (!qState || !qState.active) return;
        const quest = QUESTS[questId];
        if (qState.progress[stepIndex] < quest.steps[stepIndex].count) {
            qState.progress[stepIndex]++;
        }
        this.checkQuestCompletion(questId);
    },

    advanceQuestByType(type) {
        for (const [qId, qState] of Object.entries(this.player.quests)) {
            if (!qState.active) continue;
            const quest = QUESTS[qId];
            quest.steps.forEach((step, i) => {
                if (step.type === type && qState.progress[i] < step.count) {
                    qState.progress[i]++;
                }
            });
            this.checkQuestCompletion(qId);
        }
    },

    checkQuestCompletion(questId) {
        const qState = this.player.quests[questId];
        if (!qState || !qState.active) return;
        if (this.isQuestComplete(questId) && !qState.rewarded) {
            const quest = QUESTS[questId];
            qState.rewarded = true;
            this.addNarrative('reward', `\uD83C\uDF1F Quest Complete: ${quest.name}!`);
            if (quest.rewards.xp) this.gainXP(quest.rewards.xp);
            if (quest.rewards.gold) {
                this.player.gold += quest.rewards.gold;
                this.addNarrative('reward', `+${quest.rewards.gold} gold`);
            }
            if (quest.rewards.spell && !this.player.spells.includes(quest.rewards.spell)) {
                this.player.spells.push(quest.rewards.spell);
                this.addNarrative('reward', `Learned: ${SPELLS[quest.rewards.spell].name}`);
            }
        }
    },

    isQuestComplete(questId) {
        const qState = this.player.quests[questId];
        const quest = QUESTS[questId];
        return quest.steps.every((step, i) => qState.progress[i] >= step.count);
    },

    // ---- Save/Load ----
    saveGame() {
        const save = {
            player: this.player,
            location: this.currentLocation,
            version: 1
        };
        localStorage.setItem('fillory_save', JSON.stringify(save));
        this.addNarrative('system', 'Game saved.');
    },

    loadGame() {
        const raw = localStorage.getItem('fillory_save');
        if (!raw) {
            alert('No saved game found.');
            return;
        }
        try {
            const save = JSON.parse(raw);
            this.player = save.player;
            this.currentLocation = save.location;
            this.showScreen('game');
            this.clearNarrative();
            this.addNarrative('system', 'Game loaded.');
            this.switchTab('explore');
            this.updateUI();
        } catch (e) {
            alert('Failed to load save data.');
        }
    },

    // ---- Utility ----
    rollRange(range) {
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }
};

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('player-name').addEventListener('input', () => Game.updateCreateButton());
});

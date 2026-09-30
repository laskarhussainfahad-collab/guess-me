const wordSets = {
    easy: [
        [['CAT', 'A small pet that purrs.'], ['SUN', 'The star at the center of our solar system.'], ['CLOUD', 'A white or gray shape floating in the sky.'], ['BREAD', 'A baked food made from flour and water.'], ['TRAIN', 'A long vehicle that runs on rails.'],
        ['POCKET', 'A small sewn pouch in a piece of clothing.'], ['SILENCE', 'A state with little or no sound.'], ['PATTERN', 'A repeated decorative design.'], ['JOURNEY', 'A trip from one place to another.'], ['DAYLIGHT', 'The natural light of daytime.'],
        ['CURIOUS', 'Eager to know or learn something.'], ['FRAGILE', 'Easily broken or damaged.'], ['COMPASS', 'A tool that points north and helps you navigate.'], ['DISCOVER', 'To find something for the first time.'], ['FOUNTAIN', 'A structure that sends water up into the air.'],
        ['GENEROSITY', 'The quality of freely giving or sharing.'], ['KNOWLEDGE', 'Information and understanding gained through learning.'], ['CELEBRATE', 'To mark a happy or important occasion.'], ['PERSEVERE', 'To keep going despite difficulty.'], ['IMAGINATION', 'The ability to form ideas in your mind.']],
        [['Warm-up', 'Finding rhythm', 'Tricky', 'Brain stretch']]
    ],
    medium: [
        [['ANCHOR', 'A heavy device that keeps a boat in place.'], ['GLIMMER', 'A faint or brief flash of light.'], ['HORIZON', 'The distant line where earth and sky seem to meet.'], ['MOSAIC', 'A picture made from small pieces of colored material.'], ['RHYTHM', 'A regular pattern of beats or movement.'],
        ['ECLIPSE', 'An event where one celestial body blocks another.'], ['RESILIENT', 'Able to recover quickly after difficulty.'], ['AMBIGUOUS', 'Having more than one possible meaning.'], ['LABYRINTH', 'A complicated network of paths or passages.'], ['CONSCIOUS', 'Aware of your surroundings and thoughts.'],
        ['QUARANTINE', 'A period of isolation to prevent disease spreading.'], ['PHENOMENON', 'An observable event or occurrence.'], ['METICULOUS', 'Showing great attention to detail.'], ['ARCHIPELAGO', 'A group or chain of islands.'], ['EQUILIBRIUM', 'A state of balance between opposing forces.'],
        ['SERENDIPITY', 'Finding something good without looking for it.'], ['PERSPICACIOUS', 'Quick to notice and understand things.'], ['INEVITABLE', 'Certain to happen; impossible to avoid.'], ['CIRCUMSTANCE', 'A fact or condition connected to an event.'], ['PERSEVERANCE', 'Steady effort despite obstacles or delay.']],
        [['Getting started', 'Picking up pace', 'Tough', 'Brain stretch']]
    ],
    hard: [
        [['ABSTRUSE', 'Difficult to understand; obscure.'], ['INCHOATE', 'Only just beginning and not fully formed.'], ['LACONIC', 'Using very few words.'], ['ESOTERIC', 'Understood by only a small, specialized group.'], ['EPHEMERAL', 'Lasting for a very short time.'],
        ['PERNICIOUS', 'Having a harmful effect, often gradually.'], ['OBDURATE', 'Stubbornly refusing to change an opinion.'], ['UBIQUITOUS', 'Seeming to be present everywhere.'], ['INELUCTABLE', 'Impossible to avoid or escape.'], ['INTRANSIGENT', 'Unwilling to compromise or change a view.'],
        ['PUSILLANIMOUS', 'Showing a lack of courage; timid.'], ['CONTUMACIOUS', 'Stubbornly disobedient to authority.'], ['SESQUIPEDALIAN', 'Characterized by the use of long words.'], ['QUOTIDIAN', 'Happening every day; ordinary.'], ['PULCHRITUDE', 'Physical beauty.'],
        ['FLOCCINAUCINIHILIPILIFICATION', 'The act of judging something to be worthless.'], ['AUTOCHTHONOUS', 'Native to the place where it is found.'], ['ELEEMOSYNARY', 'Relating to charity or charitable donations.'], ['RECRUDESCENCE', 'The return of something after a period of quiet.'], ['INCOMPREHENSIBILITY', 'The quality of being impossible or very hard to understand.']],
        [['Hard', 'Expert', 'Severe', 'Extreme']]
    ]
};

const stages = Object.fromEntries(Object.entries(wordSets).map(([level, [words, labels]]) => [level, labels[0]]));
const levels = { easy: 'EASY RUN', medium: 'MEDIUM RUN', hard: 'HARD RUN' };
const state = { level: 'easy', score: 0, decks: {}, indexes: { easy: 0, medium: 0, hard: 0 }, hintOrder: [], hintsUsed: 0 };
const $ = (selector) => document.querySelector(selector);

function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1));
        [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
}

function newDeck(level) {
    const words = wordSets[level][0];
    return Array.from({ length: 4 }, (_, band) => shuffled(words.slice(band * 5, band * 5 + 5))).flat();
}

function currentWord() {
    if (!state.decks[state.level]) state.decks[state.level] = newDeck(state.level);
    return state.decks[state.level][state.indexes[state.level]];
}

function render() {
    const index = state.indexes[state.level];
    const word = currentWord();
    $('#score').textContent = state.score;
    $('#level-name').textContent = levels[state.level];
    $('#round').textContent = String(Math.min(index + 1, 20)).padStart(2, '0');
    $('#progress').style.width = `${index / 20 * 100}%`;
    $('#stage').textContent = stages[state.level][Math.min(Math.floor(index / 5), 3)];
    $('#answer').value = '';
    $('#answer').disabled = !word;
    $('#hint').disabled = state.score < 5 || !word || state.hintsUsed >= word[0].length;
    $('#submit').textContent = index >= 20 ? 'Play another set ↗' : 'Check word ↗';
    if (!word) {
        $('#clue').textContent = 'That is all 20 words. Ready for a fresh set?';
        $('#word-length').textContent = 'SET COMPLETE';
        $('#hint').disabled = true;
    } else {
        $('#clue').textContent = word[1];
        $('#word-length').textContent = `${word[0].length} LETTERS`;
    }
}

document.querySelectorAll('.level').forEach((button) => button.addEventListener('click', () => {
    state.level = button.dataset.level;
    document.querySelectorAll('.level').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
    });
    state.hintsUsed = 0;
    state.hintOrder = [];
    $('#feedback').textContent = '';
    $('#feedback').className = 'feedback';
    render();
}));

$('#answer-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const index = state.indexes[state.level];
    if (index >= 20) {
        state.decks[state.level] = newDeck(state.level);
        state.indexes[state.level] = 0;
        state.hintsUsed = 0;
        state.hintOrder = [];
        $('#feedback').textContent = 'A fresh set is ready.';
        render();
        return;
    }
    const [answer] = currentWord();
    const guess = $('#answer').value.toLocaleUpperCase().replace(/[^A-Z]/g, '');
    const feedback = $('#feedback');
    if (guess === answer) {
        state.score += 10;
        state.indexes[state.level]++;
        state.hintsUsed = 0;
        state.hintOrder = [];
        feedback.textContent = 'Correct! +10 points.';
        feedback.className = 'feedback good';
        render();
    } else {
        feedback.textContent = 'Not quite. Give it another try.';
        feedback.className = 'feedback bad';
    }
});

$('#hint').addEventListener('click', () => {
    const word = currentWord();
    if (!word || state.score < 5) return;
    if (!state.hintOrder.length) state.hintOrder = shuffled([...word[0]].map((_, index) => index));
    const position = state.hintOrder[state.hintsUsed++];
    state.score -= 5;
    $('#feedback').textContent = `Hint: letter ${position + 1} is “${word[0][position]}”.`;
    $('#feedback').className = 'feedback';
    $('#score').textContent = state.score;
    $('#hint').disabled = state.score < 5 || state.hintsUsed >= word[0].length;
    $('#answer').focus();
});

render();
let s_actor = canvas.tokens.controlled[0]?.actor || game.user.character; 

let dice = new Roll('(ceil(@rogueLevel /2))d6', {rogueLevel: getRogueLevel(s_actor) });
await dice.roll();

let total = 0;

dice.terms[0].results.forEach(result => {
    if (result.result == 1) { 
        result.result = 9
    }
});

dice = Roll.fromTerms(dice.terms);

return await dice.toMessage({flavor: "Sneak Attack", speaker});


/**
 * Gets the rogue levels for a particular actor.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @returns {number} The number of levels.
 */
function getRogueLevel(actor) {
    return actor.data.data.classes.rogue.levels;
}
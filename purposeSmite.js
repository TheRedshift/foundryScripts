(() => {

let maxSpellSlot = 5; //  Highest spell-slot level that may be used.

let confirmed = false; 

// Use token selected, or default character for the Actor if none is.
let s_actor = canvas.tokens.controlled[0]?.actor || game.user.character; 

if (hasAvailableSlot(s_actor)) {
    let optionsText = "";
    for (let i = 1; i < maxSpellSlot; i++) {
        const level = CONFIG.DND5E.spellLevels[i];
        const label = "Level " + i;
        optionsText += `<option value="${i}">${label}</option>`;
        
    }

    let dialogEditor = new Dialog({
        title: `Multi Window Test`,
        content: `
        <form id="multi-window-form">
            <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Divine Smite", type: "feature"}) + `</p>
            <div class="form-group">
                <label>Spell Slot Level</label>
                <div class="form-fields">
                    <select name="slot-level">` + optionsText + `</select>
                </div>
            </div>
            <div class="form-group">
                <label class="checkbox">
                <input type="checkbox" name="criticalCheckbox"/>` + game.i18n.localize("DND5E.CriticalHit") + "?" + `</label>
            </div>
            <div class="form-group">
                <label class="checkbox">
                <input type="checkbox" name="weakCheckbox"/>` + "Fiend or Undead?" + `</label>
            </div>
        </form>
        `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "SMITE!",
                callback: () => confirmed = true
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => confirmed = false
            }
        },
        default: "Cancel",
        close: html => {
            if (confirmed) {
                const slotLevel = parseInt(html.find('[name=slot-level]')[0].value);
                const criticalHit = html.find('[name=criticalCheckbox]')[0].checked;				
                const weak = html.find('[name=weakCheckbox]')[0].checked;

                smite(s_actor, slotLevel, criticalHit, weak);
            }
        }
    }).render(true);

}

else {
    return ui.notifications.error(`No spell slots available to use this feature.`);    
}

  /**
 * Gives the spell slot information for a particular actor and spell slot level.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @param {integer} level - the spell slot level to get information about. level 0 is deprecated.
 * @returns {object} contains value (number of slots remaining), max, and override.
 */
function getSpellSlots(actor, level) {
    return actor.data.data.spells[`spell${level}`];
}

/**
 * Returns true as purpose doesn't consume spell slots to smite
 */
 function hasAvailableSlot(actor) {
    return true;
 }

  
/**
 * Use the controlled token to smite the targeted token.
 * @param {Actor5e} actor - the actor that is performing the action.
 * @param {integer} slotLevel - the spell slot level to use when smiting.
 * @param {boolean} criticalHit - whether the hit is a critical hit.
 * @param {boolean} weak - whether the target takes an extra 1d8 from being a Fiend or Undead
 */

  function smite(actor, slotLevel, criticalHit, weak) {

    let numDice = slotLevel + 1;
    if (weak) numDice += 1;
    if (criticalHit) numDice *= 2;
    const flavor = `Purpose Divine Smite - ${game.i18n.localize("DND5E.DamageRoll")} (${game.i18n.localize("DND5E.DamageRadiant")})`;
    new Roll(`${numDice}d8`).roll().toMessage({ flavor: flavor, speaker });
    
}

})();
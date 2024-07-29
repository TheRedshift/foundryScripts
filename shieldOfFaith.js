/**
 * Gives the spell slot information for a particular actor and spell slot level.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @param {integer} level - the spell slot level to get information about. level 0 is deprecated.
 * @param {boolean} isPact - whether the spell slot is obtained through pact.
 * @returns {object} contains value (number of slots remaining), max, and override.
 */
function getSpellSlots(actor, level, isPact){
    if(isPact == false) {
        return actor.system.spells[`spell${level}`];
    }
    else {
        return actor.system.spells.pact;
    }
}

/**
 * Returns whether the actor has any spell slot left.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @returns {boolean} True if any spell slots of any spell level are available to be used.
 */
function hasAvailableSlot(actor) {
	console.log(actor.name);
	console.log(actor.system.spells);
    for (let slot in actor.system.spells) {
        if (actor.system.spells[slot].value > 0) {
            return true;
        }
    }
    return false;
}

console.log("Shiled of faith macro");
// Use token selected, or default character for the Actor if none is.
let s_actor = canvas.tokens.controlled[0].actor || game.user.character;    
	
let confirmed = false;

if (hasAvailableSlot(s_actor)) {
	// Get options for available slots
	let optionsText = "";

	for (let i = 1; i < 9; i++) {
		const slots = getSpellSlots(s_actor, i, false);
		if (slots.value > 0) {
			const level = CONFIG.DND5E.spellLevels[i];
			const label = game.i18n.format('DND5E.SpellLevelSlot', {level: level, n: slots.value});
			optionsText += `<option value="${i}">${label}</option>`;
		}
	}

// Create a dialogue box to select spell slot level to use when smiting.
new Dialog({
	title: "Divine Smite: Usage Configuration",
    content: `
	   	<form id="smite-use-form">
        <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Shield of Faith", type: "item"}) + `</p>
        <div class="form-group">
            <label>Spell Slot Level</label>
            <div class="form-fields">
                <select name="slot-level">` + optionsText + `</select>
            </div>
        </div>

        <div class="form-group">
            <label class="checkbox">
            <input type="checkbox" name="consumeCheckbox" checked/>` + game.i18n.localize("DND5E.SpellCastConsume") + `</label>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Sheild of Faith",
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
                let slotLevel = parseInt(html.find('[name=slot-level]')[0].value);
		
                const consumeSlot = html.find('[name=consumeCheckbox]')[0].checked;
                shieldOfFaith(s_actor, slotLevel, consumeSlot);
            }
        }
    }).render(true);
} else {
	return ui.notifications.error(`No spell slots available to use this spell.`);    
}


/**
 * Use the controlled token to smite the targeted token.
 * @param {Actor5e} actor - the actor that is performing the action.
 * @param {integer} slotLevel - the spell slot level to use when smiting.
 * @param {boolean} consume - whether to consume the spell slot.
 */
function shieldOfFaith(actor, slotLevel, consume){
	let targets = game.user.targets;

    let chosenSpellSlots = getSpellSlots(actor, slotLevel, false);

	if (chosenSpellSlots.value < 1) {
		ui.notifications.error("No spell slots of the required level available.");
        return;
	}

	if (!targets || targets.size !== 1) {
		ui.notifications.error("You must target exactly one token to use Shield of Faith");
		return;
	}
	
	targets.forEach(target => {
		let shieldOfFaithEffect = {
			changes: [
				{
					key: "system.attributes.ac.value",
					mode: 2,
					priority: 20,
					value: "+2"
				}
			],
			duration: {
				"seconds": 600,
			},
			icon: "systems/dnd5e/icons/svg/rosa-shield.svg",
			label: "Shield of Faith"
		}
		target.actor.createEmbeddedDocuments("ActiveEffect", [shieldOfFaithEffect]);

		let chatData = {
			user: game.user._id,
			speaker: ChatMessage.getSpeaker(),
			content:  `${target.name} is now protected by ${actor.name}'s Shield of Faith`
		};
		ChatMessage.create(chatData, {});
	});
}
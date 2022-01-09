new Dialog({
	title:'How many good bois are attacking?',
	content:`
	  <form>
		<div class="form-group">
		  <label>Doggos</label>
		  <input type='number' name='inputField'></input>
		</div>
	  </form>`,
	buttons:{
	  yes: {
		icon: "<i class='fas fa-check'></i>",
		label: `Confirm`
	  }},
	default:'yes',
	close: async html => {
		const result = html.find('input[name=\'inputField\']');
		let chatMessages = [];
		const doggos = result.val()

		for (let i = 0; i < doggos; i++) {
			let roll = new Roll(`2d20`);
			roll = await roll.evaluate({async: true});
			chatMessages.push(
				roll.toMessage({
					flavor: `Doggo ${i}/${doggos} Attacks!`
				},
				{
					create: true
				})
			);
		}
		
		await Promise.allSettled(chatMessages);
}
}).render(true);
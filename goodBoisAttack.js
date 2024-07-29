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
        const doggos = result.val();
        await doggosAttack(doggos);
}
}).render(true);


async function doggosAttack(numberOfDoggos) {
    let chatMessages = [];
    for (let i = 0; i < numberOfDoggos; i++) {
        let roll = new Roll(`2d20`);
        roll = await roll.evaluate();
        chatMessages.push(
            roll.toMessage({
                flavor: `Doggo ${i + 1}/${numberOfDoggos} Attacks!`
            },
            {
                create: true
            })
        );
    }
    await Promise.allSettled(chatMessages);
}
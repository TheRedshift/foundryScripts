new Dialog({
    title:'Example Dialog',
    content:`
      <form>
        <div class="form-group">
          <label>Input text</label>
          <input type='text' name='inputField'></input>
        </div>
      </form>`,
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Apply Changes`
      }},
    default:'yes',
    close: async html => {
      let result = html.find('input[name=\'inputField\']');
      var i;
      var roll;
      for (i = 0; i < result.val(); i++) {
        roll = new Roll(`2d20`);
        roll = await roll.evaluate({async: true});
        await roll.toMessage({
          flavor: "Doggo Attacks!"},
          {
              create: true
          });
  };
  }
}).render(true);
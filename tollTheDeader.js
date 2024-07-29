new Dialog({
    title: `Toll the Deader`,
    content: `Is the target damaged?`,
    buttons: {
        torch: {
        label: `No`,
        callback: async () => {
          let target = canvas.tokens.controlled[0]?.actor;
          const save = await target.rollAbilitySave("wis");
          let roll = new Roll(`3d8`);
          roll = await roll.roll();
          await roll.toMessage({
              flavor: "d8 damage",
          });
        }
      },
      light: {
        label: `Yes`,
        callback: async () => {
          let roll = new Roll(`3d12`);
          roll = await roll.roll();
          await roll.toMessage({
              flavor: "d12 damage",
          });
        }
      },
      close: {
        icon: "<i class='fas fa-tick'></i>",
        label: `Close`
      },
    },
    default: "close",
    close: () => {}
}).render(true);
// Pull the passive and max health of each token in the current scene and say it as a chat message
// Only tested with the 5e System in Foundry.
// Author: @DaiKnapz, Based on Passive perception community macro Author: @Drunemeton#7955. Based on the original macro by author @Erogroth#7134.

// Initalize variables.
let pcArray = [];
let messageContentPC = "";
let messageHeaderPC = "<tr><th>HP</th><th>Current</th><th>Temp</th><th>Current Total</th><th>Max</th></tr>";

// Gather tokens in the current scene into an array.
let tokens = canvas.tokens.placeables.filter((token) => token.actor);

// From the tokens array sort into PC and NPC arrays.
for (let count of tokens) {
  let tokenType = count.actor.system.type;
  let tokenName = count.name;
  let tokenHealth = count.actor.system.attributes.hp;
  
  //TODO change to use player check
  if(tokenType === "character") {
      tokenHealth["total"] = tokenHealth.value + tokenHealth.temp
    pcArray.push({ name: tokenName, health: tokenHealth });
  } 
}

// Sort each array.
sortArray(pcArray);

// Build chat message, with PCs first, then NPCs.
for (let numPC of pcArray) {
  messageContentPC += `<tr><td>${numPC.name}</td><td>${numPC.health.value}</td><td>${numPC.health.temp ?? 0}</td><td>${numPC.health.total}</td><td>${numPC.health.max}</td></tr>`;
}


let chatMessage = ("<table>" + messageHeaderPC + messageContentPC + "</table>");

let chatData = {
  user: game.user._id,
  speaker: ChatMessage.getSpeaker(),
  content: chatMessage,
};

// Display chat message.
ChatMessage.create(chatData, {});

// Sort each array by Name.
  function sortArray(checkArray) {
    checkArray.sort(function (a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    // Sort array by health
    checkArray.sort(function (a, b) {
      return a.health.value - b.health.value;
    });
  }

//TODO replace 12 with @classes.rogue.levels
let dice = new Roll('(ceil(12 /2))d6');
dice.roll();

dice.terms[0].results.forEach(result => {
    if (result.result == 1) { 
        result.result = 9
    }
});

console.log(dice.terms[0].toJSON());

dice.toMessage();
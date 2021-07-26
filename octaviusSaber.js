let dice = new Roll('(ceil(13 /2))d6');
dice.roll();

dice.terms[0].results.forEach(result => {
    if (result.result == 1) { 
        result.result = 9
    }
});

await dice.toMessage({flavor: "Sneak Attack"});
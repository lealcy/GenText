"use strict";

var alphabet = "abcdefghijklmnopqrstuvwxyz .,ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
var target = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do";/* + 
    " eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad " +
    "minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip " +
    "ex ea commodo consequat. Duis aute irure dolor in reprehenderit in " +
    "voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur " +
    "sint occaecat cupidatat non proident, sunt in culpa qui officia " +
    "deserunt mollit anim id est laborum.";*/
target = target.split("");

var targetLen = target.length;

var stop = false;
var pool = alphabet;
var poolLen = pool.length;
var populationSize = 10000;
var aptGroupSize = 1000;
var maxGen = 10000;
var mutationChance = 0.005;
var population = randomPopulation();
var generation = 1;
var genFit = 1;
var bestInd = population[0];
var bestInd1 = population[0];
var bestInd2 = population[0];
var bestIndFit = fitness(bestInd);
var bgColor = "#D3D3D3";
var mutColor = "#FFA500";
var ind1Color = "#B22222";
var ind2Color = "#C71585";
var colColor = "#008000";
var hitColor = "#90EE90";


function printPop() {
    let el = document.getElementById("popList");
    el.innerText = `Generation: ${generation},
    population size: ${populationSize},
    max mutation chance: ${mutationChance},
    apt group size: ${aptGroupSize},
    best fitness score (this generation): ${genFit}, 
    best fitness score (all generations): ${bestIndFit},
    target: ${target.join("")}, 
    best fit (all generations): ${bestInd.join("")},
    best fit (this generation): ${population[0].join("")}`; 
}

function printBreed(ind1, ind2, offspring) {
    let el = document.getElementById("breedTable");
    let table = "";
    let colNum = 64;

    let i = 0;
    
    while (i < targetLen) {
        table += "<tr>";
        for (let c = 0; c < colNum; c++) {
            let os = offspring[i];
            let i1 = ind1[i];
            let i2 = ind2[i];
            let color = mutColor;
            let bg = bgColor;
            if (os == i1 == i2) {
                color = colColor;
            } else if (os == i1) {
                color = ind1Color;
            } else if (os == i2) {
                color = ind2Color;
            }
            if (os == target[i]) {
                bg = hitColor;
            }
            table += `<td style="background-color: ${bg}; color: ${color}">${os == " " ? "&nbsp;" : os}</td>`;
            i++;
            if (i >= targetLen) {
                break;
            }
        }
        table += "</tr>";
    }
    
    el.innerHTML = table;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomIndividual() {
    let ind = [];
    for (let i = 0; i < targetLen; i++) {
        ind.push(pool[randInt(0, poolLen)]);
    }
    return ind;
}

function randomPopulation() {
    let pop = [];
    for (let ps = 0; ps < populationSize; ps++) {
        pop.push(randomIndividual());
    }
    pop.sort(weight);
    return pop;
}

function fitness(individual) {
    let score = 0;
    for (let i = 0; i < targetLen; i++) {
        score += Math.abs(individual[i].charCodeAt(0) - target[i].charCodeAt(0));
    }
    return score;
}

function weight(ind1, ind2) {
    return fitness(ind1) - fitness(ind2);
}

function breed(ind1, ind2) {
    let newInd = [];
    for (let i = 0; i < targetLen; i++) {
        if (Math.random() < mutationChance){
            newInd.push(pool[randInt(0, poolLen)]);
        } else if (ind1[i] === ind2[i]) {
            newInd.push(ind1[i]);
        } else {
            newInd.push(Math.round(Math.random()) ? ind2[i] : ind1[i]);
        }
    }
    printBreed(ind1, ind2, newInd);
    return newInd;
}

function evolve() {
    var newPop = []; 
    for (var ps = 0; ps < populationSize; ps++) {
        let ind1 = population[randInt(0, aptGroupSize)];
        let ind2 = population[randInt(0, aptGroupSize)];
        newPop.push(breed(ind1, ind2));
    }
    population = newPop.sort(weight);
}

function gen() {
    if (stop || !maxGen--) {
        return;
    }

    /*console.log(`Generation: ${generation},
    target: ${target}, 
    best fit: ${samples[0]} (${fitness(samples[0])}), 
    best fit overall: ${bestInd} (${bestIndFit})`);*/
    printPop();


    genFit = fitness(population[0]); 

    if (genFit <= bestIndFit) {
        bestInd = population[0];
        bestIndFit = genFit;
    }
    if (!genFit) { // Found the best match.
        printPop();
        return;
    }

    aptGroupSize = bestIndFit > populationSize ? Math.ceil(populationSize / 2) : bestIndFit;
    evolve();
    generation++;
    setTimeout(gen, 1);
}

//gen();
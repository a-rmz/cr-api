const Math = require('mathjs');
const jsonfile = require('jsonfile');

const feedForward = (bytes, initialWeights, hiddenWeights, hiddenLayerValues) => {
    //Obtener resultados de las primeras 26 neuronas
    let index = 0;
    for (let key in initialWeights) {
        let dot = 0;
        bytes.map((byte, i) => {
            dot += byte * initialWeights[key][i];
        });
        hiddenLayerValues[index] = actionFunction(dot);
        index += 1;
    }
    //Resultados de las primeras neuronas obtenidos
    let results = [];

    for (let key in hiddenWeights) {
        let output = 0;
        hiddenLayerValues.forEach((value, i) => {
            output += value * hiddenWeights[key][i];
        });
        results.push(actionFunction(output));
    }
    return results;
};

const actionFunction = (output) => {
    return 1.0 / (1 + Math.exp(-output));
}

const hiddenActionFunction = (output) => {
    return output > 0.5 ? 1 : 0;
}

const dsigmoid = (output) => {
    return output * (1 - output);
}

const backPropagation = function (error, input, output, initialWeights, hiddenWeights, hiddenLayerValues) {
    const learningRate = 0.0005;
    let outputDelta = output.map((out, i) => {
        return dsigmoid(out) * error[i];
    });
    let ind = 0;
    for (let key in hiddenWeights) {
        hiddenWeights[key] = hiddenWeights[key].map((weight, i) => {
            return weight + (hiddenLayerValues[i] * learningRate * outputDelta[ind]);
        });
        ind += 1;
    }
    const learningRate2 = 0.003;
    ind = 0;
    let hiddenDeltas = [];
    for (let key in hiddenWeights) {
        let delta = hiddenWeights[key].map((weight, i) => {
            return dsigmoid(hiddenLayerValues[i]) * weight * outputDelta[ind];
        });
        hiddenDeltas.push(delta);
        ind += 1;
    }

    ind = 0;
    for (let key in initialWeights) {
        initialWeights[key] = initialWeights[key].map((initial, i) => {
            let actual = 0;
            hiddenDeltas.forEach((delta) => {
                actual += (input[i] * learningRate2 * delta[ind]);
            });
            return initial += (actual / hiddenDeltas.length);
        });

        ind += 1;
    }

    /*return weights = weights.map((weight,i) => {
        return weight + (input[i] * outputDelta * learningRate);
    });*/
}

const trainPerceptron = function (trainingMatrix, classes, initialWeights, hiddenWeights, hiddenLayerValues, values) {
    let hits = 0;
    let actual = 0;

    while (trainingMatrix.length > hits) {
        hits = 0;

        trainingMatrix.map((trainingVector, i) => {
            let output = feedForward(trainingVector, initialWeights, hiddenWeights, hiddenLayerValues);
            let expectedOutput = values[classes[i]];
            let error = output.map((out, i) => {
                return expectedOutput[i] - out;
            });

            if(error.some((element) => { return Math.abs(element) > 0.5; })){
                var newError = error.map((err) => {
                    if(Math.abs(err) <= 0.5){
                        return 0;
                    } else {
                        return err;
                    }
                });

                backPropagation(newError, trainingVector, output, initialWeights, hiddenWeights, hiddenLayerValues);
            } else {
                hits += 1;
            }
        });
        
        if (actual >= 10){
            break;
        } else {
            actual++;
            console.log('Number of correct hits: ' + hits);
            console.log((actual / 0.1) + '%');
        }

    }

    saveWeights(initialWeights, hiddenWeights);
}

const saveWeights = (initialWeights, hiddenWeights) => {
    jsonfile.writeFile('./initialWeights.json', initialWeights, (err) => {
        if (err) {
            console.log('Error saving initial weights ' + err);
        }
    });

    jsonfile.writeFile('./hiddenWeights.json', hiddenWeights, (err) => {
        if (err) {
            console.log('Error saving hidden weights ' + err);
        }
    });
}

const readWeights = (done) => {
    let weights = {
        initialWeights: {},
        hiddenWeights: {}
    };
    
    jsonfile.readFile('./src/neuron/initialWeights.json', (err, obj) => {
        if (!err) {
            console.log('one');
            weights.initialWeights = obj;
            jsonfile.readFile('./src/neuron/hiddenWeights.json', (err, obj) => {
                if (!err) {
                    console.log('two');
                    weights.hiddenWeights = obj;
                    done(weights);
                } else {
                    console.log('Error lowading hidden weights ' + err);
                }
            });
        } else {
            console.log('Error loading initial weights ' + err);
        }
    });
}

module.exports = {
    feedForward,
    actionFunction,
    trainPerceptron,
    readWeights,
}
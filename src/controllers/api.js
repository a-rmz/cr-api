const Jimp = require('jimp');
const HttpStatus = require('http-status-codes');
const Neurona = require('../neuron/neurona.js');
const Math = require('mathjs')

const get = (req, res) => {
  res.sendStatus(200);
};

const post = (req, res) => {
  const { image } = req.body;
  // if (!image.startsWith('data:image/png;base64,')) {
  //   res.sendStatus(HttpStatus.BAD_REQUEST);
  // } else {
  const rawImage = image.replace('data:image/png;base64,', '');

  Jimp.read(Buffer.from(rawImage, 'base64'))
    .then((png) => {
      const normalized = png
        .normalize()
        .contrast(1)
        .resize(8, 16);
      let trainingVector = [];
      
      for (let i = 0; i < 16; i++) {
        let array = [];
        for (let j = 0; j < 8; j++) {
          const hex = normalized
            .getPixelColor(j, i);
          
          let color = Jimp.intToRGBA(hex);
          if(color.a < 250 || color.b < 250 || color.c < 250){
            array.push(1);
            trainingVector.push(1);
          }else{
            trainingVector.push(0);
            array.push(0);
          }
        }
        console.log(array);
      }

      
      normalized.write('image.png');
      let hiddenLayerValues = [];
      Neurona.readWeights((weights) => {
        let result = Neurona.feedForward(trainingVector, weights.initialWeights, weights.hiddenWeights, hiddenLayerValues);
        let i = 4;
        let letter = 97;
        let results = result.map((result) => {
          return result >=0.5? 1:0; 
        });
        results.forEach((res) => {
          letter += (Math.pow(2,i) * res);
          i -= 1;
        });
        console.log(letter);
        console.log(String.fromCharCode(letter));
        res.status(HttpStatus.ACCEPTED).send(String.fromCharCode(letter));
      });
      
      
    })
    .catch((err) => {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('something');
    });
  // }
};

module.exports = {
  get,
  post,
};

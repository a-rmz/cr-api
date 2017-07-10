const Jimp = require('jimp');
const HttpStatus = require('http-status-codes');

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

      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 8; j++) {
          const hex = normalized
            .getPixelColor(j, i);
          console.log(Jimp.intToRGBA(hex));
        }
      }


      normalized.write('image.png');
      res.sendStatus(HttpStatus.CREATED);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  // }
};

module.exports = {
  get,
  post,
};

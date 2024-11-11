const path = require('path');
const GifCreator = require('../lib/');

async function createGif() {
  const width = 480 * 2;
  const height = 295 * 2;
  const gifCreator = new GifCreator(width, height, true);

  const outputPath = path.resolve(__dirname, 'output.gif');
  gifCreator.setOutput(outputPath);
  gifCreator.setRepeat(true);
  gifCreator.setQuality(10);
  gifCreator.setFrameRate(20);

  const imagePattern = path.resolve(__dirname, 'images', 'h%d.png');
  gifCreator.addImage(imagePattern);
  gifCreator.start();
}

createGif();

const path = require('path');
const GifCreator = require('../lib/');

async function createGif() {
  const width = 320;
  const height = -1;
  const gifCreator = new GifCreator(width, height, true);

  const outputPath = path.resolve(__dirname, 'output.gif');
  gifCreator.setOutput(outputPath);
  gifCreator.setRepeat(true);
  gifCreator.setQuality(9);
  gifCreator.setFrameRate(10);

  const video = path.resolve(__dirname, 'video.mp4');
  gifCreator.addVideo(video);
  gifCreator.start();
}

createGif();

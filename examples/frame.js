const path = require('path');
const { createCanvas } = require('canvas');
const GifCreator = require('../lib/');

async function createGif() {
  const width = 500;
  const height = 500;
  const gifCreator = new GifCreator(width, height, true);

  const outputPath = path.resolve(__dirname, 'output.gif');
  gifCreator.setOutput(outputPath);
  gifCreator.setRepeat(true);
  gifCreator.setQuality(10);
  gifCreator.setFrameRate(18);

  const frames = [];

  for (let i = 0; i < 50; i++) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(50 + (i % 50) * 8, 250, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate((i * Math.PI) / 40);
    ctx.fillStyle = 'red';
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();

    ctx.fillStyle = 'green';
    ctx.font = `${20 + (i % 50)}px Arial`;
    ctx.fillText(`Frame ${i + 1}`, 50, 100);

    frames.push(canvas);
    gifCreator.addFrame(canvas);
  }

  // Add reversed frames
  for (let i = 49; i >= 0; i--) {
    gifCreator.addFrame(frames[i]);
  }

  gifCreator.start();
}

createGif();

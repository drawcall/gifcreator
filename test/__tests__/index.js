const GifCreator = require('../../lib');
const fs = require('fs');
const path = require('path');

describe('GifCreator', () => {
  let gifCreator;

  beforeEach(() => {
    gifCreator = new GifCreator(320, 240, true);
  });

  afterEach(() => {
    gifCreator.destroy();
  });

  test('should set output path', () => {
    const outputPath = 'output.gif';
    gifCreator.setOutput(outputPath);
    expect(gifCreator.outputPath).toBe(outputPath);
  });

  test('should set repeat', () => {
    gifCreator.setRepeat(true);
    expect(gifCreator.repeat).toBe(0);

    gifCreator.setRepeat(false);
    expect(gifCreator.repeat).toBe(-1);
  });

  test('should set delay', () => {
    const delay = 1000;
    gifCreator.setDelay(delay);
    expect(gifCreator.delay).toBe(delay);
  });

  test('should set frame rate', () => {
    const frameRate = 30;
    gifCreator.setFrameRate(frameRate);
    expect(gifCreator.frameRate).toBe(frameRate);
  });

  test('should set transparent color', () => {
    const color = 0xff00ff;
    gifCreator.setTransparent(color);
    expect(gifCreator.transparent).toBe(color);
  });

  test('should set quality', () => {
    const quality = 5;
    gifCreator.setQuality(quality);
    expect(gifCreator.quality).toBe(quality);
  });

  test('should add frame', () => {
    const imageData = Buffer.from('some image data');
    gifCreator.addFrame(imageData);
    expect(gifCreator.inputType).toBe('frame');
  });

  test('should add image', () => {
    const imageFiles = ['image1.png', 'image2.png'];
    gifCreator.addImage(imageFiles);
    expect(gifCreator.imageFiles).toBe(imageFiles);
    expect(gifCreator.inputType).toBe('image');
  });

  test('should add video', () => {
    const videoPath = 'video.mp4';
    gifCreator.addVideo(videoPath);
    expect(gifCreator.videoFile).toBe(videoPath);
    expect(gifCreator.inputType).toBe('video');
  });

  test('should start ffmpeg process', done => {
    const outputPath = path.join(__dirname, 'output.gif');
    gifCreator.setOutput(outputPath);
    gifCreator.addImage(['image1.png', 'image2.png']);
    gifCreator.start();

    gifCreator.ffmpegCommand.on('end', () => {
      expect(fs.existsSync(outputPath)).toBe(true);
      fs.unlinkSync(outputPath);
      done();
    });
  });

  test('should destroy ffmpeg process', () => {
    gifCreator.addImage(['image1.png', 'image2.png']);
    gifCreator.start();
    gifCreator.destroy();

    expect(gifCreator.ffmpegCommand).toBeNull();
    expect(gifCreator.frameStream).toBeNull();
  });
});

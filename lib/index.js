const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const { PassThrough } = require('stream');
const EventEmitter = require('eventemitter3');

class GifCreator extends EventEmitter {
  constructor(width, height, verbose = false) {
    super();
    this.width = width;
    this.height = height;
    this.frameStream = new PassThrough();
    this.outputPath = '';
    this.repeat = 0;
    this.delay = 500;
    this.quality = 10;
    this.frameRate = null;
    this.transparent = null;
    this.imageFiles = null;
    this.videoFile = null;
    this.verbose = verbose;
    this.ffmpegCommand = null;
    this.inputType = null;
  }

  setOutput(outputPath) {
    this.outputPath = outputPath;
  }

  setRepeat(repeat) {
    this.repeat = repeat ? 0 : -1;
  }

  setDelay(delay) {
    this.delay = delay;
  }

  setFrameRate(frameRate) {
    this.frameRate = frameRate;
  }

  setTransparent(color) {
    this.transparent = color;
  }

  setQuality(quality) {
    this.quality = quality;
  }

  setFfmpegPath() {
    try {
      ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    } catch (e) {
      console.error(e);
    }
  }

  getFrameRate() {
    return this.frameRate || (1000 / this.delay) >> 0;
  }

  addFrame(imageData) {
    if (!imageData) {
      console.error('Invalid imageData provided');
      return;
    }

    this.inputType = 'frame';
    if (imageData.toDataURL) {
      const canvas = imageData;
      const frameData = canvas.toDataURL('image/png').split(',')[1];
      this.frameStream.write(Buffer.from(frameData, 'base64'));
    } else {
      this.frameStream.write(imageData);
    }
  }

  addImage(imageFiles) {
    this.imageFiles = imageFiles;
    this.inputType = 'image';
  }

  addVideo(videoPath) {
    this.videoFile = videoPath;
    this.inputType = 'video';
  }

  setInput() {
    switch (this.inputType) {
      case 'video':
        this.ffmpegCommand.input(this.videoFile);
        break;
      case 'image':
        this.ffmpegCommand.input(this.imageFiles);
        break;
      case 'frame':
        this.ffmpegCommand.input(this.frameStream).inputFormat('image2pipe');
        break;
      default:
        console.error('No valid input type specified');
        return false;
    }
    return true;
  }

  start() {
    this.ffmpegCommand = ffmpeg();

    if (!this.setInput()) {
      return;
    }

    let videoFps = '';
    if (this.inputType !== 'video') {
      this.ffmpegCommand.inputOptions('-framerate', this.getFrameRate() >> 0);
    } else {
      videoFps = `fps=${this.getFrameRate()},`;
    }

    this.ffmpegCommand
      .outputOptions(
        '-vf',
        `${videoFps}scale=${this.width}:${
          this.height
        }:flags=lanczos,split[v0][v1];[v0]palettegen=reserve_transparent=on:transparency_color=${
          this.transparent ? this.transparent.toString(16).padStart(6, '0') : '00000000'
        }[v];[v1][v]paletteuse`,
      )
      .outputOptions('-f', 'gif')
      .outputOptions('-loop', this.repeat)
      .outputOptions('-q:v', 31 - (this.quality * 3.1).toFixed(4))
      .output(this.outputPath)
      .on('end', () => {
        if (this.verbose) console.log('FFmpeg process finished');
        this.emit('success');
      })
      .on('error', err => {
        console.error(`Error executing ffmpeg: ${err.message}`);
        this.emit('error', err);
      });

    if (this.verbose) {
      this.ffmpegCommand.on('start', commandLine => {
        console.log(`Spawned FFmpeg with command: ${commandLine}`);
      });
      this.ffmpegCommand.on('stderr', stderrLine => {
        console.log(`FFmpeg stderr: ${stderrLine}`);
      });
    }

    this.ffmpegCommand.run();
    this.frameStream.end();
  }

  destroy() {
    if (this.ffmpegCommand) {
      this.ffmpegCommand.kill('SIGKILL');
      this.ffmpegCommand = null;
    }

    if (this.frameStream) {
      this.frameStream.destroy();
      this.frameStream = null;
    }

    this.imageFiles = null;
    this.videoFile = null; 
    this.inputType = null;
  }
}

module.exports = GifCreator;

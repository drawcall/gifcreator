# GifCreator

A simple and lightweight `Node.js` server-side GIF rendering tool. This tool utilizes `FFmpeg` to compose GIF images, offering easy operation and fast production, making it suitable for applications that require quick GIF animation generation.

## Installation

Install this module via npm:

```bash
$ npm install gifcreator
```

#### About ffmpeg

> Please note that this package relies on ffmpeg, so you need to install ffmpeg before using it.

The methods for installing FFmpeg on various Linux distributions differ slightly. Here are the installation steps for some common Linux distributions:

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to compiling from Source on Linux [https://www.tecmint.com/install-ffmpeg-in-linux/](https://www.tecmint.com/install-ffmpeg-in-linux/)
- How to Install FFmpeg on Windows [https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/](https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/)


## Usage Example

#### Creating a GIF Animation

The following example demonstrates how to use the GifCreator class to create a GIF animation with multiple frames and add images from a file path pattern.

```javascript
const path = require('path');
const { createCanvas } = require('canvas');
const GifCreator = require('gifcreator');

function createGif() {
  const width = 500;
  const height = 500;
  const gifCreator = new GifCreator(width, height, true);
  const outputPath = path.resolve(__dirname, 'output.gif');
  gifCreator.setOutput(outputPath);
  gifCreator.setRepeat(true);
  gifCreator.setQuality(10);
  gifCreator.setFrameRate(18);
  gifCreator.on('success', () => {});

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
    gifCreator.addFrame(canvas);
  }

  gifCreator.start();
}
```

#### Other uses
GifCreator also supports image input and video input, for example:
```javascript
const imagePattern = path.resolve(__dirname, 'images', 'h%d.png');
gifCreator.addImage(imagePattern);
// or
const video = path.resolve(__dirname, 'video.mp4');
gifCreator.addVideo(video);
```

<p align="center">
  <img src="https://github.com/drawcall/gifcreator/blob/main/examples/demo/1.gif?raw=true" width="28%" />
  <img src="https://github.com/drawcall/gifcreator/blob/main/examples/demo/2.gif?raw=true" width="28%" style="margin: 0 2%;" />
  <img src="https://github.com/drawcall/gifcreator/blob/main/examples/demo/3.gif?raw=true" width="28%" />
</p>

## API and Documentation

### Constructor

#### `new GifCreator(width, height, verbose = false)`

- **width**: `number` - The width of the output GIF.
- **height**: `number` - The height of the output GIF.
- **verbose**: `boolean` (optional) - If true, enables verbose logging. Default is `false`.

### Methods

#### `setOutput(outputPath)`

Sets the output path for the GIF.

- **outputPath**: `string` - The file path where the GIF will be saved.

#### `setRepeat(repeat)`

Sets the repeat option for the GIF.

- **repeat**: `boolean` - If true, the GIF will loop indefinitely. If false, it will not loop.

#### `setDelay(delay)`

Sets the delay between frames in the GIF.

- **delay**: `number` - The delay in milliseconds.

#### `setFrameRate(frameRate)`

Sets the frame rate for the GIF.

- **frameRate**: `number` - The frame rate in frames per second.

#### `setTransparent(color)`

Sets the transparent color for the GIF.

- **color**: `string` - The color to be made transparent in the GIF.

#### `setQuality(quality)`

Sets the quality of the GIF.

- **quality**: `number` - The quality level (1-31, where 1 is the best quality).

#### `setFfmpegPath()`

Sets the path for the FFmpeg executable.

#### `addFrame(imageData)`

Adds a frame to the GIF.

- **imageData**: `Buffer` or `Canvas` - The image data for the frame.

#### `addImage(imageFiles)`

Adds images to the GIF.

- **imageFiles**: `string` - The file path(s) of the images.

#### `addVideo(videoPath)`

Adds a video to the GIF.

- **videoPath**: `string` - The file path of the video.

#### `start()`

Starts the FFmpeg process to create the GIF.

#### `destroy()`

Destroys the FFmpeg command and cleans up resources.

### Events

#### `success`

Emitted when the FFmpeg process finishes successfully.

#### `error`

Emitted when there is an error during the FFmpeg process.

- **Parameters**: 
  - `err`: `Error` - The error object.


## Contributing
GifCreator is an OPEN Open Source Project. This means that:
Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. 

## License

[MIT LICENSE](./LICENSE)
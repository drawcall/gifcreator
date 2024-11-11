declare module 'gifcreator' {
  import { PassThrough } from 'stream';
  import { Canvas } from 'canvas';

  interface ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
  }

  class GifCreator {
    constructor(width: number, height: number, verbose?: boolean);

    setOutput(outputPath: string): void;
    setRepeat(repeat: boolean): void;
    setDelay(delay: number): void;
    setFrameRate(frameRate: number): void;
    setTransparent(color: number): void;
    setQuality(quality: number): void;
    addFrame(imageData: ImageData | Uint8ClampedArray | Canvas): void;
    addImage(imageFiles: string): void;
    setFfmpegPath(): void;
    addVideo(videoPath: string): void;
    start(): void;
    destroy(): void;
  }

  export = GifCreator;
}

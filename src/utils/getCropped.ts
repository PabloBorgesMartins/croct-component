import { PixelCrop } from 'react-image-crop'

const TO_RADIANS = Math.PI / 180

export async function getCropped(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;

  const cropScale = scaleX > scaleY ? scaleY : scaleX
  canvas.width = Math.floor(crop.width * cropScale * pixelRatio)
  canvas.height = Math.floor(crop.height * cropScale * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  //Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  //Scale the image
  ctx.scale(scale, scale);
  //Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);

  if (image.naturalWidth > image.naturalHeight) {
    ctx.drawImage(
      image,
      (image.naturalWidth - image.naturalHeight) / (2 * scale),
      0,
      image.naturalHeight,
      image.naturalHeight,
      0,
      0,
      image.naturalHeight,
      image.naturalHeight,
    )
  } else {
    ctx.drawImage(
      image,
      0,
      (image.naturalHeight - image.naturalWidth) / (2 * scale),
      image.naturalWidth,
      image.naturalWidth,
      0,
      0,
      image.naturalWidth,
      image.naturalWidth,
    )
  }

  ctx.restore();

  const base64Image = canvas.toDataURL("image/jpeg", 1);

  return base64Image;
}

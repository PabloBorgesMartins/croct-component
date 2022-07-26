import { PixelCrop } from 'react-image-crop'

const TO_RADIANS = Math.PI / 180

const getBlobFromCanvas = (canvas: HTMLCanvasElement, file: any, withUrl: any) =>
    new Promise<getCroppedImageProps>((resolve, reject) => {
        canvas.toBlob((blob: any) => {
            if (blob) {
                blob.name = file.name;
                blob.lastModified = file.lastModified;

                let blobUrl: any, revokeUrl;

                if (withUrl) {
                    blobUrl = URL.createObjectURL(blob);
                    revokeUrl = () => URL.revokeObjectURL(blobUrl);
                }

                resolve({ blob, blobUrl, revokeUrl });
            } else {
                reject(new Error("Canvas is empty"));
            }
        }, file.type);
    });

interface getCroppedImageProps {
    blob: any;
    blobUrl: any;
    revokeUrl: any;
}

export default async function getCropped(
    image: HTMLImageElement,
    crop: PixelCrop,
    scale = 1,
    file: File,
    withUrl = false
): Promise<getCroppedImageProps> {
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

    // canvas.width = Math.floor(crop.width * kingScale * pixelRatio);
    // canvas.height = Math.floor(crop.height * kingScale * pixelRatio);
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

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
            (image.naturalWidth - image.naturalHeight) / 2,
            0,
            image.naturalHeight,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        )
    } else {
        ctx.drawImage(
            image,
            0,
            (image.naturalHeight - image.naturalWidth) / 2,
            image.naturalWidth,
            image.naturalWidth,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        )
    }

    ctx.restore();

    return await getBlobFromCanvas(canvas, file, withUrl);
}

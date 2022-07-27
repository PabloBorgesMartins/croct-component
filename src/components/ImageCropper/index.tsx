import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop
} from 'react-image-crop'
import { getCropped } from '../../utils/getCropped';

import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imgSrc: string;
  setImgCropped: (val: any) => void;
  scale: number;
}

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropper({ imgSrc, scale, setImgCropped }: ImageCropperProps) {

  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const aspect = 1;

  const getCroppedImg = useCallback(async () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current
    )
      setImgCropped(
        await getCropped(
          imgRef.current,
          completedCrop,
          scale,
        )
      )
  }, [imgRef, completedCrop, scale, setImgCropped]);

  useEffect(() => {
    if (scale) {
      getCroppedImg();
    }
  }, [scale, getCroppedImg])

  const onImageLoad = useCallback(async (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect));
  }, [setCrop]);

  const handleCompleted = useCallback(() => {
    if (crop && imgRef.current?.width && imgRef.current?.height) {
      setCompletedCrop(
        convertToPixelCrop(
          crop, imgRef.current?.width, imgRef.current?.height
        )
      )
      getCroppedImg()
    }
  }, [setCompletedCrop, crop, imgRef, getCroppedImg]);

  return (
    <ReactCrop
      disabled
      crop={crop}
      onChange={(_, percentCrop) => setCrop(percentCrop)}
      onComplete={handleCompleted}
      aspect={aspect}
      circularCrop
    >
      <img
        ref={imgRef}
        alt="Crop me"
        src={imgSrc}
        style={{
          transform: `scale(${scale})`,
          objectFit: 'cover',
          width: 200,
          height: 200,
        }}
        onLoad={onImageLoad}
      />
    </ReactCrop>
  )
}
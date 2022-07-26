import React, { useState, useRef, useEffect, useCallback } from 'react'

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop
} from 'react-image-crop'
import { canvasPreview } from '../../utils/canvasPreview';
import { useDebounceEffect } from '../../utils/useDebounceEffect';
import { getCropped } from '../../utils/getCropped';

import 'react-image-crop/dist/ReactCrop.css';

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    console.log("media", mediaWidth, mediaHeight, aspect)
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

export function Demo({ }) {
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(1)

    //save the resulted image
    const [result, setResult] = useState("");
    const [image, setImage] = useState<HTMLImageElement>();

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, 1));
            setImage(e.currentTarget);
        }
    }

    useEffect(() => {
        console.log("crop agora", crop);
    }, [crop])

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    );

    const handleCompleted = useCallback((e: any) => {
        console.log("setCompletedCrop", e)
        // setCompletedCrop(e);
        if (crop && imgRef.current?.width && imgRef.current?.height)
            setCompletedCrop(
                convertToPixelCrop(
                    crop, imgRef.current?.width, imgRef.current?.height
                )
            )
    }, [setCompletedCrop, crop, imgRef]);

    const handleTeste = useCallback(() => {
        setScale(val => val + 0.1);
        // if (crop)
        //     setCrop({
        //         unit: '%',
        //         x: crop.x,
        //         y: crop.y,
        //         width: crop.width,
        //         height: crop.height
        //     })
    }, [crop, setCrop, setScale]);

    const getCroppedImg = useCallback(async () => {
        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current
        )
            setResult(
                await getCropped(
                    imgRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            )
    }, [imgRef, completedCrop, scale, rotate]);

    return (
        <div className="App">
            <div className="Crop-Controls">
                <input type="file" accept="image/*" onChange={onSelectFile} />
                <div>
                    <label htmlFor="scale-input">Scale: </label>
                    <input
                        id="scale-input"
                        type="number"
                        step="0.1"
                        value={scale}
                        disabled={!imgSrc}
                        onChange={(e) => setScale(Number(e.target.value))}
                    />
                </div>
                <div>
                    <button onClick={() => setScale(val => val - 0.1)}>
                        zoon out
                    </button>
                    <button onClick={() => setScale(val => val + 0.1)}>
                        {/* <button onClick={handleTeste}> */}
                        zoon in
                    </button>
                    <button onClick={getCroppedImg}>
                        crop
                    </button>
                </div>
            </div>

            {Boolean(imgSrc) && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    // onComplete={(c) => setCompletedCrop(c)}
                    onComplete={handleCompleted}
                    aspect={aspect}
                    circularCrop
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                            objectFit: 'cover',
                            width: 200,
                            height: 200,
                        }}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            )}
            <div>
                {Boolean(completedCrop) && (
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            // objectFit: 'cover',
                            width: 200,
                            height: 200,
                        }}
                    />
                )}
            </div>
            {result && (
                <div>
                    <img
                        style={{
                            border: '1px solid black',
                            width: 200,
                            height: 200,
                        }}
                        src={result}
                        alt="cropped image"
                    />
                </div>
            )}
        </div>
    )
}
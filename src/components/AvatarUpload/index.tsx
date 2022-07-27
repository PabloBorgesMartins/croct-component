import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Display
} from './styles';
import Dropzone, { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop } from 'react-image-crop';
import { ImageCropper } from "../ImageCropper";

type InputProps = JSX.IntrinsicElements['input'];

interface FileModified extends File {
  preview: string;
}

export function AvatarUpload({ ...props }: InputProps) {
  // const onDrop = useCallback((acceptedFiles: any) => {
  //   acceptedFiles.forEach((file: File) => {
  //     const reader = new FileReader()

  //     reader.onabort = () => console.log('file reading was aborted')
  //     reader.onerror = () => console.log('file reading has failed')
  //     reader.onload = (e) => {

  //       // Do whatever you want with the file contents
  //       const binaryStr = reader.result
  //       console.log(binaryStr)
  //     }
  //     reader.readAsArrayBuffer(file)
  //   })
  // }, [])
  // const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const [file, setFile] = useState<FileModified>();
  const [avatar, setAvatar] = useState("");
  const [scale, setScale] = useState(1);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg']
    },
    noDragEventsBubbling: true,
    noClick: file ? true : false,
    onDrop: acceptedFiles => {
      setFile(Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
      }))
      // setFiles(acceptedFiles.map(file => Object.assign(file, {
      //   preview: URL.createObjectURL(file)
      // })));
    }
  });

  useEffect(() => {
    if (file)
      return () => URL.revokeObjectURL(file.webkitRelativePath)
    // return () => files.forEach(file => URL.revokeObjectURL(file.webkitRelativePath));
  }, []);

  //change the aspect ratio of crop tool as you preferred
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50
  })


  return (
    <>
      <Container {...getRootProps()}>
        {
          file ? (
            <>
              <ImageCropper
                imgSrc={file.preview}
                scale={scale}
                setImgCropped={setAvatar}
              />
              <img
                alt="Crop me"
                src={avatar}
                style={{
                  width: 200,
                  height: 200,
                }}
              />
              <div>
                <button onClick={() => setScale(val => val - 0.1)}>
                  zoon out
                </button>
                <button onClick={() => setScale(val => val + 0.1)}>
                  zoon in
                </button>
              </div>
            </>
            // <Display>
            //   <ReactCrop
            //     circularCrop
            //     aspect={1}
            //     crop={crop}
            //     onChange={setCrop}
            //   >
            //     <img src={file.preview} />
            //   </ReactCrop>
            // </Display>
          ) : (
            <>
              <input {...getInputProps()} />
              <p>Organization Logo</p>
              <p>Drop the image here or click to browse.</p>
            </>
          )
        }
      </Container>
    </>
  )
}


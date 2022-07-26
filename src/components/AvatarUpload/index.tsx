import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Display
} from './styles';
import Dropzone, { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop } from 'react-image-crop';

type InputProps = JSX.IntrinsicElements['input'];

interface FileModified extends File {
  preview: string;
}

export function AvatarUpload({ ...props }: InputProps) {

  const [file, setFile] = useState<FileModified>();

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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg']
    },
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



  //save the image that used to be crop
  const [image, setImage] = useState(null);
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
            <Display>
              {/* <img src={file?.preview} alt="" /> */}
              <div>
                <ReactCrop
                  circularCrop
                  aspect={1}
                  // style={{ maxWidth: "50%" }}
                  crop={crop}
                  onChange={setCrop}
                >
                  <img src={file.preview} />
                </ReactCrop>
              </div>
              {/* <button onClick={getCroppedImg}>
                crop
              </button> */}
            </Display>
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


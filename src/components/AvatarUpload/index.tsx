// import React, { forwardRef } from 'react';
import {
  Container
} from './styles';
import Dropzone from 'react-dropzone';

type InputProps = JSX.IntrinsicElements['input'];

export function AvatarUpload({ ...props }: InputProps) {
  return (
    <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <Container {...getRootProps()}>
          <input {...getInputProps()}  {...props} />
          <p>Organization Logo</p>
          <p>Drop the image here or click to browse.</p>
        </Container>
      )}
    </Dropzone>
  );
}


import {
  Container
} from './styles';
import { AvatarUpload } from '../../components/AvatarUpload';
import { useState } from 'react';
import { Demo } from '../../components/CropImage';

export function Home() {

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleSubmitForm = (evt: any) => {
    evt.preventDefault();
    console.log("handleSubmitForm", evt.target.avatarUpload)
  }

  return (
    <Container>
      {/* <form
        onSubmit={handleSubmitForm}
      >
        <AvatarUpload
          name="avatarUpload"
          // onChange={(evt) => setSelectedFile(evt.target.files[0])}
        />
        <button type="submit">submit</button>
      </form> */}
      <Demo />
    </Container>
  );
}
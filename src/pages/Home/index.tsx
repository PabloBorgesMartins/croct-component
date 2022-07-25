import {
  Container
} from './styles';
import { AvatarUpload } from '../../components/AvatarUpload';

export function Home() {

  const handleSubmitForm = (evt: any) => {
    evt.preventDefault();
    console.log("handleSubmitForm", evt.target.avatarUpload)
  }

  return (
    <Container>
      <form
        onSubmit={handleSubmitForm}
      >
        <AvatarUpload name="avatarUpload" />
        <button type="submit">submit</button>
      </form>
    </Container>
  );
}
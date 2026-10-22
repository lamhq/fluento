import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { useAuth } from '../auth';
import { Actions, Container, Description, Title } from './ErrorScreen';

export default function UnauthorizedErrorScreen() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  return (
    <Container>
      <Title>Unauthorized Access</Title>
      <Description>
        Please log in with the appropriate credentials to access this resource.
      </Description>
      <Actions>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => void signIn()}>Sign In</Button>
      </Actions>
    </Container>
  );
}

import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { Actions, Container, Description, Title } from './ErrorScreen';

export default function NotFoundErrorScreen() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Oops! Page Not Found!</Title>
      <Description>
        It seems like the page you're looking for does not exist or might have been
        removed.
      </Description>
      <Actions>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </Actions>
    </Container>
  );
}

import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { Actions, Container, Description, Title } from './ErrorScreen';

export default function GeneralErrorScreen() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Oops! Something went wrong :')</Title>
      <Description>
        We apologize for the inconvenience. Please try again later.
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

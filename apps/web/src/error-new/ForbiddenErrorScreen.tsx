import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { Actions, Container, Description, Title } from './ErrorScreen';

export default function ForbiddenErrorScreen() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Access Forbidden</Title>
      <Description>
        You don't have necessary permission to view this resource.
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

import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { Actions, Container, Description, Title } from './ErrorScreen';

interface NetworkErrorScreenProps {
  onRetry: () => void;
}

export default function NetworkErrorScreen({ onRetry }: NetworkErrorScreenProps) {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Network Error</Title>
      <Description>
        No network connection. Check your connection and try again.
      </Description>
      <Actions>
        <Button onClick={onRetry}>Retry</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Actions>
    </Container>
  );
}

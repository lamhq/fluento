import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { Actions, Container, Description, Title } from './ErrorScreen';

interface GeneralErrorScreenProps {
  onRetry: () => void;
}

export default function GeneralErrorScreen({ onRetry }: GeneralErrorScreenProps) {
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
        <Button onClick={onRetry}>Retry</Button>
      </Actions>
    </Container>
  );
}

import { Link } from 'react-router';

export interface AuthErrorViewProps {
  errorMessage?: string;
  homeRoute: string;
}

export default function AuthErrorView({
  errorMessage,
  homeRoute,
}: AuthErrorViewProps) {
  return (
    <>
      <p>{errorMessage}</p>
      <Link to={homeRoute}>Return</Link>
    </>
  );
}

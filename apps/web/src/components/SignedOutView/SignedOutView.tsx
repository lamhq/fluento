import { Link } from 'react-router';

export interface SignedOutViewProps {
  onSignIn: () => void;
  homeRoute: string;
}

export default function SignedOutView({ onSignIn, homeRoute }: SignedOutViewProps) {
  return (
    <>
      <p>You have been signed out.</p>
      <p>
        To sign in again, choose the <strong>Sign In</strong> button below.
      </p>
      <p>
        Or return to &nbsp;
        <Link to={homeRoute}>home page</Link>.
      </p>
      <p>
        <button onClick={onSignIn}>sign in</button>
      </p>
    </>
  );
}

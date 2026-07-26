import './style.css';

import heroImg from '../../assets/hero.png';
import reactLogo from '../../assets/react.svg';
import viteLogo from '../../assets/vite.svg';
import SignOutButton from '../../components/SignOutButton';

export default function Home() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>Click below button to sign out</p>
        </div>
        <SignOutButton />
      </section>
    </>
  );
}

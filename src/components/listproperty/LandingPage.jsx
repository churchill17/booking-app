import LandingHero from "./components/LandingHero.jsx";

export default function LandingPage({ user, onContinue, onCreateNew }) {
  return (
    <LandingHero
      user={user}
      onContinue={onContinue}
      onCreateNew={onCreateNew}
    />
  );
}

import LandingHero from "./components/LandingHero.jsx";

export default function LandingPage({ user, drafts, onContinue, onCreateNew }) {
  return (
    <LandingHero
      user={user}
      drafts={drafts}
      onContinue={onContinue}
      onCreateNew={onCreateNew}
    />
  );
}

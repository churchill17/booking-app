
export default function ScoreLabel({ score }) {
  if (score >= 9) return "Superb";
  if (score >= 8) return "Very good";
  if (score >= 7) return "Good";
  return "Pleasant";
}
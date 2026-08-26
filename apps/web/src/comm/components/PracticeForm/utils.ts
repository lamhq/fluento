export function getFeedbackScoreIcon(score: number) {
  const normalizedScore = Math.round(score);

  if (normalizedScore >= 90) {
    return '🌟';
  }

  if (normalizedScore >= 70) {
    return '😊';
  }

  if (normalizedScore >= 40) {
    return '😐';
  }

  return '😕';
}

export function normalizeLearnerResponse(response: string): string {
  const trimmed = response.trim();
  if (!trimmed) {
    return '';
  }

  const sentences = trimmed
    .match(/[^.!?]+(?:[.!?]+|$)/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => {
      const cleaned = sentence.replace(/\s+/g, ' ');
      if (!cleaned) {
        return cleaned;
      }

      const withPronounCapitalization = cleaned.replace(/\bi\b/g, 'I');
      return `${withPronounCapitalization.charAt(0).toUpperCase()}${withPronounCapitalization.slice(1)}`;
    });

  if (!sentences || sentences.length === 0) {
    return '';
  }

  const normalized = sentences.join(' ');
  if (!/[.!?]$/.test(normalized)) {
    return `${normalized}.`;
  }

  return normalized;
}

export function getFeedbackTitle(score: number) {
  const normalizedScore = Math.round(score);

  if (normalizedScore >= 90) {
    return 'Excellent work!';
  }

  if (normalizedScore >= 70) {
    return 'Good job!';
  }

  if (normalizedScore >= 40) {
    return 'Keep practicing.';
  }

  return 'Needs improvement.';
}

export function getFeedbackIcon(score: number) {
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

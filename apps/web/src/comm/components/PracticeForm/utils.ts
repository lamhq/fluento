export function normalizeLearnerResponse(response: string): string {
  const trimmed = response.trim();
  if (!trimmed) {
    return '';
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+|\s*\.\s*|\s*\?\s*|\s*!\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => {
      const cleaned = sentence.replace(/\s+/g, ' ');
      if (!cleaned) {
        return cleaned;
      }

      return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
    });

  const normalized = sentences.join('. ');
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

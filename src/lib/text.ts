import { STOPWORDS } from './stopwords'

/**
 * Tokenize text and return word frequency map
 * - Lowercase all words
 * - Filter out stopwords
 * - Keep only words with 3+ characters
 */
export function getWordFrequency(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => 
      word.length >= 3 && 
      !STOPWORDS.has(word) &&
      !/^\d+$/.test(word) // Filter out pure numbers
    )

  const frequency = new Map<string, number>()
  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1)
  }

  return frequency
}

/**
 * Get top N words by frequency
 */
export function getTopWords(frequency: Map<string, number>, n: number = 15): Array<{ word: string; count: number }> {
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }))
}




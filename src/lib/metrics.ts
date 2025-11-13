import type { Database } from './supabase/database.types'

type Bet = Database['public']['Tables']['Bet']['Row']

/**
 * Calculate Brier score for a set of resolved bets
 * Brier score = mean((probability - outcome)^2)
 * Lower is better (0 = perfect, 1 = worst)
 * 
 * Returns null if no resolved bets with outcomes
 */
export function calculateBrierScore(bets: Bet[]): number | null {
  const resolvedBets = bets.filter(
    bet => bet.status === 'resolved' && bet.outcome !== null
  )

  if (resolvedBets.length === 0) {
    return null
  }

  const sum = resolvedBets.reduce((acc, bet) => {
    const outcome = bet.outcome ? 1 : 0
    const error = bet.probability - outcome
    return acc + error * error
  }, 0)

  return sum / resolvedBets.length
}

/**
 * Count bets by status
 */
export function countBetsByStatus(bets: Bet[]): { open: number; resolved: number } {
  return bets.reduce(
    (acc, bet) => {
      if (bet.status === 'open') {
        acc.open++
      } else if (bet.status === 'resolved') {
        acc.resolved++
      }
      return acc
    },
    { open: 0, resolved: 0 }
  )
}



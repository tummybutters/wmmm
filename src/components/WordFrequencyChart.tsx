'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WordFrequencyChartProps {
  data: Array<{ word: string; count: number }>
}

export function WordFrequencyChart({ data }: WordFrequencyChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No entries in the last 7 days
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="word" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}


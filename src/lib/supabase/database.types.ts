export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      Entry: {
        Row: {
          id: string
          user_id: string
          kind: 'journal' | 'belief' | 'note'
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: 'journal' | 'belief' | 'note'
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: 'journal' | 'belief' | 'note'
          text?: string
          created_at?: string
        }
      }
      Bet: {
        Row: {
          id: string
          user_id: string
          source: 'personal'
          statement: string
          probability: number
          status: 'open' | 'resolved'
          outcome: boolean | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          source: 'personal'
          statement: string
          probability: number
          status: 'open' | 'resolved'
          outcome?: boolean | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          source?: 'personal'
          statement?: string
          probability?: number
          status?: 'open' | 'resolved'
          outcome?: boolean | null
          created_at?: string
          resolved_at?: string | null
        }
      }
    }
  }
}



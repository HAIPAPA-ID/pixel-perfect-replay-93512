export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      barber_cash_advance_payments: {
        Row: {
          amount: number
          cash_advance_id: string
          commission_payment_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_type: string
          recorded_by: string
        }
        Insert: {
          amount: number
          cash_advance_id: string
          commission_payment_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_type?: string
          recorded_by: string
        }
        Update: {
          amount?: number
          cash_advance_id?: string
          commission_payment_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_type?: string
          recorded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_cash_advance_payments_cash_advance_id_fkey"
            columns: ["cash_advance_id"]
            isOneToOne: false
            referencedRelation: "barber_cash_advances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_cash_advance_payments_commission_payment_id_fkey"
            columns: ["commission_payment_id"]
            isOneToOne: false
            referencedRelation: "commission_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_cash_advance_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_cash_advances: {
        Row: {
          advance_date: string
          amount: number
          barber_id: string
          created_at: string
          disbursement_method: string
          id: string
          notes: string | null
          outlet_id: string
          recorded_by: string
          remaining_amount: number
          status: string
        }
        Insert: {
          advance_date?: string
          amount: number
          barber_id: string
          created_at?: string
          disbursement_method?: string
          id?: string
          notes?: string | null
          outlet_id: string
          recorded_by: string
          remaining_amount: number
          status?: string
        }
        Update: {
          advance_date?: string
          amount?: number
          barber_id?: string
          created_at?: string
          disbursement_method?: string
          id?: string
          notes?: string | null
          outlet_id?: string
          recorded_by?: string
          remaining_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_cash_advances_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_cash_advances_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_cash_advances_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_service_prices: {
        Row: {
          barber_id: string
          commission_rate: number
          id: string
          is_active: boolean
          price: number
          service_id: string
        }
        Insert: {
          barber_id: string
          commission_rate?: number
          id?: string
          is_active?: boolean
          price: number
          service_id: string
        }
        Update: {
          barber_id?: string
          commission_rate?: number
          id?: string
          is_active?: boolean
          price?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_service_prices_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_service_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      barbers: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          outlet_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean
          outlet_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          outlet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "barbers_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_approval_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          barber_id: string | null
          cash_advance_id: string | null
          cash_session_id: string | null
          cashier_approved_at: string | null
          cashier_approved_by: string | null
          cashier_id: string
          category: string | null
          created_at: string
          description: string
          expense_id: string | null
          id: string
          notes: string | null
          outlet_id: string
          owner_approved_at: string | null
          owner_approved_by: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          request_type: string
          requested_by: string
          requester_role: string
          status: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          barber_id?: string | null
          cash_advance_id?: string | null
          cash_session_id?: string | null
          cashier_approved_at?: string | null
          cashier_approved_by?: string | null
          cashier_id: string
          category?: string | null
          created_at?: string
          description: string
          expense_id?: string | null
          id?: string
          notes?: string | null
          outlet_id: string
          owner_approved_at?: string | null
          owner_approved_by?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          request_type: string
          requested_by: string
          requester_role: string
          status?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          barber_id?: string | null
          cash_advance_id?: string | null
          cash_session_id?: string | null
          cashier_approved_at?: string | null
          cashier_approved_by?: string | null
          cashier_id?: string
          category?: string | null
          created_at?: string
          description?: string
          expense_id?: string | null
          id?: string
          notes?: string | null
          outlet_id?: string
          owner_approved_at?: string | null
          owner_approved_by?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          request_type?: string
          requested_by?: string
          requester_role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_approval_cash_session_fkey"
            columns: ["cash_session_id"]
            isOneToOne: false
            referencedRelation: "cash_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_cashier_approved_by_fkey"
            columns: ["cashier_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_owner_approved_by_fkey"
            columns: ["owner_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_cash_advance_id_fkey"
            columns: ["cash_advance_id"]
            isOneToOne: false
            referencedRelation: "barber_cash_advances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_deposits: {
        Row: {
          amount: number
          bank_reference: string | null
          cash_movement_id: string | null
          cash_session_id: string | null
          cashier_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          deposit_destination: string
          deposit_method: string
          deposited_at: string
          id: string
          notes: string | null
          outlet_id: string
          recipient_name: string | null
          status: string
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          cash_movement_id?: string | null
          cash_session_id?: string | null
          cashier_id: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          deposit_destination: string
          deposit_method?: string
          deposited_at?: string
          id?: string
          notes?: string | null
          outlet_id: string
          recipient_name?: string | null
          status?: string
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          cash_movement_id?: string | null
          cash_session_id?: string | null
          cashier_id?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          deposit_destination?: string
          deposit_method?: string
          deposited_at?: string
          id?: string
          notes?: string | null
          outlet_id?: string
          recipient_name?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_deposits_cash_movement_id_fkey"
            columns: ["cash_movement_id"]
            isOneToOne: false
            referencedRelation: "cash_movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_deposits_cash_session_id_fkey"
            columns: ["cash_session_id"]
            isOneToOne: false
            referencedRelation: "cash_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_deposits_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_deposits_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_deposits_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_movements: {
        Row: {
          amount: number
          cash_session_id: string | null
          cashier_id: string
          created_at: string
          description: string | null
          direction: string
          id: string
          movement_date: string
          movement_type: string
          outlet_id: string
          reference_id: string | null
          source_id: string | null
          source_type: string | null
        }
        Insert: {
          amount: number
          cash_session_id?: string | null
          cashier_id: string
          created_at?: string
          description?: string | null
          direction: string
          id?: string
          movement_date?: string
          movement_type: string
          outlet_id: string
          reference_id?: string | null
          source_id?: string | null
          source_type?: string | null
        }
        Update: {
          amount?: number
          cash_session_id?: string | null
          cashier_id?: string
          created_at?: string
          description?: string | null
          direction?: string
          id?: string
          movement_date?: string
          movement_type?: string
          outlet_id?: string
          reference_id?: string | null
          source_id?: string | null
          source_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_movements_cash_session_id_fkey"
            columns: ["cash_session_id"]
            isOneToOne: false
            referencedRelation: "cash_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_movements_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_movements_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_sessions: {
        Row: {
          actual_closing_balance: number | null
          cash_difference: number | null
          cashier_id: string
          closed_at: string | null
          created_at: string
          expected_closing_balance: number | null
          id: string
          notes: string | null
          opened_at: string
          opening_balance: number
          outlet_id: string
          session_date: string
          status: string
        }
        Insert: {
          actual_closing_balance?: number | null
          cash_difference?: number | null
          cashier_id: string
          closed_at?: string | null
          created_at?: string
          expected_closing_balance?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opening_balance?: number
          outlet_id: string
          session_date: string
          status?: string
        }
        Update: {
          actual_closing_balance?: number | null
          cash_difference?: number | null
          cashier_id?: string
          closed_at?: string | null
          created_at?: string
          expected_closing_balance?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opening_balance?: number
          outlet_id?: string
          session_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_sessions_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_sessions_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      colors: {
        Row: {
          blue: number | null
          green: number | null
          hex: string
          hue: number | null
          id: number
          light_hsl: number | null
          name: string | null
          red: number | null
          sat_hsl: number | null
          sat_hsv: number | null
          source: Database["public"]["Enums"]["color_source"] | null
          val_hsv: number | null
        }
        Insert: {
          blue?: number | null
          green?: number | null
          hex: string
          hue?: number | null
          id?: number
          light_hsl?: number | null
          name?: string | null
          red?: number | null
          sat_hsl?: number | null
          sat_hsv?: number | null
          source?: Database["public"]["Enums"]["color_source"] | null
          val_hsv?: number | null
        }
        Update: {
          blue?: number | null
          green?: number | null
          hex?: string
          hue?: number | null
          id?: number
          light_hsl?: number | null
          name?: string | null
          red?: number | null
          sat_hsl?: number | null
          sat_hsv?: number | null
          source?: Database["public"]["Enums"]["color_source"] | null
          val_hsv?: number | null
        }
        Relationships: []
      }
      commission_payment_items: {
        Row: {
          amount: number
          commission_id: string
          commission_payment_id: string
          created_at: string
          id: string
        }
        Insert: {
          amount: number
          commission_id: string
          commission_payment_id: string
          created_at?: string
          id?: string
        }
        Update: {
          amount?: number
          commission_id?: string
          commission_payment_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payment_items_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payment_items_commission_payment_id_fkey"
            columns: ["commission_payment_id"]
            isOneToOne: false
            referencedRelation: "commission_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payments: {
        Row: {
          amount: number
          barber_id: string
          created_at: string
          debt_deduction: number
          id: string
          net_amount: number | null
          notes: string | null
          outlet_id: string
          paid_by: string
          payment_date: string
          payment_method: string
          period_end: string | null
          period_start: string | null
        }
        Insert: {
          amount: number
          barber_id: string
          created_at?: string
          debt_deduction?: number
          id?: string
          net_amount?: number | null
          notes?: string | null
          outlet_id: string
          paid_by: string
          payment_date?: string
          payment_method: string
          period_end?: string | null
          period_start?: string | null
        }
        Update: {
          amount?: number
          barber_id?: string
          created_at?: string
          debt_deduction?: number
          id?: string
          net_amount?: number | null
          notes?: string | null
          outlet_id?: string
          paid_by?: string
          payment_date?: string
          payment_method?: string
          period_end?: string | null
          period_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_payments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_settings: {
        Row: {
          barber_id: string | null
          commission_rate: number
          id: string
          is_active: boolean
          outlet_id: string
          service_id: string
          updated_at: string
        }
        Insert: {
          barber_id?: string | null
          commission_rate?: number
          id?: string
          is_active?: boolean
          outlet_id: string
          service_id: string
          updated_at?: string
        }
        Update: {
          barber_id?: string | null
          commission_rate?: number
          id?: string
          is_active?: boolean
          outlet_id?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_settings_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_settings_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_settings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          barber_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          outlet_id: string
          paid_at: string | null
          status: string
          transaction_item_id: string
        }
        Insert: {
          barber_id: string
          commission_amount: number
          commission_rate: number
          created_at?: string
          id?: string
          outlet_id: string
          paid_at?: string | null
          status?: string
          transaction_item_id: string
        }
        Update: {
          barber_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          outlet_id?: string
          paid_at?: string | null
          status?: string
          transaction_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_transaction_item_id_fkey"
            columns: ["transaction_item_id"]
            isOneToOne: true
            referencedRelation: "transaction_items"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          cashier_id: string | null
          category: string
          created_at: string
          description: string | null
          entered_by: string
          expense_date: string
          id: string
          outlet_id: string
          payment_method: string
        }
        Insert: {
          amount: number
          cashier_id?: string | null
          category: string
          created_at?: string
          description?: string | null
          entered_by: string
          expense_date?: string
          id?: string
          outlet_id: string
          payment_method?: string
        }
        Update: {
          amount?: number
          cashier_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          entered_by?: string
          expense_date?: string
          id?: string
          outlet_id?: string
          payment_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      outlet_service_prices: {
        Row: {
          commission_rate: number
          id: string
          is_active: boolean
          max_price: number | null
          outlet_id: string
          price: number
          price_type: string
          service_id: string
        }
        Insert: {
          commission_rate?: number
          id?: string
          is_active?: boolean
          max_price?: number | null
          outlet_id: string
          price: number
          price_type?: string
          service_id: string
        }
        Update: {
          commission_rate?: number
          id?: string
          is_active?: boolean
          max_price?: number | null
          outlet_id?: string
          price?: number
          price_type?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outlet_service_prices_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outlet_service_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      outlets: {
        Row: {
          address: string | null
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          timezone: string
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          timezone?: string
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          timezone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          role: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          role: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          barber_id: string
          barber_name_snapshot: string
          commission_amount: number
          commission_rate_snapshot: number
          discount_amount: number
          id: string
          line_total: number
          quantity: number
          service_id: string
          service_name_snapshot: string
          transaction_id: string
          unit_price: number
        }
        Insert: {
          barber_id: string
          barber_name_snapshot: string
          commission_amount: number
          commission_rate_snapshot: number
          discount_amount?: number
          id?: string
          line_total: number
          quantity?: number
          service_id: string
          service_name_snapshot: string
          transaction_id: string
          unit_price: number
        }
        Update: {
          barber_id?: string
          barber_name_snapshot?: string
          commission_amount?: number
          commission_rate_snapshot?: number
          discount_amount?: number
          id?: string
          line_total?: number
          quantity?: number
          service_id?: string
          service_name_snapshot?: string
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          cash_session_id: string | null
          cashier_id: string
          created_at: string
          customer_id: string
          customer_name_snapshot: string
          discount_amount: number
          id: string
          outlet_id: string
          payment_method: string
          payment_status: string
          receipt_no: string
          status: string
          subtotal: number
          total_amount: number
          void_approved_by: string | null
          void_reason: string | null
          void_requested_by: string | null
        }
        Insert: {
          cash_session_id?: string | null
          cashier_id: string
          created_at?: string
          customer_id: string
          customer_name_snapshot: string
          discount_amount?: number
          id?: string
          outlet_id: string
          payment_method: string
          payment_status?: string
          receipt_no: string
          status?: string
          subtotal: number
          total_amount: number
          void_approved_by?: string | null
          void_reason?: string | null
          void_requested_by?: string | null
        }
        Update: {
          cash_session_id?: string | null
          cashier_id?: string
          created_at?: string
          customer_id?: string
          customer_name_snapshot?: string
          discount_amount?: number
          id?: string
          outlet_id?: string
          payment_method?: string
          payment_status?: string
          receipt_no?: string
          status?: string
          subtotal?: number
          total_amount?: number
          void_approved_by?: string | null
          void_reason?: string | null
          void_requested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_cash_session_id_fkey"
            columns: ["cash_session_id"]
            isOneToOne: false
            referencedRelation: "cash_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_void_approved_by_fkey"
            columns: ["void_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_void_requested_by_fkey"
            columns: ["void_requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_outlets: {
        Row: {
          outlet_id: string
          user_id: string
        }
        Insert: {
          outlet_id: string
          user_id: string
        }
        Update: {
          outlet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_outlets_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_outlets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_cash_approval: { Args: { p_request_id: string }; Returns: string }
      can_access_outlet: {
        Args: { target_outlet_id: string }
        Returns: boolean
      }
      can_manage_outlet: {
        Args: { target_outlet_id: string }
        Returns: boolean
      }
      close_cash_session: {
        Args: {
          p_actual_closing_balance: number
          p_notes?: string
          p_session_id: string
        }
        Returns: number
      }
      confirm_cash_deposit: { Args: { p_deposit_id: string }; Returns: string }
      current_user_role: { Args: never; Returns: string }
      get_cashier_cash_balance: {
        Args: { p_cashier_id: string; p_outlet_id: string }
        Returns: number
      }
      open_cash_session: {
        Args: {
          p_notes?: string
          p_opening_balance?: number
          p_outlet_id: string
        }
        Returns: string
      }
      pay_barber_commission:
        | {
            Args: {
              p_barber_id: string
              p_items: Json
              p_notes: string
              p_outlet_id: string
              p_payment_method: string
              p_period_end: string
              p_period_start: string
            }
            Returns: string
          }
        | {
            Args: {
              p_barber_id: string
              p_debt_deduction: number
              p_items: Json
              p_notes: string
              p_outlet_id: string
              p_payment_method: string
              p_period_end: string
              p_period_start: string
            }
            Returns: string
          }
      record_barber_cash_advance:
        | {
            Args: {
              p_amount: number
              p_barber_id: string
              p_notes?: string
              p_outlet_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_amount: number
              p_barber_id: string
              p_disbursement_method?: string
              p_notes?: string
              p_outlet_id: string
            }
            Returns: string
          }
      record_cash_deposit: {
        Args: {
          p_amount: number
          p_bank_reference?: string
          p_deposit_destination: string
          p_deposit_method?: string
          p_notes?: string
          p_outlet_id: string
          p_recipient_name?: string
        }
        Returns: string
      }
      record_operational_expense: {
        Args: {
          p_amount: number
          p_cashier_id?: string
          p_category: string
          p_description: string
          p_outlet_id: string
          p_payment_method: string
        }
        Returns: string
      }
      record_owner_barber_debt_transfer: {
        Args: {
          p_amount: number
          p_barber_id: string
          p_notes?: string
          p_outlet_id: string
        }
        Returns: string
      }
      reject_cash_approval: {
        Args: { p_rejection_reason: string; p_request_id: string }
        Returns: string
      }
      reject_cash_deposit: {
        Args: { p_deposit_id: string; p_reason: string }
        Returns: string
      }
      request_cash_approval: {
        Args: {
          p_amount: number
          p_barber_id?: string
          p_cashier_id: string
          p_category?: string
          p_description: string
          p_notes?: string
          p_outlet_id: string
          p_request_type: string
        }
        Returns: string
      }
      sync_transaction_commissions: {
        Args: { p_transaction_id: string }
        Returns: undefined
      }
    }
    Enums: {
      color_source:
        | "99COLORS_NET"
        | "ART_PAINTS_YG07S"
        | "BYRNE"
        | "CRAYOLA"
        | "CMYK_COLOR_MODEL"
        | "COLORCODE_IS"
        | "COLORHEXA"
        | "COLORXS"
        | "CORNELL_UNIVERSITY"
        | "COLUMBIA_UNIVERSITY"
        | "DUKE_UNIVERSITY"
        | "ENCYCOLORPEDIA_COM"
        | "ETON_COLLEGE"
        | "FANTETTI_AND_PETRACCHI"
        | "FINDTHEDATA_COM"
        | "FERRARIO_1919"
        | "FEDERAL_STANDARD_595"
        | "FLAG_OF_INDIA"
        | "FLAG_OF_SOUTH_AFRICA"
        | "GLAZEBROOK_AND_BALDRY"
        | "GOOGLE"
        | "HEXCOLOR_CO"
        | "ISCC_NBS"
        | "KELLY_MOORE"
        | "MATTEL"
        | "MAERZ_AND_PAUL"
        | "MILK_PAINT"
        | "MUNSELL_COLOR_WHEEL"
        | "NATURAL_COLOR_SYSTEM"
        | "PANTONE"
        | "PLOCHERE"
        | "POURPRE_COM"
        | "RAL"
        | "RESENE"
        | "RGB_COLOR_MODEL"
        | "THOM_POOLE"
        | "UNIVERSITY_OF_ALABAMA"
        | "UNIVERSITY_OF_CALIFORNIA_DAVIS"
        | "UNIVERSITY_OF_CAMBRIDGE"
        | "UNIVERSITY_OF_NORTH_CAROLINA"
        | "UNIVERSITY_OF_TEXAS_AT_AUSTIN"
        | "X11_WEB"
        | "XONA_COM"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      color_source: [
        "99COLORS_NET",
        "ART_PAINTS_YG07S",
        "BYRNE",
        "CRAYOLA",
        "CMYK_COLOR_MODEL",
        "COLORCODE_IS",
        "COLORHEXA",
        "COLORXS",
        "CORNELL_UNIVERSITY",
        "COLUMBIA_UNIVERSITY",
        "DUKE_UNIVERSITY",
        "ENCYCOLORPEDIA_COM",
        "ETON_COLLEGE",
        "FANTETTI_AND_PETRACCHI",
        "FINDTHEDATA_COM",
        "FERRARIO_1919",
        "FEDERAL_STANDARD_595",
        "FLAG_OF_INDIA",
        "FLAG_OF_SOUTH_AFRICA",
        "GLAZEBROOK_AND_BALDRY",
        "GOOGLE",
        "HEXCOLOR_CO",
        "ISCC_NBS",
        "KELLY_MOORE",
        "MATTEL",
        "MAERZ_AND_PAUL",
        "MILK_PAINT",
        "MUNSELL_COLOR_WHEEL",
        "NATURAL_COLOR_SYSTEM",
        "PANTONE",
        "PLOCHERE",
        "POURPRE_COM",
        "RAL",
        "RESENE",
        "RGB_COLOR_MODEL",
        "THOM_POOLE",
        "UNIVERSITY_OF_ALABAMA",
        "UNIVERSITY_OF_CALIFORNIA_DAVIS",
        "UNIVERSITY_OF_CAMBRIDGE",
        "UNIVERSITY_OF_NORTH_CAROLINA",
        "UNIVERSITY_OF_TEXAS_AT_AUSTIN",
        "X11_WEB",
        "XONA_COM",
      ],
    },
  },
} as const

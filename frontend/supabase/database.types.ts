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
      events: {
        Row: {
          data: Json | null
          id: number
          project_id: string
          timestamp: string
          transaction_id: string | null
          type: string
        }
        Insert: {
          data?: Json | null
          id?: number
          project_id: string
          timestamp?: string
          transaction_id?: string | null
          type: string
        }
        Update: {
          data?: Json | null
          id?: number
          project_id?: string
          timestamp?: string
          transaction_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: number
          project_id: string
          user_address: string
        }
        Insert: {
          id?: number
          project_id: string
          user_address: string
        }
        Update: {
          id?: number
          project_id?: string
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "notifications_user_address_fkey"
            columns: ["user_address"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["address"]
          }
        ]
      }
      projects: {
        Row: {
          banner_image: string | null
          contract_address: string | null
          created_at: string | null
          description: string | null
          discord: string | null
          logo: string | null
          long_description: string | null
          name: string | null
          network: string | null
          owner: string
          project_id: string
          token_symbol: string | null
          twitter: string | null
          website: string | null
        }
        Insert: {
          banner_image?: string | null
          contract_address?: string | null
          created_at?: string | null
          description?: string | null
          discord?: string | null
          logo?: string | null
          long_description?: string | null
          name?: string | null
          network?: string | null
          owner: string
          project_id: string
          token_symbol?: string | null
          twitter?: string | null
          website?: string | null
        }
        Update: {
          banner_image?: string | null
          contract_address?: string | null
          created_at?: string | null
          description?: string | null
          discord?: string | null
          logo?: string | null
          long_description?: string | null
          name?: string | null
          network?: string | null
          owner?: string
          project_id?: string
          token_symbol?: string | null
          twitter?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["address"]
          }
        ]
      }
      rankings: {
        Row: {
          created_at: string | null
          max_supply: number | null
          num_holders: number | null
          num_participants: number | null
          num_proposals: number | null
          nft_count: number
          numbers: Json | null
          payment_currency: string | null
          price: number | null
          project_id: string
          total_funding: number
          total_supply: number | null
          treasury_value: number | null
          tvl: number | null
          volume_24h: number | null
          week_funding: number | null
        }
        Insert: {
          created_at?: string | null
          max_supply?: number | null
          num_holders?: number | null
          num_participants?: number | null
          num_proposals?: number | null
          nft_count: number
          numbers?: Json | null
          payment_currency?: string | null
          price?: number | null
          project_id: string
          total_funding?: number
          total_supply?: number | null
          treasury_value?: number | null
          tvl?: number | null
          volume_24h?: number | null
          week_funding?: number | null
        }
        Update: {
          created_at?: string | null
          max_supply?: number | null
          num_holders?: number | null
          num_participants?: number | null
          nft_count: number
          num_proposals?: number | null
          numbers?: Json | null
          payment_currency?: string | null
          price?: number | null
          project_id?: string
          total_funding?: number
          total_supply?: number | null
          treasury_value?: number | null
          tvl?: number | null
          volume_24h?: number | null
          week_funding?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rankings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      user_funding: {
        Row: {
          address: string
          amount: number | null
          id: number
          num_nfts: number | null
          project_id: string | null
        }
        Insert: {
          address: string
          amount?: number | null
          id?: number
          num_nfts?: number | null
          project_id?: string | null
        }
        Update: {
          address?: string
          amount?: number | null
          id?: number
          num_nfts?: number | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_funding_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      users: {
        Row: {
          address: string
        }
        Insert: {
          address: string
        }
        Update: {
          address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_fund: {
        Args: {
          _project_id: string
          _usd_amount: number
          _transaction_id: string
          _data: Json
          _type: string
          _funder: string
        }
        Returns: undefined
      }
      save_fund_without_event: {
        Args: {
          _project_id: string
          _usd_amount: number
          _funder: string
        }
        Returns: undefined
      }
      save_nft_fund: {
        Args: {
          _project_id: string
          _type: string
          _data: Json
          _transaction_id: string
          _funder: string
          _amount: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

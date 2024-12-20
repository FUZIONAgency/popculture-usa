export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_tags_relation: {
        Row: {
          blog_id: string | null
          created_at: string
          id: string
          tag_id: string | null
        }
        Insert: {
          blog_id?: string | null
          created_at?: string
          id?: string
          tag_id?: string | null
        }
        Update: {
          blog_id?: string | null
          created_at?: string
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_tags_relation_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_tags_relation_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_id: string | null
          blog_image_url: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          blog_image_url?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          blog_image_url?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_invitations: {
        Row: {
          campaign_id: string | null
          created_at: string
          email: string | null
          expires_at: string | null
          id: string
          status: string | null
          token: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          token?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_invitations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_players: {
        Row: {
          campaign_id: string
          id: string
          joined_at: string | null
          player_id: string
          role_type: string
          status: string | null
        }
        Insert: {
          campaign_id?: string
          id?: string
          joined_at?: string | null
          player_id?: string
          role_type: string
          status?: string | null
        }
        Update: {
          campaign_id?: string
          id?: string
          joined_at?: string | null
          player_id?: string
          role_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_players_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          game_system_id: string
          id: string
          max_players: number
          min_players: number
          price: number
          retailer_id: string | null
          status: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_system_id?: string
          id?: string
          max_players?: number
          min_players?: number
          price?: number
          retailer_id?: string | null
          status?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          game_system_id?: string
          id?: string
          max_players?: number
          min_players?: number
          price?: number
          retailer_id?: string | null
          status?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          budget: string
          created_at: string
          email: string
          id: string
          name: string
          templateType: string
          website: string | null
        }
        Insert: {
          budget: string
          created_at?: string
          email: string
          id?: string
          name: string
          templateType: string
          website?: string | null
        }
        Update: {
          budget?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          templateType?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conventions: {
        Row: {
          carousel_image: string | null
          created_at: string
          description: string | null
          end_date: string
          expected_attendees: number | null
          id: string
          image_url: string
          is_featured: boolean | null
          location: string
          name: string
          registration_url: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          venue: string
          website_url: string | null
        }
        Insert: {
          carousel_image?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          expected_attendees?: number | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          location: string
          name: string
          registration_url?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          venue: string
          website_url?: string | null
        }
        Update: {
          carousel_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          expected_attendees?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          location?: string
          name?: string
          registration_url?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          venue?: string
          website_url?: string | null
        }
        Relationships: []
      }
      game_systems: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      metro: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          recipient: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      player_game_accounts: {
        Row: {
          account_id: string
          created_at: string | null
          game_system_id: string
          id: string
          player_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          game_system_id?: string
          id?: string
          player_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          game_system_id?: string
          id?: string
          player_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_game_accounts_game_system_id_fkey"
            columns: ["game_system_id"]
            isOneToOne: false
            referencedRelation: "game_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      player_retailers: {
        Row: {
          created_at: string | null
          id: string
          player_id: string
          retailer_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          player_id: string
          retailer_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          player_id?: string
          retailer_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_retailers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_retailers_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          alias: string
          alias_image_url: string | null
          auth_id: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          state: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          alias: string
          alias_image_url?: string | null
          auth_id?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          alias?: string
          alias_image_url?: string | null
          auth_id?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prize_cards: {
        Row: {
          card_image_url: string
          card_name: string
          created_at: string | null
          created_by: string | null
          id: string
          prize_id: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          card_image_url: string
          card_name: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          prize_id?: string
          sort_order: number
          updated_at?: string | null
        }
        Update: {
          card_image_url?: string
          card_name?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          prize_id?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      retailers: {
        Row: {
          address: string
          carousel_image: string | null
          city: string
          created_at: string | null
          description: string | null
          email: string | null
          hours_of_operation: Json | null
          id: string
          is_featured: boolean | null
          lat: number
          lng: number
          metro_id: string | null
          name: string
          phone: string | null
          state: string
          status: string | null
          store_photo: string | null
          updated_at: string | null
          website_url: string | null
          zip: string
        }
        Insert: {
          address: string
          carousel_image?: string | null
          city: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          hours_of_operation?: Json | null
          id?: string
          is_featured?: boolean | null
          lat: number
          lng: number
          metro_id?: string | null
          name: string
          phone?: string | null
          state: string
          status?: string | null
          store_photo?: string | null
          updated_at?: string | null
          website_url?: string | null
          zip: string
        }
        Update: {
          address?: string
          carousel_image?: string | null
          city?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          hours_of_operation?: Json | null
          id?: string
          is_featured?: boolean | null
          lat?: number
          lng?: number
          metro_id?: string | null
          name?: string
          phone?: string | null
          state?: string
          status?: string | null
          store_photo?: string | null
          updated_at?: string | null
          website_url?: string | null
          zip?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          campaign_id: string
          created_at: string | null
          description: string | null
          id: string
          price: number
          session_date: string
          session_number: number
          status: string | null
        }
        Insert: {
          campaign_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          price: number
          session_date: string
          session_number: number
          status?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          price?: number
          session_date?: string
          session_number?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_entries: {
        Row: {
          created_at: string | null
          final_rank: number | null
          id: string
          player_id: string
          registration_date: string | null
          status: string | null
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          final_rank?: number | null
          id?: string
          player_id?: string
          registration_date?: string | null
          status?: string | null
          tournament_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          final_rank?: number | null
          id?: string
          player_id?: string
          registration_date?: string | null
          status?: string | null
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_entries_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_prizes: {
        Row: {
          created_at: string | null
          description: string
          id: string
          placement: number
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          placement: number
          tournament_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          placement?: number
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_prizes_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          carousel_image: string | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_date: string
          game_system_id: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string
          max_participants: number | null
          prize_pool: number | null
          registration_deadline: string | null
          registration_url: string | null
          start_date: string
          status: string | null
          title: string
          tournament_type: string | null
          updated_at: string | null
          venue: string
        }
        Insert: {
          carousel_image?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date: string
          game_system_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location: string
          max_participants?: number | null
          prize_pool?: number | null
          registration_deadline?: string | null
          registration_url?: string | null
          start_date: string
          status?: string | null
          title: string
          tournament_type?: string | null
          updated_at?: string | null
          venue: string
        }
        Update: {
          carousel_image?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string
          game_system_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string
          max_participants?: number | null
          prize_pool?: number | null
          registration_deadline?: string | null
          registration_url?: string | null
          start_date?: string
          status?: string | null
          title?: string
          tournament_type?: string | null
          updated_at?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_game_system_id_fkey"
            columns: ["game_system_id"]
            isOneToOne: false
            referencedRelation: "game_systems"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: {
          lat1: number
          lng1: number
          lat2: number
          lng2: number
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

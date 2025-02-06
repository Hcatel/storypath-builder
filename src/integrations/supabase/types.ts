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
      creator_subscriptions: {
        Row: {
          creator_id: string
          id: string
          subscribed_at: string
          subscriber_id: string
        }
        Insert: {
          creator_id: string
          id?: string
          subscribed_at?: string
          subscriber_id: string
        }
        Update: {
          creator_id?: string
          id?: string
          subscribed_at?: string
          subscriber_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number
          file_type?: string
          file_url?: string
          filename?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      module_completions: {
        Row: {
          completed_at: string
          decisions: Json
          feedback: string | null
          id: string
          module_id: string
          score: number | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          decisions?: Json
          feedback?: string | null
          id?: string
          module_id: string
          score?: number | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          decisions?: Json
          feedback?: string | null
          id?: string
          module_id?: string
          score?: number | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_completions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_group_access: {
        Row: {
          created_at: string
          group_id: string
          id: string
          module_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          module_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_group_access_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_group_access_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          access_type: Database["public"]["Enums"]["module_access_type"]
          component_types:
            | Database["public"]["Enums"]["component_type"][]
            | null
          created_at: string
          description: string | null
          edges: Json
          estimated_duration_minutes: number | null
          id: string
          nodes: Json
          playlist_id: string | null
          published: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["module_access_type"]
          component_types?:
            | Database["public"]["Enums"]["component_type"][]
            | null
          created_at?: string
          description?: string | null
          edges?: Json
          estimated_duration_minutes?: number | null
          id?: string
          nodes?: Json
          playlist_id?: string | null
          published?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_type?: Database["public"]["Enums"]["module_access_type"]
          component_types?:
            | Database["public"]["Enums"]["component_type"][]
            | null
          created_at?: string
          description?: string | null
          edges?: Json
          estimated_duration_minutes?: number | null
          id?: string
          nodes?: Json
          playlist_id?: string | null
          published?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      playlist_group_access: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          playlist_id: string | null
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          playlist_id?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          playlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_group_access_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_group_access_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_modules: {
        Row: {
          created_at: string
          id: string
          module_id: string | null
          playlist_id: string | null
          position: number
        }
        Insert: {
          created_at?: string
          id?: string
          module_id?: string | null
          playlist_id?: string | null
          position: number
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string | null
          playlist_id?: string | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "playlist_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_modules_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          access_type: Database["public"]["Enums"]["module_access_type"] | null
          completion_rate: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          parent_playlist_id: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["module_access_type"] | null
          completion_rate?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_playlist_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          access_type?: Database["public"]["Enums"]["module_access_type"] | null
          completion_rate?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_playlist_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playlists_parent_playlist_id_fkey"
            columns: ["parent_playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      component_type:
        | "message"
        | "video"
        | "router"
        | "text_input"
        | "multiple_choice"
        | "ranking"
        | "likert_scale"
        | "matching"
      module_access_type: "private" | "public" | "restricted"
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

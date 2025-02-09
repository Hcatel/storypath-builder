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
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_subscriptions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          email: string | null
          group_id: string
          id: string
          joined_at: string
          user_id: string | null
        }
        Insert: {
          email?: string | null
          group_id: string
          id?: string
          joined_at?: string
          user_id?: string | null
        }
        Update: {
          email?: string | null
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_members_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_group_members_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          members_modified_at: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          members_modified_at?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          members_modified_at?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learner_module_states: {
        Row: {
          created_at: string | null
          current_node_id: string | null
          history: Json | null
          id: string
          module_id: string
          score: number | null
          updated_at: string | null
          user_id: string
          variables_state: Json | null
        }
        Insert: {
          created_at?: string | null
          current_node_id?: string | null
          history?: Json | null
          id?: string
          module_id: string
          score?: number | null
          updated_at?: string | null
          user_id: string
          variables_state?: Json | null
        }
        Update: {
          created_at?: string | null
          current_node_id?: string | null
          history?: Json | null
          id?: string
          module_id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string
          variables_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "learner_module_states_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_progress: {
        Row: {
          completed_nodes: string[] | null
          created_at: string | null
          current_node_id: string
          id: string
          module_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_nodes?: string[] | null
          created_at?: string | null
          current_node_id: string
          id?: string
          module_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_nodes?: string[] | null
          created_at?: string | null
          current_node_id?: string
          id?: string
          module_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learner_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
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
          choices: Json | null
          completed_at: string
          decisions: Json
          feedback: string | null
          id: string
          module_id: string
          score: number | null
          started_at: string | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          choices?: Json | null
          completed_at?: string
          decisions?: Json
          feedback?: string | null
          id?: string
          module_id: string
          score?: number | null
          started_at?: string | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          choices?: Json | null
          completed_at?: string
          decisions?: Json
          feedback?: string | null
          id?: string
          module_id?: string
          score?: number | null
          started_at?: string | null
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
      module_conditions: {
        Row: {
          action_type: string
          action_value: Json
          condition_group_id: string | null
          condition_operator: string | null
          condition_type: string
          condition_value: Json
          created_at: string | null
          custom_expression: string | null
          description: string | null
          expression_type: string | null
          id: string
          module_id: string | null
          priority: number | null
          reference_module_id: string | null
          reference_variable_id: string | null
          source_node_id: string
          target_variable_id: string | null
          updated_at: string | null
        }
        Insert: {
          action_type: string
          action_value: Json
          condition_group_id?: string | null
          condition_operator?: string | null
          condition_type: string
          condition_value: Json
          created_at?: string | null
          custom_expression?: string | null
          description?: string | null
          expression_type?: string | null
          id?: string
          module_id?: string | null
          priority?: number | null
          reference_module_id?: string | null
          reference_variable_id?: string | null
          source_node_id: string
          target_variable_id?: string | null
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          action_value?: Json
          condition_group_id?: string | null
          condition_operator?: string | null
          condition_type?: string
          condition_value?: Json
          created_at?: string | null
          custom_expression?: string | null
          description?: string | null
          expression_type?: string | null
          id?: string
          module_id?: string | null
          priority?: number | null
          reference_module_id?: string | null
          reference_variable_id?: string | null
          source_node_id?: string
          target_variable_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_conditions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_conditions_target_variable_id_fkey"
            columns: ["target_variable_id"]
            isOneToOne: false
            referencedRelation: "module_variables"
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
      module_variables: {
        Row: {
          created_at: string | null
          default_value: Json | null
          description: string | null
          id: string
          module_id: string | null
          name: string
          updated_at: string | null
          var_type: Database["public"]["Enums"]["variable_type"]
        }
        Insert: {
          created_at?: string | null
          default_value?: Json | null
          description?: string | null
          id?: string
          module_id?: string | null
          name: string
          updated_at?: string | null
          var_type: Database["public"]["Enums"]["variable_type"]
        }
        Update: {
          created_at?: string | null
          default_value?: Json | null
          description?: string | null
          id?: string
          module_id?: string | null
          name?: string
          updated_at?: string | null
          var_type?: Database["public"]["Enums"]["variable_type"]
        }
        Relationships: [
          {
            foreignKeyName: "module_variables_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_versions: {
        Row: {
          created_at: string
          created_by: string
          edges: Json
          id: string
          module_id: string
          nodes: Json
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by: string
          edges?: Json
          id?: string
          module_id: string
          nodes?: Json
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string
          edges?: Json
          id?: string
          module_id?: string
          nodes?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "module_versions_module_id_fkey"
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
            foreignKeyName: "fk_playlist_group_access_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
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
      check_playlist_access: {
        Args: {
          playlist_id: string
          user_id: string
        }
        Returns: boolean
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      action_type:
        | "set_variable"
        | "increment"
        | "decrement"
        | "append_to_array"
        | "remove_from_array"
        | "clear_array"
      component_type:
        | "message"
        | "video"
        | "router"
        | "text_input"
        | "multiple_choice"
        | "ranking"
        | "likert_scale"
        | "matching"
      condition_type:
        | "equals"
        | "not_equals"
        | "greater_than"
        | "less_than"
        | "contains"
        | "starts_with"
        | "ends_with"
        | "in_array"
        | "not_in_array"
      module_access_type: "private" | "public" | "restricted"
      variable_type: "number" | "string" | "boolean" | "array"
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

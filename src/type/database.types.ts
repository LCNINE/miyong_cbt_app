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
      exam_schedules: {
        Row: {
          application_ends_at: string
          application_starts_at: string
          ends_at: string
          exam_round: number
          exam_type: Database["public"]["Enums"]["exam_type_enum"]
          id: number
          starts_at: string
          success_announ_at: string | null
        }
        Insert: {
          application_ends_at: string
          application_starts_at: string
          ends_at: string
          exam_round: number
          exam_type: Database["public"]["Enums"]["exam_type_enum"]
          id?: number
          starts_at: string
          success_announ_at?: string | null
        }
        Update: {
          application_ends_at?: string
          application_starts_at?: string
          ends_at?: string
          exam_round?: number
          exam_type?: Database["public"]["Enums"]["exam_type_enum"]
          id?: number
          starts_at?: string
          success_announ_at?: string | null
        }
        Relationships: []
      }
      examples: {
        Row: {
          content: string
          created_at: string
          id: number
          question_id: number
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          question_id: number
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          question_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "examples_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_bases: {
        Row: {
          content: string | null
          detail_item_name: string
          detail_item_no: number
          license_id: number
          main_item_no: number
          sub_item_no: number
        }
        Insert: {
          content?: string | null
          detail_item_name: string
          detail_item_no: number
          license_id: number
          main_item_no: number
          sub_item_no: number
        }
        Update: {
          content?: string | null
          detail_item_name?: string
          detail_item_no?: number
          license_id?: number
          main_item_no?: number
          sub_item_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_bases_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string
          id: number
          license: string
        }
        Insert: {
          created_at?: string
          id?: number
          license: string
        }
        Update: {
          created_at?: string
          id?: number
          license?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string | null
          id: number
          message: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          content: string
          created_at: string
          is_correct: boolean
          no: number
          question_id: number
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          is_correct: boolean
          no: number
          question_id?: number
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          is_correct?: boolean
          no?: number
          question_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          content: string
          created_at: string
          episode: number | null
          explanation: string | null
          id: number
          license: number
          made_at: string | null
          no: number
          test_id: number | null
        }
        Insert: {
          content: string
          created_at?: string
          episode?: number | null
          explanation?: string | null
          id?: number
          license: number
          made_at?: string | null
          no: number
          test_id?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          episode?: number | null
          explanation?: string | null
          id?: number
          license?: number
          made_at?: string | null
          no?: number
          test_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_license_fkey"
            columns: ["license"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          episode: number | null
          id: number
          license: number
          made_at: string | null
        }
        Insert: {
          created_at?: string
          episode?: number | null
          id?: number
          license: number
          made_at?: string | null
        }
        Update: {
          created_at?: string
          episode?: number | null
          id?: number
          license?: number
          made_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_license_fkey"
            columns: ["license"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      wrong_logs: {
        Row: {
          chose_answer: number | null
          created_at: string
          id: number
          question_id: number
          user_id: string
        }
        Insert: {
          chose_answer?: number | null
          created_at?: string
          id?: number
          question_id: number
          user_id: string
        }
        Update: {
          chose_answer?: number | null
          created_at?: string
          id?: number
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wrong_logs_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wrong_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_tests_with_license: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_id: number
          created_at: string
          license_name: string
          made_at: string
          episode: number
        }[]
      }
      get_distinct_made_at: {
        Args: {
          license_name: string
        }
        Returns: {
          made_at: string
        }[]
      }
      get_unique_made_ats: {
        Args: {
          license_ids: number[]
        }
        Returns: {
          made_at: string
        }[]
      }
    }
    Enums: {
      exam_type_enum: "실기" | "필기"
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

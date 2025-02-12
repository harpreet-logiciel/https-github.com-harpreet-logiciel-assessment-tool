export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          is_anonymous: boolean;
          session_id: string;
          email: string | null;
          name: string | null;
          company: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          is_anonymous?: boolean;
          session_id?: string;
          email?: string | null;
          name?: string | null;
          company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          is_anonymous?: boolean;
          session_id?: string;
          email?: string | null;
          name?: string | null;
          company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessment_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answer: {
            value: string | string[];
            additional_info?: string | null;
            updated_at?: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          answer: {
            value: string | string[];
            additional_info?: string | null;
            updated_at?: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          answer?: {
            value: string | string[];
            additional_info?: string | null;
            updated_at?: string;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          preview_report: any;
          full_report: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preview_report?: any;
          full_report?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preview_report?: any;
          full_report?: any;
          created_at?: string;
        };
      };
    };
  };
}

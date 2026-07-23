export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          created_at?: string
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          id: string
          customer_id: string
          recipient_name: string
          phone: string | null
          address: string
          city: string
          state: string
          postal_code: string
          country: string
          landmark: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          recipient_name: string
          phone?: string | null
          address: string
          city: string
          state: string
          postal_code: string
          country?: string
          landmark?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          recipient_name?: string
          phone?: string | null
          address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          landmark?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          shipping_address_id: string
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          shipping_cost: number
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          shipping_address_id: string
          order_number: string
          status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          shipping_cost?: number
          total: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          shipping_address_id?: string
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          shipping_cost?: number
          total?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity?: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_price?: number
          quantity?: number
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          amount: number
          currency: string
          status: Database["public"]["Enums"]["payment_transaction_status"]
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          amount: number
          currency?: string
          status?: Database["public"]["Enums"]["payment_transaction_status"]
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          amount?: number
          currency?: string
          status?: Database["public"]["Enums"]["payment_transaction_status"]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      customer_wishlists: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_wishlists_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      order_events: {
        Row: {
          id: string
          order_id: string
          event_type: string
          from_status: string | null
          to_status: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          event_type: string
          from_status?: string | null
          to_status?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          event_type?: string
          from_status?: string | null
          to_status?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          name: string | null
          sku: string | null
          story: string | null
          short_description: string | null
          customer_description: string | null
          price: number | null
          selling_price: number
          mrp: number
          cost_price: number
          stock: number
          low_stock_alert: number
          category: string | null
          fabric: string | null
          craft: string | null
          color: string | null
          colour: string | null
          weave: string | null
          border: string | null
          zari_type: string | null
          occasion: string | null
          length: string | null
          weight: string | null
          blouse_included: boolean
          blouse_details: string | null
          care_instructions: string | null
          origin: string | null
          country_of_origin: string | null
          estimated_dispatch_days: number | null
          featured: boolean | null
          is_featured: boolean | null
          is_active: boolean | null
          meta_title: string | null
          meta_description: string | null
          og_image_url: string | null
          collection_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          name?: string | null
          sku?: string | null
          story?: string | null
          short_description?: string | null
          customer_description?: string | null
          price?: number | null
          selling_price: number
          mrp?: number
          cost_price?: number
          stock?: number
          low_stock_alert?: number
          category?: string | null
          fabric?: string | null
          craft?: string | null
          color?: string | null
          colour?: string | null
          weave?: string | null
          border?: string | null
          zari_type?: string | null
          occasion?: string | null
          length?: string | null
          weight?: string | null
          blouse_included?: boolean
          blouse_details?: string | null
          care_instructions?: string | null
          origin?: string | null
          country_of_origin?: string | null
          estimated_dispatch_days?: number | null
          featured?: boolean | null
          is_featured?: boolean | null
          is_active?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          og_image_url?: string | null
          collection_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          name?: string | null
          sku?: string | null
          story?: string | null
          short_description?: string | null
          customer_description?: string | null
          price?: number | null
          selling_price?: number
          mrp?: number
          cost_price?: number
          stock?: number
          low_stock_alert?: number
          category?: string | null
          fabric?: string | null
          craft?: string | null
          color?: string | null
          colour?: string | null
          weave?: string | null
          border?: string | null
          zari_type?: string | null
          occasion?: string | null
          length?: string | null
          weight?: string | null
          blouse_included?: boolean
          blouse_details?: string | null
          care_instructions?: string | null
          origin?: string | null
          country_of_origin?: string | null
          estimated_dispatch_days?: number | null
          featured?: boolean | null
          is_featured?: boolean | null
          is_active?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          og_image_url?: string | null
          collection_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            referencedRelation: "collections"
            referencedColumns: ["id"]
          }
        ]
      }
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          editorial_story: string | null
          tagline: string | null
          hero_image_url: string | null
          hero_video_url: string | null
          featured_on_homepage: boolean
          display_order: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          editorial_story?: string | null
          tagline?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          featured_on_homepage?: boolean
          display_order?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          editorial_story?: string | null
          tagline?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          featured_on_homepage?: boolean
          display_order?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          id: string
          product_id: string | null
          url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          url: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory_history: {
        Row: {
          id: string
          product_id: string
          change: number
          previous_stock: number
          new_stock: number
          reason: string
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          change: number
          previous_stock: number
          new_stock: number
          reason: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          change?: number
          previous_stock?: number
          new_stock?: number
          reason?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_events: {
        Row: {
          id: string
          event_id: string
          event_type: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          event_type: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          event_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_paid_order: {
        Args: {
          p_razorpay_order_id: string
          p_razorpay_payment_id?: string | null
          p_razorpay_signature?: string | null
        }
        Returns: Json
      }
      adjust_product_stock: {
        Args: {
          p_product_id: string
          p_quantity: number
          p_reason: string
          p_notes?: string | null
          p_allow_negative?: boolean
        }
        Returns: Json
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      release_order_inventory: {
        Args: {
          p_order_id: string
          p_reason?: string
        }
        Returns: Json
      }
    }
    Enums: {
      order_status: "pending_payment" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
      payment_status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
      payment_transaction_status: "pending" | "paid" | "failed" | "refunded"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      order_status: ["pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
      payment_status: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      payment_transaction_status: ["pending", "paid", "failed", "refunded"],
    },
  },
} as const

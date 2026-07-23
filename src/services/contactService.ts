import { supabase } from "@/integrations/supabase/client";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  orderNumber: string;
  message: string;
}

export interface ContactResult {
  success: boolean;
  error?: string;
}

const CONTACT_EDGE_FUNCTION = "send-contact-message";

export async function submitContactForm(data: ContactFormData): Promise<ContactResult> {
  try {
    const response = await supabase.functions.invoke(CONTACT_EDGE_FUNCTION, {
      body: JSON.stringify(data),
    });

    if (response.error) {
      return { success: false, error: response.error.message || "Unable to send message." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "We could not send your message right now. Please email us directly at care@houseofpadmavati.com." };
  }
}

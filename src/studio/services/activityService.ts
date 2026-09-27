import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface StudioActivity {
  id: string;
  action: string;
  entityType: "collection" | "film" | "product" | "media" | "journal" | "settings";
  entityId?: string;
  entityName: string;
  userEmail?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

interface StudioActivityRow {
  id: string;
  action: string;
  entity_type: StudioActivity["entityType"];
  entity_id?: string;
  entity_name: string;
  user_email?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

const STORAGE_KEY = "hop_studio_audit_log";

function getLocalActivities(): StudioActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalActivities(activities: StudioActivity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, 100)));
  } catch {
    // Ignore storage quota errors
  }
}

function mapRow(r: StudioActivityRow): StudioActivity {
  return {
    id: r.id,
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    entityName: r.entity_name,
    userEmail: r.user_email,
    details: r.details || {},
    createdAt: r.created_at,
  };
}

export const activityService = {
  async log(params: Omit<StudioActivity, "id" | "createdAt">): Promise<StudioActivity> {
    const entry: StudioActivity = {
      id: uuidv4(),
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      userEmail: params.userEmail,
      details: params.details || {},
      createdAt: new Date().toISOString(),
    };

    const local = getLocalActivities();
    local.unshift(entry);
    saveLocalActivities(local);

    try {
      await supabase.from("studio_activities").insert({
        id: entry.id,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        entity_name: entry.entityName,
        user_email: entry.userEmail,
        details: entry.details,
        created_at: entry.createdAt,
      });
    } catch {
      // Graceful fallback to local trail if database table does not yet exist
    }

    return entry;
  },

  async getRecent(limit: number = 20): Promise<StudioActivity[]> {
    try {
      const { data, error } = await supabase
        .from("studio_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map(mapRow);
      }
    } catch {
      // Fallback to local
    }

    const local = getLocalActivities();
    return local.slice(0, limit);
  },
};

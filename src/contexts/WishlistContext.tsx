import * as React from "react";
import { addToWishlist, removeFromWishlist } from "@/services/customerWishlistService";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  collection?: string;
};

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "TOGGLE_ITEM"; payload: WishlistItem }
  | { type: "CLEAR_WISHLIST" };

interface WishlistState {
  items: WishlistItem[];
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) return state;
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "TOGGLE_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return { items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return { items: [...state.items, action.payload] };
    }
    case "CLEAR_WISHLIST":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "hop-wishlist";

function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return [];
  }
  return [];
}

function saveWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
}

type WishlistContextValue = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
  syncToSupabase: (customerId: string) => Promise<void>;
};

const WishlistContext = React.createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(
    wishlistReducer,
    { items: [] },
    () => ({ items: loadWishlist() })
  );

  React.useEffect(() => {
    saveWishlist(state.items);
  }, [state.items]);

  const addItem = React.useCallback((item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const toggleItem = React.useCallback((item: WishlistItem) => {
    dispatch({ type: "TOGGLE_ITEM", payload: item });
  }, []);

  const isWishlisted = React.useCallback(
    (id: string) => state.items.some((i) => i.id === id),
    [state.items]
  );

  const clearWishlist = React.useCallback(() => {
    dispatch({ type: "CLEAR_WISHLIST" });
  }, []);

  const totalItems = state.items.length;

  const syncToSupabase = React.useCallback(async (customerId: string) => {
    for (const item of state.items) {
      try {
        await addToWishlist(customerId, item.id);
      } catch {
        // Silently continue on conflict
      }
    }
  }, [state.items]);

  return (
    <WishlistContext.Provider
      value={{ items: state.items, addItem, removeItem, toggleItem, isWishlisted, clearWishlist, totalItems, syncToSupabase }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Context pattern: exports Provider + hook for public API
export function useWishlist(): WishlistContextValue {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Gift from "./pages/Gift";
import NotFound from "./pages/NotFound";
import About from "./pages/about/OurStory";
import CustomerCare from "./pages/about/CustomerCare";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import StudioLogin from "./studio/pages/Login";
import StudioResetPassword from "./studio/pages/ResetPassword";
import { AuthGuard } from "./studio/components/AuthGuard";
import { StudioLayout } from "./studio/components/StudioLayout";
import { ProtectedRoute } from "./components/account/ProtectedRoute";
import AccountLayout from "./pages/account/AccountLayout";
import Login from "./pages/account/Login";
import Signup from "./pages/account/Signup";
import ForgotPassword from "./pages/account/ForgotPassword";
import ResetPassword from "./pages/account/ResetPassword";
import AccountDashboard from "./pages/account/Dashboard";
import AccountProfile from "./pages/account/Profile";
import AccountAddresses from "./pages/account/Addresses";
import AccountOrders from "./pages/account/OrderHistory";
import AccountOrderDetail from "./pages/account/OrderDetail";
import AccountWishlistPage from "./pages/account/WishlistPage";

const Category = lazy(() => import("./pages/Category"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Collections = lazy(() => import("./pages/Collections"));
const Journal = lazy(() => import("./pages/Journal"));
const JournalDetail = lazy(() => import("./pages/JournalDetail"));
const StudioDashboard = lazy(() => import("./studio/pages/Dashboard"));
const StudioOrders = lazy(() => import("./studio/pages/Orders"));
const StudioOrderDetail = lazy(() => import("./studio/pages/OrderDetail"));
const StudioProducts = lazy(() => import("./studio/pages/Products"));
const StudioProductWorkspace = lazy(() => import("./studio/pages/ProductWorkspace"));
const StudioCollections = lazy(() => import("./studio/pages/Collections"));
const StudioCollectionWorkspace = lazy(() => import("./studio/pages/CollectionWorkspace"));
const StudioInventory = lazy(() => import("./studio/pages/Inventory"));
const StudioCustomers = lazy(() => import("./studio/pages/Customers"));
const StudioJournal = lazy(() => import("./studio/pages/Journal"));
const StudioMedia = lazy(() => import("./studio/pages/Media"));
const StudioSettings = lazy(() => import("./studio/pages/Settings"));

const queryClient = new QueryClient();

function StudioRoute({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <AuthGuard>
      <StudioLayout title={title}>
        {children}
      </StudioLayout>
    </AuthGuard>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <ErrorBoundary>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm text-ink-soft font-light">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:slug" element={<Category />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/confirmation/:orderNumber" element={<OrderConfirmation />} />
              <Route path="/gift" element={<Gift />} />
              <Route path="/about" element={<About />} />
              <Route path="/customer-care" element={<CustomerCare />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<JournalDetail />} />
              <Route path="/studio/login" element={<StudioLogin />} />
              <Route path="/studio/reset-password" element={<StudioResetPassword />} />
              <Route path="/studio" element={<StudioRoute title="Dashboard"><StudioDashboard /></StudioRoute>} />
              <Route path="/studio/orders" element={<StudioRoute title="Orders"><StudioOrders /></StudioRoute>} />
              <Route path="/studio/orders/:id" element={<StudioRoute title="Order Detail"><StudioOrderDetail /></StudioRoute>} />
              <Route path="/studio/products" element={<StudioRoute title="Products"><StudioProducts /></StudioRoute>} />
              <Route path="/studio/products/new" element={<StudioRoute title="New Product"><StudioProductWorkspace /></StudioRoute>} />
              <Route path="/studio/products/:id" element={<StudioRoute title="Product Workspace"><StudioProductWorkspace /></StudioRoute>} />
              <Route path="/studio/collections" element={<StudioRoute title="Collections"><StudioCollections /></StudioRoute>} />
              <Route path="/studio/collections/new" element={<StudioRoute title="New Collection"><StudioCollectionWorkspace /></StudioRoute>} />
              <Route path="/studio/collections/:id" element={<StudioRoute title="Collection Workspace"><StudioCollectionWorkspace /></StudioRoute>} />
              <Route path="/studio/inventory" element={<StudioRoute title="Inventory"><StudioInventory /></StudioRoute>} />
              <Route path="/studio/customers" element={<StudioRoute title="Customers"><StudioCustomers /></StudioRoute>} />
              <Route path="/studio/journal" element={<StudioRoute title="Journal"><StudioJournal /></StudioRoute>} />
              <Route path="/studio/media" element={<StudioRoute title="Media Library"><StudioMedia /></StudioRoute>} />
              <Route path="/studio/settings" element={<StudioRoute title="Settings"><StudioSettings /></StudioRoute>} />
              {/* Customer account routes */}
              <Route path="/account/login" element={<Login />} />
              <Route path="/account/signup" element={<Signup />} />
              <Route path="/account/forgot-password" element={<ForgotPassword />} />
              <Route path="/account/reset-password" element={<ResetPassword />} />
              <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
                <Route index element={<AccountDashboard />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="addresses" element={<AccountAddresses />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="orders/:id" element={<AccountOrderDetail />} />
                <Route path="wishlist" element={<AccountWishlistPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

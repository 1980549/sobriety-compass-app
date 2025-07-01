
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { GuestAuthProvider } from "@/hooks/useGuestAuth";
import { UnifiedAuthProvider } from "@/hooks/useUnifiedAuth";
import { AppLayout } from "@/components/AppLayout";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DevTools } from "./components/DevTools";
import { AuthPages } from "./components/AuthPages";

const queryClient = new QueryClient();

const App = () => {
  // Adiciona meta tags para otimização mobile
  React.useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <GuestAuthProvider>
              <UnifiedAuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <PWAInstallPrompt />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={
                        <AppLayout>
                          <Index />
                        </AppLayout>
                      } />
                      <Route path="/auth" element={<AuthPages />} />
                      {/* Rota de desenvolvimento (apenas para DEV) */}
                      <Route path="/dev" element={
                        <AppLayout>
                          <DevTools />
                        </AppLayout>
                      } />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </UnifiedAuthProvider>
            </GuestAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
};

export default App;

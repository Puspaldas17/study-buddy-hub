import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import Index from "./pages/Index";
import Attendance from "./pages/Attendance";
import Notes from "./pages/Notes";
import Habits from "./pages/Habits";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="edupro-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CommandPalette />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Attendance />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Notes />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Habits />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

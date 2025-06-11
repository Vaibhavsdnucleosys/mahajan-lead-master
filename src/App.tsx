
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Login from "./components/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CreateLead from "./pages/Leads/CreateLead";
import LeadsList from "./pages/Leads/LeadsList";
import LeadDetail from "./pages/Leads/LeadDetail";
import CreateProposal from "./pages/Proposals/CreateProposal";
import ProposalTemplates from "./pages/Masters/ProposalTemplates";
import SpareParts from "./pages/Masters/SpareParts";
import Reports from "./pages/Reports/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<LeadsList />} />
              <Route path="leads/create" element={<CreateLead />} />
              <Route path="leads/:id" element={<LeadDetail />} />
              <Route path="leads/:id/edit" element={<CreateLead />} />
              <Route path="proposals" element={<LeadsList />} />
              <Route path="proposals/create" element={<CreateProposal />} />
              <Route path="masters/proposal-templates" element={<ProposalTemplates />} />
              <Route path="masters/spare-parts" element={<SpareParts />} />
              <Route path="reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

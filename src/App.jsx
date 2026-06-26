import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

// Page imports
import Home from './pages/Home';
import LeadFinder from './pages/LeadFinder';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import LeadDetail from './pages/LeadDetail';
import Outreach from './pages/Outreach';
import SavedLists from './pages/SavedLists';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DashboardLayout from './components/layout/DashboardLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0d1b2a" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/10 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40 text-sm font-display tracking-wider">HIGGINS DIGITAL</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<DashboardLayout />}>
        <Route path="/leads" element={<LeadFinder />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/outreach" element={<Outreach />} />
        <Route path="/lists" element={<SavedLists />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

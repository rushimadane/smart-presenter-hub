import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StartCreating from "./pages/StartCreating";
import Templates from "./pages/Templates";
import NotFound from "./pages/NotFound";
import Login from "./pages/login"; // Use relative import
import Register from "./pages/register"; // Use relative import
import { PresentationProvider } from "./contexts/PresentationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PresentationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/start-creating" element={<StartCreating />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PresentationProvider>
  </QueryClientProvider>
);

export default App;

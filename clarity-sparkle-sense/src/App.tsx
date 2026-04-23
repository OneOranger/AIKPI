import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Index } from "./pages/Index.tsx";
import { ModelCompare } from "./pages/ModelCompare.tsx";
import { ValueAssessment } from "./pages/ValueAssessment.tsx";
import { Quality } from "./pages/Quality.tsx";
import { Trends } from "./pages/Trends.tsx";
import { LiveCalls } from "./pages/LiveCalls.tsx";
import { Projects } from "./pages/Projects.tsx";
import { Docs } from "./pages/Docs.tsx";
import { Alerts } from "./pages/Alerts.tsx";
import { Settings } from "./pages/Settings.tsx";
import { Experiments } from "./pages/Experiments.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/models" element={<ModelCompare />} />
          <Route path="/value" element={<ValueAssessment />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/live-calls" element={<LiveCalls />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/experiments" element={<Experiments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

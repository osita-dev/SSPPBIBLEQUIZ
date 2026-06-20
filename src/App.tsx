import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useQuizStore } from "./store/useQuizStore";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import InstallButton from "./components/InstallButton";

const queryClient = new QueryClient();

const AppRouter = () => {
  const { phase, skipQuestion } = useQuizStore();

  useEffect(() => {
    if (phase === "feedback") {
      skipQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return phase === "home" ? <HomePage /> : <QuizPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AppRouter />} />
        </Routes>
      </BrowserRouter>
      {/* Fixed install button — floats above all pages */}
      <InstallButton />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
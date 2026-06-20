import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Hide if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      // Native browser install dialog available — use it
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    } else {
      // No native prompt — show manual instructions
      setShowInstructions((prev) => !prev);
    }
  };

  // Hide if already installed as PWA
  if (isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">

      {/* Manual instructions popup — shown when native prompt unavailable */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-royal text-cream text-xs font-nunito font-semibold px-4 py-3 rounded-2xl shadow-royal max-w-[200px] leading-relaxed border border-gold/20"
          >
            <p className="text-gold font-bold mb-1">To install:</p>
            <p>
              <span className="text-gold">Chrome:</span> tap ⋮ menu → "Add to Home Screen"
            </p>
            <p className="mt-1">
              <span className="text-gold">Safari:</span> tap Share → "Add to Home Screen"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Dismiss button */}
        <motion.button
          onClick={() => setDismissed(true)}
          className="w-7 h-7 rounded-full bg-royal/20 flex items-center justify-center text-royal/60 hover:bg-royal/30 transition-colors"
          whileTap={{ scale: 0.9 }}
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>

        {/* Install button — always visible */}
        <motion.button
          onClick={handleInstall}
          className="flex items-center gap-2 bg-royal text-gold font-fredoka text-base px-4 py-3 rounded-2xl shadow-royal border border-gold/30"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {installPrompt ? (
            <>
              <Download className="w-5 h-5" />
              Install App
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5" />
              Install App
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
import { motion } from "framer-motion";
import { Heart, Activity, Shield } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  showBranding?: boolean;
}

export function LoadingScreen({ 
  message = "Loading your healthcare dashboard...", 
  showBranding = true 
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-soft flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Premium Brand Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="relative"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Heart className="h-10 w-10 text-white relative z-10" />
          </div>
        </motion.div>

        {/* Medical Cross Pulse Animation */}
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Activity className="h-8 w-8 text-primary animate-heartbeat" />
            </div>
          </motion.div>
        </div>

        {/* Loading Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-heading text-foreground">{message}</h2>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Security & Compliance Badges */}
        {showBranding && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center items-center gap-6 pt-8"
          >
            <div className="compliance-badge">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="compliance-badge">
              <div className="w-4 h-4 rounded-full bg-success animate-pulse" />
              <span>Secure</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
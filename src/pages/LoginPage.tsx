import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFilterStore } from "../store/filterStore";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setSession = useFilterStore((state) => state.setSession);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setSession(true);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Login background image - kept soft blurred to match mockup */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: "#eaf4fb",
          backgroundImage: "url('/login-bg-field.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "blur(5px) brightness(0.95)",
          transform: "scale(1.05)",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] mx-4 z-10"
      >
        <div className="bg-white/35 backdrop-blur-xl border border-white/40 rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          {/* Header text */}
          <h2 className="text-xl font-medium text-slate-800 text-center mb-10 tracking-wide">
            Secure Enterprise Portal
          </h2>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Work Email field with underline styling and right side icon */}
            <div className="border-b border-[#8a735f]/40 pb-1.5 focus-within:border-[#8a735f] transition-colors">
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Email
              </label>
              <div className="flex items-center justify-between">
                <input 
                  type="email" 
                  value="demo@croprisk.ai"
                  readOnly
                  className="w-full bg-transparent text-slate-900 font-mono text-sm py-0.5 focus:outline-none cursor-default"
                />
                {/* User/Profile outline icon */}
                <svg className="w-5 h-5 text-slate-500/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Password field with underline styling and right side icon */}
            <div className="border-b border-[#8a735f]/40 pb-1.5 focus-within:border-[#8a735f] transition-colors">
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="flex items-center justify-between">
                <input 
                  type="password" 
                  value="demopass"
                  readOnly
                  className="w-full bg-transparent text-slate-900 font-mono text-sm py-0.5 focus:outline-none cursor-default tracking-widest"
                />
                {/* Eye slash outline icon */}
                <svg className="w-5 h-5 text-slate-500/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </div>
            </div>

            {/* Circular button and Sign In text link */}
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-4 mx-auto mt-10 focus:outline-none group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9c8069] to-[#604a37] flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-all border border-white/30 text-white">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                    <path d="M12 12c1.5-2 1.5-5 0-7M12 12c-1.5-2-1.5-5 0-7M12 12c1.5 2 1.5 5 0 7M12 12c-1.5 2-1.5 5 0 7" />
                    <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" />
                  </svg>
                )}
              </div>
              <span className="text-xl font-medium text-slate-800 group-hover:text-[#604a37] transition-colors">
                Sign In
              </span>
            </button>
          </form>

          {/* Forgot Password link */}
          <div className="text-center mt-8">
            <a href="#" className="text-xs text-slate-700 hover:text-[#604a37] underline underline-offset-4 transition-colors font-medium">
              Forgot Password?
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
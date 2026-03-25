import { useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Mail, ArrowRight, Loader2, KeyRound, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (otpError) setError(otpError.message);
    else setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError("");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (verifyError) setError(verifyError.message);
    else navigate("/");
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) console.error("Auth error:", error);
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4 relative scanline">
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl gradient-cyber flex items-center justify-center shadow-2xl shadow-primary/40 mb-5">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-wider neon-glow-purple" style={{ color: "hsl(var(--neon-purple))" }}>
            XSU Codex
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Zap className="w-3 h-3" style={{ color: "hsl(var(--neon-cyan))" }} />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "hsl(var(--neon-cyan))" }}>
              Secure Access Terminal
            </p>
            <Zap className="w-3 h-3" style={{ color: "hsl(var(--neon-cyan))" }} />
          </div>
        </div>

        {/* Auth card */}
        <div className="glass rounded-2xl p-6 sm:p-8 neon-box-purple">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="font-display text-[10px] font-bold tracking-wider uppercase mb-2 block" style={{ color: "hsl(var(--neon-cyan))" }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-cyber text-white rounded-xl font-display text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-primary/30"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send Code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-xl gradient-cyber-pink flex items-center justify-center mx-auto mb-3 shadow-lg shadow-accent/30">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Code sent to <span className="font-bold" style={{ color: "hsl(var(--neon-cyan))" }}>{email}</span>
                </p>
              </div>
              <div>
                <label className="font-display text-[10px] font-bold tracking-wider uppercase mb-2 block" style={{ color: "hsl(var(--neon-pink))" }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border font-mono text-xl text-center tracking-[0.5em] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-cyber-pink text-white rounded-xl font-display text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-accent/30"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Enter"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="w-full font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors py-1 uppercase tracking-wider"
              >
                ← Different Email
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl neon-box-pink bg-accent/5">
              <p className="font-mono text-[10px] text-accent text-center font-bold">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px gradient-cyber opacity-30" />
            <span className="font-display text-[9px] tracking-[0.3em] uppercase text-muted-foreground">or</span>
            <div className="flex-1 h-px gradient-cyber-pink opacity-30" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl glass font-display text-xs font-bold tracking-wider uppercase text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google Sign-in
          </button>
        </div>

        <p className="font-display text-[8px] tracking-[0.4em] uppercase text-center mt-6" style={{ color: "hsl(var(--neon-purple) / 0.3)" }}>
          Encrypted · Secure · 24/7
        </p>
      </div>
    </div>
  );
};

export default Auth;

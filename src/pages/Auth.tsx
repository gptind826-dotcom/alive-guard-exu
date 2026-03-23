import { useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm mx-4 slide-up">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-5 relative">
              <Shield className="w-8 h-8 text-primary" />
              <Sparkles className="w-3.5 h-3.5 text-secondary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight">
              XSU Codex
            </h1>
            <p className="font-mono text-[11px] text-muted-foreground mt-1.5 tracking-wide">
              Endpoint Monitoring Platform
            </p>
          </div>

          {/* Email OTP */}
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4 mb-5">
              <div>
                <label className="font-display text-[11px] font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground rounded-xl font-display text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 transition-all disabled:opacity-50"
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
            <form onSubmit={handleVerifyOtp} className="space-y-4 mb-5 fade-in">
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent/10 mb-3">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <p className="font-mono text-[11px] text-accent">
                  Code sent to <span className="font-semibold">{email}</span>
                </p>
              </div>
              <div>
                <label className="font-display text-[11px] font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3.5 rounded-xl bg-muted/50 border border-border font-mono text-lg text-center tracking-[0.6em] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground rounded-xl font-display text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="w-full font-mono text-[11px] text-muted-foreground hover:text-primary py-1.5 transition-colors"
              >
                ← Use different email
              </button>
            </form>
          )}

          {error && (
            <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-destructive/10 mb-4">
              <p className="font-mono text-[11px] text-destructive">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border font-display text-sm font-medium text-foreground hover:bg-muted transition-all"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="font-mono text-[10px] text-muted-foreground/60 text-center mt-6">
            Secure · Encrypted · 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

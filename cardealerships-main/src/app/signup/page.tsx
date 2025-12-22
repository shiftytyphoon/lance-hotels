"use client";

import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Step 1: Account info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Step 2: Twilio credentials
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState("");

  const handleGoogleSignUp = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !companyName) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setStep(2); // Move to Twilio credentials step
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call server API route to create user with admin privileges (bypass RLS)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          companyName,
          twilioAccountSid: twilioAccountSid || null,
          twilioAuthToken: twilioAuthToken || null,
          twilioPhoneNumber: twilioPhoneNumber || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes('already registered') || data.error?.includes('already exists')) {
          setError('This email is already registered. Please sign in instead.');
        } else {
          setError(data.error || 'An error occurred during signup');
        }
        setStep(1); // Go back to step 1 so user can fix email
        return;
      }

      // Success! Show thank you message
      setSuccess(true);

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
            alt="Mountains"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        {/* Success Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="font-serif text-4xl text-white mb-4">Thank you!</h1>
          <p className="text-white/60 text-lg mb-2">Your account has been created successfully.</p>
          <p className="text-white/40 text-sm">Redirecting you to sign in...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex relative overflow-hidden">
      {/* Background Image - Left side */}
      <div className="hidden lg:block absolute inset-0 w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
          alt="Mountains"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full flex">
        {/* Left side - Branding (visible on large screens) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-6 lg:px-12 py-5">
          <Link href="/">
            <Logo className="text-white" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-serif text-4xl xl:text-5xl text-white leading-[1.2] tracking-[-0.02em] max-w-md">
              AI that talks like a human.
              <br />
              <span className="text-white/40">Handles millions of calls.</span>
            </h1>
            <p className="mt-6 text-white/50 text-sm max-w-sm">
              Enterprise-grade AI voice agents for customer support, up and running in two weeks.
            </p>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-white/30">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 0-.593.25l-4.453 4.453-.307-.307-.643-.643c4.389-4.376 5.18-4.418 5.996-3.753zm-4.863 4.861l4.44-4.44a.62.62 0 1 1 .847.903l-4.699 4.125-.588-.588zm.33.694l-1.1.238a.06.06 0 0 1-.067-.082l.391-.907.776.75zm2.868-1.324l-1.637 1.439.446.445.898-.786a.855.855 0 0 0 .293-.903z"/>
              </svg>
              <span className="font-sans text-[10px] font-medium tracking-[0.3px]">POSTMAN</span>
            </div>
            <div className="flex items-center gap-1 text-white/30">
              <span className="text-[11px]">◐</span>
              <span className="font-sans text-[10px] font-semibold tracking-[0.3px]">DOORDASH</span>
            </div>
            <div className="text-white/30">
              <span className="font-sans text-[10px] font-semibold">capital</span>
              <span className="font-sans text-[10px] text-white/20">.com</span>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm"
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-12">
              <Link href="/">
                <Logo className="text-white" />
              </Link>
            </div>

            {/* Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h1 className="font-serif text-2xl text-white mb-2">
                  {step === 1 ? "Create your account" : "Connect Twilio"}
                </h1>
                <p className="text-white/50 text-sm">
                  {step === 1 ? "Get started with Lance AI" : "Optional: Add your Twilio credentials"}
                </p>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  {/* Google OAuth Button */}
                  <motion.button
                    onClick={handleGoogleSignUp}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white text-[#111] rounded-full font-sans text-sm font-medium hover:bg-white/90 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/30 text-xs">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Step 1: Account info */}
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <motion.button
                      type="submit"
                      className="w-full px-4 py-3 bg-white text-[#111] rounded-full font-sans text-sm font-medium hover:bg-white/90 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue
                    </motion.button>
                  </form>
                </>
              ) : (
                <>
                  {/* Step 2: Twilio credentials */}
                  <form onSubmit={handleCompleteSignup} className="space-y-4">
                    <div className="text-white/60 text-sm mb-4">
                      Add your Twilio credentials to start receiving calls, or skip this step and add them later in Settings.
                    </div>
                    <input
                      type="text"
                      placeholder="Twilio Account SID (optional)"
                      value={twilioAccountSid}
                      onChange={(e) => setTwilioAccountSid(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors font-mono"
                    />
                    <input
                      type="password"
                      placeholder="Twilio Auth Token (optional)"
                      value={twilioAuthToken}
                      onChange={(e) => setTwilioAuthToken(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors font-mono"
                    />
                    <input
                      type="tel"
                      placeholder="Twilio Phone Number (optional, e.g., +15551234567)"
                      value={twilioPhoneNumber}
                      onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors font-mono"
                    />
                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3 bg-white/5 text-white/70 rounded-full font-sans text-sm font-medium hover:bg-white/10 transition-all border border-white/10"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-white text-[#111] rounded-full font-sans text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Creating account...' : (twilioAccountSid ? 'Complete Setup' : 'Skip for now')}
                      </motion.button>
                    </div>
                  </form>
                </>
              )}

              {/* Sign in link */}
              <p className="text-center text-white/40 text-sm mt-6">
                Already have an account?{" "}
                <Link href="/signin" className="text-white/70 hover:text-white transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-white/30 text-xs mt-6 leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-white/50 hover:text-white/70 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-white/50 hover:text-white/70 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Back to home */}
            <div className="text-center mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

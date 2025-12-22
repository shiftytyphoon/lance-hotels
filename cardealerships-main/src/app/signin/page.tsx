"use client";

import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        console.log('Authenticated user:', data.user.id, data.user.email);

        // Check if user has a profile (don't use .single() to avoid PGRST116 error)
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('user_id, tenant_id, role, created_at')
          .eq('user_id', data.user.id);

        console.log('Profile query result:', { profiles, profileError });

        if (profileError) {
          setError(`Profile error: ${profileError.message}`);
          await supabase.auth.signOut();
          return;
        }

        if (!profiles || profiles.length === 0) {
          setError(`No profile found for user ${data.user.email}. Please contact administrator.`);
          await supabase.auth.signOut();
          return;
        }

        // Use the first profile if multiple exist
        const profile = profiles[0];
        console.log('Using profile:', profile);

        // Success - redirect to dashboard
        console.log('Login successful, redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

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

        {/* Right side - Sign in form */}
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
                <h1 className="font-serif text-2xl text-white mb-2">Welcome back</h1>
                <p className="text-white/50 text-sm">Sign in to your dashboard</p>
              </div>

              {/* Google OAuth Button */}
              <motion.button
                onClick={handleGoogleSignIn}
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

              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                {error && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white text-[#111] rounded-full font-sans text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-4 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-white/40 text-xs mb-2 font-medium">Demo Credentials:</p>
                <p className="text-white/30 text-xs">Email: admin@demo-motors.com</p>
                <p className="text-white/30 text-xs">Password: DemoPassword123!</p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-white/30 text-xs mt-6 leading-relaxed">
              By signing in, you agree to our{" "}
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

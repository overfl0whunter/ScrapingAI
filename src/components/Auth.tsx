'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Button } from './ui/button';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function Auth() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const client = getSupabaseBrowserClient();
      setSupabase(client);
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
    }
  }, []);

  useEffect(() => {
    if (!supabase || typeof window === 'undefined') return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignInWithGithub = async () => {
    if (!supabase) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Error signing in with GitHub:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ScrapingAI
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Accedi o registrati per iniziare a utilizzare la piattaforma
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleSignInWithGithub}
              disabled={isLoading || !supabase}
              className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#24292e]/90"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              {isLoading ? 'Caricamento...' : 'Continua con GitHub'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Oppure</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              disabled
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                  clipRule="evenodd"
                />
              </svg>
              Google (Prossimamente)
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Accedendo accetti i nostri{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Termini di Servizio
            </a>{' '}
            e la{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 
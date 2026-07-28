import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Login from './Login';
import Dashboard from './Dashboard';

export default function AdminRoute() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login setSession={setSession} />;
  }

  return <Dashboard session={session} />;
}

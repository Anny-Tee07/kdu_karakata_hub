import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const profileRequest = useRef(0);

    const loadProfile = useCallback(async (userId) => {
        const requestId = profileRequest.current + 1;
        profileRequest.current = requestId;
        if (!userId || !supabase) {
            setProfile(null);
            setProfileLoading(false);
            return;
        }

        setProfileLoading(true);
        let result;
        try {
            result = await supabase
                .from('profiles')
                .select('id, username, display_name, role, is_suspended')
                .eq('id', userId)
                .single();
        } catch (error) {
            if (profileRequest.current === requestId) {
                setProfile(null);
                setProfileError(`Could not load your account profile: ${error.message}`);
                setProfileLoading(false);
            }
            return;
        }

        if (profileRequest.current !== requestId) {
            return;
        }
        const { data, error } = result;
        if (error) {
            setProfile(null);
            setProfileError(`Could not load your account profile: ${error.message}`);
            setProfileLoading(false);
            return;
        }
        setProfile(data);
        setProfileError('');
        setProfileLoading(false);
    }, []);

    const refreshProfile = useCallback(async () => {
        await loadProfile(session?.user?.id);
    }, [loadProfile, session?.user?.id]);

    useEffect(() => {
        if (!supabase) {
            return undefined;
        }

        let active = true;
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, nextSession) => {
                if (!active) {
                    return;
                }
                setSession(nextSession);
                setProfile(null);
                setProfileError('');
                setLoading(false);
                setProfileLoading(Boolean(nextSession?.user?.id));
                if (nextSession?.user?.id) {
                    window.setTimeout(() => {
                        if (active) {
                            loadProfile(nextSession.user.id);
                        }
                    }, 0);
                }
            },
        );

        supabase.auth.getSession().then(({ data, error }) => {
            if (!active) {
                return;
            }
            if (error) {
                setProfileError(`Could not restore your session: ${error.message}`);
                setLoading(false);
                return;
            }
            setSession(data.session);
            setLoading(false);
            if (data.session?.user?.id) {
                loadProfile(data.session.user.id);
            } else {
                setProfile(null);
                setProfileLoading(false);
            }
        }).catch((error) => {
            if (!active) {
                return;
            }
            setProfileError(`Could not restore your session: ${error.message}`);
            setLoading(false);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [loadProfile]);

    const signOut = useCallback(async () => {
        if (!supabase) {
            return { error: new Error('Authentication is not configured.') };
        }
        return supabase.auth.signOut();
    }, []);

    const contextValue = useMemo(() => ({
        configured: isSupabaseConfigured,
        session,
        user: session?.user || null,
        profile,
        loading,
        profileLoading,
        profileError,
        refreshProfile,
        signOut,
    }), [session, profile, loading, profileLoading, profileError, refreshProfile, signOut]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

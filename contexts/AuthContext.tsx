import { auth } from '@/config/firebase';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    User,
} from 'firebase/auth';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Alert } from 'react-native';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signOut: async () => { },
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * ============================================================
 *  🔧 GOOGLE SIGN-IN CONFIGURATION
 * ============================================================
 *
 *  Replace the webClientId below with your Web Client ID from
 *  Firebase Console → Authentication → Sign-in method → Google
 *  → Web SDK configuration → Web client ID
 *
 * ============================================================
 */
GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = useCallback(async () => {
        try {
            // Check if Google Play Services are available (Android)
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Trigger the Google Sign-In flow
            const response = await GoogleSignin.signIn();

            if (response.type === 'success' && response.data.idToken) {
                // Create a Firebase credential with the Google ID token
                const credential = GoogleAuthProvider.credential(response.data.idToken);

                // Sign in to Firebase with the credential
                await signInWithCredential(auth, credential);
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the sign-in flow
                console.log('Sign-in cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign-in already in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services are not available.');
            } else {
                console.error('Google Sign-In error:', error);
                Alert.alert(
                    'Sign-In Failed',
                    'An error occurred during sign-in. Please try again.'
                );
            }
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            await GoogleSignin.signOut();
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign-out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

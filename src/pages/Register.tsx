import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { pb } from '../lib/pb';
import type { Theme } from '../types';

interface RegisterProps {
    theme: Theme;
    isDark: boolean;
}

export const Register = ({ theme, isDark }: RegisterProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await pb.collection('users').create({
                email,
                name,
                emailVisibility: true,
                password,
                passwordConfirm,
            });

            // (optional) send an email verification request
            await pb.collection('users').requestVerification(email);

            // Auto login after registration
            await pb.collection('users').authWithPassword(email, password);

            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center h-full p-6 ${theme.text}`}>
            <h1 className="text-3xl font-bold mb-8">Create Account</h1>

            <form onSubmit={handleRegister} className="w-full max-w-sm flex flex-col gap-4">
                <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.textMuted}`}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-transparent border ${theme.border} focus:outline-none focus:border-${isDark ? 'emerald-400' : 'emerald-600'}`}
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.textMuted}`}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-transparent border ${theme.border} focus:outline-none focus:border-${isDark ? 'emerald-400' : 'emerald-600'}`}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.textMuted}`}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-transparent border ${theme.border} focus:outline-none focus:border-${isDark ? 'emerald-400' : 'emerald-600'}`}
                        placeholder="Choose a password"
                        required
                        minLength={8}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.textMuted}`}>Confirm Password</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-transparent border ${theme.border} focus:outline-none focus:border-${isDark ? 'emerald-400' : 'emerald-600'}`}
                        placeholder="Confirm password"
                        required
                        minLength={8}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-4 w-full p-3 rounded-lg font-bold text-white transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                    style={{ backgroundColor: isDark ? '#34d399' : '#059669' }}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

                <div className="text-center mt-4">
                    <p className={`text-sm ${theme.textMuted}`}>
                        Already have an account?{' '}
                        <Link to="/login" className={`font-bold hover:underline`} style={{ color: isDark ? '#34d399' : '#059669' }}>
                            Log In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

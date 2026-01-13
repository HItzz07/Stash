import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../lib/pb';
import type { Theme } from '../types';

interface LoginProps {
    theme: Theme;
    isDark: boolean;
}

export const Login = ({ theme, isDark }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await pb.collection('users').authWithPassword(email, password);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center h-full p-6 ${theme.text}`}>
            <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

            <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
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
                        placeholder="Enter your password"
                        required
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
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

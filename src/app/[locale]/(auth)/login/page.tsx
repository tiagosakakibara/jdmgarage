import { login, signup } from './actions';

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const error = params?.error as string | undefined;

    return (
        <div className="flex min-h-[90vh] items-center justify-center p-4 bg-surface-dark">
            <div className="w-full max-w-md bg-surface-card p-8 rounded-2xl border border-white/5">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Auth Portal</h1>
                    <p className="text-text-dim text-sm">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-brand-red/10 border border-brand-red/50 text-brand-red px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <button
                            formAction={login}
                            className="w-full bg-brand-red hover:bg-rose-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            formAction={signup}
                            className="w-full bg-transparent hover:bg-white/5 text-white border border-white/10 font-medium py-3 rounded-lg transition-colors"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

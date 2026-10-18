import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-8">
                <p className="text-sm font-semibold text-primary">Portal Admin</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Lupa kata sandi</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Masukkan email akun Anda. Permintaan reset dicatat, lalu superadmin mengirim kata sandi baru ke email tersebut.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-primary" role="status">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    {processing ? 'Mengirim...' : 'Minta kata sandi baru'}
                </PrimaryButton>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
                Sudah ingat kata sandi?{' '}
                <Link href={route('login')} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    Kembali ke halaman masuk
                </Link>
            </p>
        </GuestLayout>
    );
}

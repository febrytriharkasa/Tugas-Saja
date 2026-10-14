import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import Icon from '@/Components/Icon';
import Modal from '@/Components/Modal';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

function Field({ id, label, error, inputRef, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
                {label}
            </label>
            <input
                ref={inputRef}
                id={id}
                className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function ProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Card className="p-6">
            <h2 className="text-base font-bold text-slate-800">Informasi Akun</h2>
            <p className="mt-1 text-sm text-slate-600">
                Perbarui nama dan alamat email akun Anda.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-5">
                <Field
                    id="name"
                    label="Nama"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    autoComplete="name"
                    required
                    error={errors.name}
                />
                <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(event) => setData('email', event.target.value)}
                    autoComplete="username"
                    required
                    error={errors.email}
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        Email Anda belum diverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                            Kirim ulang tautan verifikasi.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1 font-semibold text-emerald-700">
                                Tautan verifikasi baru telah dikirim ke email Anda.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <Button type="submit" icon="save" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    {recentlySuccessful && (
                        <span className="text-sm font-medium text-emerald-700">Tersimpan.</span>
                    )}
                </div>
            </form>
        </Card>
    );
}

function UpdatePassword() {
    const currentPasswordInput = useRef();
    const passwordInput = useRef();
    const { data, setData, put, errors, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (validationErrors) => {
                if (validationErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (validationErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card className="p-6">
            <h2 className="text-base font-bold text-slate-800">Ubah Kata Sandi</h2>
            <p className="mt-1 text-sm text-slate-600">
                Gunakan kata sandi yang panjang dan acak agar akun tetap aman.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-5">
                <Field
                    id="current_password"
                    label="Kata Sandi Saat Ini"
                    type="password"
                    inputRef={currentPasswordInput}
                    value={data.current_password}
                    onChange={(event) => setData('current_password', event.target.value)}
                    autoComplete="current-password"
                    error={errors.current_password}
                />
                <Field
                    id="password"
                    label="Kata Sandi Baru"
                    type="password"
                    inputRef={passwordInput}
                    value={data.password}
                    onChange={(event) => setData('password', event.target.value)}
                    autoComplete="new-password"
                    error={errors.password}
                />
                <Field
                    id="password_confirmation"
                    label="Konfirmasi Kata Sandi Baru"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(event) => setData('password_confirmation', event.target.value)}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                />

                <div className="flex items-center gap-3">
                    <Button type="submit" icon="save" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    {recentlySuccessful && (
                        <span className="text-sm font-medium text-emerald-700">Tersimpan.</span>
                    )}
                </div>
            </form>
        </Card>
    );
}

function DeleteAccount() {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef();
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    const submit = (event) => {
        event.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: closeModal,
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <Card className="border-red-200 p-6">
            <h2 className="text-base font-bold text-red-700">Hapus Akun</h2>
            <p className="mt-1 text-sm text-slate-600">
                Setelah dihapus, seluruh data akun akan hilang permanen dan tidak dapat
                dikembalikan.
            </p>

            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
                <Icon name="trash" className="h-4 w-4" />
                Hapus Akun
            </button>

            <Modal show={confirming} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h3 className="text-lg font-bold text-slate-800">
                        Yakin ingin menghapus akun?
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Masukkan kata sandi Anda untuk mengonfirmasi penghapusan permanen.
                    </p>

                    <div className="mt-5">
                        <Field
                            id="delete_password"
                            label="Kata Sandi"
                            type="password"
                            inputRef={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            autoComplete="current-password"
                            placeholder="Kata sandi Anda"
                            error={errors.password}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Batal
                        </Button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                        >
                            {processing ? 'Menghapus...' : 'Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Profil Akun">
            <Head title="Profil Akun" />

            <div className="mx-auto max-w-2xl space-y-6">
                <ProfileInformation mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdatePassword />
                <DeleteAccount />
            </div>
        </AdminLayout>
    );
}

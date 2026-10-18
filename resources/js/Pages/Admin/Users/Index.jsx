import Modal from '@/Components/Modal';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import SearchInput from '@/Components/SearchInput';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const roleLabels = { staff: 'Staff', admin: 'Admin', superadmin: 'Superadmin' };
const roleBadgeClasses = {
    staff: 'bg-secondary/10 text-secondary',
    admin: 'bg-tertiary/10 text-tertiary',
    superadmin: 'bg-primary/10 text-primary'
};

export default function UsersIndex({ users, filters = {} }) {
    const userItems = Array.isArray(users) ? users : (users?.data || []);
    const userLinks = Array.isArray(users) ? null : users?.links;
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ role: '', is_active: true });
    const [resetTarget, setResetTarget] = useState(null);

    const confirmDelete = () => {
        setProcessing(true);
        router.delete(`/admin/users/${deleteTarget.id}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditForm({ role: user.role, is_active: user.is_active });
    };

    const saveEdit = () => {
        setProcessing(true);
        router.patch(`/admin/users/${editingUser.id}`, editForm, {
            onFinish: () => {
                setProcessing(false);
                setEditingUser(null);
            },
        });
    };

    const confirmResetPassword = () => {
        setProcessing(true);
        router.post(`/admin/users/${resetTarget.id}/reset-password`, {}, {
            onFinish: () => {
                setProcessing(false);
                setResetTarget(null);
            },
        });
    };

    return (
        <AdminLayout title="Kelola Pengguna">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Kelola Akun Pengguna</h1>
                    <p className="mt-1 text-sm text-slate-500">Persetujuan, role, dan reset password</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <SearchInput href="/admin/users" filters={filters} placeholder="Cari nama atau email..." />
                    <select
                        defaultValue={filters?.role || ''}
                        onChange={(e) => router.get('/admin/users', { ...filters, role: e.target.value || undefined }, { preserveState: true })}
                        aria-label="Filter role"
                        className="rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Semua Role</option>
                        {Object.entries(roleLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <select
                        defaultValue={filters?.status || ''}
                        onChange={(e) => router.get('/admin/users', { ...filters, status: e.target.value || undefined }, { preserveState: true })}
                        aria-label="Filter status"
                        className="rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="pending">Menunggu</option>
                        <option value="reset_requested">Minta Reset Password</option>
                    </select>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {userItems.map((user) => (
                                <tr key={user.id} className="transition hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClasses[user.role]}`}>
                                            {roleLabels[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {user.is_active ? 'Aktif' : 'Menunggu'}
                                            </span>
                                            {user.password_reset_requested_at && (
                                                <span className="inline-flex rounded-full bg-tertiary/10 px-2.5 py-0.5 text-xs font-medium text-tertiary">
                                                    Minta Reset
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <ActionIcon icon="pencil" label="Edit role & status" onClick={() => openEditModal(user)} color="primary" />
                                            {user.is_active && (
                                                <ActionIcon
                                                    icon="key"
                                                    label="Reset password"
                                                    onClick={() => setResetTarget(user)}
                                                    color={user.password_reset_requested_at ? 'primary' : 'slate'}
                                                />
                                            )}
                                            <ActionIcon icon="trash" label="Hapus akun" onClick={() => setDeleteTarget(user)} color="red" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {userItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                            </div>
                                            {filters?.search || filters?.role || filters?.status ? (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">Tidak ada pengguna yang cocok dengan filter</p>
                                                    <Button variant="ghost" size="sm" href="/admin/users">
                                                        Hapus filter
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-slate-500">Belum ada pengguna terdaftar</p>
                                                    <p className="text-xs text-slate-400">Pengguna baru yang mendaftar akan muncul di sini</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={userLinks} />
            </Card>

            <ConfirmDeleteModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={processing}
                itemName={deleteTarget?.name}
            />

            <Modal show={!!editingUser} maxWidth="md" onClose={() => setEditingUser(null)}>
                <div className="p-6">
                    <h2 className="text-base font-bold text-slate-800">Edit Pengguna</h2>
                    <p className="mt-1 text-sm text-slate-500">Perbarui hak akses dan status aktivasi akun</p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="w-full rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                            >
                                {Object.entries(roleLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                            <select
                                value={editForm.is_active ? 'active' : 'pending'}
                                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'active' })}
                                className="w-full rounded-lg border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="active">Aktif</option>
                                <option value="pending">Menunggu</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setEditingUser(null)} disabled={processing}>
                            Batal
                        </Button>
                        <Button onClick={saveEdit} disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal show={!!resetTarget} maxWidth="sm" onClose={() => setResetTarget(null)}>
                <div className="p-6">
                    <h2 className="text-base font-bold text-slate-800">Reset Password</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Password acak baru akan digenerate dan dikirim langsung ke <span className="font-semibold text-slate-800">{resetTarget?.email}</span>. Lanjutkan?
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setResetTarget(null)} disabled={processing}>
                            Batal
                        </Button>
                        <Button onClick={confirmResetPassword} disabled={processing}>
                            {processing ? 'Mengirim...' : 'Reset Password'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

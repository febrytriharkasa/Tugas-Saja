import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm, router } from '@inertiajs/react';

export default function ContentIndex({ staff }) {
    const staffForm = useForm({ name: '', role: '', type: 'guru', email: '', phone: '' });

    const handleDelete = (id) => {
        if (confirm('Hapus data ini?')) {
            router.delete(`/admin/content/staff/${id}`);
        }
    };

    return (
        <AdminLayout title="Guru & Tendik">
            <Card className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Data Guru & Tendik</h2>
                <div className="grid md:grid-cols-5 gap-4 mb-4">
                    <input type="text" placeholder="Nama" className="rounded-lg border-slate-300 text-sm" value={staffForm.data.name} onChange={e => staffForm.setData('name', e.target.value)} />
                    <input type="text" placeholder="Jabatan" className="rounded-lg border-slate-300 text-sm" value={staffForm.data.role} onChange={e => staffForm.setData('role', e.target.value)} />
                    <select className="rounded-lg border-slate-300 text-sm" value={staffForm.data.type} onChange={e => staffForm.setData('type', e.target.value)}>
                        <option value="guru">Guru</option>
                        <option value="tendik">Tendik</option>
                        <option value="gtk">GTK</option>
                    </select>
                    <input type="email" placeholder="Email" className="rounded-lg border-slate-300 text-sm" value={staffForm.data.email} onChange={e => staffForm.setData('email', e.target.value)} />
                    <Button onClick={() => staffForm.post('/admin/content/staff')}>Tambah</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead><tr className="border-b font-semibold text-slate-600"><th className="p-2">Nama</th><th className="p-2">Jabatan</th><th className="p-2">Tipe</th><th className="p-2"></th></tr></thead>
                        <tbody className="divide-y">
                            {staff.map(person => (
                                <tr key={person.id} className="hover:bg-slate-50">
                                    <td className="p-2">{person.name}</td>
                                    <td className="p-2">{person.role}</td>
                                    <td className="p-2">{person.type}</td>
                                    <td className="p-2 text-right"><button onClick={() => handleDelete(person.id)} className="text-red-600 hover:underline text-xs">Hapus</button></td>
                                </tr>
                            ))}
                            {staff.length === 0 && (
                                <tr><td colSpan="4" className="p-4 text-center text-slate-500">Belum ada data guru atau tendik.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}

import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

const typeLabels = { guru: 'Guru', tendik: 'Tendik', gtk: 'GTK' };

export default function StaffShow({ staffMember }) {
    return (
        <AdminLayout title="Detail Guru/Tendik">
            <div className="mb-6 flex flex-wrap gap-3">
                <Button variant="outline" href="/admin/staff" icon="arrow-left">Kembali</Button>
                <Button href={`/admin/staff/${staffMember.id}/edit`} icon="pencil">Edit Data</Button>
            </div>
            <Card className="max-w-2xl p-6">
                <h1 className="text-2xl font-bold text-slate-800">{staffMember.name}</h1>
                <p className="mt-1 text-slate-600">{staffMember.role}</p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tipe</dt>
                        <dd className="mt-1 text-slate-800">{typeLabels[staffMember.type] || staffMember.type}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                        <dd className="mt-1 text-slate-800">{staffMember.email || 'Belum diisi'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telepon</dt>
                        <dd className="mt-1 text-slate-800">{staffMember.phone || 'Belum diisi'}</dd>
                    </div>
                </dl>
            </Card>
        </AdminLayout>
    );
}

import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function StatisticsSettings({ groupedSettings }) {
    const rawSettings = Object.values(groupedSettings).flat().reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        total_students: rawSettings.total_students || '',
        total_teachers: rawSettings.total_teachers || '',
        total_staff: rawSettings.total_staff || '',
        year_founded: rawSettings.year_founded || '',
    });

    const fields = [
        ['total_students', 'Total Siswa'],
        ['total_teachers', 'Label Cadangan Total Guru'],
        ['total_staff', 'Label Cadangan Total Tenaga Kependidikan'],
        ['year_founded', 'Tahun Berdiri'],
    ];

    return (
        <AdminLayout title="Statistik Sekolah">
            <form onSubmit={(event) => { event.preventDefault(); post('/admin/settings/statistics'); }} className="max-w-3xl space-y-6">
                {recentlySuccessful && (
                    <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">Pengaturan berhasil disimpan.</div>
                )}

                <Card className="p-6">
                    <h2 className="mb-2 text-base font-bold text-slate-800">Label Statistik</h2>
                    <p className="mb-4 text-sm text-slate-600">Jumlah guru, tenaga kependidikan, berita, prestasi, agenda, dan dokumentasi dihitung otomatis dari data aktif.</p>
                    <div className="space-y-4">
                        {fields.map(([key, label]) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-medium text-slate-700">{label}</label>
                                <input
                                    id={key}
                                    type="text"
                                    value={data[key]}
                                    onChange={(event) => setData(key, event.target.value)}
                                    aria-invalid={errors[key] ? 'true' : undefined}
                                    aria-describedby={errors[key] ? `${key}-error` : undefined}
                                    className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
                                />
                                {errors[key] && <p id={`${key}-error`} className="mt-1 text-sm text-red-600">{errors[key]}</p>}
                            </div>
                        ))}
                    </div>
                </Card>

                <Button type="submit" disabled={processing} icon="save">
                    {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </Button>
            </form>
        </AdminLayout>
    );
}

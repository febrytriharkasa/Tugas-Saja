import Modal from '@/Components/Modal';
import Button from '@/Components/Button';

export default function ConfirmDeleteModal({ show, onClose, onConfirm, processing = false, itemName = '' }) {
    return (
        <Modal show={show} maxWidth="sm" onClose={onClose}>
            <div className="p-6">
                <h2 className="text-base font-bold text-slate-800">Hapus Data</h2>
                <p className="mt-2 text-sm text-slate-600">
                    {itemName
                        ? <>Yakin ingin menghapus <span className="font-semibold">{itemName}</span>? Tindakan ini tidak bisa dibatalkan.</>
                        : 'Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.'}
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={processing}>
                        Batal
                    </Button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-base font-semibold text-white transition-all duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolContentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Content/Index', [
            'staff' => Staff::latest()->get(),
        ]);
    }

    public function storeStaff(Request $request)
    {
        Staff::create($request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'type' => 'required|in:guru,tendik,gtk',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
        ]));

        return back()->with('success', 'Data guru/tendik ditambahkan.');
    }

    public function destroy(string $type, int $id)
    {
        abort_unless($type === 'staff', 404);
        Staff::findOrFail($id)->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}

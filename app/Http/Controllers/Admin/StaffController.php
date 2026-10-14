<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Staff/Index', [
            'staff' => Staff::latest()->paginate(10)->withQueryString(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Staff/Form', [
            'staffMember' => null,
        ]);
    }

    public function store(Request $request)
    {
        Staff::create($request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'type' => 'required|in:guru,tendik,gtk',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
        ]));

        return redirect()->route('admin.staff.index')->with('success', 'Data guru/tendik ditambahkan.');
    }

    public function show(Staff $staff)
    {
        return Inertia::render('Admin/Staff/Show', [
            'staffMember' => $staff,
        ]);
    }

    public function edit(Staff $staff)
    {
        return Inertia::render('Admin/Staff/Form', [
            'staffMember' => $staff,
        ]);
    }

    public function update(Request $request, Staff $staff)
    {
        $staff->update($request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'type' => 'required|in:guru,tendik,gtk',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
        ]));

        return redirect()->route('admin.staff.index')->with('success', 'Data guru/tendik diperbarui.');
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();

        return redirect()->route('admin.staff.index')->with('success', 'Data berhasil dihapus.');
    }
}

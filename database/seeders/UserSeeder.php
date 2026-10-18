<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Dr. H. Ahmad Dahlan, M.Pd.',
                'email' => 'admin@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Siti Aminah, S.Pd.',
                'email' => 'humas@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Budi Santoso, S.Kom.',
                'email' => 'it@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Rina Wulandari, M.Si.',
                'email' => 'kurikulum@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'M. Rizky Pratama, S.Pd.',
                'email' => 'kesiswaan@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}

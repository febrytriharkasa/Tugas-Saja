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
            ],
            [
                'name' => 'Siti Aminah, S.Pd.',
                'email' => 'humas@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Budi Santoso, S.Kom.',
                'email' => 'it@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Rina Wulandari, M.Si.',
                'email' => 'kurikulum@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'M. Rizky Pratama, S.Pd.',
                'email' => 'kesiswaan@smaxyz.sch.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
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

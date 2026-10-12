<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::firstOrCreate(
            ['slug' => 'agenda'],
            [
                'name' => 'Agenda',
                'metadata_schema' => [
                    ['key' => 'event_date', 'label' => 'Tanggal Agenda', 'type' => 'date'],
                    ['key' => 'location', 'label' => 'Lokasi', 'type' => 'text'],
                ],
            ]
        );

        Category::firstOrCreate(
            ['slug' => 'prestasi'],
            [
                'name' => 'Prestasi',
                'metadata_schema' => [
                    ['key' => 'participant_name', 'label' => 'Nama Peserta', 'type' => 'text'],
                    ['key' => 'rank', 'label' => 'Peringkat', 'type' => 'text'],
                    ['key' => 'year', 'label' => 'Tahun', 'type' => 'number'],
                ],
            ]
        );
    }
}

<?php

namespace App\Console\Commands;

use App\Support\PostCoverGenerator;
use Illuminate\Console\Command;

class GeneratePostCovers extends Command
{
    protected $signature = 'posts:covers {--force : Buat ulang sampul yang sudah tergenerate}';

    protected $description = 'Buat gambar sampul SVG untuk post yang belum memiliki gambar';

    public function handle(PostCoverGenerator $covers): int
    {
        $count = $covers->generateMissing((bool) $this->option('force'));

        $this->info($count > 0
            ? "Sampul dibuat untuk {$count} post."
            : 'Tidak ada post yang perlu dibuatkan sampul.');

        return self::SUCCESS;
    }
}

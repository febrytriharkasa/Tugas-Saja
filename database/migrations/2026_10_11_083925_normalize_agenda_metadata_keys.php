<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $agendaId = DB::table('categories')->where('slug', 'agenda')->value('id');

        if (! $agendaId) {
            return;
        }

        DB::table('categories')->where('id', $agendaId)->update([
            'metadata_schema' => json_encode([
                ['key' => 'event_date', 'label' => 'Tanggal Agenda', 'type' => 'date'],
                ['key' => 'location', 'label' => 'Lokasi', 'type' => 'text'],
            ]),
        ]);

        DB::table('posts')
            ->where('category_id', $agendaId)
            ->whereNotNull('metadata')
            ->orderBy('id')
            ->each(function (object $post): void {
                $metadata = json_decode($post->metadata, true);

                if (! is_array($metadata)) {
                    return;
                }

                $metadata['event_date'] ??= $metadata['tanggal_agenda'] ?? null;
                $metadata['location'] ??= $metadata['lokasi'] ?? null;

                unset($metadata['tanggal_agenda'], $metadata['lokasi']);

                $metadata = array_filter($metadata, fn (mixed $value): bool => $value !== null && $value !== '');

                DB::table('posts')->where('id', $post->id)->update([
                    'metadata' => empty($metadata) ? null : json_encode($metadata),
                ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $agendaId = DB::table('categories')->where('slug', 'agenda')->value('id');

        if (! $agendaId) {
            return;
        }

        DB::table('categories')->where('id', $agendaId)->update([
            'metadata_schema' => json_encode([
                ['key' => 'lokasi', 'label' => 'Lokasi', 'type' => 'text'],
                ['key' => 'tanggal_agenda', 'label' => 'Tanggal Agenda', 'type' => 'date'],
            ]),
        ]);

        DB::table('posts')
            ->where('category_id', $agendaId)
            ->whereNotNull('metadata')
            ->orderBy('id')
            ->each(function (object $post): void {
                $metadata = json_decode($post->metadata, true);

                if (! is_array($metadata)) {
                    return;
                }

                $metadata['tanggal_agenda'] ??= $metadata['event_date'] ?? null;
                $metadata['lokasi'] ??= $metadata['location'] ?? null;

                unset($metadata['event_date'], $metadata['location']);

                $metadata = array_filter($metadata, fn (mixed $value): bool => $value !== null && $value !== '');

                DB::table('posts')->where('id', $post->id)->update([
                    'metadata' => empty($metadata) ? null : json_encode($metadata),
                ]);
            });
    }
};

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountApprovedNotification extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Akun portal Anda sudah disetujui')
            ->greeting("Halo {$notifiable->name},")
            ->line('Akun Anda sudah disetujui admin sekolah dan sekarang aktif.')
            ->action('Masuk ke portal', url('/login'))
            ->line('Jika Anda tidak merasa mendaftar, abaikan email ini.');
    }
}

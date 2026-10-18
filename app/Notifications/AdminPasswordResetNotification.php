<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminPasswordResetNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $password) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kata sandi portal Anda sudah direset')
            ->greeting("Halo {$notifiable->name},")
            ->line('Admin sekolah mereset kata sandi akun portal Anda.')
            ->line("Kata sandi baru: {$this->password}")
            ->line('Masuk lalu ganti kata sandi ini dari halaman profil.')
            ->action('Masuk ke portal', url('/login'))
            ->line('Jika Anda tidak meminta reset, hubungi admin sekolah.');
    }
}

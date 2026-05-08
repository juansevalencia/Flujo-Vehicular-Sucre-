<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReporteMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $pdfContent) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '🚦 Reporte de Tráfico - Sucre/Libertador');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.reporte');
    }

    public function attachments(): array
    {
        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(
                fn () => $this->pdfContent,
                'reporte-trafico.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
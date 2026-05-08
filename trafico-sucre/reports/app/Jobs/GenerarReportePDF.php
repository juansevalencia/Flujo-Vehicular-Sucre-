<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\ReporteMail;
use Illuminate\Support\Facades\Mail;

class GenerarReportePDF implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public array $semaforos
    ) {}

    public function handle(): void
    {
        $pdf = Pdf::loadView('reporte', [
            'semaforos' => $this->semaforos,
            'fecha' => now()->format('d/m/Y H:i'),
        ]);

        $pdfContent = $pdf->output();

        Mail::to($this->email)->send(new ReporteMail($pdfContent));
    }
}
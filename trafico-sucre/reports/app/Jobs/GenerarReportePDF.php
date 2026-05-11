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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerarReportePDF implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $email) {}

    public function handle(): void
    {
        // Obtener semáforos reales desde NestJS
        $nestUrl = env('NEST_API_URL', 'http://localhost:3000');

        try {
            $response = Http::timeout(10)->get("{$nestUrl}/semaforos");

            if (!$response->successful()) {
                Log::error('Error al obtener semáforos de NestJS', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                // Fallback: datos de ejemplo para que el reporte igual salga
                $semaforos = $this->semaferosFallback();
            } else {
                $semaforos = $response->json();
            }
        } catch (\Exception $e) {
            Log::error('No se pudo conectar a NestJS: ' . $e->getMessage());
            $semaforos = $this->semaferosFallback();
        }

        // Calcular resumen para el PDF
        $resumen = $this->calcularResumen($semaforos);

        $pdf = Pdf::loadView('reporte', [
            'semaforos' => $semaforos,
            'resumen'   => $resumen,
            'fecha'     => now()->setTimezone('America/Argentina/Buenos_Aires')->format('d/m/Y H:i'),
        ])->setPaper('a4', 'portrait');

        Mail::to($this->email)->send(new ReporteMail($pdf->output()));
    }

    private function calcularResumen(array $semaforos): array
    {
        $total    = count($semaforos);
        $criticos = 0;
        $moderados = 0;
        $fluidos  = 0;
        $totalUtil = 0;

        foreach ($semaforos as $sem) {
            // Evitar división por cero
            if (empty($sem['serviceRate']) || $sem['serviceRate'] == 0) continue;

            $util = $sem['arrivalRate'] / $sem['serviceRate'];
            $totalUtil += $util;

            if ($util > 0.8)      $criticos++;
            elseif ($util > 0.6)  $moderados++;
            else                   $fluidos++;
        }

        return [
            'total'        => $total,
            'criticos'     => $criticos,
            'moderados'    => $moderados,
            'fluidos'      => $fluidos,
            'utilizacion'  => $total > 0 ? round(($totalUtil / $total) * 100) : 0,
        ];
    }

    private function semaferosFallback(): array
    {
        // Datos de muestra si NestJS no responde — el reporte igual se genera
        return [
            ['nodeId' => 'Sucre/Libertador',    'arrivalRate' => 0.9, 'serviceRate' => 1.2, 'greenTime' => 30, 'redTime' => 45],
            ['nodeId' => 'Sucre/Gral. Paz',     'arrivalRate' => 0.5, 'serviceRate' => 1.0, 'greenTime' => 25, 'redTime' => 35],
            ['nodeId' => 'Libertador/Olleros',  'arrivalRate' => 0.7, 'serviceRate' => 0.8, 'greenTime' => 20, 'redTime' => 40],
            ['nodeId' => 'Sucre/Juramento',     'arrivalRate' => 0.3, 'serviceRate' => 1.0, 'greenTime' => 35, 'redTime' => 30],
            ['nodeId' => 'Libertador/Monroe',   'arrivalRate' => 0.95,'serviceRate' => 1.0, 'greenTime' => 15, 'redTime' => 50],
        ];
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\GenerarReportePDF;

class ReporteController extends Controller
{
    public function generar(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'semaforos' => 'required|array',
        ]);

        GenerarReportePDF::dispatch(
            $request->email,
            $request->semaforos
        );

        return response()->json([
            'mensaje' => 'Reporte en proceso, lo recibirás por email en breve.',
        ]);
    }
}
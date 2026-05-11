<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; padding: 30px; }

        /* Header */
        .header { border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 20px; }
        .header h1 { font-size: 22px; color: #1e40af; }
        .header p  { color: #64748b; font-size: 12px; margin-top: 4px; }

        /* Resumen cards */
        .resumen { display: table; width: 100%; margin-bottom: 24px; border-spacing: 8px; }
        .resumen-card { display: table-cell; width: 25%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; }
        .resumen-card .numero { font-size: 28px; font-weight: bold; }
        .resumen-card .label  { font-size: 11px; color: #64748b; margin-top: 2px; }
        .num-critico  { color: #ef4444; }
        .num-moderado { color: #f97316; }
        .num-fluido   { color: #22c55e; }
        .num-total    { color: #1e40af; }

        /* Tabla */
        h2 { font-size: 15px; color: #1e40af; margin-bottom: 10px; border-left: 4px solid #1e40af; padding-left: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        thead tr { background: #1e40af; color: white; }
        th { padding: 9px 8px; text-align: center; font-weight: 600; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center; }
        tr:nth-child(even) td { background: #f8fafc; }

        /* Badges de estado */
        .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .badge-critico  { background: #fee2e2; color: #ef4444; }
        .badge-moderado { background: #ffedd5; color: #f97316; }
        .badge-fluido   { background: #dcfce7; color: #22c55e; }

        /* Barra de utilización */
        .bar-bg   { background: #e2e8f0; border-radius: 4px; height: 10px; width: 80px; display: inline-block; vertical-align: middle; }
        .bar-fill { height: 10px; border-radius: 4px; display: block; }

        /* Footer */
        .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <h1>🚦 Reporte de Tráfico — Corredor Sucre / Libertador</h1>
        <p>Buenos Aires, Argentina &nbsp;·&nbsp; Generado: {{ $fecha }}</p>
    </div>

    {{-- Resumen ejecutivo --}}
    <div class="resumen">
        <div class="resumen-card">
            <div class="numero num-total">{{ $resumen['total'] }}</div>
            <div class="label">Intersecciones</div>
        </div>
        <div class="resumen-card">
            <div class="numero num-critico">{{ $resumen['criticos'] }}</div>
            <div class="label">Críticas (&gt;80%)</div>
        </div>
        <div class="resumen-card">
            <div class="numero num-moderado">{{ $resumen['moderados'] }}</div>
            <div class="label">Moderadas (60–80%)</div>
        </div>
        <div class="resumen-card">
            <div class="numero num-fluido">{{ $resumen['fluidos'] }}</div>
            <div class="label">Fluidas (&lt;60%)</div>
        </div>
    </div>

    <h2>Detalle por intersección</h2>

    <table>
        <thead>
            <tr>
                <th>Intersección</th>
                <th>λ (llegada)</th>
                <th>μ (servicio)</th>
                <th>Utilización ρ</th>
                <th>Cola Lq</th>
                <th>Espera Wq</th>
                <th>Verde</th>
                <th>Rojo</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
        @foreach($semaforos as $sem)
        @php
            $mu   = $sem['serviceRate'] > 0 ? $sem['serviceRate'] : 0.001;
            $util = $sem['arrivalRate'] / $mu;
            $util = min($util, 0.999); // evitar división por cero en sistema saturado
            $lq   = round(($util * $util) / (1 - $util), 2);
            $wq   = round($lq / $sem['arrivalRate'], 2);
            $pct  = round($util * 100);

            if ($util > 0.8)     { $clase = 'critico';  $label = 'Crítico';  $barColor = '#ef4444'; }
            elseif ($util > 0.6) { $clase = 'moderado'; $label = 'Moderado'; $barColor = '#f97316'; }
            else                 { $clase = 'fluido';   $label = 'Fluido';   $barColor = '#22c55e'; }
        @endphp
        <tr>
            <td style="text-align:left; font-weight:600;">{{ $sem['nodeId'] }}</td>
            <td>{{ $sem['arrivalRate'] }}</td>
            <td>{{ $sem['serviceRate'] }}</td>
            <td>
                <div class="bar-bg">
                    <span class="bar-fill" style="width: {{ min($pct, 100) }}%; background: {{ $barColor }};"></span>
                </div>
                <span style="margin-left:6px;">{{ $pct }}%</span>
            </td>
            <td>{{ $lq }}</td>
            <td>{{ $wq }}s</td>
            <td>{{ $sem['greenTime'] }}s</td>
            <td>{{ $sem['redTime'] }}s</td>
            <td><span class="badge badge-{{ $clase }}">{{ $label }}</span></td>
        </tr>
        @endforeach
        </tbody>
    </table>

    <div class="footer">
        TraficoSucre · Modelo M/M/1 · ρ = λ/μ · Lq = ρ²/(1−ρ) · Wq = Lq/λ
    </div>

</body>
</html>
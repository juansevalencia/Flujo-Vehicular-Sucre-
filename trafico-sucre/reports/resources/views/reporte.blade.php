<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1e40af; color: white; padding: 8px; }
        td { padding: 8px; border: 1px solid #ddd; text-align: center; }
        tr:nth-child(even) { background: #f1f5f9; }
        .critico { color: #ef4444; font-weight: bold; }
        .moderado { color: #f97316; font-weight: bold; }
        .fluido { color: #22c55e; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🚦 Reporte de Tráfico</h1>
    <p>Corredor Sucre → Libertador, Buenos Aires</p>
    <p>Generado: {{ $fecha }}</p>

    <table>
        <tr>
            <th>Intersección</th>
            <th>Utilización</th>
            <th>Autos en cola</th>
            <th>Espera (seg)</th>
            <th>Verde (seg)</th>
            <th>Rojo (seg)</th>
            <th>Estado</th>
        </tr>
        @foreach($semaforos as $sem)
        @php
            $util = $sem['arrivalRate'] / $sem['serviceRate'];
            $lq = ($util * $util) / (1 - $util);
            $wq = round($lq / $sem['arrivalRate'], 2);
            $estado = $util > 0.8 ? 'critico' : ($util > 0.6 ? 'moderado' : 'fluido');
            $label = $util > 0.8 ? 'Crítico' : ($util > 0.6 ? 'Moderado' : 'Fluido');
        @endphp
        <tr>
            <td>{{ $sem['nodeId'] }}</td>
            <td>{{ round($util * 100) }}%</td>
            <td>{{ round($lq, 2) }}</td>
            <td>{{ $wq }}</td>
            <td>{{ $sem['greenTime'] }}</td>
            <td>{{ $sem['redTime'] }}</td>
            <td class="{{ $estado }}">{{ $label }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>

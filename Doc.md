# Optimización de flujo de autos de Echeverria y Libertador

## Extracción de mapa.

Mediante osmnx matplotlib cree un script que pida exactamente en que parte de la ciudad quiero representar.

Y ademas le adjudico aristas y nodos a las calles e intersecciones respectivamente con JSON. Lo exporte de esa manera el grafo.

## Levantar base de datos con docker y cargar nodos-aristas que hice.

Las 3 bases de datos/contenedores:

Contenedor PostgreSQL que NestJs guarda los nodos aristas y semaforos del grafo.

Contenedor MySQÑ Lavarel guarda los resultados de la simulacion y reportes.

Contenedor Redis, Lavarel usa colas para procesar simulaciones pesadas sin bloquear.

Como cuando el SO hace esto con las tareas pesadas sin bloquear el procesador.

## Funcionamiento

Usuario desde el navegaodr pide generar el pdf. 
Next le avisa a nest y nest le dice a laravel genera el pdf.

Redis es la base de memoria ram, alli lavarel la usa como pizarra. Pendiente generar tla cosa.

WOrker es un proceso php que esta corriendo constantemente y mirandoa  redis esta viendo que hay para hacer.

## Levantar Docker.

Es necesario descargar las imagenes de postgre sql, mysql y redis desde docker hub.

Una imagen es como una plantilla con todo lo necesario para correr un programa. SO, dependencias, config.



¿Porque desde docker hub? Que es? 
Docker Hub es el repo de imagenes, es el npm pero para contenedores docker.

¿Porque es necesario imagenes de postgreSQL y para que nos sirve en este caso? 

Usamos postgreSQL para guardar el grafo de Libertador.

Sin la base de datos perderiamos todo, nestJS se conecta a postgreSQL



PosteGreSQL -> NestJS
MySql -> Lavarel
Redis -> Laravel Queues.

# Crear Proyecto NestJs

Primero necesitmaos tener instalado Node.js que es una herramienta que permite ejecutar JavaScript fuera de la web.

Con Node.js puedo crear servidores, hacer apis, automatizar tareas, ejecutar scripts. A diferencia de solo JAVASCRIPT que se usa para apginas web.

Vamos a poder usar npm para pdoer instalar librerias.

Usamos prisma para itneractuar con bases de datos mas seguro.

Nosotros creamos las tablas con las herrameintas de prisma. 
En primsa/migrations se guarda el historial.

## Estructura de tres tablas en PostgreSQL:
```
Node (intersecciones del mapa)
├── id, osmid         ← identificador de OpenStreetMap
├── lat, lon          ← coordenadas geográficas
└── edges             ← calles que salen/llegan a este nodo

Edge (calles entre intersecciones)
├── fromId → toId     ← de qué nodo a qué nodo va la calle
├── length            ← distancia en metros
└── maxspeed          ← velocidad máxima

Intersection (semáforos/colas)
├── nodeId            ← a qué intersección pertenece
├── arrivalRate λ     ← cuántos autos llegan por segundo (M/M/1)
├── serviceRate μ     ← cuántos autos pasan por segundo
└── greenTime/redTime ← tiempos del semáforo
```

## Endpoints

Los endpoints son las urls de mi API a las que Next va hacer requests para pedir datos.
Y Nest va a responder.

GET /grafo/nodos Devuelve todos los nodos del mapa
GET /grafo/aristas Devuelve todas las calles
POST /ruta Recibe origen y destino, devuelve la ruta más corta con Dijkstra
GET /semaforosDevuelve todas las intersecciones con sus tiempos
PUT /semaforos/:id
Actualiza el tiempo de un semáforo

### Arrancamos creando el modulo grafo

cd ~/Desktop/Job/Echeverria/trafico-sucre/backend
npx nest generate module grafo
npx nest generate controller grafo
npx nest generate service grafo

Escribimos en typescript en los grado service y controller .ts

Arrancamos el servidor, npm run start:dev

### Creamos modulo Djikstra
Gracias a este modulo podemos generar djikstra entre dos nodos.

## Creamos Frontend con Next.

Usamos atchivos tsx, son archivos de typescript con JSX. Escribis componentrs de React usando typsecript.

Se usan para crear paginas, componentes, loyouts, manejar UI con tipado fuerte.

## Modulo semaforos

### Con los comandos npx creamos los moudlos en el backend de semaforos

Se crean los archivos:

1. module, agrupa cosas relacionadas y permite declarar que controladores y servicios pertenecena  este modulo.

2.Controller, define las rutas HTTP, recibe requests get, post. La puerta de la entrada (API)

3.Service, aca va la logica. Calcular tiempo de semaforo, aplicar reglas, acceder a la base de datos.



### Modelo de Colas M/M/1

Primero quiero aclarar que podría pasar mucho tiempo explicando como funciona el modelo de colas. 
Pero basicamene usamos semaforos para el acceso a base de datos y el modelo de colas conocido, pueden buscarlo en internet,con ese modelo alimentamos los valores de tiempo de semaforo en verde y rojo(se puede ver en los archivos service  (logica)).

Resumen, muy resumido del calculo de saturacion de los semaforos en el modelo de colas: 

Vamos a usar el modelo M/M/1
Markoviano (llegadas aleatorias) Markoviano(tiemposde servicio exponenciales) 1 (un solo servidor, el semaforo)

Solo pasa un auto ala vez. Con esto puedo obtener cantidad promedio de autos en cola, tiempo promedio de espera, probabilidad de que haya congestion.

p = lambda/ mu . si p >= 1 el sistema colapsa

lambda = cantidad de autos que entran 

mu = cantidad de autos que salen (el semaoforo deja pasar).

## seed
El seed es un script que inserta datos iniciales en la base de datos. Cada vez que lo cambiamos tenemos que correrlo devuelta porque no es codigo de app, es herramienta de setup.

## Laravel 

Vamos a generar los reportes en pdf con Laravel osbre los reportes del trafico.

Completamos dentro de app/Job los archivos .php para generar Reportes pdf y Reporte mail.
También el ReporteCOntroller.php 

Creamos las vistas en html

El GenerarReportePDF.php va a lleva a cabo qe lavarel llame a NestJS (Get/semaforos) sin depender de que alguine madne los datos

El reporte.blade.ph genera el pdf.

ReporteController.php necesita el mail.
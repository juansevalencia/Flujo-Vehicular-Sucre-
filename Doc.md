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


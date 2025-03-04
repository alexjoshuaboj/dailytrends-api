# dailytrends-api
DailyTrends es un API que expone un feed de noticias agregadas de diferentes periódicos.

## Teconologías utilizadas
- **Node.js** con **TypeScript**
- **Express.js** como framework para la API
- **MongoDB** como base de datos
- **Mongoose** como ODM para la gestión de MongoDB
- **Cheerio** para web scraping
- **Docker** para la contenerización del proyecto
- **Jest** para la ejecución de tests

## Instalación y configuración
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd daily-trends
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno:
   - Renombrar el archivo `template.env` a `.env`
   - Configurar las variables necesarias dentro de `.env`

4. Para resetear un contenedor:

   ```bash
   npm run build
   ```

5. Levantar el contenedor Docker con las imagenes de Mongo y Node:
   ```bash
   docker compose up --build -d
   ```
   `-d es para que no se queden los logs del servidor en la terminal en ejecuccóin`

6. Para resetear un contenedor al hacer un cambio:

   ```bash
   docker compose restart :container_id:
   ```


## Endpoints

### **Feeds**
- **GET** `/feeds` - Obtener todos los feeds
- **POST** `/feeds` - Crear un nuevo feed
- **GET** `/feeds/:id` - Obtener un feed específico por ID
- **PUT** `/feeds/:id` - Actualizar un feed
- **DELETE** `/feeds/:id` - Eliminar un feed

## Arquitectura
El proyecto sigue una estructura de capas para mantener el código desacoplado:

```mermaid
flowchart TB
    A[Rutas] --> B[Controladores]
    B --> C[Servicios]
    C --> D[Repositorios]
    D --> E[Base de Datos]

    I(Interfaces) -.-> B
    I -.-> C
    I -.-> D

```

## Pruebas
Para ejecutar las pruebas:
```bash
npm test
```

## Representación de la Arquitectura

```mermaid
graph TD;
    A["Cliente/Frontend"] -->|HTTP Requests| B["Rutas (Routes) - feed/index.ts"]
    B -->|Dirige Peticiones| C["Controladores (Controllers) - feed/*.ts"]
    C -->|Usa| D["Servicios (Services) - feedService.ts"]
    D -->|Implementa Lógica| E["Repositorios (Repositories) - feed.repository.ts"]
    E -->|Accede a| F["Base de Datos"]

    D -->|Usa| G["Servicios de Scraper (services/scraper/*.ts)"]
    G -->|Configura con| H["IScraperConfig.ts"]

    I["Interfaces (IFeedRepository.ts, etc.)"] -.->|Define Contratos| D
    I -.->|Define Contratos| E
    I -.->|Define Contratos| G

    J["Tests (controllers/feed/*.test.ts, feedService.test.ts, etc.)"] -.->|Validan Lógica| C
    J -.->|Validan Lógica| D
    J -.->|Validan Lógica| E
```

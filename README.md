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

## Pruebas
Para ejecutar las pruebas:
```bash
npm test
```

## Representación de la Arquitectura

```mermaid
graph TD;
    subgraph "Punto de Entrada"
    S["start.ts / server.ts / backendApp.ts"]
    end

    subgraph "Rutas"
    B["routes/feed (o archivo de rutas)"]
    end

    subgraph "Controladores"
    C["controllers/feed.controller.ts"]
    end

    subgraph "Servicios"
    D["feed.service.ts"]
    end

    subgraph "Repositorios"
    E["repositories/feed.repository.ts"]
    end

    subgraph "Infraestructura"
    F["infrastructure/dbConnection.ts (acceso a la BD)"]
    end

    subgraph "Modelos"
    X["models/feed.ts"]
    end

    subgraph "Adaptadores / Scraper"
    G["adapters/ (abstractScraper.ts, scraper.ts)"]
    H["scraper/ (lógica adicional)"]
    end

    subgraph "Interfaces"
    IFEED["interfaces/IFeed.ts"]
    IFREP["interfaces/IFeedRepository.ts"]
    end

    subgraph "Tests"
    T["tests/*.test.ts (feed.test.ts, scraper.test.ts, etc.)"]
    end

    %% Flujo principal
    A["Cliente/Frontend"] -->|HTTP Requests| S
    S -->|Inicia y delega| B
    B -->|Dirige Peticiones| C
    C -->|Usa| D
    D -->|Implementa Lógica| E
    E -->|Accede a| F
    E -->|Usa Modelos| X

    %% Scraper
    D -->|También Usa| G
    G -->|Puede usar| H

    %% Interfaces
    IFEED -.->|Define contrato de datos| X
    IFREP -.->|Define contrato del repositorio| E
    G -.->|Puede implementar contratos| IFREP

    %% Tests
    T -.->|Validan Lógica| C
    T -.->|Validan Lógica| D
    T -.->|Validan Lógica| E
    T -.->|Validan Lógica| G

```

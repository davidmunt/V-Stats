# V-Stats - Plataforma de Análisis Estadístico para Voleibol

**V-Stats** es una aplicación web integral diseñada para cuerpos técnicos y analistas de voleibol. La plataforma permite la gestión de competiciones, el registro de acciones en tiempo real durante los partidos y la visualización de estadísticas avanzadas (como trayectorias de saque y mapas de calor) para mejorar la toma de decisiones tácticas.

---

## Puesta en marcha (Local)

La aplicación está completamente dockerizada, lo que facilita su ejecución sin necesidad de instalar cada tecnología por separado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/davidmunt/V-Stats.git
cd V-Stats
```

### 2. Configurar variables de entorno

Asegúrate de configurar los archivos .env en cada directorio.

### 3. Levantar el proyecto con Docker

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up -d --build
```

Este comando descargará las imágenes necesarias y levantará los cuatro servicios simultáneamente.

---

## Tecnologías utilizadas

El proyecto utiliza una arquitectura de microservicios y contenedores:

- **Frontend:** React + Vite + Tailwind CSS
- **Backend Principal:** Spring Boot (Java) para gestión de usuarios, seguridad (Auth) y pagos
- **Backend Estadístico:** FastAPI (Python) para el procesamiento rápido de acciones y datos del partido
- **Base de Datos:** PostgreSQL
- **Infraestructura:** Docker y Docker Compose

---

## Puertos y Acceso

Una vez que los contenedores estén en estado `Running`, podrás acceder a los servicios en las siguientes direcciones:

| Servicio   | URL Local             |
| ---------- | --------------------- |
| Frontend   | http://localhost:5173 |
| API Java   | http://localhost:8080 |
| API Python | http://localhost:8000 |

---

## Funcionalidades clave

- **Análisis en vivo:** Registro de acciones (saques, remates, recepciones, bloqueos, etc).
- **Gráficas:** Visualización de datos mediante dos modalidades principales: gráficas de trayectoria del balón para saques o ataques, y mapas de calor (heatmaps) para el resto de acciones, permitiendo identificar los puntos ganados y perdidos por ambos equipos.
- **Gestión de Plantillas:** Componente que usa Drag and Drop para organizar la plantilla titular del equipo para un partido, junto al banquillo de suplentes.
- **Asistente IA:** Chatbot integrado para consultas rápidas sobre el rendimiento.
- **Pagos Integrados:** Gestión de pagos mediante Stripe.

---

## Desarrollado por

**David Muntean**

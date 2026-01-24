# ⚔️ Risk Real-Time Strategy Game

![Status](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

> **Una adaptación moderna y en tiempo real del clásico juego de estrategia Risk.** > Conquista territorios, gestiona tropas y enfréntate a tus amigos en un mapa interactivo SVG con actualizaciones instantáneas.

---

## 📖 Sobre el Proyecto

Este proyecto es una implementación completa de un juego de estrategia por turnos multijugador. El objetivo es dominar el mundo atacando territorios enemigos y fortificando los propios.

A diferencia de las versiones clásicas de navegador, este juego utiliza **WebSockets (SignalR)** para garantizar que cada movimiento, ataque o despliegue de tropas se refleje instantáneamente en las pantallas de todos los jugadores, sin necesidad de recargar la página.

### ✨ Características Principales
* **Mapa Interactivo SVG:** Territorios vectoriales con detección de clics precisa y escalado perfecto.
* **Multijugador en Tiempo Real:** Salas de juego dinámicas y actualizaciones instantáneas.
* **Lógica de Juego Completa:** Fases de Draft (colocación), Ataque y Fortificación.
* **Sistema de Batalla:** Cálculo de dados y resolución de conflictos automática.
* **Interfaz Reactiva:** Feedback visual inmediato (animaciones, filtros de color, tooltips).

---

▶️ **Ver video en YouTube**  
[![Demo](https://img.youtube.com/vi/n51jqkmD_Io/hqdefault.jpg)](https://www.youtube.com/watch?v=n51jqkmD_Io)

---

## 🛠️ Tech Stack

El proyecto está construido utilizando una arquitectura moderna de cliente-servidor separada.

### **Frontend (Cliente)**
* ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black) **React.js:** Biblioteca principal para la UI.
* ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS:** Estilizado rápido y diseño responsivo.
* ![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white) **Vite:** Entorno de desarrollo y build tool ultrarrápido.
* **SVG & CSS Filters:** Para el renderizado avanzado del mapa.

### **Backend (Servidor)**
* ![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white) **C# / .NET 8 API:** Núcleo lógico del juego.
* ![SignalR](https://img.shields.io/badge/SignalR-WebSockets-1384C8?logo=signalr&logoColor=white) **SignalR:** Comunicación bidireccional en tiempo real.
* ![EF Core](https://img.shields.io/badge/EF_Core-ORM-512BD4) **Entity Framework Core:** Gestión de base de datos.
* ![SQL Server](https://img.shields.io/badge/SQL_Server-Database-CC2927?logo=microsoft-sql-server&logoColor=white) **SQL Server:** Persistencia de datos (Partidas, Jugadores, Estado).

---

## 🔁 Turnos y Fases

En su turno, cada jugador pasa por **tres fases consecutivas**:

### 🟢 Colocación de tropas (Draft)

- El jugador recibe tropas en función de los territorios que controla.
- Todas las tropas deben colocarse antes de continuar.
- La interfaz muestra controles interactivos directamente sobre el mapa para facilitar la asignación.

---

### 🔴 Ataque

- Se elige un territorio propio como origen (con más de una tropa).
- Se selecciona un territorio enemigo adyacente como objetivo.
- El servidor resuelve el combate automáticamente mediante tiradas de dados.
- El mapa entra en un modo de enfoque que resalta solo las acciones válidas.

---

### 🟡 Reorganización (Fortify)

- Es posible mover tropas entre territorios propios conectados.
- Solo se permite un movimiento por turno.
- Al finalizar (o saltar esta fase), el turno pasa al siguiente jugador.

---

## 🏆 Final de la partida

La partida termina cuando:

- Un jugador domina todo el mapa, o
- El resto de jugadores abandona la partida.

En ese momento, el estado del juego se marca como **finalizado** y se anuncia al ganador.

---

## 🚀 Puesta en marcha

### Requisitos

- Node.js + npm
- .NET 8 SDK
- SQL Server (local o en Docker)

### Backend

```bash
cd RiskGameAPI
dotnet ef database update
dotnet run --launch-profile network
```

### Frontend

```bbash
cd RiskGameClient
npm install
npm run dev -- --host
```

---

## 🗂️ Modelo Entidad-Relación (ER)

El núcleo de datos está diseñado para mantener el estado persistente de cada partida.

```mermaid
erDiagram
    GAME ||--|{ PLAYER : "tiene"
    GAME ||--|{ PRINCEDOM : "contiene"
    PLAYER ||--o{ PRINCEDOM : "controla"
    
    GAME {
        guid Id PK
        string GameState "WAITING | PLACING | ATTACKING | MOVING | FINISHED"
        guid CurrentPlayerID
        int NextHighstorm
    }

    PLAYER {
        guid Id PK
        string Name
        string Color
        int AvailabelTroops
        bool IsAlive
        guid GameId FK
    }

    PRINCEDOM {
        guid Id PK
        int BlueprintID "ID Estático del Mapa"
        string Name
        int Troops
        guid PlayerId FK "Dueño actual"
        guid GameId FK
    }



# PoundAK

PoundAK is an experimental Overwolf-based gaming companion platform focused on realtime telemetry processing, cross-window application orchestration, AI-assisted gameplay analysis, and player performance tracking.

The platform was designed as a multi-context desktop companion capable of operating across supported multiplayer games while synchronizing overlays, background services, desktop interfaces, and live gameplay data into a unified user experience.

Unlike traditional single-window desktop applications, PoundAK operated as a distributed runtime environment where multiple isolated application contexts needed to continuously synchronize state, events, telemetry, and UI behavior in realtime during active gameplay sessions.

---

# Core Stack

## Frontend
- Next.js
- React
- TypeScript
- Redux
- TailwindCSS

## Backend
- Express.js
- MongoDB
- JWT Authentication
- REST APIs

## Platform / Runtime
- Overwolf APIs
- Overlay Windows
- Background Processes
- Desktop Windows
- Hotkey-triggered Interfaces

---

# Core Platform Systems

## Overwolf Runtime Architecture

PoundAK was built around Overwolf's multi-window application ecosystem, allowing the platform to operate simultaneously through:

- In-game overlays
- Desktop interfaces
- Background services
- Hotkey-triggered utility windows
- Game-aware runtime contexts

The application dynamically reacted to supported games and could switch operational behavior depending on the currently active title.

The architecture was primarily designed around:
- FPS games
- Competitive multiplayer environments
- Live telemetry-driven workflows

with Marvel Rivals serving as the primary implemented integration target alongside experimental Apex Legends support.

---

## Realtime Telemetry & Game Event Processing

The platform consumed live Overwolf game-event APIs to process gameplay telemetry in realtime.

Depending on game support, the system could ingest:
- Kills
- Deaths
- Assists
- Match states
- Player statistics
- Session telemetry
- Map data
- Combat events
- Game-specific runtime events

Different subsystems consumed telemetry differently:

- Realtime overlays and assistance systems processed live event streams during gameplay
- Analytics systems aggregated post-session data for historical tracking and visualization

The architecture was designed to support multiple independent telemetry pipelines simultaneously.

Because apparently merely playing games was not enough suffering for humanity.

---

## AI Coaching & Context-Aware Assistance

One of the primary experimental systems within PoundAK was a context-aware AI coaching layer integrated directly into player progression and gameplay analytics.

The AI systems consumed:
- Historical gameplay statistics
- Aggregated player performance
- User preferences
- Tracked habits
- Self-reported metrics
- Progression information
- Session history

The goal was to create a persistent coaching assistant capable of discussing:
- Strategies
- Gameplay improvement
- Player trends
- Performance weaknesses
- Progression recommendations

Multiple LLM providers and models were tested during development through TogetherAI orchestration, including:
- Llama
- Mistral
- Claude
- GPT models
- DeepSeek variants

Prompt orchestration and structured context injection pipelines were implemented to normalize gameplay and profile data into reusable AI-facing contexts.

---

## Cross-Window Synchronization Architecture

One of the more technically challenging aspects of the platform involved synchronization across isolated Overwolf runtime contexts.

Because:
- Overlays
- Desktop windows
- Background processes
- Hotkey interfaces

all operated as effectively separate application environments, traditional React state management alone was insufficient for reliable synchronization.

To solve this, PoundAK implemented a lightweight event-driven localStorage synchronization layer that acted as an inter-context communication bridge between runtime environments.

This allowed:
- Realtime UI synchronization
- Shared operational state
- Cross-window event propagation
- Persistent local coordination
- Gameplay event distribution

between otherwise isolated application layers.

This architecture became one of the central coordination systems of the platform.

---

## Analytics & Performance Tracking

PoundAK included player analytics systems focused on aggregating gameplay telemetry into historical performance views and visual tracking systems.

Tracked metrics varied dynamically depending on available Overwolf game integrations and APIs.

The platform supported:
- Session aggregation
- Historical stat tracking
- Graph visualizations
- Trend analysis
- Gameplay summaries
- Derived performance indicators

Several experimental gameplay calculations and composite metrics were also implemented for evaluating player behavior patterns and adaptability characteristics.

The original long-term direction also explored integration between gameplay tracking and broader personal performance systems.

Some parts of that vision remained experimental or partially implemented during development.

Which is software engineering language for:

> “the architecture escaped containment before the roadmap survived contact with reality.”

---

## Backend Infrastructure

The backend primarily functioned as:
- Authentication infrastructure
- Persistence layer
- Telemetry storage
- Account management system
- AI context provider
- Synchronization backend

Features included:
- JWT authentication
- Discord OAuth integration
- MongoDB persistence
- REST-based synchronization APIs
- Account-linked progression systems

Due to the project's evolution timeline, portions of the persistence architecture were integrated after significant frontend systems had already been developed, resulting in a frontend-heavy runtime model where certain client systems operated as primary state managers before backend synchronization occurred.

Surprisingly common in realtime application projects. Disturbingly common, actually.

---

# Technical Challenges

The project involved solving several non-trivial engineering problems, including:

- Realtime synchronization across isolated Overwolf runtime windows
- Managing state consistency between overlays, desktop views, and background services
- Event-driven telemetry ingestion from live game APIs
- Dynamic per-game runtime behavior
- Integrating AI-assisted systems into gameplay analytics workflows
- Handling realtime UI updates during active gameplay sessions
- Designing frontend-heavy persistence synchronization pipelines

The platform architecture required combining traditional web technologies with desktop-runtime coordination patterns uncommon in standard React applications.

---

# Project Status

PoundAK represents an experimental realtime gaming companion architecture exploring:
- Live telemetry systems
- AI-assisted gameplay tooling
- Overwolf runtime orchestration
- Cross-window synchronization
- Realtime overlays
- Player analytics
- Multi-context desktop application design

The repository is maintained as an engineering and architecture reference project representing exploration into realtime gaming-assistant systems and event-driven desktop application infrastructure.

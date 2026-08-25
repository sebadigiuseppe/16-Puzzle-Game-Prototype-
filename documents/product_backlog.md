# Product Backlog
## Proyecto: Sliding Puzzle Diario con Mascotas *(nombre tentativo)*

**Documento vivo** — complementa al Project Charter. Mientras el charter define el *para qué* y los límites del proyecto, este backlog define el *qué exactamente* se construye, en qué orden y con qué criterio de "terminado".

**Framework de estimación:** Story Points, escala Fibonacci (1, 2, 3, 5, 8, 13...)
**Framework de priorización:** MoSCoW (Must / Should / Could / Won't have por ahora)

---

## Definition of Ready (DoR)

Checklist transversal — se aplica a **toda** historia de usuario antes de que el equipo la tome para trabajar en un sprint (evita arrancar algo mal definido y trabarse a mitad de camino):

- [ ] La historia tiene criterios de aceptación claros
- [ ] No depende de otra historia todavía sin resolver
- [ ] El equipo entiende el "para qué" (valor) de la historia
- [ ] Está estimada (story points asignados)

## Definition of Done (DoD)

Checklist transversal — se aplica a **toda** historia de usuario antes de considerarla "hecha", sin importar a qué épica pertenezca:

- [ ] Código revisado por al menos otro colaborador (peer review)
- [ ] Funciona correctamente en desktop y mobile
- [ ] Sin bugs críticos conocidos
- [ ] Desplegado en el ambiente accesible públicamente
- [ ] Cumple todos los criterios de aceptación definidos en la historia

---

## FASE 1 — MVP

### Épica E1 — Motor de juego (sliding puzzle 4x4)

| ID | Historia de usuario | Criterios de aceptación | SP | Prioridad |
|---|---|---|---|---|
| US1.1 | Como jugador, quiero ver un tablero 4x4 con piezas desordenadas al entrar, para poder empezar a jugar | El tablero se genera con un estado siempre resoluble (nunca una combinación imposible); 15 piezas + 1 espacio vacío | 5 | Must |
| US1.2 | Como jugador, quiero mover una pieza adyacente al espacio vacío tocándola, para ir resolviendo el puzzle | Solo piezas adyacentes al hueco son movibles; funciona con clic (desktop) y touch (mobile) | 5 | Must |
| US1.3 | Como jugador, quiero que el juego detecte automáticamente cuando resolví el puzzle, para saber que gané | Se compara el estado actual contra el estado resuelto tras cada movimiento; se dispara un evento de victoria apenas se cumple | 3 | Must |
| US1.4 | Como jugador, quiero ver mi cantidad de movimientos y el tiempo transcurrido mientras juego, para tener referencia de mi desempeño | El contador de movimientos incrementa con cada movimiento válido; el cronómetro arranca en el primer movimiento y se detiene al resolver | 3 | Must |

### Épica E2 — Imagen diaria rotativa

| ID | Historia de usuario | Criterios de aceptación | SP | Prioridad |
|---|---|---|---|---|
| US2.1 | Como jugador, quiero que todos veamos la misma imagen el mismo día, para competir en igualdad de condiciones | La imagen se determina por fecha (zona horaria definida), no por sesión; se mantiene igual durante todo el día | 5 | Must |
| US2.2 | Como equipo de producto, quiero poder programar imágenes de días futuros sin tocar código, para no depender de un despliegue para cambiar contenido | Existe un mecanismo simple (archivo de configuración o panel mínimo) para asignar imagen por fecha, con anticipación | 5 | Should |
| US2.3 | Como jugador, quiero ver la fecha del puzzle actual en la interfaz, para saber si ya jugué el de hoy | La fecha se muestra visible en la pantalla de juego | 2 | Should |

### Épica E3 — Leaderboard diario

| ID | Historia de usuario | Criterios de aceptación | SP | Prioridad |
|---|---|---|---|---|
| US3.1 | Como jugador, quiero ingresar mi nombre al completar el puzzle, para aparecer en el leaderboard del día | Se solicita nombre solo tras resolver; se guarda asociado a tiempo/movimientos y fecha | 3 | Must |
| US3.2 | Como jugador, quiero ver una tabla con los mejores resultados del día, para compararme con otros jugadores | Se muestra tabla pública con nombre, tiempo y movimientos de los mejores puntajes del día | 5 | Must |
| US3.3 | Como jugador, quiero que el leaderboard esté ordenado de mejor a peor resultado, para identificar fácilmente a los líderes | Orden por menor tiempo como criterio principal (o menor cantidad de movimientos, a definir con el equipo) | 3 | Must |
| US3.4 | Como jugador, quiero que el leaderboard se reinicie con cada nueva imagen diaria, para que la competencia sea justa día a día | El leaderboard mostrado corresponde siempre a la fecha activa; resultados de días anteriores quedan archivados, no mezclados | 3 | Must |

### Épica E4 — Infraestructura y despliegue base

| ID | Historia de usuario | Criterios de aceptación | SP | Prioridad |
|---|---|---|---|---|
| US4.1 | Como equipo de desarrollo, quiero tener el proyecto desplegado públicamente, para poder compartirlo con usuarios reales | La app es accesible vía URL pública, funcionando en el hosting elegido (ver Charter, sección 10.3) | 5 | Must |
| US4.2 | Como equipo de desarrollo, quiero persistir los datos del leaderboard en una base de datos, para que los resultados no se pierdan | Los resultados sobreviven a reinicios/redeploys; se consultan correctamente desde el frontend | 5 | Must |
| US4.3 | Como equipo de desarrollo, quiero tener el dominio propio apuntando a la app, para tener una URL profesional y fácil de compartir | El dominio (una vez definido el nombre) resuelve correctamente al proyecto desplegado, con HTTPS activo | 2 | Must |

---

## FASE 2 — Post-validación de MVP

*(Nivel de detalle intencionalmente menor — se refinará con historias completas y criterios de aceptación cuando el MVP esté validado y se confirme avanzar)*

| ID | Épica | Historia de usuario (borrador) | SP | Prioridad |
|---|---|---|---|---|
| US5.1 | E5 — Autenticación | Como jugador, quiero iniciar sesión con Google, para tener un perfil persistente entre partidas | 8 | Should |
| US6.1 | E6 — Leaderboard por país | Como jugador, quiero filtrar el leaderboard por país, para compararme con jugadores de mi región | 5 | Should |
| US7.1 | E7 — Subida de fotos de mascotas | Como jugador, quiero subir una foto de mi mascota, para que participe en el pool de imágenes del juego | 8 | Should |
| US8.1 | E8 — Recompensa por donación (mecánica simplificada) | Como donante, quiero recibir una recompensa garantizada al donar (ej. insignia de perfil o aparición confirmada en fecha futura), para que mi aporte tenga un retorno claro y no dependa del azar | 8 | Should — *pendiente cierre de revisión legal/ética (Charter, R1)* |
| US9.1 | E9 — Monetización | Como equipo de producto, quiero integrar publicidad no intrusiva, para generar ingresos que cubran costos de infraestructura | 5 | Should |
| US10.1 | E10 — Analítica | Como Product Owner, quiero ver métricas básicas de retención diaria, para evaluar si el producto genera hábito | 5 | Could |

---

## Parking Lot — Ideas para evaluar en el futuro (sin comprometer, sin fase asignada)

Ideas que surgieron durante la planificación pero que **no forman parte del alcance comprometido** — se listan para no perderlas, se evaluarán si el proyecto valida tracción real.

| Idea | Nota |
|---|---|
| "Like" a la imagen del día | Mecánica social simple, bajo esfuerzo aparente — a validar si aporta retención real antes de comprometerla a una fase |
| Comentarios cortos en la imagen del día (ej. "qué lindo gatito") | Requiere moderación de contenido (similar riesgo a subida de fotos); evaluar junto con E7 |

---

*Documento vivo — se actualizará sprint a sprint. Parte de la práctica de portafolio profesional en Product Ownership / Business Analysis.*

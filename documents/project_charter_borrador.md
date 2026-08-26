# Project Charter (Borrador)
## Proyecto: Sliding Puzzle Diario con Mascotas *(nombre tentativo)*

| Campo | Detalle |
|---|---|
| Fecha de elaboración | 24 de agosto de 2026 |
| Estado del documento | Borrador en construcción — sesión de mentoría PM/BA/PO/Scrum Master |
| Sponsor / PM / PO / SM | Tú (rol combinado) |
| Propósito del documento | Guiar el proyecto real y, en paralelo, servir como práctica documentada para portafolio profesional en PM, BA, PO y Scrum Master |

---

## 1. Justificación del Proyecto

| Aspecto | Descripción |
|---|---|
| Problema que resuelve | Ofrecer una alternativa breve, satisfactoria y mentalmente sana al scroll de redes sociales |
| Público objetivo | Personas que disfrutan de puzzles y buscan usar minutos libres en algo que les genere satisfacción sin ser nocivo para su mente |
| Origen de la idea | Situación personal real — necesidad de una actividad breve durante un momento de espera, evitando redes sociales |
| Diferenciación propuesta | (1) Leaderboard diario, expandible a multidimensional por país/tiempo/movimientos. (2) Fotos de mascotas de los propios usuarios como imagen del puzzle, generando conexión comunitaria e incentivo de retorno |
| Validación de mercado (búsqueda preliminar) | Se hallaron productos con piezas similares por separado (sliding puzzles diarios con leaderboard global; apps de puzzle con fotos propias como personalización manual), pero ninguno combina puzzle diario único + leaderboard multidimensional por país + pool comunitario de fotos de mascotas. Sugiere oportunidad real de diferenciación, a validar de forma continua |

---

## 2. Objetivos del Proyecto

| # | Objetivo | Descripción | Plazo |
|---|---|---|---|
| 1 | Sostenibilidad financiera | Generar ingresos mensuales (publicidad y/o donaciones, en fases posteriores) que cubran el costo de hosting, servidor y dominio, sostenido durante al menos 1 mes | Dentro de los primeros 3 meses desde el lanzamiento |
| 2 | Validación de producto (MVP) | Lanzar un MVP funcional que permita medir si los usuarios regresan día a día (retención), como base de decisión para invertir en Fase 2 | 5 semanas desde el inicio |
| 3+ | Objetivos de usuarios/engagement | Pendiente — se definirán con línea base post-lanzamiento | A definir |

---

## 3. Alcance del Proyecto

| Dentro del alcance — Fase 1 / MVP | Fuera del alcance — Fase 2+ (a evaluar tras validar MVP) |
|---|---|
| Juego de sliding puzzle 4x4 | Leaderboard segmentado por país |
| Imagen del puzzle cambia diariamente (curada por el equipo) | Autenticación (login con Google u otro proveedor) |
| Leaderboard diario con nombre libre (sin cuenta) | Subida de fotos de mascotas por usuarios + mecánica de selección para el puzzle del día siguiente |
| Registro de tiempo y/o movimientos por partida | Monetización: publicidad y donaciones (mecánica de recompensa garantizada al donar, no basada en probabilidad — ver sección 7, R1) |
| — | Analítica de datos avanzada / dashboards (rol de Data reservado para esta fase) |

---

## 4. Stakeholders (Interesados)

Clasificación según matriz de Poder/Interés (Mendelow), para definir la estrategia de gestión con cada uno.

| Stakeholder | Rol / Interés | Influencia | Categoría de gestión | Expectativas | Estrategia de gestión |
|---|---|---|---|---|---|
| Sponsor / PM / PO / SM (tú) | Impulsar el proyecto, tomar decisiones de producto y gestión | Alta | Gestionar de cerca | Cumplir objetivos de sostenibilidad y validación en plazo | Autogestión; documentar decisiones para trazabilidad |
| Equipo de desarrollo (front/back) | Construir el producto; ganar experiencia de portfolio | Alta | Gestionar de cerca | Tareas claras, aprendizaje real, reconocimiento en portfolio | Comunicación frecuente, backlog claro, crédito visible en publicaciones |
| UX/UI | Diseñar la experiencia de usuario; portfolio | Media | Mantener satisfecho | Ver su diseño implementado fielmente | Involucrar temprano en Sprint 0-1, feedback loops cortos |
| QA | Asegurar calidad; portfolio | Media | Mantener satisfecho | Acceso a build testeable, reportes de bugs escuchados | Definir criterios de aceptación claros antes de testing |
| Candidato de Data (no incorporado en Fase 1) | Interés en sumar valor en el futuro | Baja (por ahora) | Monitorear | Expectativa clara de cuándo/si se incorpora | Comunicación explícita: rol reservado para Fase 2 |
| Jugadores / usuarios finales | Consumir el producto; entretenimiento saludable | Alta (para el éxito del producto) | Mantener informado / satisfecho | Juego simple, divertido, sin fricción | Canal de feedback simple; iteración basada en uso real |
| Dueños de mascotas (subconjunto de usuarios, Fase 2) | Ver a su mascota destacada; conexión emocional | Media (crece en Fase 2) | Monitorear (por ahora) | Proceso justo y transparente de selección de imágenes | Diseñar mecánica transparente antes de activar Fase 2 |
| Reclutadores / lectores de portfolio (LinkedIn) | Evaluar habilidades de PM/BA/PO/SM del autor | Media | Mantener informado | Ver un proceso de gestión de proyecto real, prolijo y trazable | Publicación en LinkedIn + documentación clara (este charter) |
| Anunciantes potenciales | Fuente de ingresos vía publicidad | Baja (aún no aplica) | Monitorear | N/A todavía | Evaluar en Fase 2, junto con el objetivo financiero |

---

## 5. Equipo del Proyecto (preliminar)

| Rol | Estado |
|---|---|
| Project Manager / Product Owner / Scrum Master | Cubierto (tú) |
| Desarrollo (front/back) | Candidatos identificados — confirmar si cubre backend/infra necesario para leaderboard e imagen diaria |
| UX/UI | Candidato identificado |
| QA | Candidato identificado |
| Data / Analytics | No sumar en Fase 1 — sin tareas claras dentro del alcance actual; reevaluar en Fase 2 |

---

## 6. Cronograma Preliminar

| Sprint | Duración | Foco |
|---|---|---|
| Sprint 0 | Días 1–3 | Setup técnico, definición de stack, confirmación de colaboradores, backlog inicial |
| Sprint 1 | ~2 semanas | Mecánica core del puzzle (lógica sliding 4x4, UI jugable) |
| Sprint 2 | ~2 semanas | Leaderboard diario + imagen cambiante diaria + deploy |
| Buffer | ~3–5 días | Testing, ajustes, preparación para compartir públicamente |
| **Meta de lanzamiento** | **5 semanas desde el inicio** | Fecha exacta a confirmar en Sprint 0 |

---

## 7. Matriz de Riesgos

| ID | Riesgo | Categoría | Probabilidad | Impacto | Prioridad | Estrategia | Acción concreta | Responsable |
|---|---|---|---|---|---|---|---|---|
| R1 | Mecánica de donación podría interpretarse como juego de azar pagado | Legal/Ético | Baja *(mitigada por diseño: se optó por recompensa garantizada, no basada en probabilidad — ver Backlog, US8.1)* | Medio | **Media** | Mitigar | Confirmar con revisión legal/ética antes de activar en Fase 2, aunque el rediseño ya reduce significativamente el riesgo | PO (tú) |
| R2 | Leaderboard sin autenticación permite falsificar puntajes | Técnico | Alta | Medio | **Alta** | Aceptar (en MVP) / Mitigar (Fase 2) | Documentar como limitación conocida del MVP; planear validación server-side en Fase 2 | Dev Backend |
| R3 | Backend/infra no cubierto explícitamente por roles confirmados | Equipo/Técnico | Media | Alto | **Alta** | Mitigar | Confirmar con el equipo actual antes de cerrar Sprint 0; si no está cubierto, reclutar específicamente ese rol | PM (tú) |
| R4 | Disponibilidad variable del equipo voluntario | Equipo | Alta | Medio | **Alta** | Mitigar | Agregar colchón en cronograma; check-ins cortos y frecuentes en vez de asumir dedicación full-time | Scrum Master (tú) |
| R5 | Abandono de algún colaborador a mitad de proyecto | Equipo | Media | Alto | **Alta** | Mitigar | Documentar avances desde el día 1; evitar dependencia de una sola persona en tareas críticas (bus factor) | Scrum Master (tú) |
| R6 | Plazo de 5 semanas es ambicioso para un equipo recién formado | Cronograma | Media | Medio | **Media** | Mitigar | Validar el cronograma real recién en Sprint 0, junto con el equipo, no solo con estimación individual | PM (tú) |
| R7 | Costos de infraestructura superan lo estimado | Financiero | Baja | Medio | **Baja-Media** | Mitigar | Definir techo de gasto de alerta (ver sección 10); monitorear uso de tiers gratuitos | PM (tú) |
| R8 | Rol de Data queda sin tareas claras y genera desmotivación si se suma anticipadamente | Equipo/Alcance | Baja (ya mitigado) | Bajo | **Baja** | Evitar | Resuelto: no sumar en Fase 1, comunicarlo explícitamente al candidato | PO (tú) |

**Nota de lectura:** la columna "Prioridad" resulta del cruce cualitativo Probabilidad × Impacto. 4 de los 5 riesgos de prioridad Alta corresponden a gestión de equipo, no a complejidad técnica — señal de que el mayor desafío de este proyecto es la coordinación de un equipo voluntario y distribuido, más que la arquitectura del producto.

---

## 8. Supuestos

| # | Supuesto |
|---|---|
| 1 | Los colaboradores voluntarios mantendrán motivación suficiente por el valor de portfolio durante todo el desarrollo del MVP |
| 2 | No hay presupuesto asignado para salarios del equipo de desarrollo en esta fase |
| 3 | El alcance del MVP no crecerá antes de completar y validar la Fase 1 |

---

## 9. Restricciones

| # | Restricción |
|---|---|
| 1 | Sin presupuesto para pago de personal (equipo voluntario, compensado vía contribución en especie — ver sección 10) |
| 2 | Plazo objetivo ambicioso: 5 semanas |
| 3 | Reparto de ganancias definido como equitativo simple entre colaboradores, sin negociación diferenciada por ahora (ver sección 10) |

---

## 10. Presupuesto Estimado

### 10.1 Presupuesto Fase 1 (MVP)

| Categoría | Costo estimado mensual | Nota |
|---|---|---|
| Hosting/Compute | $0 | Tier gratuito. Se descarta Vercel Hobby por prohibir uso comercial; se evalúa Cloudflare Pages o Netlify |
| Base de datos | $0 | Tiers gratuitos (ej. Supabase/Neon) cubren holgadamente el volumen de un leaderboard simple |
| Dominio | ~$1/mes (~$10-15/año, pago único anual) | Único costo real y recurrente del proyecto en Fase 1 |
| Herramientas de gestión (repo, chat, tablero) | $0 | GitHub, Discord/Slack, Notion/Trello — tiers gratuitos |
| Seguridad (SSL) | $0 | Incluido por defecto en los proveedores de hosting evaluados |
| Trabajo del equipo | $0 en caja (contribución en especie) | Ver acuerdo de colaboración abajo |
| **Total recurrente estimado** | **~$1/mes** | Base extremadamente baja — el Objetivo 1 (cubrir costos en 3 meses) es un umbral fácilmente alcanzable |

### 10.2 Contingencia

**20% de contingencia** aplicado sobre el estimado anual (dominio + margen ante un eventual upgrade de tier pago), definido en base a un perfil de riesgo bajo, dado que el mayor riesgo del proyecto (ver sección 7) es de equipo, no financiero.

Adicionalmente, se define un **techo de gasto de alerta de $20-25/mes**: si algún proveedor gratuito se acerca a ese nivel de facturación por uso, se revisa la arquitectura antes de aceptar el cargo (evita "factura sorpresa" ante picos de tráfico).

### 10.3 Decisión preliminar de hosting

**Cloudflare Pages**, como primera preferencia (ancho de banda ilimitado en tier gratuito, reduce riesgo de facturación inesperada). **Decisión no cerrada** — queda abierta a la recomendación técnica final del rol de Backend en Sprint 0.

### 10.4 Acuerdo de colaboración — reparto de ganancias

Se define un **reparto equitativo simple entre todos los colaboradores activos**, priorizando avanzar rápido sobre optimizar la distribución. Se documenta explícitamente que esta no es necesariamente la opción más justa en términos de aporte/hora, sino una decisión pragmática para reducir carga de negociación en esta etapa temprana. Proyectos futuros con mayor potencial de ingreso ameritarán un análisis de reparto más profundo.

---

## 11. Épicas de Alto Nivel

Vista resumida de los grandes bloques de trabajo, mapeados a fase. El detalle de historias de usuario y criterios de aceptación vivirá en un **Product Backlog separado** (documento vivo, distinto de este charter).

| ID | Épica | Fase | Descripción breve |
|---|---|---|---|
| E1 | Motor de juego (sliding puzzle 4x4) | Fase 1 | Lógica de movimiento, validación de solución, detección de victoria |
| E2 | Imagen diaria rotativa | Fase 1 | Sistema que cambia la imagen del puzzle cada día (curada por el equipo) |
| E3 | Leaderboard diario | Fase 1 | Registro y visualización de tiempo/movimientos por jugador, sin cuenta |
| E4 | Infraestructura y despliegue base | Fase 1 | Hosting, dominio, CI/CD mínimo, persistencia de datos del leaderboard |
| E5 | Autenticación de usuarios | Fase 2 | Login (ej. Google) para identidad persistente de jugadores |
| E6 | Leaderboard por país | Fase 2 | Segmentación geográfica de resultados |
| E7 | Subida de fotos de mascotas | Fase 2 | Formulario de carga, moderación de contenido, almacenamiento |
| E8 | Recompensa por donación | Fase 2 | Mecánica de donación con recompensa garantizada (no basada en probabilidad) para selección de mascota del día (vinculada a R1 — revisión legal pendiente) |
| E9 | Monetización | Fase 2 | Integración de publicidad y/o donaciones |
| E10 | Analítica y reportes | Fase 2 | Dashboards de comportamiento de usuario (rol Data) |

---

## 12. Pendientes para próximas sesiones

| # | Pendiente | Estado |
|---|---|---|
| 1 | Estimación de presupuesto | ✅ Completado (sección 10) |
| 2 | Matriz formal de riesgos (probabilidad × impacto) | ✅ Completado (sección 7) |
| 3 | Stakeholders formales y plan de comunicación | ✅ Completado (sección 4) |
| 4 | Épicas de alto nivel | ✅ Completado (sección 11) |
| 5 | Product Backlog con historias de usuario y criterios de aceptación | ✅ Completado (`product_backlog.md`) |
| 6 | Criterios de aceptación por historia de usuario / Definition of Done | ✅ Completado (`product_backlog.md` — incluye DoR y DoD) |
| 7 | Definición de nombre del proyecto y dominio | Pendiente |
| 8 | Revisión legal/ética de mecánica de donación (Fase 2) | Pendiente |
| 9 | Confirmación técnica final de plataforma de hosting (con Backend) | Pendiente |

---

*Documento en construcción como parte de una práctica de Project Management / Business Analysis / Product Ownership / Scrum Mastery, con fines de portafolio profesional.*

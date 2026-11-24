<p align="center">
  <img src="img/Neon_Racers_Logo_Transparent.png" alt="Logotipo de Neon Racers" width="400">
</p>

# Neon Racers

**Juegos en Red · Grado en Diseño y Desarrollo de Videojuegos · URJC · Curso 2026/27**<br>
**Grupo J**

## Descripción de la temática

Neon Racers es un juego en 2D con vista cenital inspirado en el Tron clásico. Dos jugadores controlan sendas motos que dejan una estela a su paso. El objetivo es sobrevivir al rival evitando las estelas y los límites del escenario, y aprovechando los objetos especiales (power-ups).

## Jugar a Neon Racers

Puedes jugar directamente desde el navegador sin necesidad
de descargar el repositorio.

[Jugar a Neon Racers](https://mrtn0624.github.io/Neon-Racers/Game/idx.html)

**Nota:** La versión correspondiente a la fase 2 permite
jugar en modo multijugador local.

## Equipo de desarrollo

| Nombre y apellidos | Correo URJC | GitHub |
| :--- | :--- | :--- |
| Javier Arcas Calvo | j.arcas.2024@alumnos.urjc.es | `https://github.com/nemsOmega` |
| Martín Carmona Espartero | m.carmona.2024@alumnos.urjc.es | `https://github.com/MRTN0624` |
| Adriel Nava De Santos | a.nava.2024@alumnos.urjc.es | `https://github.com/Multiestar` |
| Felipe Owen Zhu Zhang | fo.zhu.2023@alumnos.urjc.es | `https://github.com/FelipeOwenZZ` |

**Repositorio:** `https://github.com/MRTN0624/Neon-Racers`

**Licencia:** [Apache 2.0](LICENSE)

---

## Game Design Document

📄 El documento de diseño completo está en **[GDD.md](GDD.md)**.

Apartados principales:

- [Especificaciones básicas](GDD.md#2-especificaciones-básicas)
- [Jugabilidad](GDD.md#3-jugabilidad)
- [Narrativa](GDD.md#4-narrativa)
- [Imagen y diseño visual](GDD.md#5-imagen-y-diseño-visual)
- [Sonido](GDD.md#6-sonido)
- [Interfaz y diagrama de flujo](GDD.md#7-interfaz-y-diagrama-de-flujo)
- [Comunicación y marketing](GDD.md#8-comunicación-y-marketing)
- [Referencias](GDD.md#9-referencias)

---

## Funcionalidades implementadas en la fase 2

- Multijugador local para dos jugadores con un teclado compartido.
- Menú principal, pantalla de carga, ajustes, ayuda, créditos, pausa y fin de partida.
- Tres escenarios seleccionados aleatoriamente al iniciar cada partida.
- Cinco tipos de power-ups: velocidad, inmortalidad, eliminación de trazas, congelación y traza aumentada.
- Sistema de colisiones y marcador de victorias.
- Cinco pistas musicales, con música diferenciada para el menú, cada escenario y el fin de partida.
- Ajuste del volumen general y opción de silenciar el audio.
- Interacción con los menús mediante teclado y ratón.

La opción «JUGAR EN LÍNEA» todavía no dispone de comunicación en red y actualmente inicia una partida local. La API REST se implementará en la fase 3 y la comunicación en tiempo real mediante WebSockets, en la fase 4.

## Ejecución del juego en un servidor local

El juego está desarrollado con Phaser 3 y se ejecuta en un navegador web de escritorio.

1. Clonar o descargar el repositorio.
2. Abrir la carpeta que contiene el archivo HTML del juego mediante un servidor web local, por ejemplo, Live Server de Visual Studio Code.
3. Acceder al juego desde el navegador y seleccionar «JUGAR LOCAL» en el menú principal.

## Controles

| Acción | Jugador 1 | Jugador 2 |
| :--- | :--- | :--- |
| Izquierda | A | ← |
| Derecha | D | → |
| Arriba | W | ↑ |
| Abajo | S | ↓ |
| Pausar / reanudar | Q | P |

Los objetos especiales se activan automáticamente al recogerlos.

---

## Fases del proyecto

| Fase | Contenido | Estado |
| :--- | :--- | :--- |
| Fase 1 | Equipo, temática y GDD | ✅ Entregada ([tag fase-1](https://github.com/MRTN0624/Neon-Racers/tree/fase-1)) |
| Fase 2 | Juego en local | ✅ Entregada ([tag fase-2](https://github.com/MRTN0624/Neon-Racers/tree/fase-2)) |
| Fase 3 | API REST | ⏳ Pendiente |
| Fase 4 | WebSockets | ⏳ Pendiente |

# Mesa 21 · Blackjack

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo

Abre `index.html` en un navegador de ordenador. La interfaz está diseñada para un ancho mínimo de 1024 px. Elige fichas por valor de 1, 5, 10, 50, 100 o 500 y pulsa «Repartir».

## Reglas de esta mesa

- Se juega con seis barajas y un saldo inicial de 500 fichas. La apuesta mínima es 1.
- El blackjack natural paga 3:2. El crupier se planta en 17 suave.
- Si el crupier muestra un as, se puede contratar seguro por la mitad de la apuesta; paga 2:1 si tiene blackjack.
- Se puede dividir cartas del mismo valor hasta tener cuatro manos. Cada mano se juega y liquida por separado.
- Se permite doblar después de dividir. Los ases divididos reciben una carta y se plantan.
- La rendición está disponible en la mano inicial antes de pedir o plantarse; devuelve la mitad de la apuesta.

## Uso de IA

Usé GitHub Copilot en VS Code para planificar, implementar y revisar el HTML, CSS y JavaScript por fases. Definí la idea del blackjack, las reglas de la mesa y el requisito de que funcionara solo en ordenador; Copilot me ayudó con la implementación del código.

Prompts reales (extractos):

- «Antes de escribir código: propón 4 o 5 fases pequeñas para construirlo, cada una con algo visible funcionando al terminarla, y dime qué estado necesito guardar en JavaScript y por qué. No escribas todavía ningún archivo.»
- «Quiero que el código sea sencillo [...] y además con algunos comentarios puestos, después haz una comprobación.»

Comprobé las fases en el navegador con manos controladas: puntuación de ases, blackjack natural, seguro ganado y perdido, división, doblar, rendición, saldos, cambio de ronda y barajado. También revisé que no hubiera `onclick`, `innerHTML` ni frameworks.

## Autopsia

1. Guardo las cartas, apuesta y estado de cada mano en objetos dentro de `playerHands`, y el índice de la mano activa por separado. Así puedo dividir hasta cuatro manos y liquidar cada apuesta individualmente. La alternativa era usar una sola mano y leer cartas desde el DOM; eso no representa bien una partida dividida y acopla las reglas a la interfaz.
2. Renuevo el mazo entre rondas cuando quedan menos de 52 cartas, en lugar de mezclarlo al quedar solo unas pocas cartas durante una jugada. Al probar el mazo agotado, el barajado durante el reparto podía mezclar cartas nuevas en mitad de la mano. La alternativa de esperar al agotamiento completo se conserva como reserva para no bloquear una ronda excepcionalmente larga.


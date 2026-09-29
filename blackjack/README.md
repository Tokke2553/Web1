# Mesa 21 · Blackjack

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo

Abre `index.html` en un navegador de ordenador. Elige fichas por valor de 1, 5, 10, 50, 100 o 500 y pulsa repartir
Al crupier se le muestra solo la primera carta hasta que el jugador termine su turno, el jugador recibe 2 cartas y puede decidir plantar, pedir, doblar,rendir o dividir si tiene dos cartas del mismo numero.
El juego consiste en acercarse más al 21 y si se pasa pierde directamente la mano.

## Reglas de esta mesa

- Se juega con seis barajas y un saldo inicial de 500 fichas y con una apuesta mínima de 1 ficha.
- El blackjack natural paga 3:2 y el crupier se planta en 17.
- Si el crupier muestra un as se puede pagar un seguro por la mitad de la apuesta; paga 2:1 si el crupier tiene blackjack natural.
- Se puede dividir cartas del mismo valor hasta tener cuatro manos. Cada mano se juega por separado.
- Se permite doblar después de dividir y los ases divididos reciben una carta y se plantan sin opción de pedir más carta para dicha mano.
- La rendición está disponible en la mano inicial antes de pedir o plantarse y devuelve la mitad de la apuesta.

## Uso de IA

Usé GitHub con Chatgpt en VS Code para planificar, implementar y revisar el HTML, CSS y JavaScript por fases. Definí la idea del blackjack, las reglas de la mesa; Chatgpt me ayudó con la implementación del código, hice comprobaciónes tanto en el codigo como prueba después de cada fase.


Prompts :

- Voy a construir una pagina web para blackjack, en el cuál puede jugar varios manos el mismo jugador, pudes pedir, doblar, dividir, plantar, con todo las reglas del blackjack normal, y además con el boton N pone en modo oscuro en el cuál la pagina del blackjack se juega en oscuro con HTML, CSS y JavaScript puro, sin frameworks ni librerías. Antes de escribir código: propón 4 o 5 fases pequeñas para construirlo, cada una con algo visible funcionando al terminarla, y dime qué estado necesito guardar en JavaScript y por qué. No escribas todavía ningún archivo.
- Regla: Moneda de 1,5,10,50,100,500. Pago minimo 1. Blackjack pagará 3:2 sobre la apuesta. el crupier se planta en 17 suave. Seguro cuando el crupier tiene un As de primera. Hay rendición si el jugador no ha pedido pedido carta o plantado la mano. Se permite doblar cuando el jugador no ha pedido pedido carta o plantado la mano. Regla habitual
- Comprueba las fases en el navegador con manos controladas: puntuación de ases, blackjack natural, seguro ganado y perdido, división, doblar, rendición, saldos, cambio de ronda y barajado. También revisé que no hubiera `onclick`, `innerHTML` ni frameworks.

## Autopsia
- Guardé el estado de la partida en un objeto de JavaScript y uso `render()` para actualizar la pantalla, aunque podría haber cambiado cada elemento del DOM por separado, pero con varias manos me pareció más fácil tener los datos en un solo sitio, lo malo es que se vuelva a dibujar la interfaz cada vez que cambia algo.
- Para dividir una mano, comparo el valor de las cartas y no su rango por lo que por ejemplo, un 10 y una J si se puede dividir ya que valen lo mismo, al igual que un con Q o K que tiene un valor de 10.


# Mi Cartera iPhone 3.5.2

## Cambios

- Paleta azul oscuro con textos claros. Verde para el saldo y las entradas, rojo para las salidas y ámbar para los atrasos.
- Cobros: cada crédito muestra nombre, frecuencia, cuotas pagadas/pendientes, próxima cuota y estado. Dos botones: «Cobrar R$…» y «Expandir información». El saldo, progreso, fechas adicionales e historial siguen disponibles al expandir. En «Abonado hoy», los pagos y su eliminación también quedan dentro del panel. Un crédito liquidado muestra ese estado en lugar de ofrecer otro cobro.
- Caja: saldo esperado destacado y explicación «saldo al inicio + entradas − salidas». El detalle distingue cobros, dinero agregado, otros ingresos, préstamos entregados, gastos y ajustes.
- Deudas pendientes y Clavos se presentan aparte del dinero disponible. Las cuotas atrasadas ya están incluidas en la deuda de Cartera y no se suman otra vez.
- Movimientos e historial de cierres plegados. El cierre muestra el saldo esperado que se va a guardar; los cierres guardados destacan su saldo final.
- Se conservan los importes, operaciones, rutas, PIN, documentos y claves de almacenamiento existentes. La pantalla explica los registros; no cuenta el efectivo físico.

## Actualizar la publicación existente

1. Exporta un respaldo de todas las rutas desde la aplicación actual.
2. Extrae este ZIP y reemplaza los archivos de tu publicación actual, conservando la misma dirección. Incluye los archivos nuevos `clarity.js` y `dark.css`, y el `sw.js` actualizado. No subas únicamente el ZIP como página.
3. Cuando se publique, abre la misma dirección en Safari con conexión y recarga. En Ajustes debe aparecer 3.5.2. Cierra y vuelve a abrir la app si aún ves el diseño anterior.
4. No borres los datos de Safari ni restablezcas la cartera para actualizar. Un dominio diferente puede abrir un almacenamiento vacío.

## Verificación

- 18 comprobaciones de regresión con Chromium/Playwright: créditos, abonos, renovación, Caja, cierre, rutas, respaldos, PIN y uso sin conexión.
- Comprobaciones específicas de saldo en centavos, préstamos separados de gastos, cierre coherente, tarjetas plegadas, botones de cobrar y expandir, saldo negativo y diferencia con un cierre previo.
- Revisión a 320, 390, 768 y 1366 píxeles, sin desbordamiento horizontal en las pantallas probadas.
- Actualización real del service worker desde 3.5.1 en el mismo origen, preservando datos y verificando la reapertura sin conexión y el tema oscuro.
- No se ha probado físicamente en un iPhone ni publicado automáticamente en tu repositorio. El ZIP está preparado para reemplazar los archivos existentes.

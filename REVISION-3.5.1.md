# Revisión Mi Cartera 3.5.1

Base: 3.4.9 corregida con liquidación al renovar.

## Validación realizada

18 comprobaciones de flujos automatizadas en Chromium con datos ficticios, además de revisión estática y sintaxis de todos los JavaScript.

- Arranque vacío y navegación de las siete pantallas sin errores JavaScript.
- Crear crédito diario: capital 1000, interés 20%, 20 cuotas; Caja baja de 5000 a 4000.
- Abono parcial y selector de varias cuotas; el crédito pasa a Abonado hoy y conserva saldo. Sin filtros de fecha.
- Renovar: liquida 1150, crea capital 1500; Caja queda en 3700 y los desembolsos no cuentan como gastos.
- Recarga conserva rutas, créditos, abonos y Caja. Diagnóstico financiero sin errores.
- Anular abono revierte Caja y reabre el saldo correspondiente.
- Sin desbordamiento horizontal a 360, 390, 768 y 1366 px en Inicio, Cobros, Caja y Ajustes.
- Modales: Escape y Cerrar funcionan, con foco accesible.
- Fechas diarias respetan primera cuota explícita; suma exacta de centavos para 1, 3, 20 y 500 cuotas.
- Cierre de Caja bloquea nuevos créditos.
- Documentos: guardar un adjunto en IndexedDB.
- Exportar y restaurar respaldo completo conserva Caja, créditos y cierres.
- Fallo simulado de almacenamiento revierte los cambios sin confirmar el guardado.
- Crear PIN, bloquear y desbloquear con clave correcta.
- Reapertura sin conexión desde caché conserva scripts, estilos y datos.
- Rutas corruptas: escritura bloqueada, contenido conservado y pantallas sin fallos.
- Dos pestañas: la desactualizada no sobrescribe cambios de la otra.
- Configuración de PIN corrupta mantiene la pantalla bloqueada.

## Cambios de rendimiento

Los renderizados crean índices temporales de clientes, créditos y abonos. Se descartan al terminar para evitar saldos obsoletos tras editar, importar o cambiar de ruta. Cobros agrupa los pagos del día en una sola pasada. Los adjuntos de un lote se guardan en una transacción de IndexedDB. No se incluyen dependencias de pruebas en la aplicación.

## Límites

No se validó en un iPhone físico ni en Windows físico. El lanzador PowerShell se revisó, pero no se ejecutó en este entorno. No se realizó autorización ni subida real a Google Drive. Se conserva la operación local y el formato de respaldos; el PIN no cifra los datos. No se garantiza ausencia absoluta de errores.

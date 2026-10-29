# Configuración opcional de Google Drive

 Activar Google una sola vez, para todos los iPhone

Google exige registrar la aplicación que solicita permiso para escribir en Drive. Por seguridad no existe un modo de saltarse este registro. La conexión tampoco puede autorizarse automáticamente sin tu intervención.

1. En Windows, inicia sesión en https://console.cloud.google.com/ y crea o selecciona un proyecto.
2. En la biblioteca de API, activa **Google Drive API**.
3. Abre **Google Auth Platform** y configura la marca/pantalla de consentimiento OAuth (para Gmail personal selecciona usuario externo). Si está en modo pruebas, incluye las cuentas Google que utilizarán la aplicación como usuarios de prueba.
4. En **Google Auth Platform → Clients**, crea un **ID de cliente OAuth 2.0** de tipo **Aplicación web**.
5. En **Authorized JavaScript origins / Orígenes JavaScript autorizados**, introduce exactamente `https://jpruta725-ship-it.github.io` (sin `/cartera` y sin barra al final). Guarda.
6. Copia el **ID de cliente** que termina en `.apps.googleusercontent.com`. No copies ningún secreto.
7. Desde GitHub, abre `google-client.js`, haz clic en Editar y cambia la línea:

   `window.MI_CARTERA_GOOGLE_CLIENT_ID = '';`

   por una línea con el identificador público entre comillas. Guarda con **Commit changes**.
8. Cada iPhone abre Mi Cartera → **Copias y ajustes** → **Conectar mi Google Drive**; selecciona su cuenta y acepta el permiso. Después pulsa **Guardar respaldo en Google Drive**. Verifica que el archivo aparezca en la carpeta **Mi Cartera - Respaldos** en esa cuenta.

**Importante:** el ID de cliente OAuth no es una contraseña ni una clave privada; es un identificador público de la aplicación. Nunca subas un secreto OAuth, contraseña, token o archivo de respaldo al repositorio público de GitHub.

## Límites reales

- Cuando hay autorización activa, pulsar **Guardar respaldo en Google Drive** prepara el respaldo completo y lo sube sin elegir archivos ni carpetas. La app solo confirma cuando Drive responde correctamente.
- La autorización del navegador puede caducar y requerir volver a pulsar **Conectar mi Google Drive**.
- Safari/PWA no garantiza copias en segundo plano con la aplicación cerrada ni subidas sin conexión.
- Sin la configuración inicial de Google, utiliza **Descargar respaldo en el teléfono** y súbelo manualmente a Google Drive.
- El respaldo JSON puede incluir rutas, créditos, cobros, ubicaciones y documentos sensibles y no está cifrado por esta función. Resguarda la cuenta Google y considera cifrar los respaldos antes de compartirlos.
- La actualización conserva las claves de almacenamiento de las versiones anteriores. Haz siempre un respaldo externo antes de reemplazar archivos.

## Pruebas

Se verificó la sintaxis JavaScript y la interfaz/flujo con pruebas de lógica simuladas, incluyendo el caso sin ID y con ID público configurado. **No se realizó una subida real a Google Drive ni se probó en Safari físico**: la verificación final requiere tu autorización Google y una cuenta real.


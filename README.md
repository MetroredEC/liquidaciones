# Metrored – Cartera – Módulo de Liquidaciones

Este proyecto implementa un módulo de conciliación 100 % frontend para la gestión de liquidaciones de cuentas de Metrored. La aplicación se compone de varias páginas para cargar archivos fuente, conciliar registros según reglas de negocio, generar archivos para BC y mantener bitácoras y reportes. Al no disponer de backend, toda la información se almacena en el navegador (localStorage/IndexedDB) y el despliegue se realiza en GitHub Pages.

## Estructura del proyecto

```
metrored-cartera-liquidaciones/
├── index.html               # Shell de la aplicación (punto de entrada Vite)
├── package.json             # Dependencias y scripts
├── postcss.config.js        # Configuración PostCSS
├── tailwind.config.js       # Configuración Tailwind (colores Metrored)
├── vite.config.js           # Configuración Vite (base para GitHub Pages)
├── public/
│   ├── logo.png             # Logotipo (placeholder; sustituir por logo oficial)
│   ├── 512x512bb.jpg        # Ícono para dispositivos
│   └── manifest.json        # Manifest PWA
└── src/
    ├── main.jsx            # Punto de arranque de React
    ├── index.css           # Estilos globales (Tailwind)
    ├── app/                # Shell y rutas principales
    │   └── App.jsx
    ├── auth/               # Autenticación y control de acceso
    │   ├── AuthProvider.jsx
    │   ├── LoginPage.jsx
    │   ├── RequireAuth.jsx
    │   ├── RoleGuard.jsx
    │   └── authService.js
    ├── components/         # Componentes reutilizables (Navbar, Sidebar, Table…)
    ├── data/               # Semillas de usuarios, catálogos y plantillas BC
    ├── features/           # Funcionalidad agrupada por módulo
    │   ├── Dashboard.jsx
    │   ├── ingestion/      # Carga y normalización de archivos
    │   │   ├── UploadPage.jsx
    │   │   └── pdfUtils.js
    │   ├── reconcile/      # Motor de conciliación
    │   │   └── ReconcilePage.jsx
    │   ├── exports/        # Generación de archivos BC y log
    │   │   └── ExportPage.jsx
    │   ├── reports/        # Reportes históricos
    │   │   └── ReportsPage.jsx
    │   ├── audit/          # Bitácora de auditoría
    │   │   └── AuditPage.jsx
    │   └── admin/          # Administración de usuarios, catálogos, plantillas
    │       └── AdminPage.jsx
    └── utils/              # Utilidades (fechas, crypto, idb, esquemas)
```

## Dependencias principales

- **React / Vite**: Motor de UI y bundler ultrarrápido para proyectos SPA.
- **Tailwind CSS**: Framework de utilidades con configuración extendida para colores corporativos (cyan `#00B7D3`, azul `#135EA7`, gris `#6B7280`, gris claro `#E5E7EB` y blanco `#FFFFFF`).
- **React Router**: Navegación entre páginas sin recargar.
- **pdfjs-dist**: Lectura de PDFs directamente en el navegador.
- **xlsx (SheetJS)** y **papaparse**: Parseo de archivos Excel/CSV.
- **jszip** y **file-saver**: Generación de archivos ZIP y descargas.
- **tesseract.js**: Motor OCR en el navegador (preparado para futuros PDFs que no puedan parsearse con pdf.js).
- **CryptoJS**: Generación de hashes PBKDF2/SHA‑256 y SHA‑256 para firmas.
- **dayjs** y **zod**: Manejo de fechas y validación de esquemas.
- **idb-keyval**: Almacenamiento en IndexedDB simplificado.

## Primeros pasos

1. **Instalación de dependencias**

   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

   El servidor de Vite arrancará en `http://localhost:5173`. La aplicación está preparada para funcionar exclusivamente en el frontend; no sube ni persiste datos en servidores remotos.

3. **Construir para producción y desplegar en GitHub Pages**

   La configuración establece `base: './'` en `vite.config.js` para soportar rutas relativas. Para generar los archivos estáticos:

   ```bash
   npm run build
   ```

   El contenido se compilará en la carpeta `dist/`. Para publicar en GitHub Pages puede utilizarse [`gh-pages`](https://www.npmjs.com/package/gh-pages) con:

   ```bash
   npm run deploy
   ```

   Asegúrese de configurar correctamente la rama `gh-pages` y el parámetro `homepage` en `package.json` si el repositorio no está en la raíz.

## Autenticación y roles

Los usuarios se almacenan en `localStorage` con contraseñas salteadas y hasheadas mediante PBKDF2/SHA‑256. En `src/data/users.json` se incluyen tres usuarios demo:

| Usuario     | Rol          | Contraseña   |
|-------------|--------------|--------------|
| `admin`     | Administrador| `password123`|
| `analista`  | Analista     | `password123`|
| `asistente` | Asistente    | `password123`|

Al iniciar sesión se crea una sesión en `localStorage` y se registra la hora de última actividad. Si el usuario permanece inactivo más de 30 minutos se cierra la sesión automáticamente. El control de acceso se aplica mediante:

- **RequireAuth**: redirige al login si no hay sesión activa.
- **RoleGuard**: muestra u oculta rutas según el rol del usuario (por ejemplo, la ruta de administración sólo la ven los administradores).

## Flujo funcional

1. **Ingreso**: El usuario accede a la ruta `/login`, ingresa sus credenciales y, tras autenticarse, es redirigido al *dashboard*.

2. **Carga de archivos** (`/ingestion`):
   - Se pueden arrastrar o seleccionar múltiples archivos Excel/CSV/PDF.
   - Los Excel/CSV se procesan con SheetJS o PapaParse. Se extraen los encabezados y se normalizan los campos.
   - Los PDFs de tipo “Comprobante de Pago – Nota de Crédito” se leen con `pdfjs-dist` y, si no es posible extraer texto, se dejaría preparada la integración con OCR (Tesseract.js). La función `extractComprobanteData` implementa heurísticas simples para detectar líneas de datos (fecha, doc recap, concepto y montos). Se ignoran las filas de “Ajuste por aproximaciones”.
   - Los registros procesados se guardan temporalmente en `localStorage` bajo la clave `metrored_ingestion` y se muestra una vista previa (primeros 50 registros).

3. **Conciliación** (`/reconciliation`):
   - Se cargan los registros de `metrored_ingestion`.
   - Se aplican reglas de conciliación simplificadas: por ejemplo, para cada registro se calcula si `Neto a Pagar ≈ Valor Bruto − Comisión − IVA Retenido − IRF Retenido` (tolerancia de ±0,02). Si cuadra, se marca como OK; si falta algún campo, se marca como advertencia; si la diferencia es mayor, se marca como error. En un sistema real aquí se implementarían las reglas detalladas para aseguradoras, SSO, efectivo, tarjetas, autoconsumos y descuentos a rol (cortes, tolerancias, cruce por RUC/cliente/monto/fecha, escalamientos…).
   - Los resultados se separan en pestañas **OK**, **Advertencias** y **Errores** con sus respectivos conteos. Estos datos se almacenan en `localStorage` (`metrored_reconciliation`) y se genera un resumen (`metrored_summary`) para el dashboard (% conciliado, monto conciliado, pendientes > 48h, top causa).

4. **Exportación** (`/exports`):
   - Se listan las plantillas BC definidas en `src/data/templatesBC.json` (ej. “Tarjetas” y “Efectivo”).
   - Al seleccionar una plantilla se generan:
     - **Archivo BC** (`ArchivoBC.xlsx`): Cada registro OK se mapea a las columnas requeridas por la plantilla. Se insertan valores por defecto (Journal Template, Batch, Currency, Reason Code) y se copian datos del registro (Nº Documento, Fecha de publicación, Monto, Descripción…).
     - **Log de errores y advertencias** (`Log.xlsx`): Se listan las observaciones, con campos de severidad, sugerencias y SLA (este esquema puede adaptarse según el instructivo). Para los errores, la sugerencia por defecto es “Corregir” con severidad *Alta*; para las advertencias, “Revisar” con severidad *Media*.
     - **hashes.json**: Contiene las huellas SHA‑256 de ambos archivos para garantizar su integridad.
   - Los tres ficheros se empaquetan en un ZIP y se descargan con FileSaver.js.

5. **Reportes** (`/reports`):
   - Muestra un historial de lotes procesados guardados en `localStorage` (fecha, tipo, número de registros OK/Advertencias/Errores). Esta funcionalidad es mínima y sirve de ejemplo; en una evolución se almacenaría en IndexedDB junto con los ZIP generados.

6. **Auditoría** (`/audit`):
   - Pestaña para consultar el registro de acciones. En esta demo no se generan entradas automáticamente; sin embargo, se muestra la estructura esperada para almacenar la fecha, usuario, acción y detalle. Puede integrarse el registro en las funciones de carga, conciliación y exportación.

7. **Administración** (`/admin`):
   - Disponible solo para el rol *Administrador*.
   - Permite listar los catálogos de bancos, centros y métodos de pago; ver las plantillas BC existentes; y crear nuevos usuarios. Las contraseñas se saltean y hashean automáticamente.

## Agregar nuevos bancos o plantillas BC

Los catálogos y plantillas se almacenan en `src/data/catalogs.json` y `src/data/templatesBC.json`. Para añadir un nuevo banco o centro, edite `catalogs.json` e incluya un objeto con `id` y `name`. Para crear un nuevo template BC:

1. Añada un objeto en `templatesBC.json` con las propiedades `id`, `name`, `description`, `columns` (lista ordenada de columnas que requiere BC) y `defaults` (valores por defecto para ciertas columnas).
2. Si se necesitan reglas de mapeo específicas (por ejemplo, cuentas contables distintas según el tipo de pago), modifique la lógica de `ExportPage.jsx` para poblar las columnas en función del `id` del template.

## Límites conocidos

- **Reglas simplificadas**: El motor de conciliación implementa solo una pequeña fracción de las reglas indicadas en el documento funcional y el instructivo (`AJUSTE POR APROXIMACIONES`, cruces ±3 días, escalamientos por SLA, etc.). Estas se pueden codificar en `ReconcilePage.jsx` y refactorizar en hooks/utilidades para mejorar legibilidad.
- **OCR**: El módulo OCR está preparado para integrarse con `tesseract.js` si `pdfjs-dist` no logra extraer texto. Dada la complejidad y el tiempo de cómputo, el ejemplo actual se centra en la extracción textual con heurísticas.
- **Persistencia**: Toda la información se almacena en el navegador. Para un entorno productivo debería añadirse cifrado (por ejemplo, con AES‑GCM) y funcionalidad de respaldo/restauración.
- **Auditoría**: No se implementa la bitácora de auditoría ni las firmas SHA‑256 de cada lote; se aporta un esqueleto que puede integrarse fácilmente registrando acciones en `localStorage` o `IndexedDB`.
- **Accesibilidad**: Se recomienda complementar los componentes con atributos ARIA y manejo de teclado para cumplir con normas de accesibilidad.

## Conclusión

Esta aplicación demuestra cómo construir un módulo de liquidaciones totalmente en frontend, con autenticación por roles, procesamiento de Excel/CSV/PDF, conciliación básica, exportación de archivos contables y un diseño responsive basado en Tailwind. Sirve como base extensible para implementar el Documento Funcional detallado y el instructivo MTR‑CAR‑IN‑005. Para producir un sistema listo para producción se deben ampliar las reglas de negocio, agregar seguridad y mejorar la experiencia de usuario.
import React from 'react';

const Section = ({ id, title, children }) => (
  <section id={id} className="space-y-4">
    <h2 className="text-2xl font-semibold text-blue border-b border-grayLight pb-2">{title}</h2>
    <div className="space-y-3 text-slate-700 leading-relaxed">{children}</div>
  </section>
);

const SubSection = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold text-cyan">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const FunctionalSpecPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      <header className="bg-white border-b border-grayLight">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-2">
          <p className="text-sm uppercase tracking-wide text-gray-500">Plataforma Web de Automatización y Control de Cartera</p>
          <h1 className="text-3xl md:text-4xl font-bold text-blue">Metrored — Documento Funcional Detallado v0.9</h1>
          <p className="text-gray-600 max-w-3xl">
            Este documento resume la arquitectura, los módulos funcionales, los flujos y las reglas de negocio
            para la plataforma 100% frontend desplegada en GitHub Pages, alineada con el instructivo MTR-CAR-IN-005.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        <Section id="resumen" title="1) Resumen Ejecutivo del Proyecto">
          <p>
            Metrored requiere digitalizar y automatizar la liquidación de cuentas para aseguradoras, clientes SSO,
            tarjetas, efectivo, autoconsumos y descuentos a rol. La solución propuesta es una aplicación web estática
            basada en React y Tailwind que opera completamente en el navegador y publica sus builds en GitHub Pages.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>OCR de comprobantes PDF (voucher, notas de crédito bancarias, transferencias).</li>
            <li>Lectura de planillas Excel (SheetJS) y CSV.</li>
            <li>Conciliación automática con reglas de negocio explícitas y tolerancias configurables.</li>
            <li>Generación de Archivo conciliado para BC y Log de errores/advertencias por cada corrida.</li>
            <li>Login por roles (Administrador, Analista, Asistente) con persistencia local encriptada.</li>
            <li>Dashboard con KPIs, seguimiento, auditoría y trazabilidad completa de lotes.</li>
          </ul>
          <p>
            La solución replica la identidad visual corporativa (cyan, azul, blanco y gris) e incorpora logo y favicon.
            Los flujos implementan los pasos operativos y las notas importantes del instructivo en sus secciones 4.1–4.5.
          </p>
        </Section>

        <Section id="objetivos" title="2) Objetivos del Sistema">
          <ol className="list-decimal list-inside space-y-2">
            <li>Reducir los tiempos de conciliación y registro contable mediante validaciones automáticas.</li>
            <li>Disminuir errores de digitación y descuadres detectando diferencias de facturas, valores y fechas.</li>
            <li>Estandarizar el flujo de liquidación para todos los tipos de cartera.</li>
            <li>Generar archivos compatibles con Dynamics 365 BC junto con logs exhaustivos para auditoría.</li>
            <li>Garantizar trazabilidad con paneles de seguimiento, bitácora por usuario y firmas de lote.</li>
          </ol>
        </Section>

        <Section id="arquitectura" title="3) Arquitectura y Tecnologías">
          <p>
            La plataforma funciona 100% en frontend con builds estáticos generados por Vite. Emplea React 18, Tailwind CSS,
            SheetJS, PapaParse, pdf.js, Tesseract.js, Zod, dayjs, lodash, idb-keyval, crypto-js, FileSaver.js, JSZip y Chart.js.
          </p>
          <SubSection title="Estructura de carpetas sugerida">
            <pre className="bg-white border border-grayLight rounded-md p-4 text-sm overflow-x-auto">
{`/public
/src
  /app
  /auth
  /core
  /data
  /features
    /ingestion
    /reconcile
    /exports
    /audit
    /admin
    /reports
  /theme`}
            </pre>
          </SubSection>
          <p>
            El flujo de datos sigue la cadena: Entrada (Excel/PDF) → Normalización → Conciliación → Resultados → Salidas (BC + log) → Registro (auditoría, KPIs).
          </p>
        </Section>

        <Section id="flujo-general" title="4) Flujo General del Proceso">
          <p>
            El proceso automatiza la carga de archivos, su preprocesamiento, la clasificación automática, la conciliación con
            reglas específicas, la generación de salidas para BC y logs, y el registro en dashboard y auditoría.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Recepción y clasificación de transferencias de aseguradoras/SSO con ajustes ante diferencias.</li>
            <li>Conciliación de efectivo con alertas y escalamiento si hay descuadres superiores a 48 horas.</li>
            <li>Conciliación de notas de crédito de tarjetas con reporte BC y escalamiento por lotes/vouchers faltantes.</li>
            <li>Gestión de autoconsumos con clasificación por centro y registro contable.</li>
            <li>Descuentos a rol con reporte a Talento Humano, confirmación de nómina y registro.</li>
          </ul>
        </Section>

        <Section id="modulos" title="5) Módulos Funcionales">
          <SubSection title="5.1 Login y gestión de usuarios">
            <ul className="list-disc list-inside space-y-1">
              <li>Autenticación basada en JSON local migrado a IndexedDB, contraseñas con hash PBKDF2/SHA-256 y salt.</li>
              <li>Roles de Administrador, Analista y Asistente con permisos diferenciados.</li>
              <li>Controles de bloqueo por intentos fallidos, expiración de sesión, registro de IP/UA y log de acceso.</li>
            </ul>
          </SubSection>
          <SubSection title="5.2 Panel principal (dashboard y alertas)">
            <ul className="list-disc list-inside space-y-1">
              <li>KPIs por período: lotes procesados, % y $ conciliado, pendientes, top causas de error, tiempos medios.</li>
              <li>Alertas: diferencias pendientes &gt; 48h, lotes de tarjeta sin voucher/factura, transferencias con valor no coincidente.</li>
            </ul>
          </SubSection>
          <SubSection title="5.3 Módulo de carga de archivos">
            <p>Soporta Excel/CSV para reportes y planillas, y PDF para notas de crédito o comprobantes bancarios.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Extracción de campos clave como Fecha Recap, Nº Doc Recap, Valor Bruto, Comisión, IVA/IRF retenido, Neto a pagar.</li>
              <li>Uso de pdf.js y fallback a Tesseract.js, normalización de formatos, detección de moneda y corrección de OCR.</li>
              <li>Clasificación automática de documentos por heurística.</li>
            </ul>
          </SubSection>
          <SubSection title="5.4 Módulo de conciliación automática">
            <p>
              Motor declarativo con reglas JSON y estrategias de fuzzy matching que cubren aseguradoras/SSO, efectivo, tarjetas,
              autoconsumos y descuentos a rol.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cruces por Nº de factura, cliente, monto y fecha (±3 días) con gestión de observaciones.</li>
              <li>Conciliación de efectivo por centro/banco/fecha con SLA de 48 horas para descuadres.</li>
              <li>Conciliación de tarjetas con verificación de neto, tolerancias y notificación cuando faltan lotes en BC.</li>
              <li>Clasificación de autoconsumos y generación de asientos contables.</li>
              <li>Gestión de descuentos a rol con reportes a Talento Humano y propuestas de asiento.</li>
            </ul>
          </SubSection>
          <SubSection title="5.5 Resultados de conciliación">
            <ul className="list-disc list-inside space-y-1">
              <li>Registros OK pasan al archivo para BC.</li>
              <li>Advertencias requieren confirmación del analista.</li>
              <li>Errores generan entradas en el log con acciones sugeridas.</li>
            </ul>
          </SubSection>
          <SubSection title="5.6 Módulo de reportes, histórico y seguimiento">
            <ul className="list-disc list-inside space-y-1">
              <li>Histórico de lotes con fecha, tipo, banco/aseguradora, registros, montos y estado.</li>
              <li>Bitácora con usuario responsable, hash SHA-256, versión del motor y firmas.</li>
              <li>Filtros por centro médico, rango de fechas, tipo de cartera y estado.</li>
            </ul>
          </SubSection>
          <SubSection title="5.7 Panel administrativo">
            <ul className="list-disc list-inside space-y-1">
              <li>Gestión de usuarios, roles y catálogos de bancos, aseguradoras, clientes SSO y centros médicos.</li>
              <li>Configuración de plantillas BC y parámetros de tolerancia, ventanas temporales y reglas de ruido.</li>
            </ul>
          </SubSection>
        </Section>

        <Section id="diseno" title="6) Diseño UI/UX y paleta de colores">
          <p>
            La interfaz mantiene claridad, consistencia y accesibilidad (WCAG AA) con un layout de cabecera, barra lateral y zona
            de trabajo por módulo. Utiliza la paleta Metrored: Cyan #00B7D3, Azul #135EA7, Gris medio #6B7280, Gris claro #E5E7EB y Blanco.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tipografía Inter o Roboto, tamaños responsivos y alto contraste.</li>
            <li>Componentes clave: dropzone de carga, tablas tabuladas para conciliación, selectores de plantilla y dashboard con KPIs.</li>
          </ul>
        </Section>

        <Section id="usuarios" title="7) Manejo de usuarios y roles">
          <p>
            Modelo de datos: <code>{'{ id, name, email, role, hash, salt, createdAt, lastLoginAt, status }'}</code>. Autorización con guards por ruta y
            persistencia en IndexedDB con opción de backup/restore cifrado AES-256-GCM.
          </p>
          <table className="w-full text-sm border border-grayLight">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-grayLight px-3 py-2 text-left">Rol</th>
                <th className="border border-grayLight px-3 py-2 text-left">Permisos clave</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-grayLight px-3 py-2">Administrador</td>
                <td className="border border-grayLight px-3 py-2">CRUD de usuarios/roles, plantillas BC, catálogos, auditoría completa, tolerancias y reglas.</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-grayLight px-3 py-2">Analista</td>
                <td className="border border-grayLight px-3 py-2">Carga y conciliación, aprobación de lotes, exportación, gestión de pendientes y reportes.</td>
              </tr>
              <tr>
                <td className="border border-grayLight px-3 py-2">Asistente</td>
                <td className="border border-grayLight px-3 py-2">Carga archivos, ejecuta conciliaciones estándar, descarga salidas y crea borradores de correo.</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section id="logica" title="8) Lógica de conciliación y validación">
          <SubSection title="8.1 Reglas transversales">
            <ul className="list-disc list-inside space-y-1">
              <li>Ventanas temporales configurables y tolerancias absolutas/relativas para montos.</li>
              <li>Normalización de texto, detección de sinónimos y validación de fórmulas para tarjetas.</li>
              <li>Escalamiento automático según actor indicado en el instructivo.</li>
            </ul>
          </SubSection>
          <SubSection title="8.2 Aseguradoras y SSO">
            <p>
              Clasificación de transferencias, cruces por factura y RUC, gestión de prorrateos y observaciones con generación de correo.
            </p>
          </SubSection>
          <SubSection title="8.3 Efectivo">
            <p>
              Cruce entre cierres de caja y depósitos por centro/banco/fecha/monto, con notificación a Ejecutivo Senior si hay descuadre.
            </p>
          </SubSection>
          <SubSection title="8.4 Tarjetas de crédito">
            <p>
              Extracción de campos clave de notas de crédito, conciliación contra reporte BC, tolerancia por ajustes y escalamiento ante lotes faltantes.
            </p>
          </SubSection>
          <SubSection title="8.5 Autoconsumos">
            <p>
              Clasificación por centro médico, validación de valores y armado de líneas contables.</p>
          </SubSection>
          <SubSection title="8.6 Descuentos a rol">
            <p>
              Corte el día 18 con reporte a Talento Humano, consolidación con nómina y generación de asientos.</p>
          </SubSection>
        </Section>

        <Section id="salidas" title="9) Salidas esperadas">
          <SubSection title="9.1 Archivo para BC (conciliado)">
            <p>
              Formato CSV/XLSX parametrizable por escenario, con columnas como Journal Template Name, Document Type, Account No., Amount, External Document No. y dimensiones.
            </p>
          </SubSection>
          <SubSection title="9.2 Log de errores">
            <p>
              Exportado en XLSX/JSON/HTML con campos de tipo, origen, documento, regla, detalle, diferencia, severidad, sugerencia, responsable y SLA.</p>
          </SubSection>
        </Section>

        <Section id="seguridad" title="10) Seguridad y control de accesos">
          <ul className="list-disc list-inside space-y-1">
            <li>Autenticación con hash PBKDF2/SHA-256, rate limiting de login y bloqueo temporal.</li>
            <li>Autorización basada en roles con route guards y menús contextuales.</li>
            <li>Datos en reposo cifrados en IndexedDB y firmas SHA-256 por lote exportado.</li>
            <li>Generación de correos mediante plantillas <code>mailto:</code> para mantener la solución 100% frontend.</li>
          </ul>
        </Section>

        <Section id="pruebas" title="11) Pruebas y criterios de aceptación">
          <SubSection title="11.1 Criterios de aceptación">
            <ul className="list-disc list-inside space-y-1">
              <li>Carga/OCR: lectura de Excel/PDF con campos clave extraídos en notas de crédito Diners/VISA.</li>
              <li>Conciliación: tarjetas con ≥95% de coincidencias, efectivo con alertas de descuadre, aseguradoras con correos generados.</li>
              <li>Exportación: generación de archivo BC y log con huellas e histórico.</li>
              <li>Seguridad: control de acceso por roles y bitácora de operaciones.</li>
            </ul>
          </SubSection>
          <SubSection title="11.2 Casos de prueba">
            <table className="w-full text-sm border border-grayLight">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-grayLight px-3 py-2 text-left">ID</th>
                  <th className="border border-grayLight px-3 py-2 text-left">Caso</th>
                  <th className="border border-grayLight px-3 py-2 text-left">Datos de entrada</th>
                  <th className="border border-grayLight px-3 py-2 text-left">Resultado esperado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-grayLight px-3 py-2">TC-01</td>
                  <td className="border border-grayLight px-3 py-2">OCR Diners (09-OCT-2025)</td>
                  <td className="border border-grayLight px-3 py-2">PDF “Comprobante… 52302952”</td>
                  <td className="border border-grayLight px-3 py-2">Tabla con 5 líneas RECAP y total Neto 867,60.</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-grayLight px-3 py-2">TC-02</td>
                  <td className="border border-grayLight px-3 py-2">OCR Diners (13-OCT-2025)</td>
                  <td className="border border-grayLight px-3 py-2">PDF “Comprobante… 52341091”</td>
                  <td className="border border-grayLight px-3 py-2">5 líneas, Neto 622,83 y campos clave extraídos.</td>
                </tr>
                <tr>
                  <td className="border border-grayLight px-3 py-2">EF-01</td>
                  <td className="border border-grayLight px-3 py-2">Cierre vs Depósitos</td>
                  <td className="border border-grayLight px-3 py-2">Excel de cierres + depósitos</td>
                  <td className="border border-grayLight px-3 py-2">Creación de pendiente con SLA 48h si difiere.</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-grayLight px-3 py-2">AS-01</td>
                  <td className="border border-grayLight px-3 py-2">Transferencia Aseguradora</td>
                  <td className="border border-grayLight px-3 py-2">Comprobante + planilla facturas</td>
                  <td className="border border-grayLight px-3 py-2">Correo a cliente/aseguradora y marca “Observación”.</td>
                </tr>
                <tr>
                  <td className="border border-grayLight px-3 py-2">AR-01</td>
                  <td className="border border-grayLight px-3 py-2">Descuento a rol (corte 18)</td>
                  <td className="border border-grayLight px-3 py-2">Listado de facturas</td>
                  <td className="border border-grayLight px-3 py-2">Reporte a TH y generación de líneas de asiento.</td>
                </tr>
              </tbody>
            </table>
          </SubSection>
        </Section>

        <Section id="ejemplos" title="12) Ejemplos de entrada/salida">
          <p>
            Se incluye un extracto normalizado de “Comprobante de Pago – Nota de Crédito” con campos Recap, valores y neto a pagar,
            además de ejemplos de salida para el archivo BC y el log de errores.
          </p>
        </Section>

        <Section id="devops" title="13) Publicación y DevOps">
          <p>
            Repositorio con ramas <code>main</code> (producción) y <code>dev</code> (pruebas). El build se realiza con Vite hacia <code>/dist</code> y se despliega en GitHub Pages.
            Se contemplan feature flags para OCR avanzado y backups cifrados de configuración.</p>
        </Section>

        <Section id="permisos" title="14) Mapa de permisos (resumen)">
          <table className="w-full text-sm border border-grayLight">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-grayLight px-3 py-2 text-left">Acción / Rol</th>
                <th className="border border-grayLight px-3 py-2 text-left">Admin</th>
                <th className="border border-grayLight px-3 py-2 text-left">Analista</th>
                <th className="border border-grayLight px-3 py-2 text-left">Asistente</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cargar archivos (Excel/PDF)', '✔', '✔', '✔'],
                ['Ejecutar conciliación', '✔', '✔', '✔'],
                ['Aprobar/descartar lote', '✔', '✔', '✖'],
                ['Descargar “Archivo BC”', '✔', '✔', '✔'],
                ['Descargar “Log”', '✔', '✔', '✔'],
                ['Editar reglas/tolerancias/plantillas', '✔', '✖', '✖'],
                ['Gestionar usuarios/catálogos', '✔', '✖', '✖'],
                ['Ver auditoría completa', '✔', '✔', '✖']
              ].map(([action, admin, analyst, assistant]) => (
                <tr key={action}>
                  <td className="border border-grayLight px-3 py-2">{action}</td>
                  <td className="border border-grayLight px-3 py-2 text-center">{admin}</td>
                  <td className="border border-grayLight px-3 py-2 text-center">{analyst}</td>
                  <td className="border border-grayLight px-3 py-2 text-center">{assistant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section id="plan-pruebas" title="15) Pruebas (plan resumido)">
          <ul className="list-disc list-inside space-y-1">
            <li>Unitarias: parsers, normalizador, motor de reglas y generador de salidas.</li>
            <li>Integración: flujos por escenario (tarjetas, efectivo, aseguradoras, SSO, autoconsumos, descuentos a rol).</li>
            <li>E2E: Cypress/Playwright para validar carga → conciliación → exportación → histórico en GitHub Pages.</li>
            <li>Rendimiento: OCR en web worker con lotes ≥ 5.000 líneas.</li>
            <li>Accesibilidad: verificación WCAG AA.</li>
            <li>Seguridad: validación de hash, expiración de sesión y cifrado de backups.</li>
          </ul>
        </Section>

        <Section id="beneficios" title="16) Beneficios y métricas de mejora">
          <ul className="list-disc list-inside space-y-1">
            <li>Reducción del tiempo de conciliación y armado de archivos en 60–80%.</li>
            <li>Disminución de errores humanos con trazabilidad completa por lote y usuario.</li>
            <li>Control del cierre mensual con pendientes visibles y SLA definidos.</li>
            <li>Despliegue inmediato sin infraestructura adicional al usar GitHub Pages.</li>
          </ul>
        </Section>

        <Section id="anexo" title="17) Anexo — Pasos del instructivo a automatizar">
          <ul className="list-disc list-inside space-y-1">
            <li>Aseguradoras/SSO: recepción, clasificación, validación y comunicación de diferencias antes del cierre.</li>
            <li>Efectivo: verificación diaria de cierres vs depósitos y escalamiento con SLA de 48h.</li>
            <li>Tarjetas de crédito: generación y archivo de notas de crédito, conciliación con BC y escalamiento de faltantes.</li>
            <li>Autoconsumos: recepción, clasificación por centro y registro.</li>
            <li>Descuentos a rol: reporte a Talento Humano el día 18, consolidación y registro contable.</li>
          </ul>
          <p className="text-sm text-gray-500">
            Este documento funcional define arquitectura, flujos e interfaces listos para implementación con posibilidad de extender reglas y plantillas sin modificar el motor.
          </p>
        </Section>
      </main>
    </div>
  );
};

export default FunctionalSpecPage;

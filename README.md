# NIJA — Web de café de especialidad

Sitio web de una sola página para **NIJA · Alimentos y Frutos Naturales del Perené**
(Cienti Selva Perú S.A.C.), café de especialidad de Chanchamayo, Perú.

HTML, CSS y JavaScript puros. Sin dependencias, sin build, sin `npm install`.

## Cómo verla

Haz doble clic en `index.html` — funciona directamente en el navegador.

Si prefieres servirla en local (recomendado para probar como en producción):

```bash
python3 -m http.server 5173 -d "/Users/t1kevin/Documents/APLICACIONES WEB/CAFETERIA 1"
```

Luego abre <http://localhost:5173>.

## Estructura

```
index.html          Toda la página (una sola vista con anclas)
css/styles.css      Estilos, tokens de marca y responsive
js/main.js          Menú, filtros, selector de presentación, formularios
assets/
  fonts/            Pacifico.ttf (tipografía de títulos de marca)
  img/marca/        Logos en 4 colores, favicon y patrón Ashaninka
  img/productos/    Fotos de las bolsas
  img/fotos/        Fotografía ambiental
```

## Marca

Del *Lineamiento Gráfico de Marca V1.0*:

| Color | Hex | Uso |
|---|---|---|
| Ámbar | `#d18e36` | Acentos, botones, precios |
| Marrón | `#2d1515` | Fondos oscuros, texto |
| Olivo | `#5b662e` | Secciones, sellos, CTA secundario |

Tipografías oficiales: **Pacifico** para títulos de acento (incluida en el repo) y
**Signika Negative** para textos (se carga desde Google Fonts, con alternativa del
sistema si no hay internet).

El trapecio y las grecas de rombos vienen del arte Ashaninka; se usan en los
separadores y en los distintivos de sección.

## Contenido editable

- **Precios y presentaciones**: en `index.html`, cada botón `.presentacion` tiene
  `data-medida` y `data-precio`. El precio mostrado y el mensaje de WhatsApp se
  actualizan solos al cambiarlos.
- **Número de WhatsApp**: constante `WHATSAPP` al inicio de `js/main.js`.
- **Ficha técnica**: tablas de la sección `#calidad`.

Los precios provienen del documento interno *PRODUCTOS NIJA 2020*. Ese documento
está marcado como de uso interno y con precios de 2020 — conviene revisarlos antes
de publicar el sitio.

## Formularios

Los dos formularios (pedido y partners) no envían datos a ningún servidor: validan
en el navegador y abren WhatsApp con el mensaje ya redactado. No se guarda nada.
Si más adelante quieres recibirlos por correo, habría que conectar un servicio de
formularios o un backend.

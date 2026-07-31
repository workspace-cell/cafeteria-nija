/* ============================================================
   NIJA — Interacciones del sitio
   Sin dependencias externas.
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP = '51984451771';

  /* ---------- Menú móvil ---------- */
  var hamburguesa = document.getElementById('hamburguesa');
  var menu = document.getElementById('menu');

  function cerrarMenu() {
    if (!menu) return;
    menu.classList.remove('esta-abierto');
    hamburguesa.setAttribute('aria-expanded', 'false');
    hamburguesa.setAttribute('aria-label', 'Abrir menú');
  }

  if (hamburguesa && menu) {
    hamburguesa.addEventListener('click', function () {
      var abierto = menu.classList.toggle('esta-abierto');
      hamburguesa.setAttribute('aria-expanded', String(abierto));
      hamburguesa.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });

    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !hamburguesa.contains(e.target)) cerrarMenu();
    });
  }

  /* ---------- Cabecera al hacer scroll ---------- */
  var cabecera = document.getElementById('cabecera');
  var ultimoScroll = -1;

  function alScrollear() {
    var y = window.scrollY;
    if (y === ultimoScroll) return;
    ultimoScroll = y;
    if (cabecera) cabecera.classList.toggle('esta-fija', y > 12);
    marcarEnlaceActivo();
  }

  window.addEventListener('scroll', function () {
    window.requestAnimationFrame(alScrollear);
  }, { passive: true });

  /* ---------- Enlace activo según la sección visible ---------- */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var secciones = enlaces
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function marcarEnlaceActivo() {
    var pos = window.scrollY + (window.innerHeight * 0.32);
    var actual = null;

    secciones.forEach(function (sec) {
      if (sec.offsetTop <= pos) actual = sec.id;
    });

    enlaces.forEach(function (a) {
      a.classList.toggle('esta-activo', a.getAttribute('href') === '#' + actual);
    });
  }

  /* ---------- Animaciones de entrada ---------- */
  var aRevelar = document.querySelectorAll('.revelar');

  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('es-visible');
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    aRevelar.forEach(function (el) { observador.observe(el); });
  } else {
    aRevelar.forEach(function (el) { el.classList.add('es-visible'); });
  }

  /* ---------- Barras del perfil sensorial ---------- */
  var barras = document.querySelectorAll('.nota-barra__relleno');

  if (barras.length && 'IntersectionObserver' in window) {
    var obsBarras = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        el.style.width = el.getAttribute('data-nivel') + '%';
        obsBarras.unobserve(el);
      });
    }, { threshold: 0.4 });

    barras.forEach(function (b) { obsBarras.observe(b); });
  } else {
    barras.forEach(function (b) { b.style.width = b.getAttribute('data-nivel') + '%'; });
  }

  /* ---------- Filtros de productos ---------- */
  var filtros = document.querySelectorAll('.filtro');
  var productos = document.querySelectorAll('.producto');

  filtros.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var valor = btn.getAttribute('data-filtro');

      filtros.forEach(function (f) {
        var activo = f === btn;
        f.classList.toggle('esta-activo', activo);
        f.setAttribute('aria-pressed', String(activo));
      });

      productos.forEach(function (p) {
        var coincide = valor === 'todos' || p.getAttribute('data-categoria') === valor;
        p.classList.toggle('esta-oculto', !coincide);
      });
    });
  });

  /* ---------- Selector de presentación + precio ---------- */
  function textoPedido(tarjeta) {
    var nombre = tarjeta.getAttribute('data-nombre') || 'café NIJA';
    var activo = tarjeta.querySelector('.presentacion.esta-activo');

    var mensaje = 'Hola NIJA ☕,\n\nEstoy interesado en adquirir su *' + nombre + '*.';
    if (activo) {
      mensaje += '\n\nDeseo la presentación de *' + activo.getAttribute('data-medida') + '* (S/ ' + activo.getAttribute('data-precio') + ').\n\n¿Me podrían indicar los pasos para la compra y el envío, por favor?';
    } else {
      mensaje += '\n\n¿Me podrían brindar más información y precios, por favor?';
    }
    return mensaje;
  }

  function actualizarEnlacePedido(tarjeta) {
    var enlace = tarjeta.querySelector('[data-pedir]');
    if (!enlace) return;
    enlace.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(textoPedido(tarjeta));
    enlace.target = '_blank';
    enlace.rel = 'noopener';
  }

  productos.forEach(function (tarjeta) {
    var opciones = tarjeta.querySelectorAll('.presentacion');
    var visor = tarjeta.querySelector('[data-precio-visor]');

    opciones.forEach(function (op) {
      op.addEventListener('click', function () {
        opciones.forEach(function (o) {
          var activo = o === op;
          o.classList.toggle('esta-activo', activo);
          o.setAttribute('aria-pressed', String(activo));
        });

        if (visor) {
          visor.innerHTML = 'S/ ' + op.getAttribute('data-precio') +
                            '<small>Incluye IGV</small>';
        }

        actualizarEnlacePedido(tarjeta);
      });
    });

    actualizarEnlacePedido(tarjeta);
  });

  /* ---------- Validación y envío de formularios ---------- */
  function limpiarError(campo) {
    var aviso = document.querySelector('[data-error-de="' + campo.id + '"]');
    if (aviso) aviso.textContent = '';
    campo.removeAttribute('aria-invalid');
  }

  function marcarError(campo, texto) {
    var aviso = document.querySelector('[data-error-de="' + campo.id + '"]');
    if (aviso) aviso.textContent = texto;
    campo.setAttribute('aria-invalid', 'true');
  }

  function validar(form) {
    var ok = true;
    var primeroConError = null;

    form.querySelectorAll('input, textarea').forEach(function (campo) {
      limpiarError(campo);
      var valor = campo.value.trim();

      if (campo.hasAttribute('required') && !valor) {
        marcarError(campo, 'Este campo es obligatorio.');
        ok = false;
        primeroConError = primeroConError || campo;
        return;
      }

      if (campo.type === 'tel' && valor) {
        var digitos = valor.replace(/\D/g, '');
        if (digitos.length < 9) {
          marcarError(campo, 'Ingresa un número de al menos 9 dígitos.');
          ok = false;
          primeroConError = primeroConError || campo;
        }
      }
    });

    if (primeroConError) primeroConError.focus();
    return ok;
  }

  function abrirWhatsApp(mensaje) {
    window.open(
      'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensaje),
      '_blank',
      'noopener'
    );
  }

  function mostrarAviso(texto) {
    var aviso = document.getElementById('avisoPedido');
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.hidden = false;
    window.setTimeout(function () { aviso.hidden = true; }, 6000);
  }

  /* Formulario de pedido */
  var formPedido = document.getElementById('formPedido');

  if (formPedido) {
    formPedido.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validar(formPedido)) return;

      var d = new FormData(formPedido);
      var mensaje =
        'Hola NIJA ☕, mi nombre es *' + d.get('nombre') + '*.\n\n' +
        'Estoy interesado en el producto: *' + d.get('producto') + '*.\n' +
        'Mi teléfono de contacto es: ' + d.get('telefono') + '.';

      var extra = (d.get('mensaje') || '').trim();
      if (extra) mensaje += '\n\nDetalle adicional: ' + extra;

      abrirWhatsApp(mensaje);
      mostrarAviso('¡Listo! Abrimos WhatsApp con tu pedido redactado.');
      formPedido.reset();
    });
  }

  /* Formulario de partners */
  var formPartner = document.getElementById('formPartner');

  if (formPartner) {
    formPartner.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validar(formPartner)) return;

      var d = new FormData(formPartner);
      var mensaje =
        'Hola NIJA ☕, me gustaría solicitar la lista de precios mayorista.\n\n' +
        '*Mis datos son:*\n' +
        '- Nombre: ' + d.get('nombre') + '\n' +
        '- Negocio: ' + (d.get('negocio') || 'No indicado') + '\n' +
        '- Tipo de aliado: ' + d.get('tipo') + '\n' +
        '- Teléfono: ' + d.get('telefono');

      abrirWhatsApp(mensaje);
      formPartner.reset();
    });
  }

  /* ---------- Año en el pie ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- Estado inicial ---------- */
  alScrollear();
})();

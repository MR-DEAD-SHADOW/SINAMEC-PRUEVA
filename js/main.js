/* ═══════════════════════════════════════════════════════════
   Grupo SINAMEC — JavaScript principal
   Navegación SPA, contacto directo WhatsApp/Gmail (sin backend)
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Configuración ───────────────────────────────────────── */
const WHATSAPP_NUMBER = '525661381199'; // Número en formato internacional sin +
const GMAIL_ADDRESS   = 'contacto@grupsinamec.com';

/* ── Estado ──────────────────────────────────────────────── */
let currentPage = 'inicio';

/* ── Navegación ──────────────────────────────────────────── */
function navigate(pageId) {
  const oldPage = document.getElementById('page-' + currentPage);
  if (oldPage) oldPage.classList.remove('active');

  const newPage = document.getElementById('page-' + pageId);
  if (newPage) newPage.classList.add('active');

  currentPage = pageId;

  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  /* Cerrar menú Bootstrap en móvil */
  const collapse = document.getElementById('navbarCollapse');
  if (collapse && collapse.classList.contains('show')) {
    const toggler = document.querySelector('[data-bs-target="#navbarCollapse"]');
    if (toggler) toggler.click();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── WhatsApp directo (hipervínculo, sin backend) ─────────── */
function openWhatsApp(prefilledMsg) {
  const msg = prefilledMsg || '¡Hola! Quiero saber más sobre los servicios de Grupo SINAMEC.';
  const url  = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ── Gmail directo (hipervínculo mailto, sin backend) ─────── */
function openGmail(subject, body) {
  const sub  = subject || 'Consulta — Grupo SINAMEC';
  const bod  = body    || 'Hola, me gustaría obtener más información sobre sus servicios.';
  const url  = 'mailto:' + GMAIL_ADDRESS
             + '?subject=' + encodeURIComponent(sub)
             + '&body='    + encodeURIComponent(bod);
  window.location.href = url;
}

/* ── FAB WhatsApp ────────────────────────────────────────── */
function buildFab() {
  const fab = document.getElementById('whatsapp-fab');
  if (!fab) return;
  fab.addEventListener('click', function (e) {
    e.preventDefault();
    openWhatsApp();
  });
}

/* ── Formulario de contacto (abre WhatsApp o Gmail) ──────── */
function handleContactForm(e) {
  e.preventDefault();

  const name    = (document.getElementById('cname')    || {}).value || '';
  const company = (document.getElementById('ccompany') || {}).value || '';
  const email   = (document.getElementById('cemail')   || {}).value || '';
  const service = (document.getElementById('cservice') || {}).value || '';
  const message = (document.getElementById('cmessage') || {}).value || '';
  const channel = document.querySelector('input[name="channel"]:checked');
  const via     = channel ? channel.value : 'whatsapp';

  if (!name || !email) {
    showAlert('Por favor completa tu nombre y correo.', 'danger');
    return;
  }

  const composed =
    'Nombre: '   + name    + '\n' +
    'Empresa: '  + company + '\n' +
    'Correo: '   + email   + '\n' +
    'Servicio de interés: ' + service + '\n\n' +
    (message || 'Quiero saber más al respecto.');

  if (via === 'gmail') {
    openGmail('Consulta de ' + name + ' — Grupo SINAMEC', composed);
  } else {
    openWhatsApp(composed);
  }
}

function showAlert(msg, type) {
  const box = document.getElementById('form-alert');
  if (!box) return;
  box.textContent   = msg;
  box.className     = 'alert alert-' + type + ' mt-3';
  box.style.display = 'block';
  if (type === 'success') {
    setTimeout(function () { box.style.display = 'none'; }, 5000);
  }
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  /* Marcar inicio activo */
  document.querySelectorAll('[data-page="inicio"]').forEach(function (el) {
    el.classList.add('active');
  });

  /* Tooltips Bootstrap */
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
    new bootstrap.Tooltip(el);
  });

  /* FAB */
  buildFab();

  /* Formulario */
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', handleContactForm);
});

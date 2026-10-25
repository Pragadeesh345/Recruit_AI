/* =============================================
   RECRUIT AI — MAIN JS
   Features: Live search with count, keyboard
   shortcuts, smooth modal, focus management
   ============================================= */

// ── SEARCH ──────────────────────────────────────

let totalRows = 0;

function initSearch() {
    const tbody = document.querySelector('#jobsTable tbody');
    totalRows = tbody ? tbody.querySelectorAll('.table-row').length : 0;
    updateCount(totalRows);

    // ⌘K / Ctrl+K focuses search
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const inp = document.getElementById('searchInput');
            if (inp) { inp.focus(); inp.select(); }
        }
        if (e.key === 'Escape') {
            const modal = document.getElementById('detailsModal');
            if (modal && modal.classList.contains('is-open')) {
                closeModal();
            } else {
                clearSearch();
            }
        }
    });
}

function filterTable() {
    const input   = document.getElementById('searchInput').value.toUpperCase().trim();
    const rows    = document.querySelectorAll('#jobsTable .table-row');
    const empty   = document.getElementById('emptyState');
    let visible   = 0;

    rows.forEach(row => {
        const role    = (row.querySelector('.role-cell')?.textContent  || '').toUpperCase();
        const company = (row.querySelector('.company-cell')?.textContent || '').toUpperCase();
        const badge   = (row.querySelector('.source-badge')?.textContent || '').toUpperCase();

        const match = !input || role.includes(input) || company.includes(input) || badge.includes(input);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
    });

    updateCount(visible);

    // Toggle empty state
    if (empty) {
        empty.classList.toggle('is-visible', visible === 0 && input.length > 0);
    }
}

function updateCount(n) {
    const el = document.getElementById('visibleCount');
    if (el) el.textContent = n;
}

function clearSearch() {
    const inp = document.getElementById('searchInput');
    if (inp) { inp.value = ''; }
    filterTable();
    inp?.focus();
}


// ── MODAL ───────────────────────────────────────

let lastFocused = null;

function openModal(button) {
    lastFocused = document.activeElement;

    document.getElementById('modalTitle').textContent    = button.getAttribute('data-company');
    document.getElementById('modalRole').textContent     = button.getAttribute('data-role');
    document.getElementById('modalLocation').textContent = button.getAttribute('data-location');
    document.getElementById('modalSource').textContent   = button.getAttribute('data-source');
    document.getElementById('modalCategory').textContent = button.getAttribute('data-category') || '—';
    document.getElementById('modalDate').textContent     = button.getAttribute('data-date');

    const modal = document.getElementById('detailsModal');
    modal.classList.add('is-open');
    document.body.classList.add('modal-locked');

    // Focus the close button for accessibility
    requestAnimationFrame(() => {
        modal.querySelector('.modal-close')?.focus();
    });
}

function closeModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-locked');

    // Return focus to trigger element
    if (lastFocused) {
        requestAnimationFrame(() => lastFocused.focus());
        lastFocused = null;
    }
}


// ── INIT ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initSearch);
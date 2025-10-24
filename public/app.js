const apiBase = '/api/patients';


async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return res.json();
}

async function savePatient() {
    const form = document.getElementById('patient-form');
    const data = {
        name: form.name.value.trim(),
        age: form.age.value ? Number(form.age.value) : undefined,
        gender: form.gender.value.trim(),
        phone: form.phone.value.trim(),
        doctor: form.doctor.value.trim(),
        notes: form.notes.value.trim()
    };

    try {
        if (form.id.value) {
            // Update existing patient
            await fetchJSON(apiBase + '/' + form.id.value, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create new patient
            await fetchJSON(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        form.reset(); // clear form after save
        loadPatients(document.getElementById('search').value); // refresh list
    } catch (err) {
        alert('Save error: ' + err.message);
    }
}

// Attach savePatient function to form submit
document.getElementById('patient-form').addEventListener('submit', (e) => {
    e.preventDefault(); // prevent page reload
    savePatient();       // call function to send data to backend
});

async function loadPatients(filter = '') {
    try {
        const patients = await fetchJSON(apiBase);
        const list = document.getElementById('list');
        list.innerHTML = '';
        const q = filter.toLowerCase();
        patients.filter(p => !q || p.name.toLowerCase().includes(q) || (p.doctor || '').toLowerCase().includes(q))
            .forEach(p => {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `
<strong>${escapeHtml(p.name)}</strong> — <span class="meta">Doctor: ${escapeHtml(p.doctor)}</span>
<div class="meta">Age: ${p.age || '-'} | Gender: ${p.gender || '-'} | Phone: ${p.phone || '-'}</div>
<div>${escapeHtml(p.notes || '')}</div>
<div class="actions">
<button onclick='editPatient("${p._id}")'>Edit</button>
<button onclick='deletePatient("${p._id}")'>Delete</button>
</div>
`;
                list.appendChild(div);
            });
    } catch (err) {
        alert('Error loading patients: ' + err.message);
    }
}


function escapeHtml(s) { if (!s) return ''; return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[c]); }


async function editPatient(id) {
    try {
        const p = await fetchJSON(apiBase + '/' + id);
        const form = document.getElementById('patient-form');
        form.id.value = p._id;
        form.name.value = p.name || '';
        form.age.value = p.age || '';
        form.gender.value = p.gender || '';
        form.phone.value = p.phone || '';
        form.doctor.value = p.doctor || '';
        form.notes.value = p.notes || '';
    } catch (err) { alert('Error: ' + err.message); }
}


async function deletePatient(id) {
    if (!confirm('Delete this patient?')) return;
    try {
        await fetchJSON(apiBase + '/' + id, { method: 'DELETE' });
        loadPatients(document.getElementById('search').value);
    } catch (err) { alert(err.message); }
}


loadPatients();

// ========== DASHBOARD JAVASCRIPT ==========
// For pages: parent-dashboard.php, my-children.php, book-appointment.php, 
// vaccination-history.php, hospital-dashboard.php, admin-dashboard.php

// ========== 1. FLOATING SHAPES (Background) ==========
function createFloatingShapes() {
  const container = document.getElementById('floatingShapes');
  if (!container) return;
  container.innerHTML = '';
  const shapes = ['shape-1', 'shape-2', 'shape-3', 'shape-4'];
  shapes.forEach(shape => {
    const div = document.createElement('div');
    div.className = shape;
    container.appendChild(div);
  });
}

// ========== 2. BUBBLES ANIMATION (for book appointment) ==========
function createBubbles() {
  const container = document.getElementById('bubbles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    let bubble = document.createElement('div');
    bubble.classList.add('bubble');
    let size = Math.random() * 60 + 20;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.animationDuration = Math.random() * 8 + 6 + 's';
    bubble.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(bubble);
  }
}

// ========== 3. MODAL FUNCTIONS ==========
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// ========== 4. LOGOUT FUNCTION ==========
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'logout.php';
  }
}

// ========== 5. PRINT CERTIFICATE ==========
function printCertificate(id, childName, vaccine, date, hospital) {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
        <html>
        <head>
            <title>Vaccination Certificate</title>
            <style>
                body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #F0ECFF; }
                .certificate { background: white; border-radius: 24px; padding: 40px; width: 600px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 2px solid #5B2EFF; }
                .certificate h1 { color: #5B2EFF; margin-bottom: 10px; }
                .certificate hr { margin: 20px 0; border: 1px solid #DDD6FE; }
                .certificate p { margin: 10px 0; font-size: 16px; }
                .stamp { margin-top: 30px; color: #5B2EFF; font-size: 18px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1><i class="fas fa-shield-virus"></i> ImmunoTrack</h1>
                <h2>Vaccination Certificate</h2>
                <hr>
                <p><strong>Child Name:</strong> ${childName}</p>
                <p><strong>Vaccine:</strong> ${vaccine}</p>
                <p><strong>Date Administered:</strong> ${date}</p>
                <p><strong>Hospital:</strong> ${hospital}</p>
                <hr>
                <div class="stamp">✓ Officially Vaccinated</div>
                <p><small>Certificate ID: ${id}</small></p>
            </div>
            <script>
                window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };
            <\/script>
        </body>
        </html>
    `);
}

// ========== 6. ADMIN DASHBOARD FUNCTIONS ==========
// Data
let parents = JSON.parse(localStorage.getItem("admin_parents") || '[{"id":1,"name":"Sarah Johnson","email":"sarah@email.com","phone":"1234567890","children":2}]');
let hospitals = JSON.parse(localStorage.getItem("admin_hospitals") || '[{"id":1,"name":"City Hospital","address":"123 Health St","phone":"555-1234"},{"id":2,"name":"Green Valley","address":"456 Wellness Ave","phone":"555-9876"}]');
let vaccineStock = JSON.parse(localStorage.getItem("admin_vaccineStock") || '[{"id":1,"name":"DTP Vaccine","stock":"Available","quantity":25},{"id":2,"name":"MMR Vaccine","stock":"Low","quantity":3},{"id":3,"name":"Polio Drops","stock":"Available","quantity":50},{"id":4,"name":"Hepatitis B","stock":"Out of Stock","quantity":0}]');

function getAllAppointments() { return JSON.parse(localStorage.getItem("appointments") || "[]"); }
function saveAllAppointments(data) { localStorage.setItem("appointments", JSON.stringify(data)); }
function saveParents() { localStorage.setItem("admin_parents", JSON.stringify(parents)); }
function saveHospitals() { localStorage.setItem("admin_hospitals", JSON.stringify(hospitals)); }
function saveVaccineStockData() { localStorage.setItem("admin_vaccineStock", JSON.stringify(vaccineStock)); }

function updateStats() {
  let appointments = getAllAppointments();
  const totalParents = document.getElementById("totalParents");
  const totalHospitals = document.getElementById("totalHospitals");
  const totalAppointments = document.getElementById("totalAppointments");
  const totalVaccines = document.getElementById("totalVaccines");
  const recentAppointments = document.getElementById("recentAppointments");

  if (totalParents) totalParents.innerText = parents.length;
  if (totalHospitals) totalHospitals.innerText = hospitals.length;
  if (totalAppointments) totalAppointments.innerText = appointments.length;
  if (totalVaccines) totalVaccines.innerText = vaccineStock.length;

  if (recentAppointments) {
    let recent = appointments.slice(-5).reverse();
    let html = recent.map(a => `<div>${a.childName} - ${a.vaccine} on ${a.date} (${a.status})</div>`).join('');
    recentAppointments.innerHTML = html || "<p>No appointments yet.</p>";
  }
}

function renderParents() {
  const tbody = document.getElementById("parentsTable");
  if (!tbody) return;
  tbody.innerHTML = parents.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.email}</td>
            <td>${p.phone}</td>
            <td>${p.children}</td>
            <td>
                <button class="btn-sm" onclick="editParent(${p.id})">Edit</button>
                <button class="btn-sm btn-danger" onclick="deleteParent(${p.id})">Del</button>
            </td>
        </tr>
    `).join('');
}

function renderHospitals() {
  const tbody = document.getElementById("hospitalsTable");
  if (!tbody) return;
  tbody.innerHTML = hospitals.map(h => `
        <tr>
            <td>${h.name}</td>
            <td>${h.address}</td>
            <td>${h.phone}</td>
            <td>
                <button class="btn-sm" onclick="editHospital(${h.id})">Edit</button>
                <button class="btn-sm btn-danger" onclick="deleteHospital(${h.id})">Del</button>
            </td>
        </tr>
    `).join('');
}

function renderAppointments() {
  const tbody = document.getElementById("allAppointmentsTable");
  if (!tbody) return;
  let appointments = getAllAppointments();
  tbody.innerHTML = appointments.map(a => `
        <tr>
            <td>${a.childName}</td>
            <td>${a.vaccine}</td>
            <td>${a.hospital}</td>
            <td>${a.date}</td>
            <td>${a.status}</td>
        </tr>
    `).join('');
}

function renderVaccineStock() {
  const tbody = document.getElementById("vaccineStockTable");
  const vaccineSelect = document.getElementById("vaccineSelect");
  if (tbody) {
    tbody.innerHTML = vaccineStock.map(v => `
            <tr>
                <td>${v.name}</td>
                <td>${v.stock}</td>
                <td>${v.quantity}</td>
                <td><button class="btn-sm" onclick="editVaccine(${v.id})">Edit</button></td>
            </tr>
        `).join('');
  }
  if (vaccineSelect) {
    vaccineSelect.innerHTML = vaccineStock.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
  }
}

// CRUD Parents
let currentParentId = null;
function openParentModal(editId = null) {
  currentParentId = editId;
  const parentName = document.getElementById("parentName");
  const parentEmail = document.getElementById("parentEmail");
  const parentPhone = document.getElementById("parentPhone");

  if (editId) {
    let p = parents.find(p => p.id == editId);
    parentName.value = p.name;
    parentEmail.value = p.email;
    parentPhone.value = p.phone;
  } else {
    parentName.value = "";
    parentEmail.value = "";
    parentPhone.value = "";
  }
  document.getElementById("parentModal").style.display = "flex";
}

function saveParent() {
  let name = document.getElementById("parentName").value;
  let email = document.getElementById("parentEmail").value;
  let phone = document.getElementById("parentPhone").value;

  if (currentParentId) {
    let index = parents.findIndex(p => p.id == currentParentId);
    parents[index] = { ...parents[index], name, email, phone };
  } else {
    let newId = parents.length ? Math.max(...parents.map(p => p.id)) + 1 : 1;
    parents.push({ id: newId, name, email, phone, children: 0 });
  }
  saveParents();
  renderParents();
  updateStats();
  closeModal('parentModal');
  currentParentId = null;
}

function editParent(id) { openParentModal(id); }
function deleteParent(id) { if (confirm("Delete parent?")) { parents = parents.filter(p => p.id != id); saveParents(); renderParents(); updateStats(); } }

// CRUD Hospitals
let currentHospitalId = null;
function openHospitalModal(editId = null) {
  currentHospitalId = editId;
  const hospitalName = document.getElementById("hospitalName");
  const hospitalAddress = document.getElementById("hospitalAddress");
  const hospitalPhone = document.getElementById("hospitalPhone");

  if (editId) {
    let h = hospitals.find(h => h.id == editId);
    hospitalName.value = h.name;
    hospitalAddress.value = h.address;
    hospitalPhone.value = h.phone;
  } else {
    hospitalName.value = "";
    hospitalAddress.value = "";
    hospitalPhone.value = "";
  }
  document.getElementById("hospitalModal").style.display = "flex";
}

function saveHospital() {
  let name = document.getElementById("hospitalName").value;
  let address = document.getElementById("hospitalAddress").value;
  let phone = document.getElementById("hospitalPhone").value;

  if (currentHospitalId) {
    let index = hospitals.findIndex(h => h.id == currentHospitalId);
    hospitals[index] = { ...hospitals[index], name, address, phone };
  } else {
    let newId = hospitals.length ? Math.max(...hospitals.map(h => h.id)) + 1 : 1;
    hospitals.push({ id: newId, name, address, phone });
  }
  saveHospitals();
  renderHospitals();
  updateStats();
  closeModal('hospitalModal');
  currentHospitalId = null;
}

function editHospital(id) { openHospitalModal(id); }
function deleteHospital(id) { if (confirm("Delete hospital?")) { hospitals = hospitals.filter(h => h.id != id); saveHospitals(); renderHospitals(); updateStats(); } }

// Vaccine Stock
let currentVaccineId = null;
function openVaccineModal(editId = null) {
  currentVaccineId = editId;
  const vaccineQuantity = document.getElementById("vaccineQuantity");
  const vaccineStockStatus = document.getElementById("vaccineStockStatus");
  const vaccineSelect = document.getElementById("vaccineSelect");

  if (editId) {
    let v = vaccineStock.find(v => v.id == editId);
    vaccineQuantity.value = v.quantity;
    vaccineStockStatus.value = v.stock;
    vaccineSelect.value = v.id;
  } else {
    vaccineQuantity.value = "";
    vaccineStockStatus.value = "Available";
  }
  document.getElementById("vaccineModal").style.display = "flex";
}

function saveVaccineStock() {
  let vid = parseInt(document.getElementById("vaccineSelect").value);
  let qty = parseInt(document.getElementById("vaccineQuantity").value);
  let status = document.getElementById("vaccineStockStatus").value;
  let index = vaccineStock.findIndex(v => v.id == vid);
  if (index !== -1) {
    vaccineStock[index].quantity = qty;
    vaccineStock[index].stock = status;
  }
  saveVaccineStockData();
  renderVaccineStock();
  closeModal('vaccineModal');
}

function editVaccine(id) { openVaccineModal(id); }

// Reports
function generateReport(type) {
  let appointments = getAllAppointments();
  let output = `<h4>${type.toUpperCase()} Report</h4><ul>`;
  if (type === 'weekly') {
    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    let filtered = appointments.filter(a => new Date(a.date) >= lastWeek);
    output += `<li>Appointments last 7 days: ${filtered.length}</li>`;
  } else {
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    let filtered = appointments.filter(a => new Date(a.date) >= lastMonth);
    output += `<li>Appointments last 30 days: ${filtered.length}</li>`;
  }
  output += `<li>Total Parents: ${parents.length}</li><li>Total Hospitals: ${hospitals.length}</li><li>Vaccine Stock: ${vaccineStock.map(v => v.name + ": " + v.stock).join(", ")}</li></ul>`;
  document.getElementById("reportOutput").innerHTML = output;
}

function showAdminSection(section) {
  let sections = ['overviewSection', 'parentsSection', 'hospitalsSection', 'appointmentsSection', 'vaccinesSection', 'reportsSection'];
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = 'none';
  });
  const sectionEl = document.getElementById(section + 'Section');
  if (sectionEl) sectionEl.style.display = 'block';
  if (section === 'parents') renderParents();
  if (section === 'hospitals') renderHospitals();
  if (section === 'appointments') renderAppointments();
  if (section === 'vaccines') renderVaccineStock();
  if (section === 'overview') updateStats();
}

// ========== 7. BOOK APPOINTMENT FUNCTIONS ==========
let childrenList = [
  { id: 1, name: "Aisha Khan", dob: "2022-03-15" },
  { id: 2, name: "Rayan Ahmed", dob: "2023-07-20" }
];

let vaccinesList = [
  { id: 1, name: "DTP Vaccine", description: "Diphtheria, Tetanus, Pertussis" },
  { id: 2, name: "MMR Vaccine", description: "Measles, Mumps, Rubella" },
  { id: 3, name: "Polio Drops", description: "Oral Polio Vaccine" },
  { id: 4, name: "Hepatitis B", description: "Hepatitis B Vaccine" },
  { id: 5, name: "Flu Shot", description: "Influenza Vaccine" }
];

let hospitalsList = [
  { id: 1, name: "City Hospital", address: "123 Health St, Downtown", phone: "555-1234" },
  { id: 2, name: "Green Valley Medical", address: "456 Wellness Ave, Westside", phone: "555-9876" },
  { id: 3, name: "Sunrise Clinic", address: "789 Care Lane, Eastside", phone: "555-4567" }
];

let selectedChild = null;
let selectedVaccine = null;
let selectedHospital = null;
let selectedDate = null;
let selectedTime = null;
let currentStep = 1;

function populateChildren() {
  const select = document.getElementById("childSelect");
  if (!select) return;
  select.innerHTML = '<option value="">-- Choose Child --</option>';
  childrenList.forEach(child => {
    let option = document.createElement("option");
    option.value = child.id;
    option.textContent = child.name;
    select.appendChild(option);
  });
}

function renderVaccinesBooking() {
  const container = document.getElementById("vaccineOptions");
  if (!container) return;
  container.innerHTML = "";
  vaccinesList.forEach(v => {
    let div = document.createElement("div");
    div.className = "vaccine-card";
    div.setAttribute("data-id", v.id);
    div.innerHTML = `<strong>${v.name}</strong><br><small>${v.description}</small>`;
    div.onclick = () => {
      document.querySelectorAll(".vaccine-card").forEach(c => c.classList.remove("selected"));
      div.classList.add("selected");
      selectedVaccine = v;
    };
    container.appendChild(div);
  });
}

function renderHospitalsBooking() {
  const container = document.getElementById("hospitalList");
  if (!container) return;
  container.innerHTML = "";
  hospitalsList.forEach(h => {
    let div = document.createElement("div");
    div.className = "hospital-card";
    div.innerHTML = `<strong>${h.name}</strong><br>📍 ${h.address}<br>📞 ${h.phone}`;
    div.onclick = () => {
      document.querySelectorAll(".hospital-card").forEach(c => c.classList.remove("selected"));
      div.classList.add("selected");
      selectedHospital = h;
    };
    container.appendChild(div);
  });
}

function bindTimeSlots() {
  let slots = document.querySelectorAll(".time-slot");
  slots.forEach(slot => {
    slot.onclick = () => {
      slots.forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
      selectedTime = slot.getAttribute("data-time");
    };
  });
}

function showStep(step) {
  for (let i = 1; i <= 5; i++) {
    let el = document.getElementById(`step${i}`);
    if (el) el.style.display = i === step ? "block" : "none";
  }
  for (let i = 1; i <= 5; i++) {
    let ind = document.getElementById(`step${i}Indicator`);
    if (ind) {
      if (i < step) ind.classList.add("completed");
      else ind.classList.remove("completed");
      if (i === step) ind.classList.add("active");
      else ind.classList.remove("active");
    }
  }
  currentStep = step;
}

function validateStep(step) {
  if (step === 1) {
    let childId = document.getElementById("childSelect").value;
    if (!childId) { alert("Please select a child."); return false; }
    selectedChild = childrenList.find(c => c.id == childId);
    return true;
  }
  if (step === 2) {
    if (!selectedVaccine) { alert("Please select a vaccine."); return false; }
    return true;
  }
  if (step === 3) {
    if (!selectedHospital) { alert("Please select a hospital."); return false; }
    return true;
  }
  if (step === 4) {
    let date = document.getElementById("appointmentDate").value;
    if (!date) { alert("Please select a date."); return false; }
    if (!selectedTime) { alert("Please select a time slot."); return false; }
    selectedDate = date;
    return true;
  }
  return true;
}

function nextStep(step) {
  if (validateStep(step)) {
    if (step === 4) {
      buildSummary();
    }
    if (step + 1 <= 5) showStep(step + 1);
  }
}

function prevStep(step) {
  if (step - 1 >= 1) showStep(step - 1);
}

function buildSummary() {
  let summaryDiv = document.getElementById("summary");
  if (summaryDiv) {
    summaryDiv.innerHTML = `
            <div class="summary-row"><strong>Child:</strong> ${selectedChild.name}</div>
            <div class="summary-row"><strong>Vaccine:</strong> ${selectedVaccine.name}</div>
            <div class="summary-row"><strong>Hospital:</strong> ${selectedHospital.name}</div>
            <div class="summary-row"><strong>Address:</strong> ${selectedHospital.address}</div>
            <div class="summary-row"><strong>Date:</strong> ${selectedDate}</div>
            <div class="summary-row"><strong>Time:</strong> ${selectedTime}</div>
        `;
  }
}

function confirmBooking() {
  let bookings = JSON.parse(localStorage.getItem("appointments") || "[]");
  let newBooking = {
    id: Date.now(),
    childId: selectedChild.id,
    childName: selectedChild.name,
    vaccine: selectedVaccine.name,
    hospital: selectedHospital.name,
    date: selectedDate,
    time: selectedTime,
    status: "Scheduled"
  };
  bookings.push(newBooking);
  localStorage.setItem("appointments", JSON.stringify(bookings));
  alert("✅ Appointment booked successfully!");
  resetBooking();
  showStep(1);
}

function resetBooking() {
  selectedChild = null;
  selectedVaccine = null;
  selectedHospital = null;
  selectedDate = null;
  selectedTime = null;
  const childSelect = document.getElementById("childSelect");
  if (childSelect) childSelect.value = "";
  document.querySelectorAll(".vaccine-card").forEach(c => c.classList.remove("selected"));
  document.querySelectorAll(".hospital-card").forEach(c => c.classList.remove("selected"));
  document.querySelectorAll(".time-slot").forEach(c => c.classList.remove("selected"));
  const appointmentDate = document.getElementById("appointmentDate");
  if (appointmentDate) appointmentDate.value = "";
}

// ========== 8. VACCINATION HISTORY FUNCTIONS ==========
let childrenHistory = [
  { id: 1, name: "Aisha Khan" },
  { id: 2, name: "Rayan Ahmed" }
];

function getAppointments() {
  let saved = localStorage.getItem("appointments");
  return saved ? JSON.parse(saved) : [];
}

function saveAppointmentsHistory(appointments) {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

function renderHistory() {
  let appointments = getAppointments();
  let filterChild = document.getElementById("filterChild");
  let filterStatus = document.getElementById("filterStatus");

  let childFilter = filterChild ? filterChild.value : "all";
  let statusFilter = filterStatus ? filterStatus.value : "all";

  let filtered = appointments.filter(apt => {
    if (childFilter !== "all" && apt.childId != childFilter) return false;
    if (statusFilter !== "all" && apt.status !== statusFilter) return false;
    return true;
  });

  let total = appointments.length;
  let completed = appointments.filter(a => a.status === "Completed").length;
  let scheduled = appointments.filter(a => a.status === "Scheduled").length;

  const totalCount = document.getElementById("totalCount");
  const completedCount = document.getElementById("completedCount");
  const scheduledCount = document.getElementById("scheduledCount");
  if (totalCount) totalCount.innerText = total;
  if (completedCount) completedCount.innerText = completed;
  if (scheduledCount) scheduledCount.innerText = scheduled;

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No matching appointments.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(apt => {
    let child = childrenHistory.find(c => c.id == apt.childId) || { name: apt.childName || "Unknown" };
    let statusClass = "";
    if (apt.status === "Scheduled") statusClass = "status-scheduled";
    else if (apt.status === "Completed") statusClass = "status-completed";
    else statusClass = "status-missed";

    return `
            <tr>
                <td>${child.name}</td>
                <td>${apt.vaccine}</td>
                <td>${apt.hospital}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td><span class="status-badge ${statusClass}">${apt.status}</span></td>
                <td>
                    ${apt.status === "Scheduled" ? `<button class="btn-print" onclick="markCompleted(${apt.id})"><i class="fas fa-check-circle"></i> Mark Done</button>` : ''}
                    <button class="btn-print" onclick="printCertificateHistory(${apt.id})"><i class="fas fa-print"></i> Cert</button>
                </td>
            </tr>
        `;
  }).join('');
}

function markCompleted(id) {
  let appointments = getAppointments();
  let index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = "Completed";
    saveAppointmentsHistory(appointments);
    renderHistory();
    alert("Appointment marked as Completed!");
  }
}

function printCertificateHistory(id) {
  let appointments = getAppointments();
  let apt = appointments.find(a => a.id === id);
  if (apt && apt.status === "Completed") {
    printCertificate(apt.id, apt.childName, apt.vaccine, apt.date, apt.hospital);
  } else {
    alert("Certificate only available for completed vaccinations.");
  }
}

function populateChildFilter() {
  let select = document.getElementById("filterChild");
  if (!select) return;
  select.innerHTML = '<option value="all">All Children</option>';
  childrenHistory.forEach(child => {
    let option = document.createElement("option");
    option.value = child.id;
    option.textContent = child.name;
    select.appendChild(option);
  });
}

function addSampleDataIfEmpty() {
  let appointments = getAppointments();
  if (appointments.length === 0) {
    let sample = [
      { id: Date.now(), childId: 1, childName: "Aisha Khan", vaccine: "Polio Drops", hospital: "City Hospital", date: "2024-05-15", time: "10:00 AM", status: "Completed" },
      { id: Date.now() + 1, childId: 2, childName: "Rayan Ahmed", vaccine: "DTP Vaccine", hospital: "Green Valley Medical", date: "2024-06-20", time: "11:00 AM", status: "Scheduled" }
    ];
    localStorage.setItem("appointments", JSON.stringify(sample));
  }
}

// ========== 9. HOSPITAL DASHBOARD FUNCTIONS ==========
let hospitalId = 1;
let hospitalName = "City Hospital";

let vaccineStockHospital = [
  { name: "DTP Vaccine", stock: "Available", quantity: 25 },
  { name: "MMR Vaccine", stock: "Low", quantity: 3 },
  { name: "Polio Drops", stock: "Available", quantity: 50 },
  { name: "Hepatitis B", stock: "Out of Stock", quantity: 0 },
  { name: "Flu Shot", stock: "Available", quantity: 12 }
];

function getHospitalAppointments() {
  let all = JSON.parse(localStorage.getItem("appointments") || "[]");
  return all.filter(apt => apt.hospital === hospitalName);
}

function updateHospitalStats() {
  let appointments = getHospitalAppointments();
  let today = new Date().toISOString().split('T')[0];
  let todayApts = appointments.filter(apt => apt.date === today);
  const todayCount = document.getElementById("todayCount");
  const totalCount = document.getElementById("totalCount");
  if (todayCount) todayCount.innerText = todayApts.length;
  if (totalCount) totalCount.innerText = appointments.length;
}

function showDashboard() {
  const appointmentsDiv = document.getElementById('appointments');
  const vaccineStockDiv = document.getElementById('vaccineStock');
  if (appointmentsDiv) appointmentsDiv.style.display = 'none';
  if (vaccineStockDiv) vaccineStockDiv.style.display = 'none';
}

function renderHospitalAppointments() {
  let appointments = getHospitalAppointments();
  let today = new Date().toISOString().split('T')[0];
  let todayApts = appointments.filter(apt => apt.date === today);
  let container = document.getElementById("appointmentsList");
  if (!container) return;

  if (todayApts.length === 0) {
    container.innerHTML = "<p>No appointments for today.</p>";
    return;
  }
  container.innerHTML = todayApts.map(apt => `
        <div class="appointment-card">
            <div><strong>${apt.childName}</strong> - ${apt.vaccine}<br><small>${apt.time}</small></div>
            <div>
                <select id="status-${apt.id}" class="status-select">
                    <option ${apt.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                    <option ${apt.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option ${apt.status === 'Missed' ? 'selected' : ''}>Missed</option>
                </select>
                <button class="btn-update" onclick="updateAppointmentStatus(${apt.id})">Update</button>
            </div>
        </div>
    `).join('');
}

function updateAppointmentStatus(appointmentId) {
  let newStatus = document.getElementById(`status-${appointmentId}`).value;
  let appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  let index = appointments.findIndex(a => a.id === appointmentId);
  if (index !== -1) {
    appointments[index].status = newStatus;
    localStorage.setItem("appointments", JSON.stringify(appointments));
    alert("Status updated to " + newStatus);
    renderHospitalAppointments();
    updateHospitalStats();
  }
}

function renderHospitalVaccineStock() {
  let container = document.getElementById("vaccineStock");
  if (!container) return;
  container.innerHTML = vaccineStockHospital.map(v => `
        <div class="vaccine-item">
            <span><strong>${v.name}</strong> - ${v.stock}</span>
            <span>${v.quantity} doses left</span>
        </div>
    `).join('');
}

function showHospitalTab(tab) {
  const appointmentsDiv = document.getElementById('appointments');
  const vaccineStockDiv = document.getElementById('vaccineStock');
  if (tab === 'appointments') {
    if (appointmentsDiv) appointmentsDiv.style.display = 'block';
    if (vaccineStockDiv) vaccineStockDiv.style.display = 'none';
  } else if (tab === 'vaccine') {
    if (appointmentsDiv) appointmentsDiv.style.display = 'none';
    if (vaccineStockDiv) vaccineStockDiv.style.display = 'block';
  }
}

function addSampleAppointments() {
  let existing = getHospitalAppointments();
  if (existing.length === 0) {
    let all = JSON.parse(localStorage.getItem("appointments") || "[]");
    let today = new Date().toISOString().split('T')[0];
    let newAppts = [
      { id: Date.now(), childId: 1, childName: "Aisha Khan", vaccine: "DTP Vaccine", hospital: hospitalName, date: today, time: "10:00 AM", status: "Scheduled" },
      { id: Date.now() + 1, childId: 2, childName: "Rayan Ahmed", vaccine: "Polio Drops", hospital: hospitalName, date: today, time: "11:30 AM", status: "Scheduled" }
    ];
    all.push(...newAppts);
    localStorage.setItem("appointments", JSON.stringify(all));
  }
}

// ========== 10. MY CHILDREN FUNCTIONS ==========
let myChildrenList = [
  { id: 1, name: "Aisha Khan", dob: "2022-03-15", bloodGroup: "B+", allergies: "None", vaccinesCompleted: 4, totalVaccines: 8 },
  { id: 2, name: "Rayan Ahmed", dob: "2023-07-20", bloodGroup: "O+", allergies: "Peanuts", vaccinesCompleted: 2, totalVaccines: 8 }
];
let editChildId = null;

function calculateAge(dob) {
  let birthDate = new Date(dob);
  let diff = new Date() - birthDate;
  let ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970) + " years";
}

function renderMyChildren() {
  let container = document.getElementById("childrenContainer");
  if (!container) return;
  if (myChildrenList.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-child fa-3x"></i><p>No children added yet. Click "Add Child" to start.</p></div>`;
    return;
  }
  container.innerHTML = myChildrenList.map(child => {
    let age = calculateAge(child.dob);
    let percent = (child.vaccinesCompleted / child.totalVaccines) * 100;
    return `
            <div class="child-card" data-id="${child.id}">
                <div class="child-avatar">
                    <div class="avatar-icon"><i class="fas fa-baby"></i></div>
                    <div class="child-info">
                        <h3>${child.name}</h3>
                        <p><i class="fas fa-calendar-alt"></i> ${age}</p>
                    </div>
                </div>
                <div class="details">
                    <div class="detail-row"><span>Blood Group:</span><strong>${child.bloodGroup}</strong></div>
                    <div class="detail-row"><span>Allergies:</span><strong>${child.allergies}</strong></div>
                    <div class="detail-row"><span>Vaccination Progress:</span><span>${child.vaccinesCompleted}/${child.totalVaccines}</span></div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
                </div>
                <div class="card-buttons">
                    <button class="btn-history" onclick="viewChildHistory(${child.id})"><i class="fas fa-eye"></i> History</button>
                    <button class="btn-edit" onclick="editMyChild(${child.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteMyChild(${child.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
  }).join('');
}

function openChildModal(isEdit = false) {
  const modal = document.getElementById("childModal");
  if (!modal) return;
  modal.style.display = "flex";
  if (!isEdit) {
    document.getElementById("modalTitle").innerText = "Add New Child";
    document.getElementById("childName").value = "";
    document.getElementById("childDOB").value = "";
    document.getElementById("childBloodGroup").value = "";
    document.getElementById("childAllergies").value = "";
    editChildId = null;
  }
}

function saveMyChild() {
  let name = document.getElementById("childName").value.trim();
  let dob = document.getElementById("childDOB").value;
  let bloodGroup = document.getElementById("childBloodGroup").value;
  let allergies = document.getElementById("childAllergies").value.trim();

  if (!name || !dob || !bloodGroup) {
    alert("Please fill all required fields.");
    return;
  }

  if (editChildId !== null) {
    let index = myChildrenList.findIndex(c => c.id === editChildId);
    if (index !== -1) {
      myChildrenList[index] = { ...myChildrenList[index], name, dob, bloodGroup, allergies };
    }
  } else {
    let newId = myChildrenList.length > 0 ? Math.max(...myChildrenList.map(c => c.id)) + 1 : 1;
    myChildrenList.push({
      id: newId,
      name,
      dob,
      bloodGroup,
      allergies: allergies || "None",
      vaccinesCompleted: 0,
      totalVaccines: 8
    });
  }
  renderMyChildren();
  closeChildModal();
}

function editMyChild(id) {
  let child = myChildrenList.find(c => c.id === id);
  if (child) {
    editChildId = id;
    document.getElementById("modalTitle").innerText = "Edit Child";
    document.getElementById("childName").value = child.name;
    document.getElementById("childDOB").value = child.dob;
    document.getElementById("childBloodGroup").value = child.bloodGroup;
    document.getElementById("childAllergies").value = child.allergies;
    openChildModal(true);
  }
}

function deleteMyChild(id) {
  if (confirm("Are you sure you want to delete this child?")) {
    myChildrenList = myChildrenList.filter(c => c.id !== id);
    renderMyChildren();
  }
}

function viewChildHistory(id) {
  alert("Vaccination history will be shown here.");
}

function closeChildModal() {
  const modal = document.getElementById("childModal");
  if (modal) modal.style.display = "none";
}

// ========== 11. INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function () {
  // Floating shapes
  if (document.getElementById('floatingShapes')) {
    createFloatingShapes();
  }

  // Bubbles for book appointment
  if (document.getElementById('bubbles')) {
    createBubbles();
  }

  // My Children page
  if (document.getElementById("childrenContainer")) {
    const addBtn = document.getElementById("openAddModalBtn");
    const saveBtn = document.getElementById("saveChildBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    if (addBtn) addBtn.onclick = () => openChildModal(false);
    if (saveBtn) saveBtn.onclick = saveMyChild;
    if (closeBtn) closeBtn.onclick = closeChildModal;
    window.onclick = function (e) {
      const modal = document.getElementById("childModal");
      if (e.target === modal) closeChildModal();
    };
    renderMyChildren();
  }

  // Book Appointment page
  if (document.getElementById("childSelect")) {
    let today = new Date().toISOString().split('T')[0];
    const appointmentDate = document.getElementById("appointmentDate");
    if (appointmentDate) appointmentDate.min = today;
    populateChildren();
    renderVaccinesBooking();
    renderHospitalsBooking();
    bindTimeSlots();
    showStep(1);
  }

  // Vaccination History page
  if (document.getElementById("filterChild")) {
    const applyBtn = document.getElementById("applyFilterBtn");
    const printBtn = document.getElementById("printBtn");
    if (applyBtn) applyBtn.addEventListener("click", renderHistory);
    if (printBtn) printBtn.addEventListener("click", () => window.print());
    addSampleDataIfEmpty();
    populateChildFilter();
    renderHistory();
  }

  // Hospital Dashboard
  if (document.getElementById("appointmentsList")) {
    addSampleAppointments();
    updateHospitalStats();
    renderHospitalAppointments();
    renderHospitalVaccineStock();
  }

  // Admin Dashboard
  if (document.getElementById("totalParents")) {
    updateStats();
    renderParents();
    renderHospitals();
    renderVaccineStock();
  }
});

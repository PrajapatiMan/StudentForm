document.addEventListener("DOMContentLoaded", () => {
  const rollNo = document.getElementById("rollNo");
  const formFields = ["fullName", "className", "birthDate", "address", "enrollDate"];
  const saveBtn = document.getElementById("saveBtn");
  const updateBtn = document.getElementById("updateBtn");
  const resetBtn = document.getElementById("resetBtn");

  const enableFields = () => formFields.forEach(id => document.getElementById(id).disabled = false);
  const disableFields = () => formFields.forEach(id => document.getElementById(id).disabled = true);
  const resetButtons = () => {
    saveBtn.disabled = true;
    updateBtn.disabled = true;
    resetBtn.disabled = true;
  };

  disableFields();
  resetButtons();
  rollNo.focus();

  rollNo.addEventListener("change", () => {
    const value = rollNo.value.trim();
    if (!value) return;

    fetch(`handler.php?rollNo=${value}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          enableFields();
          rollNo.disabled = true;
          updateBtn.disabled = false;
          resetBtn.disabled = false;

          document.getElementById("fullName").value = data.FullName;
          document.getElementById("className").value = data.Class;
          document.getElementById("birthDate").value = data.BirthDate;
          document.getElementById("address").value = data.Address;
          document.getElementById("enrollDate").value = data.EnrollmentDate;
        } else {
          enableFields();
          saveBtn.disabled = false;
          resetBtn.disabled = false;
          document.getElementById("fullName").focus();
        }
      });
  });

  saveBtn.addEventListener("click", () => {
    const payload = getFormData();
    if (!validateForm(payload)) return alert("Please fill all fields.");

    fetch("handler.php", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action: "save", ...payload })
    })
    .then(res => res.text())
    .then(alert);
  });

  updateBtn.addEventListener("click", () => {
    const payload = getFormData();
    if (!validateForm(payload)) return alert("Please fill all fields.");

    fetch("handler.php", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action: "update", ...payload })
    })
    .then(res => res.text())
    .then(alert);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("studentForm").reset();
    rollNo.disabled = false;
    disableFields();
    resetButtons();
    rollNo.focus();
  });

  function getFormData() {
    return {
      rollNo: rollNo.value,
      FullName: document.getElementById("fullName").value,
      Class: document.getElementById("className").value,
      BirthDate: document.getElementById("birthDate").value,
      Address: document.getElementById("address").value,
      EnrollmentDate: document.getElementById("enrollDate").value
    };
  }

  function validateForm(data) {
    return Object.values(data).every(val => val.trim() !== "");
  }
});
document.addEventListener('DOMContentLoaded', function () {
  // handle delete buttons that open the confirm modal
  const deleteButtons = document.querySelectorAll('.btn-delete');
  const modalEl = document.getElementById('confirmDeleteModal');
  if (!modalEl) return;
  const bootstrapModal = new bootstrap.Modal(modalEl);
  const confirmForm = document.getElementById('confirmDeleteForm');

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const action = btn.getAttribute('data-action');
      if (action) {
        confirmForm.setAttribute('action', action);
      }
      bootstrapModal.show();
    });
  });
});

((doc) => {
	let modal = doc.querySelector('#modal'),
		backdrop = doc.querySelector('#backdrop'),
		modalTrigger = doc.querySelector('#modal-trigger'),
		closeModal = doc.querySelector('#close-modal'),
		cancelModal = doc.querySelector('#cancel-modal');

	if (!modal || !backdrop || !modalTrigger || !closeModal || !cancelModal) {
		return;
	}

	modalTrigger.addEventListener('click', () => {
		showModal();
	});

	closeModal.addEventListener('click', () => {
		hideModal();
	});

	cancelModal.addEventListener('click', () => {
		hideModal();
	});

	function showModal() {
		modal.classList.add('fade-in-open');
		backdrop.classList.add('backdrop-open');
	}

	function hideModal() {
		modal.classList.remove('fade-in-open');
		backdrop.classList.remove('backdrop-open');
	}

})(document);
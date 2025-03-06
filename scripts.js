document.addEventListener('DOMContentLoaded', () => {
    const confessionForm = document.getElementById('confessionForm');
    const confessionList = document.getElementById('confessionList');

    confessionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const confessionInput = document.getElementById('confessionInput').value;

        if (confessionInput) {
            const response = await fetch('/api/confessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ confession: confessionInput }),
            });

            if (response.ok) {
                confessionForm.reset();
                loadConfessions();
            } else {
                alert('Error submitting confession. Please try again.');
            }
        }
    });

    const loadConfessions = async () => {
        const response = await fetch('/api/confessions');
        const confessions = await response.json();
        renderConfessions(confessions);
    };

    const renderConfessions = (confessions) => {
        confessionList.innerHTML = '';
        confessions.forEach(confession => {
            const confessionItem = document.createElement('div');
            confessionItem.classList.add('confession-item');
            confessionItem.innerHTML = `
                <p>${confession.text}</p>
                <button class="relate-button" data-id="${confession.id}">I can relate to this</button>
                <button class="crazy-button" data-id="${confession.id}">That's crazy</button>
            `;
            confessionList.appendChild(confessionItem);
        });
        addEventListenersToButtons();
    };

    const addEventListenersToButtons = () => {
        const relateButtons = document.querySelectorAll('.relate-button');
        const crazyButtons = document.querySelectorAll('.crazy-button');

        relateButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const confessionId = button.getAttribute('data-id');
                await updateReaction(confessionId, 'relate');
            });
        });

        crazyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const confessionId = button.getAttribute('data-id');
                await updateReaction(confessionId, 'crazy');
            });
        });
    };

    const updateReaction = async (id, type) => {
        const response = await fetch(`/api/confessions/${id}/${type}`, {
            method: 'POST',
        });

        if (!response.ok) {
            alert('Error updating reaction. Please try again.');
        }
    };

    loadConfessions();
});
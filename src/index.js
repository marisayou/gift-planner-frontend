const recipientsURL = 'http://localhost:3000/recipients'

document.addEventListener('DOMContentLoaded', function() {

    const recipientsList = document.getElementById('recipientsList');
    const addRecipientModal = document.getElementById('addRecipientModal');
    const addRecipientForm = document.getElementById('addRecipientForm');

    // get recipients from db
    getRecipients()
    function getRecipients() {
        fetch(recipientsURL)
        .then(res => res.json())
        .then(recipients => recipients.forEach(recipient => addRecipientToList(recipient)))
    }

    // add recipient using modal form
    addRecipientForm.addEventListener('submit', addRecipient);

    function addRecipient(e) {
        e.preventDefault();

        // close modal

        const name = document.getElementById('recipientName').value;
        const budget = document.getElementById('recipientBudget').value;
        
        addRecipientForm.reset();
        addRecipientModal.querySelector('button.close').click();

        const configObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({name, budget})
        };
        fetch(recipientsURL, configObj)
        .then(res => res.json())
        .then(recipient => addRecipientToList(recipient));
        
    }

    function addRecipientToList(recipient) {
        const recipientLi = document.createElement('li');
        recipientLi.id = `recipient-${recipient.id}`
        recipientLi.className = 'list-group-item';
        recipientLi.innerText = recipient.name
        recipientsList.appendChild(recipientLi);
    }

    // click on recipient to view his/her lists
    recipientsList.addEventListener('click', e => {
        if (e.target.tagName === "LI") {
            renderLists(e.target.id)
        }
    });

    function renderLists(recipientId) {
        console.log(recipientId)
    }

})
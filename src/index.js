const recipientsURL = 'http://localhost:3000/recipients'
const itemsURL = 'http://localhost:3000/items'

document.addEventListener('DOMContentLoaded', function() {
    // consts
    const recipientsList = document.getElementById('recipientsList');
    const addRecipientModal = document.getElementById('addRecipientModal');
    const addRecipientForm = document.getElementById('addRecipientForm');
    let allRecipients; 

    const cartIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        <path fill-rule="evenodd" d="M11.354 5.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708 0z"/>
    </svg>`;

    const cartIcon2 = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>`;

    const removeIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
    </svg>`;

    const removeIcon2 = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>`;

    // get recipients from db
    getRecipients();

    function getRecipients() {
        return fetch(recipientsURL)
        .then(res => res.json())
        .then(recipients => {
            recipients.forEach(recipient => addRecipientToList(recipient));
            allRecipients = recipients;
            if (recipients.length > 0) {
                renderRecipient(recipients[0]);
            }
        });
    }

    // add recipient using modal form
    addRecipientForm.addEventListener('submit', addRecipient);

    function addRecipient(e) {
        e.preventDefault();

        const name = document.getElementById('recipientName').value;
        const budget = document.getElementById('recipientBudget').value;

        // reset form and close modal
        addRecipientForm.reset();
        addRecipientModal.querySelector('button.close').click();

        // TODO: check that float has max of 2 decimal places
        if (name === "" || budget === "") {
            return; // TODO: error message
            
        }

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
        .then(recipient => {
            addRecipientToList(recipient);
            allRecipients.push(recipient);
            if (allRecipients.length === 1) {
                renderRecipient(recipient);
            }
        });
        
    }

    function addRecipientToList(recipient) {
        const recipientLi = document.createElement('li');
        recipientLi.id = `recipient-${recipient.id}`;
        recipientLi.className = 'list-group-item';
        recipientLi.innerText = recipient.name;
        recipientsList.appendChild(recipientLi);
    }

    // click on recipient to view his/her lists
    recipientsList.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            const recipientId = parseInt(e.target.id.slice(10));
            const recipient = allRecipients.find(r => r.id === recipientId);
            renderRecipient(recipient);
        }
    });

    function renderRecipient(recipient) {
        const recipientName = document.getElementById('recipient-name');
        recipientName.innerText = recipient.name;

        const recipientItems = recipient.recipient_items;
        let toBuyItems = [];
        let boughtItems = [];

        for (const item of recipientItems) {
            if (item.bought) {
                boughtItems.push(item);
            }
            else {
                toBuyItems.push(item);
            }
        }
        const toBuyList = document.getElementById('to-buy-list');
        renderListItems(toBuyList, toBuyItems);
        const boughtList = document.getElementById('bought-list');
        renderListItems(boughtList, boughtItems);

    }

    function renderListItems(ul, recipientItems) {
        const listType = ul.id;
        ul.innerHTML = ""
        console.log(ul)
        
        for (let i = 0; i < recipientItems.length; i++) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            const itemRow = document.createElement('div');
            itemRow.className = 'row';

            const itemNameCol = document.createElement('div');
            itemNameCol.className = 'col'; 

            const itemPriceCol = document.createElement('div');
            itemPriceCol.className = 'col text-right';

            const cartBtnCol = document.createElement('div');
            if (listType === 'to-buy-list') {
                cartBtnCol.className = 'col-1';
                cartBtnCol.innerHTML = cartIcon2;
            }

            const removeBtnCol = document.createElement('div');
            removeBtnCol.className = 'col-1';
            removeBtnCol.innerHTML = removeIcon;

            fetch(itemsURL + '/' + recipientItems[i].item_id)
            .then(res => res.json())
            .then(item => {
                itemNameCol.innerText = item.name;
                itemPriceCol.innerText = `$${item.price.toFixed(2)}`;
                itemRow.append(itemNameCol, itemPriceCol, cartBtnCol, removeBtnCol);
                li.appendChild(itemRow);
                ul.appendChild(li);

            });
        }
    }

})
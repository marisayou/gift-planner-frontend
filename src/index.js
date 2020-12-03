// URLs
const recipientsURL = 'http://localhost:3000/recipients';
const itemsURL = 'http://localhost:3000/items';
const recipientItemsURL = 'http://localhost:3000/recipient_items';

    // consts
    const recipientsList = document.getElementById('recipientsList');
    const addRecipientModal = document.getElementById('addRecipientModal');
    const addRecipientForm = document.getElementById('addRecipientForm');
    const recipientInfo = document.getElementById('recipient-info');

    // global variables
    let toBuyList;
    let boughtList;
    let firstRecipient; 

    // icons for buttons
    const cartIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>`;

    const filledCartIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>`;

    const removeIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
    </svg>`;

    const filledRemoveIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
    </svg>`;

    // event handler for updating recipient info
    const updateForm = document.getElementById('updateRecipientForm');
    updateForm.addEventListener('submit', (ev) => updateRecipient(ev, updateForm.dataset.id));


    // get recipients from db
    getRecipients();

    function getRecipients() {
        recipientsList.innerHTML = '';
        return fetch(recipientsURL)
        .then(res => res.json())
        .then(recipients => {
            handleGetRecipients(recipients);
        })
    }

    function handleGetRecipients(recipients) {
        recipients.forEach(recipient => addRecipientToList(recipient));
        
        if (recipients.length > 0) {
            firstRecipient = recipients[0]
            renderListStructures();
        }
        else {
            const addRecipient = document.createElement('h1');
            addRecipient.className = 'no-recipients';
            addRecipient.innerText = 'Add a Recipient!';
            recipientInfo.appendChild(addRecipient);
        }
    }

    function renderListStructures() {
        recipientInfo.innerHTML = `<div class="row">
            <div class="col">
                <h1 id="recipient-name" ></h1>
            </div>
            <div class="col text-right">
                <h1 id="recipient-budget">$<span></span></h1>
                <h4 id="remaining-budget">Remaining: $<span></span></h4>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title" style="text-align: center;">To Buy</h5>
                        <ul class="list-group" id="to-buy-list"></ul>
                        <br>
                        <div class="text-center">
                            <button class="btn btn-outline-dark" id="add-to-buy-item">Add Item</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title" style="text-align: center;">Bought</h5>
                        <ul class="list-group" id="bought-list"></ul>
                        <br>
                        <p id="total-spent" style="text-align: center;">Total Spent: $<span></span><p>
                        <div class="text-center">
                            <button class="btn btn-outline-dark" id="add-bought-item">Add Item</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <br>
        <div class="row">
            <div class="col text-center" id="recipient-btns">
                <button type="button" class="btn btn-outline-dark" id="update-recipient" data-toggle="modal" data-target="#updateRecipientModal">Update Recipient</button>           
                <button class="btn btn-outline-dark" id="delete-recipient">Delete Recipient</button>
            </div>
            
        </div>
        `;
        
        toBuyList = document.getElementById('to-buy-list');
        boughtList = document.getElementById('bought-list');
        renderRecipient(firstRecipient.id);
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
            body: JSON.stringify({ name, budget })
        };
        fetch(recipientsURL, configObj)
        .then(res => res.json())
        .then(recipient => {
            console.log(recipient);
            addRecipientToList(recipient);
            if (!firstRecipient) {
                firstRecipient = recipient;
                renderListStructures();
            }
            else {
                renderRecipient(recipient.id);
            }
        });
        
    }

    // add a new recipient from the form to the recipients list
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
            renderRecipient(recipientId);
        }
    });

    // render lists for a recipient
    function renderRecipient(recipientId) {
        updateForm.dataset.id = recipientId;

        fetch(recipientsURL + '/' + recipientId)
        .then(res => res.json())
        .then(recipient => {

            const recipientName = document.getElementById('recipient-name');
            recipientName.dataset.id = recipient.id
            recipientName.innerText = recipient.name;

            const recipientBudget = document.getElementById('recipient-budget').children[0];
            recipientBudget.innerText = recipient.budget.toFixed(2);

            const remainingBudget = document.getElementById('remaining-budget').children[0];
            remainingBudget.innerText = parseFloat(recipient.budget - recipient.spent).toFixed(2);

            const amtSpent = document.getElementById('total-spent').children[0];
            amtSpent.innerText = `${recipient.spent.toFixed(2)}`;

            toBuyList.innerHTML = '';
            boughtList.innerHTML = '';

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
            
            renderListItems(toBuyList, toBuyItems);
            renderListItems(boughtList, boughtItems);

            const recipientBtns = document.getElementById('recipient-btns');
            recipientBtns.addEventListener('click', (e) => handleRecipientBtnClick(e, recipient.name, recipient.budget))
        })
    }

    // render list items for a recipient
    function renderListItems(ul, recipientItems) {
        const listType = ul.id;
        
        for (let i = 0; i < recipientItems.length; i++) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.id = recipientItems[i].id;

            const itemRow = document.createElement('div');
            itemRow.className = 'row';

            const itemNameCol = document.createElement('div');
            itemNameCol.className = 'col list-item'; 

            const itemPriceCol = document.createElement('div');
            itemPriceCol.className = 'col text-right list-item';

            const cartBtnCol = document.createElement('div');
            if (listType === 'to-buy-list') {
                cartBtnCol.className = 'col-1 icon-col';

                const cartBtn = document.createElement('button');
                cartBtn.className = 'btn icon-btn cart-btn';
                cartBtn.innerHTML = cartIcon;
                cartBtn.addEventListener('click', handleItemBtnClick);

                cartBtnCol.appendChild(cartBtn);
            }

            const removeBtnCol = document.createElement('div');
            removeBtnCol.className = 'col-1 icon-col';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn icon-btn remove-btn';
            removeBtn.innerHTML = removeIcon;
            // removeBtn.onmouseenter = (e) => e.target.innerHTML = filledRemoveIcon;
            // removeBtn.onmouseleave = (e) => e.target.innerHTML = removeIcon;
            removeBtn.addEventListener('click', handleItemBtnClick);
            
            removeBtnCol.appendChild(removeBtn);

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

    // handle button clicks to move or remove list items
    function handleItemBtnClick(e) {
        const btn = e.currentTarget;
        const li = e.currentTarget.parentElement.parentElement.parentElement;
        const id = li.id;

        // move item from to-buy list to bought list
        if (btn.classList.contains('cart-btn')) {
            const priceStr = li.children[0].children[1].innerText;
            const price = parseFloat(priceStr.slice(1));

            const configObj = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    bought: true,
                    price: price
                })
            };

            fetch(recipientItemsURL + '/' + id, configObj)
            .then(res => res.json())
            .then(recipientItem => {
                // remove list item from to-buy and add to bought list
                boughtLi = li.cloneNode(true);
                boughtLi.children[0].children[2].remove();
                boughtList.appendChild(boughtLi);
                li.remove();

                // update budget
                const recipientId = recipientItem.recipient_id;
                const recipientItemPrice = recipientItem.price;
                updateBudgetAfterBuyingItem(recipientId, recipientItemPrice)
            });
        }

        // remove item from either list
        else if (btn.classList.contains('remove-btn')) {
            fetch(recipientItemsURL + '/' + id, { method: 'DELETE' })
            .then(li.remove())
        };
    }

    function updateBudgetAfterBuyingItem(recipientId, price) {
        const remainingBudget = document.getElementById('remaining-budget').children[0];

        //update total spent
        // const totalSpent = document.getElementById('total-spent');
        // totalSpent.innerText = parseFloat(totalSpent.innerText.slice(1))

        const spent = document.getElementById('total-spent').children[0];
        const newSpent = parseFloat(spent.innerText) + price;
        
        const configObj = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ spent: newSpent })
        };

        fetch(recipientsURL + '/' + recipientId, configObj)
        .then(res => res.json())
        .then(recipient => { 
            spent.innerText = recipient.spent.toFixed(2);
            remainingBudget.innerText = parseFloat(recipient.budget - recipient.spent).toFixed(2);
        });
    }

    // handle click of buttons to update or delete recipients
    function handleRecipientBtnClick(e, name, budget) {
        
        if (e.target.id === 'update-recipient') {
            const updateRecipientName = document.getElementById('updateRecipientName');
            updateRecipientName.value = name;

            const updateRecipientBudget = document.getElementById('updateRecipientBudget');
            updateRecipientBudget.value = budget;
        }
        else if (e.target.id === 'delete-recipient') {
            deleteRecipient();
        }
    }

    // update recipient info
    function updateRecipient(e, id) {
        e.preventDefault();

        const name = document.getElementById('updateRecipientName').value;
        const budget = document.getElementById('updateRecipientBudget').value;

        // close modal form
        updateRecipientModal.querySelector('button.close').click();

        const configObj = {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ name, budget })
        };

        fetch(recipientsURL + '/' + id, configObj)
        .then(res => res.json())
        .then(recipient => {
            // update info on page
            document.getElementById(`recipient-${id}`).innerText = recipient.name;
            document.getElementById('recipient-name').innerText = recipient.name;
        });
    }

    // delete a recipient and his/her recipient items
    function deleteRecipient() {
        const recipientId = document.getElementById('recipient-name').dataset.id;

        fetch(recipientsURL + '/' + recipientId, { method: 'DELETE' })
        .then(location.reload());
    }
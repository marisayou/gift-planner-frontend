// URLs
const recipientsURL = 'http://localhost:3000/recipients';
const recipientItemsURL = 'http://localhost:3000/recipient_items';
const itemsURL = 'http://localhost:3000/items';
const searchItemsURL = 'http://localhost:3000/search_items';
const notesURL = 'http://localhost:3000/notes';

// consts
const recipientsList = document.getElementById('recipientsList');
const addRecipientModal = document.getElementById('addRecipientModal');
const recipientInfo = document.getElementById('recipient-info');

// global variables
let toBuyList;
let boughtList;
let notesList;

// event handler for adding recipient
const addRecipientForm = document.getElementById('addRecipientForm');
addRecipientForm.addEventListener('submit', addRecipient);


// event handler for updating recipient info
const updateForm = document.getElementById('updateRecipientForm');
updateForm.addEventListener('submit', (e) => {
    updateRecipient(e, updateForm.dataset.id)
});
// remove previous error messages when form is cancelled
const updateFormCancelBtn = updateForm.querySelector('button[data-dismiss="modal"]')
updateFormCancelBtn.addEventListener('click', () => {
    const errorMsg = updateForm.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.remove();
    }
})

// event handler for deleting recipient info
const confirmDeleteRecipient = document.getElementById('confirm-delete-recipient');
confirmDeleteRecipient.addEventListener('click', deleteRecipient);

// event handler for adding new note
const newNoteForm = document.getElementById('newNoteForm');
newNoteForm.addEventListener('submit', addNewNote);

// reset form if modal is closed 
const cancel = document.getElementsByClassName('cancel');
for (let i = 0; i < cancel.length; i++) {
    cancel[i].addEventListener('click', (e) => {
        e.target.parentElement.parentElement.reset();
    });
}

// icons for buttons
const linkIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link-45deg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
</svg>`;

const cartIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    <path fill-rule="evenodd" d="M8.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 .5-.5z"/>
</svg>`;

const emptyCartIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-dash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    <path fill-rule="evenodd" d="M6 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
</svg>`;

const removeIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>`;


// get recipients upon page load
getRecipients();

function getRecipients() {
    recipientsList.innerHTML = '';
    return fetch(recipientsURL)
    .then(res => res.json())
    .then(recipients => {
        recipients.forEach(recipient => addRecipientToList(recipient));
        
        if (recipients.length > 0) {
            renderListStructures(recipients[0].id);
        }
        else {
            const addRecipient = document.createElement('h1');
            addRecipient.className = 'no-recipients';
            addRecipient.innerText = 'Welome!';
            recipientInfo.appendChild(addRecipient);
        }
    })
}

// render layout for a recipient's lists
function renderListStructures(recipientId) {
    recipientInfo.innerHTML = `<div class="row">
        <div class="col" id="name-col">
            <h1 id="recipient-name"></h1>
        </div>
        <div class="col text-right">
            <h3 id="recipient-budget">$<span></span></h2>
            <h5 id="remaining-budget">Remaining: $<span></span></h4>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title" style="text-align: center;">To Buy</h5>
                    <ul class="list-group" id="to-buy-list"></ul>
                    <br>
                    <div class="text-center">
                        <button class="btn card-btn" id="add-to-buy-item">ADD ITEM</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title" style="text-align: center;">Bought</h5>
                    <ul class="list-group" id="bought-list"></ul>
                    
                    <p id="total-spent" style="text-align: center;">TOTAL SPENT: $<span></span><p>
                </div>
            </div>
        </div>
        <div class="col-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title" style="text-align: center;">Notes</h5>
                    <ul class="list-group" id="notes-list"></ul>
                    <br>
                    <div class="text-center">
                        <button class="btn card-btn" id="add-note" data-toggle="modal" data-target="#newNoteModal">ADD NOTE</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>
    <br>
    <div class="row">
        <div class="col text-center" id="recipient-btns">
            <button type="button" class="btn background-btn" id="update-recipient" data-toggle="modal" data-target="#updateRecipientModal">UPDATE RECIPIENT</button>           
            <button class="btn background-btn" id="delete-recipient" data-toggle="modal" data-target="#deleteRecipientModal">DELETE RECIPIENT</button>
        </div>
    </div>`;
    
    toBuyList = document.getElementById('to-buy-list');
    boughtList = document.getElementById('bought-list');
    notesList = document.getElementById('notes-list');
    renderRecipient(recipientId);

    const toBuyListBtn = document.getElementById('add-to-buy-item');
    toBuyListBtn.addEventListener('click', addItem);
}

// add an item to a list
function addItem() {
    const recipientId = document.getElementById('recipient-name').dataset.id;

    recipientInfo.innerHTML = `<div class="row">
        <div class="col text-center">
            <h2>Add Item</h2>
        </div>
    </div>
    <div class="row text-center">
        <form id="search-form">
            <div class="form-group">
                <input class="form-control" id="searchForItem" name="search" placeholder="What are you looking for?">
            </div>
            <div class="text-center">
                <button type="submit" class="btn background-btn">SEARCH</button>
                <button type="button" class="btn background-btn" id="cancel-search">CANCEL</button>
            </div>
        </form>
    </div>
    <div class="row" id="search-results"></div>`;

    document.getElementById('search-form').addEventListener('submit', (e) => searchForItems(e, recipientId));

    document.getElementById('cancel-search').addEventListener('click', (e) => {
        e.preventDefault();
        renderListStructures(recipientId);
    });
}

// scrape Nordstrom for products resulting from the search term
// scraper script is located at gift-planner-backend/app/models/concerns/scraper.js
function searchForItems(e, recipientId) {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    
    const configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ query: searchTerm })
    };
    
    fetch(searchItemsURL, configObj)
    .then(() => displaySearchResults(recipientId));
}

// display resulting products' images, names, and prices
function displaySearchResults(recipientId) {
    fetch(searchItemsURL)
    .then(res => res.json())
    .then(products => {
        const searchResultsDiv = document.getElementById('search-results');
        searchResultsDiv.innerHTML = '';
        if (products.length === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.innerText = 'Sorry, no results match your search! Please try again';
            noResultsDiv.id = 'no-results';
            searchResultsDiv.appendChild(noResultsDiv)
            return;
        }
        for (const product of products) {
            
            const prodDiv = document.createElement('div');
            prodDiv.className = 'col-3';
            prodDiv.style = 'margin-bottom: 25px;';

            const image = document.createElement('img');
            image.className = 'result-image';
            image.style = "width: 90%;"
            image.src = product.image_url;

            const name = document.createElement('p');
            name.className = 'search-result-name'
            name.innerText = product.name;

            const price = document.createElement('p');
            price.className = 'search-result-price'
            price.innerText = `$${product.price.toFixed(2)}`;

            const addBtn = document.createElement('button');
            addBtn.className = 'btn background-btn';
            addBtn.style = 'margin-left: auto; margin-right: auto;';
            addBtn.innerText = 'ADD ITEM';

            const body = { name: product.name, price: product.price, link: product.link, image_url: product.image_url };
            addBtn.addEventListener('click', () => checkIfItemExists(recipientId, body));

            prodDiv.append(image, name, price, addBtn);
            searchResultsDiv.appendChild(prodDiv);
        }
    })
}

// check if an item exists in db
function checkIfItemExists(recipientId, body) {
    fetch(itemsURL)
    .then(res => res.json())
    .then(items => {
        let curItem;
        for (let item of items) {
            if (item.link === body.link) {
                curItem = item;
                break;
            }
        }

        // update item if it exists but price is different 
        if (curItem && curItem.price != body.price) {
            curItem = updateItem(curItem.id, body);
        }
        // create item if it's not in the db
        else if (!curItem) {
            curItem = createItem(body);
        }
        return curItem;
    })
    .then(item => createRecipientItem(recipientId, item.id, item.price));
}

// update item if price changed
function updateItem(itemId, body) {
    const configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    };
    return fetch(itemsURL + "/" + itemId, configObj)
    .then(res => res.json());
}

// create item if it's not in the db
function createItem(body) {
    const configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    };
    return fetch(itemsURL, configObj)
    .then(res => res.json());
}

// create recipient item after getting, creating, or updating the item
function createRecipientItem(recipientId, itemId, itemPrice) {

    const body = {
        recipient_id: recipientId,
        item_id: itemId,
        bought: false,
        price: itemPrice
    };
    const configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    };

    fetch(recipientItemsURL, configObj)
    .then(() => fetch(searchItemsURL, { method: 'DELETE' }))
    .then(() => renderListStructures(recipientId));
}

// add recipient to recipients list after submitting Add Recipient Form
function addRecipient(e) {
    e.preventDefault();

    const name = document.getElementById('recipientName').value;
    let budget = document.getElementById('recipientBudget').value;

    // if (name === "" || !parseFloat(budget)) {
    //     while (!parseFloat(budget)) {
    //         const validationDiv = addRecipientForm.querySelector('.budget-validation');
    //         validationDiv.innerText = "Please provide a valid budget";
    //         budget = document.getElementById('recipientBudget').value;
    //     }
    // }

    // reset form and close modal
    addRecipientForm.reset();
    addRecipientModal.querySelector('button.btn.cancel').click();

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
        addRecipientToList(recipient);
        renderListStructures(recipient.id);
    });
}

// add a new recipient from the form to the recipients list
function addRecipientToList(recipient) {
    const recipientLi = document.createElement('li');
    recipientLi.id = `recipient-${recipient.id}`;
    recipientLi.dataset.budget = recipient.budget;
    recipientLi.dataset.spent = recipient.spent;
    recipientLi.className = 'list-group-item';
    recipientLi.innerText = recipient.name;
    recipientsList.appendChild(recipientLi);
}

// click on recipient to view his/her lists
recipientsList.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
        const recipientId = parseInt(e.target.id.slice(10));
        renderListStructures(recipientId);
    }
});

// render lists for a recipient
function renderRecipient(recipientId) {
    updateForm.dataset.id = recipientId;

    fetch(recipientsURL + '/' + recipientId)
    .then(res => res.json())
    .then(recipient => {

        const recipientName = document.getElementById('recipient-name');
        recipientName.dataset.id = recipient.id;
        recipientName.innerText = recipient.name;

        const recipientBudget = document.getElementById('recipient-budget').children[0];
        recipientBudget.innerText = recipient.budget.toFixed(2);

        const remainingBudget = document.getElementById('remaining-budget').children[0];
        remainingBudget.innerText = parseFloat(recipient.budget - recipient.spent).toFixed(2);

        const amtSpent = document.getElementById('total-spent').children[0];
        amtSpent.innerText = `${recipient.spent.toFixed(2)}`;

        const updateRecipientBtn = document.getElementById('update-recipient');
        updateRecipientBtn.addEventListener('click', (e) => {
            updateRecipientBtnClick(e, recipient.id);
        });

        getListItems(recipient.id);
        getNotes(recipient.id);
    });
}

// render list items for a recipient
function getListItems(recipientId) {
    fetch(recipientsURL + `/${recipientId}/recipient_items`)
    .then(res => res.json())
    .then(recipientItems => {
        for (const recipientItem of recipientItems) {
            // check if prices of to-buy items have changed
            if (!recipientItem.bought && recipientItem.price !== recipientItem.item.price) {
                alertPriceChange(recipientItem, recipientItem.item.price, recipientItem.price);

                updateRecipientItemPrice(recipientItem);
            }
            else {
                renderListItems(recipientItem);
            }
        }
    })
}

function alertPriceChange(recipientItem, itemPrice, recipientItemPrice) {
    const alertPriceChange = document.createElement('div');
    alertPriceChange.className = 'alert alert-dark';
    alertPriceChange.role = 'alert';
    if (itemPrice === 0) {
        alertPriceChange.innerText =`${recipientItem.item.name} is out of stock.`;
    }
    else if (recipientItemPrice === 0) {
        alertPriceChange.innerText =`${recipientItem.item.name} is back in stock.`
    }
    else {
        alertPriceChange.innerText = `The price for ${recipientItem.item.name} has changed from $${recipientItemPrice.toFixed(2)} to $${itemPrice.toFixed(2)}.`;
    }

    const closeAlertBtn = document.createElement('button');
    closeAlertBtn.type = 'button';
    closeAlertBtn.className = 'close';
    closeAlertBtn.innerHTML = `<span>&times;</span>`;
    closeAlertBtn.addEventListener('click', (e) => e.currentTarget.parentElement.remove());

    alertPriceChange.appendChild(closeAlertBtn);
    document.getElementById('recipient-info').prepend(alertPriceChange);
}

function renderListItems(recipientItem) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.id = recipientItem.id;

    const itemRow = document.createElement('div');
    itemRow.className = 'row';

    // item name
    const itemNameCol = document.createElement('div');
    itemNameCol.className = 'col item-name';
    itemNameCol.innerText = recipientItem.item.name;

    // item price
    const itemPriceCol = document.createElement('div');
    itemPriceCol.className = 'col-3 item-price';
    const price = recipientItem.price.toFixed(2);
    itemPriceCol.innerText = `$${price}`; // span
    let outOfStock = parseFloat(price) === 0;
    if (outOfStock) {
        itemPriceCol.innerText = 'Out of Stock';
    }

    // link button
    const linkBtnCol = document.createElement('div');
    linkBtnCol.className = 'col-1 icon-col';
    const linkBtn = document.createElement('button');
    linkBtn.className = 'btn icon-btn link-btn';
    linkBtn.innerHTML = linkIcon
    linkBtn.addEventListener('click', () => {
        window.open(recipientItem.item.link)
    });
    linkBtnCol.appendChild(linkBtn);

    // cart button
    const cartBtnCol = document.createElement('div');
    cartBtnCol.className = 'col-1 icon-col';
    const cartBtn = document.createElement('button');
    if (recipientItem.bought) {
        cartBtn.className = 'btn icon-btn cart-btn empty-cart-btn';
        cartBtn.innerHTML = emptyCartIcon;
        cartBtn.type = 'button';
    }
    else {
        cartBtn.className = 'btn icon-btn cart-btn fill-cart-btn';
        cartBtn.innerHTML = cartIcon;
        cartBtn.type = 'button';
        const remainingBudget = parseFloat(document.getElementById('remaining-budget').children[0].innerText);
        if (outOfStock) {
            cartBtn.disabled = true;
        }
        if (price > remainingBudget) {
            cartBtn.dataset.toggle = 'modal';
            cartBtn.dataset.target = '#overBudgetModal';
        }
    }
    cartBtn.addEventListener('click', (e) => handleItemBtnClick(e, recipientItem));
    cartBtnCol.appendChild(cartBtn);

    // remove item button
    const removeBtnCol = document.createElement('div');
    removeBtnCol.className = 'col-1 icon-col';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn icon-btn remove-btn';
    removeBtn.innerHTML = removeIcon;
    removeBtn.addEventListener('click', (e) => handleItemBtnClick(e, recipientItem));
    removeBtnCol.appendChild(removeBtn);

    itemRow.append(itemNameCol, itemPriceCol, linkBtnCol, cartBtnCol, removeBtnCol);
    li.appendChild(itemRow);

    if (recipientItem.bought) {
        boughtList.appendChild(li);
    }
    else {
        toBuyList.appendChild(li);
    }
}

function updateRecipientItemPrice(recipientItem) {
    const configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ price: recipientItem.item.price })
    }
    fetch(recipientItemsURL + '/' + recipientItem.id, configObj)
    .then(res => res.json())
    .then(recipientItem => renderListItems(recipientItem));
}

// handle button clicks to move or remove list items
function handleItemBtnClick(e, recipientItem) {
    const btn = e.currentTarget;
    const li = btn.parentElement.parentElement.parentElement;
    const list = li.parentElement;

    const recipientItemId = li.id;
    const price = recipientItem.item.price;
    const recipientId = recipientItem.recipient.id;
    const item = recipientItem.item;
    const recipientName = recipientItem.recipient.name;
    const recipientBudget = recipientItem.recipient.budget;
    
    // move item from to-buy list to bought list
    if (btn.classList.contains('fill-cart-btn')) {
        const remainingBudget = parseFloat(document.getElementById('remaining-budget').children[0].innerText);
        // if price of item is higher than remaining budget, don't add to bought list
        if (price > remainingBudget) {
            document.getElementById('add-to-budget').addEventListener('click', (e) => {
                document.getElementById('cancel-add-item').click();
                updateRecipientBtnClick(e, recipientItem.recipient.id);
            });
        }
        else{
            moveToBoughtList(recipientItemId, li, price);
        }
    }

    // move item from bought list to to-buy list
    else if (btn.classList.contains('empty-cart-btn')) {
        moveToToBuyList(recipientItemId, li, recipientItem.item.price, recipientItem.price);
    }

    // remove item from to-buy list
    else if (btn.classList.contains('remove-btn') && list.id === 'to-buy-list') {
        fetch(recipientItemsURL + '/' + recipientItemId, { method: 'DELETE' })
        .then(() => {
            li.remove();
            getItem(item);
        });
    }

    // remove item from bought-list
    else if (btn.classList.contains('remove-btn') && list.id === 'bought-list') {
        fetch(recipientItemsURL + '/' + recipientItemId, { method: 'DELETE' })
        .then(() => {
            li.remove();
            updateBudgetFromRecipientItem(recipientId, price, 'subtract');
            getItem(item);
        });
    }
}

function getItem(item) {
    fetch(itemsURL + '/' + item.id)
    .then(res => res.json())
    .then(item => {
        if (item.recipient_items.length === 0) {
            fetch(itemsURL + '/' + item.id, { method: 'DELETE' });
        }
    })
}

// move item from to-buy list to bought list
function moveToBoughtList(recipientItemId, li, price) {
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

    fetch(recipientItemsURL + '/' + recipientItemId, configObj)
    .then(res => res.json())
    .then(recipientItem => {
        // remove list item from to-buy and add to bought list
        boughtLi = li.cloneNode(true);
        const row = boughtLi.children[0];
        const cartBtn = row.getElementsByClassName('cart-btn')[0];
        cartBtn.innerHTML = emptyCartIcon;
        cartBtn.className = 'btn icon-btn cart-btn empty-cart-btn';
        cartBtn.type = 'button';  
        cartBtn.removeAttribute('data-toggle');
        cartBtn.removeAttribute('data-target');

        // add event listener to each icon button
        row.children[2].children[0].addEventListener('click', () => {
            window.open(recipientItem.item.link)
        });
        for (let i = 3; i < 5; i++) {
            row.children[i].children[0].addEventListener('click', (e) => handleItemBtnClick(e, recipientItem));
        }
        boughtList.appendChild(boughtLi);
        li.remove();

        // update budget
        const recipientId = recipientItem.recipient_id;
        const recipientItemPrice = recipientItem.price;
        updateBudgetFromRecipientItem(recipientId, recipientItemPrice, 'add');
    });
}

// move item from bought list to to-buy list
function moveToToBuyList(recipientItemId, li, itemPrice, recipientItemPrice) {
    const configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            bought: false,
            price: itemPrice
        })
    };

    fetch(recipientItemsURL + '/' + recipientItemId, configObj)
    .then(res => res.json())
    .then(recipientItem => {
        // remove list item from to-buy and add to bought list
        toBuyLi = li.cloneNode(true);
        const row = toBuyLi.children[0];
        const priceCol = row.getElementsByClassName('item-price')[0];
        priceCol.innerText = `$${itemPrice.toFixed(2)}`;
        const cartBtn = row.getElementsByClassName('cart-btn')[0];
        cartBtn.innerHTML = cartIcon;
        cartBtn.className = 'btn icon-btn cart-btn fill-cart-btn';
        cartBtn.type = 'button';
        // item out of stock
        if (parseFloat(itemPrice) === 0) {
            priceCol.innerText = 'Out of Stock';
            cartBtn.disabled = true;
        }   

        // add event listener to each icon button
        row.children[2].children[0].addEventListener('click', () => {
            window.open(recipientItem.item.link)
        });
        for (let i = 3; i < 5; i++) {
            row.children[i].children[0].addEventListener('click', (e) => handleItemBtnClick(e, recipientItem));
        }
        toBuyList.appendChild(toBuyLi);
        li.remove();

        // alert price change if there is one
        if (itemPrice !== recipientItemPrice) {
            alertPriceChange(recipientItem, itemPrice, recipientItemPrice);
        }

        // update budget, subtracting old price if there was a price change
        updateBudgetFromRecipientItem(recipientItem.recipient_id, recipientItemPrice, 'subtract');

    });
}

function addNewNote(e) {
    e.preventDefault();
    const recipientId = document.getElementById('recipient-name').dataset.id;
    const message = document.getElementById('newMessage').value;

    newNoteForm.reset();
    newNoteForm.querySelector('button.btn.cancel').click();

    if (message === '') {
        return;
    }

    const configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            recipient_id: recipientId,
            message: message
        })
    };
    fetch(notesURL, configObj)
    .then(() => renderListStructures(recipientId));
}

function getNotes(recipientId) {
    fetch(recipientsURL + `/${recipientId}/notes`)
    .then(res => res.json())
    .then(notes => {
        for (const note of notes) {
            renderNote(note);
        }
    })
}

function renderNote(note) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.id = `note-${note.id}`;

    const row = document.createElement('div');
    row.className = 'row';

    // note message
    const messageCol = document.createElement('div');
    messageCol.className = 'note-message';
    messageCol.innerText = note.message;

    // remove note button
    const removeBtnCol = document.createElement('div');
    removeBtnCol.className = 'note-icon-col icon-col';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn icon-btn remove-btn';
    removeBtn.innerHTML = removeIcon;
    removeBtn.addEventListener('click', () => {
        fetch(notesURL + '/' + note.id, { method: 'DELETE' })
        .then(() => {
            li.remove();
        });
    });
    removeBtnCol.appendChild(removeBtn);

    row.append(messageCol, removeBtnCol);
    li.appendChild(row);
    notesList.appendChild(li);
}

// update budget, remaining budget, and total spend as a result of moving items between lists
function updateBudgetFromRecipientItem(recipientId, price, changeAmt) {
    const remainingBudget = document.getElementById('remaining-budget').children[0];
    
    const spent = document.getElementById('total-spent').children[0];
    let updateSpent;

    if (changeAmt === 'add') {
        updateSpent = parseFloat(spent.innerText) + price;
    }
    else {
        updateSpent = parseFloat(spent.innerText) - price;
    }
    
    const configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ spent: updateSpent })
    };

    fetch(recipientsURL + '/' + recipientId, configObj)
    .then(res => res.json())
    .then(recipient => { 
        spent.innerText = recipient.spent.toFixed(2);
        remainingBudget.innerText = parseFloat(recipient.budget - recipient.spent).toFixed(2);
        updateOverBudgetModalToggle();
    });
}

// handle click of buttons to update or delete recipients
function updateRecipientBtnClick(e, recipientId) {
    const updateRecipientName = document.getElementById('updateRecipientName');
    const updateRecipientBudget = document.getElementById('updateRecipientBudget');
    fetch(recipientsURL + '/' + recipientId)
    .then(res => res.json())
    .then(recipient => {
        updateRecipientName.value = recipient.name;
        updateRecipientBudget.value = recipient.budget.toFixed(2);
    })
    
    // updateRecipientName.value = recipientName;
    // updateRecipientBudget.value = recipientBudget;
    
}

// update recipient info
function updateRecipient(e, id) {
    e.preventDefault();
    // remove error messages upon submit, if there are any
    const errorMsg = updateForm.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.remove();
    }

    const spent = parseFloat(document.getElementById('total-spent').children[0].innerText);
    const name = document.getElementById('updateRecipientName').value;
    const budget = parseFloat(document.getElementById('updateRecipientBudget').value);
    
    // should not be able to update budget to be less that amount already spent
    if (budget < spent) {
        const formBudget = document.getElementById('updateRecipientForm').children[1];
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-msg';
        const errorMsg = document.createElement('p');
        errorMsg.innerText = "The budget for this recipient cannot be lower than amount already spent.";

        errorDiv.appendChild(errorMsg);
        formBudget.appendChild(errorDiv);
        return;
    }
    
    // close modal form
    updateRecipientModal.querySelector('button.btn.cancel').click();

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
        document.getElementById('recipient-budget').children[0].innerText = recipient.budget.toFixed(2);
        document.getElementById('remaining-budget').children[0].innerText = (recipient.budget - recipient.spent).toFixed(2);
        updateOverBudgetModalToggle();
    });
}

function updateOverBudgetModalToggle() {
    // find all cartbtns on to-buy-list
    const toBuyList = document.getElementById('to-buy-list');
    const cartBtns = toBuyList.getElementsByClassName('fill-cart-btn');
    const remainingBudget = parseFloat(document.getElementById('remaining-budget').children[0].innerText);
    for (let i = 0; i < cartBtns.length; i++) {
        const cartBtn = cartBtns[i];
        cartBtn.removeAttribute('data-toggle');
        cartBtn.removeAttribute('data-target');
        const price = parseFloat(cartBtn.parentElement.parentElement.children[1].innerText.slice(1));
        if (price > remainingBudget) {
            cartBtn.dataset.toggle = 'modal';
            cartBtn.dataset.target = '#overBudgetModal';
        }
    }
}
// delete a recipient and his/her recipient items
function deleteRecipient() {
    // close modal
    document.getElementById('cancel-delete-recipient').click();

    const recipientId = document.getElementById('recipient-name').dataset.id;

    fetch(recipientsURL + '/' + recipientId, { method: 'DELETE' })
    .then(location.reload());
}
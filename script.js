// Get references to HTML elements
const itemForm = document.getElementById('item-form'); // Form for adding items
const itemInput = document.getElementById('item-input'); // Input field for new items
const itemList = document.getElementById('item-list'); // List container for items
const clear = document.getElementById('clear'); // Clear all items button
const itemFilter = document.getElementById('filter'); // Filter input field
const formBtn = itemForm.querySelector('button');
let isEditMode = false ;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}


// Function to handle form submission and add a new item
function onAddItemSubmit(e) {
    e.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get the value from the input field, which represents the new item
    const newItem = itemInput.value;

    // Validate the input: Ensure it's not empty
    if (newItem === '') {
        alert('Please add an item');
        return;
    }
    
// check for edit mode 
if(isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;}
    else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  
}

    // Add the new item to the DOM (UI)
    addItemToDOM(newItem);
    
    // Store the new item in local storage
    addItemToStorage(newItem);
    
    // Update the UI, e.g., showing/hiding buttons based on the number of items
    checkUI();

    // Clear the input field for the next item
    itemInput.value = '';
}

// Function to add an item to the DOM (UI)
function addItemToDOM(item) {
    // Create a new list item (li element)
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item)); // Populate with the new item text

    // Create a remove button and add it to the list item
    const button = createButton('remove-item btn-link text-red'); // Create a button element
    li.appendChild(button); // Append the button to the list item

    // Add the list item to the item list
    itemList.appendChild(li);
}


// Function to create a button element
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark'); // Create an icon for the button
    button.appendChild(icon); // Append the icon to the button
    return button;
}

// Function to create an icon element
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


// Function to add an item to local storage
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    // Add the new item to the array
    itemsFromStorage.push(item);

    // Store the updated item list back in local storage (as JSON)
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;

    // Check if there are already items in local storage
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []; // Initialize an empty array if no items are stored yet
    } else {
        // Parse and retrieve stored items from local storage
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
   
    return itemsFromStorage;

}

function onClickItem(e){

    if (e.target.parentElement.classList.contains('remove-item'))
    {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
 const itemsFromStorage = getItemsFromStorage();
 
 return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;
    
    // Remove the "edit-mode" class from all list items
    itemList.querySelectorAll('li').
    forEach((i) => i.classList.remove('edit-mode'));
    
    // Add the "edit-mode" class to the selected item
    item.classList.add('edit-mode');
    
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

// Function to remove an item
function removeItem(item) {
    
    if(confirm('Are you sure?')){
    // remove from DOM
    item.remove();

    // remove from storage
    removeItemFromStorage(item.textContent);
    checkUI();
}

}

function  removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i)=> i!== item);

    // Store the updated item list back in local storage (as JSON)
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}



// Function to clear all items
function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // clear from local storage

    localStorage.removeItem('items');
    checkUI(); // Update the UI after clearing all items
}

// Function to filter items based on input text
function filterItems(e) {
    // Get the value of the input field and convert it to lowercase
    const text = e.target.value.toLowerCase();

    // Select all list items in the itemList
    const items = itemList.querySelectorAll('li');

    // Iterate through each list item
    items.forEach((item) => {
        // Get the text content of the list item and convert it to lowercase
        const itemName = item.firstChild.textContent.toLowerCase();

        // Check if the text in the input field is found in the list item's text
        if (itemName.indexOf(text) !== -1) {
            // If there's a match, display the list item (set its display property to 'flex')
            item.style.display = 'flex';
        } else {
            // If there's no match, hide the list item (set its display property to 'none')
            item.style.display = 'none';
        }
    });
}

// Function to check and update the UI state
function checkUI() {
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clear.style.display = 'none'; // Hide the clear button if there are no items
        itemFilter.style.display = 'none'; // Hide the filter input field if there are no items
    } else {
        clear.style.display = 'block'; // Show the clear button if there are items
        itemFilter.style.display = 'block'; // Show the filter input field if there are items
    }
    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    itemInput.value = '';
    
    isEditMode = false;

}


// initialize app 

function init (){
    
// Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit); // Call onAddItemSubmit when the form is submitted
itemList.addEventListener('click', onClickItem); // Remove items when clicked
clear.addEventListener('click', clearItems); // Clear all items when clicked
itemFilter.addEventListener('input', filterItems); // Filter items based on input
document.addEventListener('DOMContentLoaded',displayItems);
checkUI(); // Initial check and update of the UI

}

init();
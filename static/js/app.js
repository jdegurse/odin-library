////////    LIBRARY    ////////
// localStorage.clear(); ////////////////////////////////////////// DEBUGGING //

function loadLibrary() {
    if (storage_available) {
        // localStorage is available and we can use it
        // check if library is currently stored in localStorage
        // if no, create an array for library and save it into localStorage
        if (!localStorage.getItem('library')) {
            storeLibrary();
        }
        // if yes, load the library and parse it into a library array
        else {
            library = getLibrary();
        }
    }
    else {
        // localStorage is not available to the user, alert them that their
        // library will not be saved
        alert('localStorage is not enabled on your browser. '
            + 'Entries will not be saved');
    }
}

function storageAvailable(type) {
    // on load check that localStorage is enabled and can accept data
    // type should be 'localStorage' when function is called
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function storeLibrary() {
    // store the library array in the 'library' localStorage as a string
    localStorage.setItem('library', JSON.stringify(library));
}

function getLibrary() {
    // get the 'library' storage item and parse it into JSON
    let library_string = localStorage.getItem('library');
    return JSON.parse(library_string);
}

function saveToLibrary() {
    // used after adding, deleting, or modifying a book
    // MUST go after the library array is updated
    // checks if localStorage is available
    if (storage_available) {
        // store the current library array in localStorate
        storeLibrary()
    }
    // if not, do nothing
    else {
        return;
    }
}

let library = [];
let storage_available = storageAvailable('localStorage');



////////    BOOK CREATION    ////////
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    // creates a book using the constructor
    const new_book = new Book(title, author, pages, read);
    // push the book to the end of the library array
    // can change the push function to unshift to add books to the front of the
    // array but would then need to reassign data indexes here
    library.push(new_book);
    // if localStorage, save the library
    saveToLibrary();
    createRow(
        document.getElementById('book-table'),
        new_book,
        library.length - 1
    );
}

function submitClick() {
    // takes the values from each input field and sends them to the
    // addBookToLibrary function so a book can be constructed
    let title = document.getElementById('add-title');
    let author = document.getElementById('add-author');
    let pages = document.getElementById('add-pages');
    let read = document.getElementById('add-read');
    let required_field_warning =
        document.getElementById('required-field-warning');
    let pages_number_warning = document.getElementById('pages-number-warning')
    // validate the values, and if invalid, warn the user and return the
    // function here
    if (title.value === '' || author.value === '' || pages.value === '') {
        required_field_warning.classList.remove('hidden');
        return;
    }
    if (isNaN(pages.value)) {
        pages_number_warning.classList.remove('hidden');
        return;
    }
    // if valid, the book is added
    addBookToLibrary(
        title.value,
        author.value,
        pages.value,
        read.checked
    );
    // the input fields are all reset to their default placeholders and hide
    // any warnings
    title.value = author.value = pages.value = '';
    read.checked = false;
    required_field_warning.classList.add('hidden');
    pages_number_warning.classList.add('hidden');
}

function invalidEntryWarning() {
    alert('Invalid Entry')
}



////////    TABLE CREATION    ////////
function createTable() {
    // iterate through the library array
    for (i = 0; i < library.length; i++) {
        createRow(document.getElementById('book-table'), library[i], i)
    }
}

function createRow(table, object, i) {
    // create a row
    const row = table.insertRow(-1);
    // create the cells
    row.insertCell(0).textContent = object.title;
    row.insertCell(1).textContent = object.author;
    row.insertCell(2).textContent = object.pages;
    row.insertCell(3).appendChild(createReadButton(object, i))
    row.insertCell(4).appendChild(createDeleteButton(i))
    //createDeleteButton(row, object, i)
}



////////    READ BUTTON    ////////

function createReadButton(object, i) {
    // creates a new button
    let new_button = document.createElement('button');
    new_button.setAttribute('data-index', i);
    // if read has been checked, assign the read values
    if (object.read === true) {
        new_button.textContent = 'Read';
        new_button.setAttribute('class', 'read-button is-read');
    }
    // if not, set the not read values
    else {
        new_button.textContent = 'Not Read';
        new_button.setAttribute('class', 'read-button is-not-read');
    }
    // add an event listener for the button
    new_button.addEventListener('click', readClick);
    return new_button;
}

function readClick() {
    // flip the value of the read key in the library
    const i = this.getAttribute('data-index');
    library[i].read = !library[i].read;
    // save the flip to localStorage
    saveToLibrary();
    readButtonFlip(this);
}

function readButtonFlip(button) {
    // flip the is-/not-/read class as well as the text content
    button.classList.toggle('is-read');
    button.classList.toggle('is-not-read');
    if (button.textContent === 'Read') {
        button.textContent = 'Not Read';
    }
    else {
        button.textContent = 'Read';
    }
}



////////    DELETE BUTTON    ////////
function createDeleteButton(i) {
    let new_button = document.createElement('button');
    new_button.setAttribute('class', 'delete-button')
    new_button.setAttribute('data-index', i)
    new_button.innerHTML = '&times;'
    new_button.addEventListener('click', deleteClick);
    return new_button;
}

function deleteClick() {
    // takes the data index and splices the library at that index for 1 item
    const i = this.getAttribute('data-index');
    library.splice(i, 1);
    // deletes the row and reassigns data indices on all buttons so they match
    // the new indices in the library
    deleteRow(i);
    reassignDataIndex();
    // save the delete to local storage
    saveToLibrary();
}

function deleteRow(i) {
    // finds the delete button's grandparent node (ie. the table row) and
    // deletes the row
    let delete_button = document.querySelector(`[data-index="${i}"]`);
    let row = delete_button.parentNode.parentNode;
    document.getElementById('book-table').deleteRow(row.rowIndex);
}

function reassignDataIndex() {
    // creates an array of delete buttons and an array of read buttons
    let delete_buttons =
        Array.from(document.getElementsByClassName('delete-button'))
    let read_buttons =
        Array.from(document.getElementsByClassName('read-button'))
    // for every row (denoted by the delete button in the row), set the
    // data index of each delete and read button to the current index of the
    // iteration
    for (i = 0; i < delete_buttons.length; i++) {
        delete_buttons[i].setAttribute('data-index', i);
        read_buttons[i].setAttribute('data-index', i)
    }
}



////////    ACCORDION    ////////

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}



////////    ON LOAD    ////////
loadLibrary();
createTable();

document.getElementById('add-submit').addEventListener('click', submitClick);
document.getElementById('required-field-warning')
    .addEventListener('click', function () {
        this.classList.add('hidden')
    });
document.getElementById('pages-number-warning')
    .addEventListener('click', function () {
        this.classList.add('hidden')
    });
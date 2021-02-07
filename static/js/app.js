////////    LIBRARY    ////////
let library = [
    {
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "pages": "223",
        "read": true
    },
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "pages": "310",
        "read": false
    },
    {
        "title": "Airframe",
        "author": "Michael Crichton",
        "pages": "352",
        "read": true
    }
]



////////    BOOK CREATION    ////////
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    const new_book = new Book(title, author, pages, read);
    library.push(new_book);
    createRow(
        document.getElementById('book-table'),
        new_book,
        library.length - 1
    )
}

function submitClick() {
    let title = document.getElementById('add-title');
    let author = document.getElementById('add-author');
    let pages = document.getElementById('add-pages');
    let read = document.getElementById('add-read');
    if (title.value === '' || author.value === '' || pages.value === '') {
        invalidEntryWarning();
        return;
    }
    addBookToLibrary(
        title.value,
        author.value,
        pages.value,
        read.checked
    );
    title.value = author.value = pages.value = '';
    read.checked = false;
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
    let new_button = document.createElement('button');
    new_button.setAttribute('data-index', i);
    if (object.read === true) {
        new_button.textContent = 'Read';
        new_button.setAttribute('class', 'read-button is-read');
    }
    else {
        new_button.textContent = 'Not Read';
        new_button.setAttribute('class', 'read-button is-not-read');
    }
    new_button.addEventListener('click', readClick);
    return new_button;
}

function readClick() {
    const i = this.getAttribute('data-index');
    library[i].read = !library[i].read;
    readButtonFlip(this);
}

function readButtonFlip(button) {
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
    new_button.textContent = 'Delete'
    new_button.addEventListener('click', deleteClick);
    return new_button;
}

function deleteClick() {
    const i = this.getAttribute('data-index');
    library.splice(i, 1);
    deleteRow(i);
    reassignDataIndex();
}

function deleteRow(i) {
    let delete_button = document.querySelector(`[data-index="${i}"]`);
    let row = delete_button.parentNode.parentNode;
    document.getElementById('book-table').deleteRow(row.rowIndex);
}

function reassignDataIndex() {
    let delete_buttons =
        Array.from(document.getElementsByClassName('delete-button'))
    let read_buttons =
        Array.from(document.getElementsByClassName('read-button'))
    for (i = 0; i < delete_buttons.length; i++) {
        delete_buttons[i].setAttribute('data-index', i);
        read_buttons[i].setAttribute('data-index', i)
    }
}



////////    ON LOAD    ////////
createTable()

document.getElementById('add-submit').addEventListener('click', submitClick);
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
    createReadButton(row, object, i)
    createDeleteButton(row, object, i)
}

function createReadButton(row, object, i) {
    if (object.read === true) {
        row.insertCell(3).innerHTML =
            `<button class="read-button is-read" data-index="${i}">Read</button>`;
    }
    else {
        row.insertCell(3).innerHTML =
            `<button class="read-button is-not-read" data-index="${i}">Not Read</button>`;
    }
}

function createDeleteButton(row, i) {
    row.insertCell(4).innerHTML =
        `<button class="delete-button" data-index="${i}">Delete</button>`;
}



////////    READ BUTTON    ////////

function createReadButtonEventListeners() {
    const buttons = Array.from(document.getElementsByClassName('read-button'));
    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', readClick);
    }
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



////////    ON LOAD    ////////
createTable()
createReadButtonEventListeners();

document.getElementById('add-submit').addEventListener('click', submitClick);
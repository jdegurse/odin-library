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
    library.push(new Book(title, author, pages, read))
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
    const table = document.getElementById('book-table');
    // iterate through the library array
    for (i = 0; i < library.length; i++) {
        createRow(table, library[i])
    }
}

function createRow(table, object) {
    // create a row
    const row = table.insertRow(-1);
    // create the cells
    row.insertCell(0).textContent = object.title;
    row.insertCell(1).textContent = object.author;
    row.insertCell(2).textContent = object.pages;
    if (object.read = true) {
        row.insertCell(3).innerHTML = '<button>Read</button>'
    }
    else {
        row.insertCell(3).innerHTML = '<button>Not Read</button>'
    }
    row.insertCell(4).innerHTML = '<button>Delete</button>'
}



////////    ON LOAD    ////////
createTable()
document.getElementById('add-submit').addEventListener('click', submitClick);

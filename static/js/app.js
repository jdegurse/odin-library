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
    // creates a book using the constructor, then pushes it to the end of the
    // library array
    // can change the push function to unshift to add books to the front of the
    // array but would then need to reassign data indexes here
    const new_book = new Book(title, author, pages, read);
    library.push(new_book);
    createRow(
        document.getElementById('book-table'),
        new_book,
        library.length - 1
    )
}

function submitClick() {
    // takes the values from each input field and sends them to the
    // addBookToLibrary function so a book can be constructed
    let title = document.getElementById('add-title');
    let author = document.getElementById('add-author');
    let pages = document.getElementById('add-pages');
    let read = document.getElementById('add-read');
    // validate the values, and if invalid, warn the user and return the
    // function here
    if (title.value === '' || author.value === '' || pages.value === '') {
        invalidEntryWarning();
        return;
    }
    // if valid, the book is added
    addBookToLibrary(
        title.value,
        author.value,
        pages.value,
        read.checked
    );
    // the input fields are all reset to their default placeholders
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
createTable()

document.getElementById('add-submit').addEventListener('click', submitClick);
document.getElementById('required-field-warning')
    .addEventListener('click', function () {
        this.classList.toggle('hidden')
    });
document.getElementById('pages-number-warning')
    .addEventListener('click', function () {
        this.classList.toggle('hidden')
    });
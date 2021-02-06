// Library Array
let library = [];

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

document.getElementById('add-submit').addEventListener('click', submitClick);
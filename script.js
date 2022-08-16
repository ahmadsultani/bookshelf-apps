const bookshelf = [];
const STORAGE_KEY = 'books';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mend  ukung local storage');
    return false;
  }
  return true;
}

function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data !== null) {
    for (const book of data) {
      bookshelf.push(book);
    }
  }
  render(bookshelf); 
}

function render(bookshelf) {
  const uncompletedBookshelf = document.getElementById('books');
  const completedBookshelf = document.getElementById('books-completed');

  uncompletedBookshelf.innerHTML = '';
  completedBookshelf.innerHTML = '';

  for (const book of bookshelf) {
    const bookElement = makeBook(book);
    if (!book.isCompleted) {
      uncompletedBookshelf.append(bookElement);
    } else {
      completedBookshelf.append(bookElement);
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
  console.log("Buku berhasil disimpan");
}

function generateID() {
  return Date.now();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const book of bookshelf) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function handleCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isCompleted = true;
  render(bookshelf);
  saveData();
}

function handleDelete(bookId) {
  const bookTargetIndex = findBookIndex(bookId);
  if (bookTargetIndex === -1) return;
  bookshelf.splice(bookTargetIndex, 1);
  render(bookshelf);
  saveData();
}

function handleUndoCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isCompleted = false;
  render(bookshelf);
  saveData();
}

function addBook() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('name').value;
  const year = document.getElementById('year').value;
  const isCompleted = document.getElementById('completed').checked;
  const id = generateID();
  const bookObject = generateBookObject(id, title, author, year, isCompleted);
  bookshelf.push(bookObject);
  render(bookshelf);
  saveData();
}

function makeBook(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject;

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = "Penulis: "+author;

  const bookYear = document.createElement('p');
  bookYear.innerText = "Tahun: "+year;

  const bookContainer = document.createElement('div');
  bookContainer.classList.add('book-container');
  bookContainer.append(bookTitle, bookAuthor, bookYear);

  const section = document.createElement('section');
  section.classList.add('book-section', 'shadow');
  section.append(bookContainer);
  section.setAttribute('id', id);

  const bookButtonGroup = document.createElement('div');
  bookButtonGroup.classList.add('book-button-group');

  if (!isCompleted) {
    const completedButton = document.createElement('button');
    completedButton.innerText = 'Selesai'
    completedButton.classList.add('book-button','completed-button');
    completedButton.addEventListener('click', function () {
      handleCompleted(id)
    });

    bookButtonGroup.append(completedButton);
  } else {
    const undoCompletedButton = document.createElement('button');
    undoCompletedButton.classList.add('book-button', 'undo-completed-button');
    undoCompletedButton.innerText = 'Belum selesai';
    undoCompletedButton.addEventListener('click', function () {
      handleUndoCompleted(id)
    });
    bookButtonGroup.append(undoCompletedButton);
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus';
  deleteButton.classList.add('book-button','delete-button');
  deleteButton.addEventListener('click', function () {
    if (confirm ('Apakah kamu yakin ingin menghapus buku ini?')) {
      handleDelete(id)
    }
  });
  bookButtonGroup.append(deleteButton);
  
  section.append(bookButtonGroup);
  
  return section;
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('book-form')
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    for (const input of submitForm.querySelectorAll('input')) {
      if (input.value !== 'Submit') input.value = '';
      else if (input.checked) input.checked = false;
    }
    alert('Buku berhasil ditambahkan');
  });
  
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchValue = document.getElementById('search').value;
    const filteredBookShelf = bookshelf.filter(function (book) {
      return book.title.toLowerCase().includes(searchValue.toLowerCase());
    });
    render(filteredBookShelf);
  });

  if (isStorageExist()) {
    loadData();
  }
});
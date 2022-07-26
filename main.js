const userInputContainer = document.querySelector('.book-input');
const closeBtn = document.querySelector('.close');
const openInputBtn = document.querySelector('.open-input-btn');
const addBtn = document.querySelector('.add-btn');
const booksContainer = document.querySelector('.books-container');  

closeBtn.addEventListener('click', closeInput);
openInputBtn.addEventListener('click', openInput);
addBtn.addEventListener('click', addNewBook);
const deleteBtn = document.querySelectorAll('.delete-btn');
 deleteBtn.forEach(btn => {
  btn.addEventListener('click', deleteBook)
 })

let library = [];
let currentBook = [];

window.addEventListener('load', getStorage)

 function books(title, author, pages, id, readStatus){
  this.title = title
  this.author = author
  this.pages = pages
  this.id = id
  this.readStatus = readStatus
 }
 
function addNewBook(){
  currentBook = []
  const titleInput = document.querySelector('.titleInput');
  const authorInput = document.querySelector('.authorInput');
  const pageInput = document.querySelector('.pageInput');

  const title = titleInput.value;
  const author = authorInput.value; 
  const pages = pageInput.value;

  const id = "" + new Date().getTime();

  let readInput = document.querySelector('.toggle-input')
  let readStatus 

    if (readInput.checked == true){ 
     readStatus = 'Read'
    } else {
      readStatus = 'Not read'
    }
  
  let validity 
   if (title.toString().length < 3){
    validity = 'false'
   } if (author.toString().length < 3){
    validity = 'false'
   } if (pages.toString().length < 1){
    validity = 'false'
   } else {
    validity = 'true'
   }
  if (validity == 'true') {

  let b = new books(title, author, pages, id, readStatus)
  currentBook.push(b);
  library.push(b);
  
  addCard();
  closeInput();
  clearBookInput();
  saveBooks()
}
  }
  
 function addCard (){
  currentBook.forEach(book => {
    let title = book.title;
    let author = book.author;
    let pages = book.pages;
    let id = book.id;
    let readStatus = book.readStatus;

    const cardContent = `
    <h3 class="title">${title}</h3>
    <div class="flex"><p>Author:</p> <span>${author}</span></div>
    <div class="flex"><p>Pages:</p> <span>${pages}</span></div>
    <div class="flex"><p>Status:</p> <p class="status">${readStatus}</p></div>
    <div class="flex"><p>Have you read it?</p> 
        <div class="toggle-container">
            <input type="checkbox" id="${id}" class="toggle">
            <label for="${id}"></label>
       </div>
     </div>
       <button class="delete-btn"><img src="icon/trash-can-solid.svg"></button>
      `
   const card = document.createElement('div');
   card.classList.add('card')

   card.innerHTML = cardContent;
   booksContainer.appendChild(card); 
   
   if (book.readStatus === 'Read') {
    card.querySelector('.toggle').checked = true;
  }
 
   card.querySelector('.delete-btn').addEventListener('click', deleteBook)
   card.querySelector('.toggle').addEventListener('change', statusChanged)
   updateTotal();
   updateFinished();
   updatePages();
  });    
}

function statusChanged (event) {
  let checkBox = event.target;
  let card = checkBox.parentNode.parentNode.parentNode;
  let readStatus = card.querySelector('.status');
  let cardInput = card.querySelector('.toggle');
  let cardId = cardInput.id;
  
    if (checkBox.checked == true){ 
     readStatus.textContent = 'Read'
    } else {
      readStatus.textContent = 'Not read'
    }

    library.forEach(book => {
      if (cardId === book.id){
        book.readStatus = readStatus.textContent;
      }
    })
      updateFinished();
      saveBooks();
  }

function closeInput(){
  userInputContainer.style.top = '-100%';
  clearBookInput();
}

function openInput(){
  userInputContainer.style.top = '20%';
}

function clearBookInput(){
  const bookInput = document.querySelector('.book-input');
  const inputFields = bookInput.querySelectorAll('input');
  inputFields.forEach(field => {
    field.value = "";
    field.innerText = "";
  })
}

function deleteBook(event){
  let btnToDelete = event.currentTarget;
  let cardToDelete = btnToDelete.parentNode;
  let cardInputElem = cardToDelete.querySelector('.toggle')
  let cardId = cardInputElem.id;
  cardToDelete.remove();
  updateArray(cardId)
  updateTotal()
  updatePages()
  updateFinished()
}

function updateArray(cardId){
  library = library.filter(book => {
   if (book.id === cardId) {
     return false;
   } else {
     return true;
   }
  })
  updateTotal()
  updatePages()
  updateFinished()
  saveBooks()
}

  // library log

  const libraryLog = document.querySelector('.library-log');
  const total = libraryLog.querySelector('.total');
  const finished = libraryLog.querySelector('.finished');
  const totalPages = libraryLog.querySelector('.total-pages');

  function updateTotal (){
  total.textContent = library.length;
}

let finishedBooks 
function updateFinished () {
  finishedBooks = library.filter(book => {
    return book.readStatus == 'Read';
  })
  finished.textContent = parseInt(finishedBooks.length);
}

let pageArray = [];
function updatePages() {
  if (library.length === 0){
    totalPages.innerText = 0;
  } else {
  library.forEach(book =>{
    let pages = book.pages;
    let pgNumber = parseInt(pages);    
    pageArray.push(pgNumber);

    let sum = 0;
    for (let i = 0; i < pageArray.length; i++) {
      sum += pageArray[i];
  }
   totalPages.innerText = parseInt(sum); 
  })
  pageArray = []
}}

function saveBooks (){
 localStorage.setItem('library', JSON.stringify(library))
}

function getStorage(){
 let savedLibrary = JSON.parse(localStorage.getItem('library'));
 currentBook = savedLibrary;
 addCard()
 currentBook = []
 library = savedLibrary;
 updateTotal()
 updatePages()
 updateFinished()
}



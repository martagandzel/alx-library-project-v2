import { v4 as uuidv4 } from 'uuid';

document.addEventListener("DOMContentLoaded", function () {

    // catching library
    const library = document.querySelector("#library");

    // catching browsing by buttons
    const btnCat = document.querySelector("#btnCat");
    const btnTitAlph = document.querySelector("#btnTitAlph");
    const btnTitChron = document.querySelector("#btnTitChron");
    const searchInput = document.querySelector('#searchInput');

    // catching elements for adding a new book
    const addBookBtn = document.querySelector('#addBookBtn');
    const addTitleInput = document.querySelector('#addTitle');
    const addAuthorInput = document.querySelector('#addAuthor');
    const addYearInput = document.querySelector('#addYear');
    const addCatInput = document.querySelector('#addCat');
    const addImgInput = document.querySelector('#addImg');

    let libraryOfBooks = [];

    const sortBy = (listOfBooks, key) => listOfBooks.sort((a, b) => a[key] > b[key] ? 1 : -1);

    const handleSearch = (event) => {
        event.preventDefault();

        const matchingBooks = libraryOfBooks.filter(book => {
            return book.title.toLowerCase().includes(searchInput.value.toLowerCase())
        });

        showLibrary(matchingBooks);
    }

    const postBook = (book) => {
        fetch('http://localhost:3000/library/', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(book)
        })
            .then(res => res.json())
            .then(() => {
                libraryOfBooks.push(book);
                showLibrary(libraryOfBooks);
            })
    }

    const showLibrary = (listOfBooks) => {
        library.innerHTML = '';

        listOfBooks.forEach(book => {
            library.innerHTML +=
                `
            <div class="book__container">
                <div class="book__img__container">
                    <img src="${book.image}" alt="cover for ${book.title}">
                </div>
                <div class="book__details__container">
                    <p><span class="book__details__title">${book.title}</span></p>
                    <p>By: <span class="book__details__author">${book.author}</span></p>
                    <p>Release year: <span class="book__details__year">${book.year}</span></p>
                    <p>Category: <span class="book__details__category">${book.category}</span></p>
                </div>
            </div>
        `
        })

    }

    const handleAddingBook = event => {
        event.preventDefault();

        const newBook = {
            id: uuidv4(),
            title: addTitleInput.value,
            author: addAuthorInput.value,
            year: addYearInput.value,
            category: addCatInput.value.toLowerCase(),
            image: addImgInput.value,
            alt: `Cover for ${addTitleInput.value}`
        }

        postBook(newBook);

        addTitleInput.value = '';
        addAuthorInput.value = '';
        addYearInput.value = '';
        addCatInput.value = '';
        addImgInput.value = '';
    }

    const fetchLibrary = () => {
        fetch('http://localhost:3000/library')
            .then(res => res.json())
            .then(data => {
                libraryOfBooks = data;
                showLibrary(data);
            })
            .catch(err => console.log(err))
    }


    btnCat.addEventListener('click', () => {
        showLibrary(sortBy(libraryOfBooks, 'category'))
    });
    btnTitAlph.addEventListener('click', () => {
        showLibrary(sortBy(libraryOfBooks, 'title'))
    });
    btnTitChron.addEventListener('click', () => {
        showLibrary(sortBy(libraryOfBooks, 'year'))
    });

    searchInput.addEventListener('keyup', handleSearch);

    addBookBtn.addEventListener('click', handleAddingBook);


    fetchLibrary();

})
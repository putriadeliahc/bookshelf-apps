document.addEventListener("DOMContentLoaded", function () {
  const tambahBukuForm = document.getElementById("tambahBuku");
  const ListBuku_belumDibaca = document.getElementById("ListBuku_belumDibaca");
  const ListBuku_sudahDibaca = document.getElementById("ListBuku_sudahDibaca");

  renderBuku();

  tambahBukuForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const titleInput = document.getElementById("judulBuku");
    const authorInput = document.getElementById("authorBook");
    const yearInput = parseInt(document.getElementById("year_book").value);
    const isCompleteInput = document.getElementById("buku_sudahdibaca");

    const title = document.getElementById("judulBuku").value;
    const author = document.getElementById("authorBook").value;
    const year = document.getElementById("year_book").value;
    const isComplete = document.getElementById("buku_sudahdibaca").checked;

    tambah_data(title, author, year, isComplete);
    if (isComplete) {
      alert("Buku telah ditambahkan ke koleksi sudah dibaca");
    } else {
      alert("Buku telah ditambahkan ke koleksi belum dibaca");
    }
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;

    simpan_local();
  });

  const buku_sudahdibaca = document.getElementById("buku_sudahdibaca");
  const buku_belumdibaca = document.getElementById("buku_belumdibaca");

  buku_sudahdibaca.addEventListener("change", function () {
    if (buku_sudahdibaca.checked) {
      buku_belumdibaca.checked = false;
    }
  });

  buku_belumdibaca.addEventListener("change", function () {
    if (buku_belumdibaca.checked) {
      buku_sudahdibaca.checked = false;
    }
  });

  const Formcaribuku = document.getElementById("searchBook");
  Formcaribuku.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitle = document.getElementById("cari_judulBuku").value;

    ListBuku_belumDibaca.innerHTML = "";
    ListBuku_sudahDibaca.innerHTML = "";

    cari_buku(searchTitle);
  });

  function tambah_item_buku(title, author, year, isComplete) {
    const article = document.createElement("article");
    article.classList.add("book_item");

    const timestamp = +new Date();
  article.id = `Buku_${timestamp}`;

    const h3 = document.createElement("h3");
    h3.textContent = title;

    const pAuthor = document.createElement("p");
    pAuthor.textContent = `Penulis: ${author}`;

    const pYear = document.createElement("p");
    pYear.textContent = `Tahun: ${year}`;

    const divAction = document.createElement("div");
    divAction.classList.add("action");

    const btnToggle = document.createElement("button");
    btnToggle.textContent = isComplete
      ? "Pindah ke Koleksi Belum Dibaca"
      : "Sudah dibaca";
    btnToggle.classList.add(isComplete ? "green" : "red");
    btnToggle.addEventListener("click", function () {
      if (isComplete) {
        alert("Buku akan Dipindahkan ke Koleksi Belum Selesai Dibaca");

        isComplete = false;
        btnToggle.textContent = "Sudah Dibaca";
        btnToggle.classList.remove("green");
        btnToggle.classList.add("red");

        ListBuku_belumDibaca.appendChild(article);
      } else {
        alert("Pindah ke Koleksi Selesai Dibaca");

        isComplete = true;
        btnToggle.textContent = "Pindah ke Rak Belum Dibaca";
        btnToggle.classList.remove("red");
        btnToggle.classList.add("green");

        ListBuku_sudahDibaca.appendChild(article);
      }

      simpan_local();
    });

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.classList.add("blue");
    btnEdit.addEventListener("click", function () {
      showEditForm(article, title, author, year, isComplete);
    });

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Hapus buku";
    btnDelete.classList.add("black");
    btnDelete.addEventListener("click", function () {
      const isConfirmed = confirm(
        "Apakah Anda Yakin Menghapus Buku Ini Dari Koleksi?"
      );
      if (isConfirmed) {
        hapus_buku(article);

        simpan_local();
      }
    });

    divAction.appendChild(btnToggle);
    divAction.appendChild(btnDelete);
    divAction.appendChild(btnEdit);

    article.appendChild(h3);
    article.appendChild(pAuthor);
    article.appendChild(pYear);
    article.appendChild(divAction);

    return article;
  }

  function showEditForm(article, title, author, year) {
    const form = document.createElement("form");
    form.classList.add("edit-form");
    form.innerHTML = `
        <label for="editBookTitle">Judul:</label>
        <input type="text" id="editBookTitle" value="${title}" required>
        <label for="editBookAuthor">Pengarang:</label>
        <input type="text" id="editBookAuthor" value="${author}" required>
        <label for="editBookYear">Tahun Terbit:</label>
        <input type="number" id="editBookYear" value="${year}"
        <input type="number" id="editBookYear" value="${year}" required>
        <button type="submit">Simpan Perubahan</button>
      `;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const editedTitle = document.getElementById("editBookTitle").value;
      const editedAuthor = document.getElementById("editBookAuthor").value;
      const editedYear = document.getElementById("editBookYear").value;

      editBookInfo(article, editedTitle, editedAuthor, editedYear);

      form.remove();

      simpan_local();

      alert("Perubahan Berhasil Disimpan");
    });

    article.appendChild(form);
  }

  function editBookInfo(article, editedTitle, editedAuthor, editedYear) {
    const id = article.id;
    article.querySelector("h3").textContent = editedTitle;
    article.querySelector("p:nth-child(2)").textContent = `Penulis: ${editedAuthor}`;
    article.querySelector("p:nth-child(3)").textContent = `Tahun: ${editedYear}`;

    const storedBooks = JSON.parse(localStorage.getItem("books"));
    const bookIndex = storedBooks.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      storedBooks[bookIndex].title = editedTitle;
      storedBooks[bookIndex].author = editedAuthor;
      storedBooks[bookIndex].year = parseInt(editedYear);
      localStorage.setItem("books", JSON.stringify(storedBooks));
    }
  }

  function tambah_data(title, author, year, isComplete) {
    const bookItem = tambah_item_buku(title, author, year, isComplete);
    if (isComplete) {
      ListBuku_sudahDibaca.appendChild(bookItem);
    } else {
      ListBuku_belumDibaca.appendChild(bookItem);
    }
  
    const timestamp = +new Date();
    const bookObject = {
      id: `Buku_${timestamp}`,
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete
    };
  
    console.log(bookObject); // Menampilkan objek buku di konsol
  }
  

  function hapus_buku(bookItem) {
    const id = bookItem.id;
    bookItem.remove();
  
    // Perbarui data di localStorage
    const storedBooks = JSON.parse(localStorage.getItem("books"));
    const updatedBooks = storedBooks.filter(book => book.id !== id);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }

  function simpan_local() {
    const incompleteBooks = [];
    const completeBooks = [];
  
    ListBuku_belumDibaca.querySelectorAll(".book_item").forEach((bookItem) => {
      const title = bookItem.querySelector("h3").textContent;
      const author = bookItem.querySelector("p:nth-child(2)").textContent.split(": ")[1];
      const year = bookItem.querySelector("p:nth-child(3)").textContent.split(": ")[1];
      incompleteBooks.push({ id: bookItem.id, title, author, year, isComplete: false });
    });
  
    ListBuku_sudahDibaca.querySelectorAll(".book_item").forEach((bookItem) => {
      const title = bookItem.querySelector("h3").textContent;
      const author = bookItem.querySelector("p:nth-child(2)").textContent.split(": ")[1];
      const year = bookItem.querySelector("p:nth-child(3)").textContent.split(": ")[1];
      completeBooks.push({ id: bookItem.id, title, author, year, isComplete: true });
    });
  
    const allBooks = [...incompleteBooks, ...completeBooks];
    localStorage.setItem("books", JSON.stringify(allBooks));
  }

  function renderBuku() {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      const books = JSON.parse(storedBooks);
      books.forEach((book) => {
        tambah_data(book.title, book.author, book.year, book.isComplete);
      });
    }
  }

  function cari_buku(title) {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      const books = JSON.parse(storedBooks);
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      filteredBooks.forEach((book) => {
        tambah_data(book.title, book.author, book.year, book.isComplete);
      });
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

async function addnewbook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const publicationYear = document.getElementById("publicationYear").value;

  const book = {
    title: title,
    author: author,
    publicationYear: publicationYear,
  };

  const token = localStorage.getItem("token");

  await axios
    .post("http://localhost:3000/register-book", book, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((errr) => {
      console.log(errr);
    });
}

async function fetchData() {
  const token = localStorage.getItem("token");

  const bookDropdown = document.getElementById("books-per-page");
  const filterDropdown = document.getElementById("books-filter");
  bookDropdown.value = parseInt(localStorage.getItem("itemPerPage"));
  filterDropdown.value = localStorage.getItem("booksFilter");

  try {
    // Initial fetch
    fetchBooksAndPopulate(
      1,
      localStorage.getItem("itemPerPage") || 2,
      localStorage.getItem("booksFilter") || "id"
    ); // Default items per page

    bookDropdown.addEventListener("change", () => {
      const newItemsPerPage = parseInt(bookDropdown.value);
      localStorage.setItem("itemPerPage", bookDropdown.value);
      fetchBooksAndPopulate(
        1,
        newItemsPerPage,
        localStorage.getItem("booksFilter")
      ); // Start from page 1
    });
    filterDropdown.addEventListener("change", () => {
      localStorage.setItem("booksFilter", filterDropdown.value);
      fetchBooksAndPopulate(
        1,
        localStorage.getItem("itemPerPage"),
        filterDropdown.value
      );
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

async function fetchBooks(page, itemsPerPage, filterValue, token) {
  const url = `http://localhost:3000/books?page=${page}&limit=${itemsPerPage}&sortBy=${filterValue}`;
  const results = await axios.get(url, {
    headers: { Authorization: token },
  });
  return results;
}

function updateTable(data) {
  let elem1 = document.getElementById("bookTable");
  while (elem1.firstChild) {
    elem1.removeChild(elem1.firstChild);
  }
  const exp = 0;
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    AddBook(data[i]);
  }
}

function generatePagination(
  containerId,
  totalItems,
  itemsPerPage,
  onPageChange
) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear previous pagination

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Create pagination buttons
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => onPageChange(i, itemsPerPage));
    container.appendChild(button);
  }
}

async function fetchBooksAndPopulate(page, itemsPerPage, filterValue) {
  const token = localStorage.getItem("token");
  const results = await fetchBooks(page, itemsPerPage, filterValue, token);
  console.log(itemsPerPage);

  // scenario where there are less items than requested
  const dataToDisplay =
    results.data.allBooks.length < itemsPerPage
      ? results.data.allBooks
      : results.data.allBooks.slice(0, itemsPerPage); // Slice if needed

  updateTable(dataToDisplay);
  generatePagination(
    "pagination",
    results.data.totalCount,
    itemsPerPage,
    handleBooksPageChange
  );
}

function handleBooksPageChange(pageNumber, itemsPerPage) {
  fetchBooksAndPopulate(pageNumber, itemsPerPage);
}

function AddBook(book) {
  const { title, author, publicationYear } = book;
  const token = localStorage.getItem("token");

  //  Creating li element ul ***************
  var tr = document.getElementById("bookTable");

  var li = document.createElement("tr");
  li.classList.add("table-row");
  var td1 = document.createElement("td");
  td1.classList.add("table-cell");
  var td2 = document.createElement("td");
  td2.classList.add("table-cell");
  var td3 = document.createElement("td");
  td3.classList.add("table-cell");

  td1.appendChild(document.createTextNode(title));
  td2.appendChild(document.createTextNode(author));
  td3.appendChild(document.createTextNode(publicationYear));

  li.appendChild(td1);
  li.appendChild(td2);
  li.appendChild(td3);

  // Creating delete button ***************************

  var deletebtn = document.createElement("button");
  deletebtn.className = " btn btn-danger  btn-sm float-right";
  deletebtn.appendChild(document.createTextNode("Delete"));
  li.appendChild(deletebtn);

  // creating edit button *********************

  var edit = document.createElement("button");
  edit.className = "btn btn-primary";
  edit.appendChild(document.createTextNode("Edit"));
  li.appendChild(edit);

  // appending li element to ul *********************

  tr.appendChild(li);

  deletebtn.addEventListener("click", removeLi);

  async function removeLi() {
    let id = book.id;
    await axios
      .delete(`http://localhost:3000/books/${id}`)
      .then((result) => {
        console.log("deleted..");
        tr.removeChild(li);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  edit.addEventListener("click", editLi);
  async function editLi() {
    let id = book.id;

    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("publicationYear").value = publicationYear;

    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      tr.removeChild(li);
      console.log("editing data..");
    } catch (error) {
      console.log(error);
      console.log("Error in editing fun.");
    }
  }
}

function freeHolds() {
  setTimeout(() => {
    window.location.reload();
  }, 300);
}

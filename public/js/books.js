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

// Fetch limited books at a time using pagination
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
    addBookToTable(data[i]);
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
    button.addEventListener("click", () =>
      onPageChange(i, itemsPerPage, localStorage.getItem("booksFilter") || "id")
    );
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

function handleBooksPageChange(pageNumber, itemsPerPage, filterValue) {
  fetchBooksAndPopulate(pageNumber, itemsPerPage, filterValue);
}

function addBookToTable(book) {
  // Destructure book object properties for readability
  const { title, author, publicationYear, id } = book;

  const tableBody = document.getElementById("bookTable");
  const tableRow = document.createElement("tr");

  // Create and populate table cells
  const titleCell = createTableCell(title);
  const authorCell = createTableCell(author);
  const publicationYearCell = createTableCell(publicationYear);

  tableRow.appendChild(titleCell);
  tableRow.appendChild(authorCell);
  tableRow.appendChild(publicationYearCell);

  // Add delete button with event listener
  const deleteButton = createButton("Delete", "btn btn-outline-danger");
  deleteButton.addEventListener("click", () => removeBook(id));
  tableRow.appendChild(deleteButton);

  // Add edit button with event listener
  const editButton = createButton("Edit", "btn btn-outline-primary");
  editButton.addEventListener("click", () => editBook(id));
  tableRow.appendChild(editButton);

  // Append the table row
  tableBody.appendChild(tableRow);

  async function removeBook(id) {
    await axios
      .delete(`http://localhost:3000/books/${id}`)
      .then((result) => {
        console.log("deleted..");
        tableBody.removeChild(tableRow);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function editBook(id) {
    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("publicationYear").value = publicationYear;

    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      tableBody.removeChild(tableRow);
    } catch (error) {
      console.log(error);
    }
  }
}

// Helper functions for creating table cells and buttons
function createTableCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function createButton(text, buttonClasses) {
  const button = document.createElement("button");
  button.classList.add(...buttonClasses.split(" ")); // Spread syntax for class names
  button.textContent = text;
  return button;
}

function freeHolds() {
  setTimeout(() => {
    window.location.reload();
  }, 300);
}

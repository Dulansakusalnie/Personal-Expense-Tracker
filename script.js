const transactionForm = document.getElementById("transactionForm");
const transactionTableBody = document.getElementById("transactionTableBody");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateSummary() {

    let totalIncome = 0;
    let totalExpenses = 0;

    const rows = transactionTableBody.querySelectorAll("tr");

    rows.forEach(function(row) {

        if (row.id === "emptyMessage") {
            return;
        }

        const type = row.cells[2].textContent.trim();

        const amount = Math.abs(
            Number(row.cells[4].textContent.replace(/[^\d.]/g, ""))
        );

        if (type === "Income") {
            totalIncome += amount;
        } 
        else if (type === "Expense") {
            totalExpenses += amount;
        }

    });

    const currentBalance = totalIncome - totalExpenses;

    document.getElementById("totalIncome").textContent =
        "LKR " + totalIncome.toFixed(2);

    document.getElementById("totalExpenses").textContent =
        "LKR " + totalExpenses.toFixed(2);

    document.getElementById("currentBalance").textContent =
        "LKR " + currentBalance.toFixed(2);
}

function saveTransactions() {

    localStorage.setItem("transactions", JSON.stringify(transactions));

}

transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const type = document.getElementById("transactionType").value;
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    // Check whether all fields are filled
    if (type === "" || amount === "" || date === "" ||
        description.trim() === "" || category === "") {

        alert("Please fill in all fields.");
        return;
    }

    // Check whether amount is greater than zero
    if (Number(amount) <= 0) {
        alert("Amount must be greater than zero.");
        return;
    }

    const newTransaction = {type: type,amount: Number(amount),date: date,description: description,category: category};

    transactions.push(newTransaction);

    saveTransactions();

   displayTransactions();

   alert("Transaction added successfully");

   transactionForm.reset();

    const emptyMessage = document.getElementById("emptyMessage");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    transactionTableBody.appendChild(newRow);
    
    alert("Transaction added successfully")

    newRow.querySelector(".delete-btn").addEventListener("click", function() {

        const index = transactions.indexOf(newTransaction);

        transactions.splice(index, 1);

        saveTransactions();

        newRow.remove();

    updateSummary();

    if (transactionTableBody.rows.length === 0) {
        transactionTableBody.innerHTML = `
            <tr id="emptyMessage">
                <td colspan="6" class="text-center text-secondary">
                    No transactions found
                </td>
            </tr>
        `;
    }

});

    console.log("Number of transactions:", transactionTableBody.rows.length);

    updateSummary();

    transactionForm.reset();

});

function displayTransactions() {

    transactionTableBody.innerHTML = "";

    if (transactions.length === 0) {

        transactionTableBody.innerHTML = `
            <tr id="emptyMessage">
                <td colspan="6" class="text-center text-secondary">
                    No transactions found
                </td>
            </tr>
        `;

        updateSummary();
        return;
    }

    transactions.forEach(function(transaction) {

        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>
                <span style="background-color: ${transaction.type === "Income" ? "darkgreen" : "darkred"};
                             color: white;
                             padding: 2px 8px;
                             border-radius: 3px;
                             font-size: 12px;">
                    ${transaction.type}
                </span>
            </td>
            <td>${transaction.category}</td>
            <td>
                ${transaction.type === "Income" ? "+" : "-"}LKR ${Number(transaction.amount).toFixed(2)}
            </td>
            <td>
                <button type="button" class="delete-btn">
                    Delete
                </button>
            </td>
        `;

        transactionTableBody.appendChild(newRow);

        newRow.querySelector(".delete-btn").addEventListener("click", function() {

            const index = transactions.indexOf(transaction);

            transactions.splice(index, 1);

            saveTransactions();

            displayTransactions();

        });

    });

    updateSummary();

}

const filterType = document.getElementById("filterType");

filterType.addEventListener("change", function() {

    const selectedType = filterType.value;
    const rows = transactionTableBody.querySelectorAll("tr");

    rows.forEach(function(row) {

        if (row.id === "emptyMessage") {
            return;
        }

        const type = row.cells[2].textContent.trim();

        if (selectedType === "All" || type === selectedType) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});
const searchTransaction = document.getElementById("searchTransaction");

searchTransaction.addEventListener("input", function() {

    const searchValue = searchTransaction.value.toLowerCase();

    const rows = transactionTableBody.querySelectorAll("tr");

    rows.forEach(function(row) {

        const description = row.cells[1].textContent.toLowerCase();
        const category = row.cells[3].textContent.toLowerCase();

        if (description.includes(searchValue) || category.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});

const typeDropdown = document.getElementById("typeDropdown");
const typeButton = typeDropdown.querySelector(".custom-select-button");
const typeOptions = typeDropdown.querySelector(".custom-select-options");
const typeInput = document.getElementById("transactionType");

typeButton.addEventListener("click", function() {
    typeOptions.classList.toggle("show");
});

typeOptions.querySelectorAll(".custom-option").forEach(function(option) {

    option.addEventListener("click", function() {

        typeInput.value = option.dataset.value;
        typeButton.querySelector("span").textContent = option.dataset.value;

        typeOptions.querySelectorAll(".custom-option").forEach(function(item) {
            item.classList.remove("selected");
        });

        option.classList.add("selected");
        typeOptions.classList.remove("show");

    });

});

const categoryDropdown = document.getElementById("categoryDropdown");
const categoryButton = categoryDropdown.querySelector(".custom-select-button");
const categoryOptions = categoryDropdown.querySelector(".custom-select-options");
const categoryInput = document.getElementById("category");

categoryButton.addEventListener("click", function() {
    categoryOptions.classList.toggle("show");
});

categoryOptions.querySelectorAll(".custom-option").forEach(function(option) {

    option.addEventListener("click", function() {

        categoryInput.value = option.dataset.value;
        categoryButton.querySelector("span").textContent = option.dataset.value;

        categoryOptions.querySelectorAll(".custom-option").forEach(function(item) {
            item.classList.remove("selected");
        });

        option.classList.add("selected");
        categoryOptions.classList.remove("show");

    });

});

displayTransactions();
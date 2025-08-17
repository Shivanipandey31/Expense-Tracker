 // Load expenses from localStorage if available
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const pieCtx = document.getElementById("pieChart").getContext("2d");
    const lineCtx = document.getElementById("lineChart").getContext("2d");

    let pieChart = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: [],
        datasets: [{
          label: "Expenses by Category",
          data: [],
          backgroundColor: ["#ff9800","#03a9f4","#4caf50","#e91e63","#9c27b0"]
        }]
      },
      options: { responsive: false }
    });

    let lineChart = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Expense Over Time",
          data: [],
          borderColor: "#ff9800",
          fill: false,
          tension: 0.3
        }]
      },
      options: { responsive: false }
    });

    function saveData() {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function addExpense() {
      const name = document.getElementById("expense-name").value;
      const amount = document.getElementById("expense-amount").value;
      const category = document.getElementById("expense-category").value;

      if (name === "" || amount === "") {
        alert("Please fill all fields!");
        return;
      }

      expenses.push({ name, amount: parseFloat(amount), category, date: new Date().toLocaleDateString() });
      saveData(); // Save to localStorage
      document.getElementById("expense-name").value = "";
      document.getElementById("expense-amount").value = "";

      renderList();
      updateCharts();
    }

    function deleteExpense(index) {
      expenses.splice(index, 1);
      saveData(); // Save updated list
      renderList();
      updateCharts();
    }

    function renderList() {
      const list = document.getElementById("expense-list");
      list.innerHTML = "";
      expenses.forEach((expense, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${expense.name} - ₹${expense.amount} (${expense.category})
                        <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>`;
        list.appendChild(li);
      });
    }

    function updateCharts() {
      let categoryTotals = {};
      let dates = [];
      let amounts = [];

      expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        dates.push(expense.date);
        amounts.push(expense.amount);
      });

      // Pie Chart Update
      pieChart.data.labels = Object.keys(categoryTotals);
      pieChart.data.datasets[0].data = Object.values(categoryTotals);
      pieChart.update();

      // Line Chart Update
      lineChart.data.labels = dates;
      lineChart.data.datasets[0].data = amounts;
      lineChart.update();
    }

    // Initial render after loading saved data
    renderList();
    updateCharts();

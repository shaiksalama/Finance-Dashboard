"use strict";

var transactions = [
  {
    id: 1,
    date: "2025-03-01",
    desc: "Salary",
    amount: 5200,
    category: "Income",
    type: "income",
  },
  {
    id: 2,
    date: "2025-03-02",
    desc: "Rent",
    amount: 1500,
    category: "Housing",
    type: "expense",
  },
  {
    id: 3,
    date: "2025-03-04",
    desc: "Groceries",
    amount: 320,
    category: "Food",
    type: "expense",
  },
  {
    id: 4,
    date: "2025-03-05",
    desc: "Netflix",
    amount: 15,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: 5,
    date: "2025-03-06",
    desc: "Freelance",
    amount: 800,
    category: "Income",
    type: "income",
  },
  {
    id: 6,
    date: "2025-03-08",
    desc: "Uber",
    amount: 45,
    category: "Transport",
    type: "expense",
  },
  {
    id: 7,
    date: "2025-03-09",
    desc: "Restaurant",
    amount: 120,
    category: "Food",
    type: "expense",
  },
  {
    id: 8,
    date: "2025-03-11",
    desc: "Electricity",
    amount: 90,
    category: "Utilities",
    type: "expense",
  },
  {
    id: 9,
    date: "2025-03-13",
    desc: "Gym",
    amount: 60,
    category: "Health",
    type: "expense",
  },
  {
    id: 10,
    date: "2025-03-15",
    desc: "Dividends",
    amount: 340,
    category: "Income",
    type: "income",
  },
  {
    id: 11,
    date: "2025-03-16",
    desc: "Amazon",
    amount: 210,
    category: "Shopping",
    type: "expense",
  },
  {
    id: 12,
    date: "2025-03-18",
    desc: "Coffee Shop",
    amount: 35,
    category: "Food",
    type: "expense",
  },
  {
    id: 13,
    date: "2025-03-20",
    desc: "Phone Bill",
    amount: 55,
    category: "Utilities",
    type: "expense",
  },
  {
    id: 14,
    date: "2025-03-22",
    desc: "Bonus",
    amount: 1000,
    category: "Income",
    type: "income",
  },
  {
    id: 15,
    date: "2025-03-24",
    desc: "Pharmacy",
    amount: 80,
    category: "Health",
    type: "expense",
  },
  {
    id: 16,
    date: "2025-03-25",
    desc: "Gas",
    amount: 70,
    category: "Transport",
    type: "expense",
  },
  {
    id: 17,
    date: "2025-03-27",
    desc: "Spotify",
    amount: 10,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: 18,
    date: "2025-03-28",
    desc: "Insurance",
    amount: 200,
    category: "Housing",
    type: "expense",
  },
];

var categoryColors = {
  Food: "#f59e0b",
  Housing: "#6366f1",
  Transport: "#10b981",
  Utilities: "#3b82f6",
  Entertainment: "#ec4899",
  Shopping: "#8b5cf6",
  Health: "#ef4444",
  Income: "#22c55e",
};

var balanceTrend = [8200, 9100, 7800, 10200, 11400, 12870];
var trendLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

//  STATE //

var currentRole = "viewer";
var sortField = "date";
var sortAsc = false;
var lineChart, doughnutChart, barChart;

//  FORMAT MONEY //

function money(amount) {
  return "$" + amount.toLocaleString("en-US");
}

// === GET TOTALS ===

function getTotals() {
  var income = 0;
  var expense = 0;

  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].type === "income") {
      income += transactions[i].amount;
    } else {
      expense += transactions[i].amount;
    }
  }

  return {
    income: income,
    expense: expense,
    balance: income - expense,
  };
}

//  GET CATEGORY SPENDING //

function getCategorySpend() {
  var map = {};

  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].type === "expense") {
      var cat = transactions[i].category;
      if (!map[cat]) map[cat] = 0;
      map[cat] += transactions[i].amount;
    }
  }

  var arr = [];
  for (var key in map) {
    arr.push({ name: key, value: map[key] });
  }

  arr.sort(function (a, b) {
    return b.value - a.value;
  });
  return arr;
}

//  RENDER SUMMARY CARDS //

function renderCards() {
  var t = getTotals();
  document.getElementById("cardBalance").textContent = money(t.balance);
  document.getElementById("cardIncome").textContent = money(t.income);
  document.getElementById("cardExpense").textContent = money(t.expense);
}

//  RENDER RECENT TRANSACTIONS TABLE //

function renderRecent() {
  var tbody = document.getElementById("recentBody");
  tbody.innerHTML = "";

  var list = transactions.slice(0, 5);

  for (var i = 0; i < list.length; i++) {
    var tx = list[i];
    var row = document.createElement("tr");

    var amtClass = tx.type === "income" ? "amount-income" : "amount-expense";
    var prefix = tx.type === "income" ? "+" : "-";
    var badge = tx.type === "income" ? "badge-income" : "badge-expense";
    var label = tx.type === "income" ? "Income" : "Expense";

    row.innerHTML =
      "<td>" +
      tx.date +
      "</td>" +
      "<td>" +
      tx.desc +
      "</td>" +
      "<td>" +
      tx.category +
      "</td>" +
      "<td><span class='badge " +
      badge +
      "'>" +
      label +
      "</span></td>" +
      "<td class='" +
      amtClass +
      "'>" +
      prefix +
      money(tx.amount) +
      "</td>";

    tbody.appendChild(row);
  }
}

// RENDER FULL TRANSACTIONS TABLE //

function renderTable() {
  var search = document.getElementById("searchBox").value.toLowerCase();
  var typeF = document.getElementById("typeFilter").value;
  var catF = document.getElementById("catFilter").value;
  var tbody = document.getElementById("txBody");
  tbody.innerHTML = "";

  // Filter
  var filtered = [];
  for (var i = 0; i < transactions.length; i++) {
    var tx = transactions[i];
    if (typeF !== "all" && tx.type !== typeF) continue;
    if (catF !== "all" && tx.category !== catF) continue;
    if (
      search &&
      tx.desc.toLowerCase().indexOf(search) === -1 &&
      tx.category.toLowerCase().indexOf(search) === -1
    )
      continue;
    filtered.push(tx);
  }

  // Sort
  filtered.sort(function (a, b) {
    var av = a[sortField];
    var bv = b[sortField];
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  if (filtered.length === 0) {
    var row = document.createElement("tr");
    row.innerHTML =
      "<td colspan='5' class='empty-msg'>No transactions found.</td>";
    tbody.appendChild(row);
  } else {
    for (var j = 0; j < filtered.length; j++) {
      var tx = filtered[j];
      var amtClass = tx.type === "income" ? "amount-income" : "amount-expense";
      var prefix = tx.type === "income" ? "+" : "-";
      var badge = tx.type === "income" ? "badge-income" : "badge-expense";
      var label = tx.type === "income" ? "Income" : "Expense";

      var row = document.createElement("tr");
      row.innerHTML =
        "<td>" +
        tx.date +
        "</td>" +
        "<td><strong>" +
        tx.desc +
        "</strong></td>" +
        "<td>" +
        tx.category +
        "</td>" +
        "<td><span class='badge " +
        badge +
        "'>" +
        label +
        "</span></td>" +
        "<td class='" +
        amtClass +
        "'>" +
        prefix +
        money(tx.amount) +
        "</td>";

      tbody.appendChild(row);
    }
  }

  document.getElementById("txCount").textContent =
    "Showing " +
    filtered.length +
    " of " +
    transactions.length +
    " transactions";
}

//  POPULATE CATEGORY FILTER //

function populateCategoryFilter() {
  var cats = [];
  for (var i = 0; i < transactions.length; i++) {
    if (cats.indexOf(transactions[i].category) === -1) {
      cats.push(transactions[i].category);
    }
  }

  var sel = document.getElementById("catFilter");
  for (var i = 0; i < cats.length; i++) {
    var opt = document.createElement("option");
    opt.value = cats[i];
    opt.textContent = cats[i];
    sel.appendChild(opt);
  }
}

//  SORT TABLE //

function sortBy(field) {
  if (sortField === field) {
    sortAsc = !sortAsc;
  } else {
    sortField = field;
    sortAsc = false;
  }
  renderTable();
}

//  RENDER INSIGHTS //

function renderInsights() {
  var t = getTotals();
  var cats = getCategorySpend();
  var top = cats[0];
  var expTxs = transactions.filter(function (x) {
    return x.type === "expense";
  });
  var avg = expTxs.length > 0 ? Math.round(t.expense / expTxs.length) : 0;
  var savRate = t.income > 0 ? Math.round((t.balance / t.income) * 100) : 0;

  // KPI cards
  document.getElementById("topCat").textContent = top ? top.name : "—";
  document.getElementById("topAmt").textContent = top
    ? money(top.value) + " spent"
    : "";
  document.getElementById("savingsRate").textContent = savRate + "%";
  document.getElementById("avgExpense").textContent = money(avg);

  // Category bars
  var barsDiv = document.getElementById("catBars");
  barsDiv.innerHTML = "";
  var maxVal = cats.length > 0 ? cats[0].value : 1;

  for (var i = 0; i < cats.length; i++) {
    var cat = cats[i];
    var pct = Math.round((cat.value / maxVal) * 100);
    var color = categoryColors[cat.name] || "#94a3b8";

    var div = document.createElement("div");
    div.className = "cat-bar-row";
    div.innerHTML =
      "<div class='cat-bar-label'>" +
      "<span>" +
      cat.name +
      "</span>" +
      "<span>" +
      money(cat.value) +
      "</span>" +
      "</div>" +
      "<div class='bar-track'>" +
      "<div class='bar-fill' style='width:" +
      pct +
      "%; background:" +
      color +
      "'></div>" +
      "</div>";

    barsDiv.appendChild(div);
  }

  // Observations
  var housing = cats.find(function (c) {
    return c.name === "Housing";
  });
  var food = cats.find(function (c) {
    return c.name === "Food";
  });

  var insights = [
    {
      icon: "🏠",
      text: housing
        ? "Housing is your biggest fixed cost at " +
          money(housing.value) +
          " this month."
        : "No housing expense found.",
    },
    {
      icon: "📈",
      text:
        "Your savings rate is " +
        savRate +
        "%. Experts recommend saving at least 20%.",
    },
    {
      icon: "🍔",
      text: food
        ? "You spent " +
          money(food.value) +
          " on food. Cooking at home can save you more."
        : "No food spending found.",
    },
    {
      icon: "💡",
      text:
        "Your top spending category is " +
        (top ? top.name : "—") +
        ". Consider setting a budget for it.",
    },
  ];

  var list = document.getElementById("insightsList");
  list.innerHTML = "";

  for (var i = 0; i < insights.length; i++) {
    var item = document.createElement("div");
    item.className = "insight-item";
    item.innerHTML =
      "<span>" + insights[i].icon + "</span><p>" + insights[i].text + "</p>";
    list.appendChild(item);
  }
}

// === BUILD CHARTS ===

function buildCharts() {
  var cats = getCategorySpend();
  var labels = cats.map(function (c) {
    return c.name;
  });
  var values = cats.map(function (c) {
    return c.value;
  });
  var colors = cats.map(function (c) {
    return categoryColors[c.name] || "#94a3b8";
  });

  // Line chart — balance trend //
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: trendLabels,
      datasets: [
        {
          label: "Balance",
          data: balanceTrend,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.1)",
          borderWidth: 2,
          fill: balanceTrend.length < 20,
          tension: 0.3,
          pointBackgroundColor: "#2563eb",
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: {
            callback: function (v) {
              return "$" + v / 1000 + "k";
            },
          },
        },
      },
    },
  });

  // Doughnut chart — spending breakdown //
  if (doughnutChart) doughnutChart.destroy();
  doughnutChart = new Chart(document.getElementById("doughnutChart"), {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "right", labels: { font: { size: 11 } } },
      },
      cutout: "55%",
    },
  });

  // Bar chart — monthly comparison
  if (barChart) barChart.destroy();
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Feb", "Mar"],
      datasets: [
        {
          label: "Income",
          data: [5800, 7340],
          backgroundColor: "#16a34a",
          borderRadius: 5,
        },
        {
          label: "Expense",
          data: [2110, 2810],
          backgroundColor: "#dc2626",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
      scales: {
        y: {
          ticks: {
            callback: function (v) {
              return "$" + v / 1000 + "k";
            },
          },
        },
      },
    },
  });
}

// TAB SWITCHING //

function showTab(tabId, btn) {
  // Hide all tabs
  var tabs = document.querySelectorAll(".tab-content");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  // Remove active from all buttons //
  var btns = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove("active");
  }

  // Show selected tab //
  document.getElementById(tabId).classList.add("active");

  // Set active button//
  if (btn) {
    btn.classList.add("active");
  } else {
    // Find button by tab id //
    for (var i = 0; i < btns.length; i++) {
      var attr = btns[i].getAttribute("onclick");
      if (attr && attr.indexOf("'" + tabId + "'") !== -1) {
        btns[i].classList.add("active");
      }
    }
  }
}

//  ROLE CHANGE //

function changeRole() {
  currentRole = document.getElementById("roleSelect").value;

  var addBtn = document.getElementById("addBtn");
  var addBtn2 = document.getElementById("addBtn2");
  var banner = document.getElementById("roleBanner");

  if (currentRole === "admin") {
    addBtn.style.display = "block";
    addBtn2.style.display = "block";
    banner.textContent = "🛡 Admin Mode — Can add & edit";
    banner.className = "role-banner admin";
  } else {
    addBtn.style.display = "none";
    addBtn2.style.display = "none";
    banner.textContent = "👁 Viewer Mode — Read Only";
    banner.className = "role-banner";
  }
}

//  DARK MODE //

function toggleDark() {
  document.body.classList.toggle("dark");
  buildCharts();
}

//  MODAL

function openModal() {
  document.getElementById("modal").classList.add("open");
  // Set today's date
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("fDate").value = today;
}

function closeModal(e) {
  // Only close if clicking the background, not the box
  if (e && e.target !== document.getElementById("modal")) return;
  document.getElementById("modal").classList.remove("open");
}

function closeModalDirect() {
  document.getElementById("modal").classList.remove("open");
}

// ADD TRANSACTION // 

function addTransaction() {
  var desc = document.getElementById("fDesc").value.trim();
  var amount = parseFloat(document.getElementById("fAmount").value);
  var date = document.getElementById("fDate").value;
  var type = document.getElementById("fType").value;
  var cat = document.getElementById("fCategory").value;

  if (!desc) {
    alert("Please enter a description.");
    return;
  }
  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }
  if (!date) {
    alert("Please select a date.");
    return;
  }

  var newTans = {
    id: Date.now(),
    date: date,
    desc: desc,
    amount: amount,
    category: cat,
    type: type,
  };

  transactions.unshift(newTans); // Add to top of list

  // Reset form //
  document.getElementById("fDesc").value = "";
  document.getElementById("fAmount").value = "";

  closeModalDirect();
  renderAll();
}

//  RENDER ALL //

function renderAll() {
  renderCards();
  renderRecent();
  renderTable();
  renderInsights();
  buildCharts();
}

//  CLOSE MODAL ON ESCAPE KEY //

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModalDirect();
  }
});

//  INIT // 

window.onload = function () {
  populateCategoryFilter();
  renderAll();
};

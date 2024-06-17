document.addEventListener('DOMContentLoaded', () => {
    // Load stored history on page load
    loadHistory();

    document.getElementById('addIncomeBtn').addEventListener('click', addIncome);
    document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addIncome();
            addExpense();
        }
    });
});

function addIncome() {
    const description = document.getElementById('incomeDescription').value;
    const amount = document.getElementById('incomeAmount').value;

    if (description !== '' && amount !== '') {
        const incomeList = document.getElementById('incomeList');
        const newIncome = document.createElement('li');

        const incomeText = document.createElement('span');
        incomeText.textContent = `${description}: ₹${amount}`;
        newIncome.appendChild(incomeText);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '❌';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function() {
            deleteIncome(newIncome, parseFloat(amount));
        });
        newIncome.appendChild(deleteBtn);

        incomeList.appendChild(newIncome);

        updateTotalAmount(parseFloat(amount), 'income');

        // Store in local storage
        storeHistory('income', description, amount);

        document.getElementById('incomeDescription').value = '';
        document.getElementById('incomeAmount').value = '';
    }
}

function addExpense() {
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (description !== '' && amount !== '') {
        const expenseList = document.getElementById('expenseList');
        const newExpense = document.createElement('li');

        const expenseText = document.createElement('span');
        expenseText.textContent = `${description}: ₹${amount}`;
        newExpense.appendChild(expenseText);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '❌';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function() {
            deleteExpense(newExpense, parseFloat(amount));
        });
        newExpense.appendChild(deleteBtn);

        expenseList.appendChild(newExpense);

        updateTotalAmount(parseFloat(amount), 'expense');

        // Store in local storage
        storeHistory('expense', description, amount);

        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    }
}

function updateTotalAmount(amount, type) {
    const totalIncomeElement = document.getElementById('totalIncome');
    const totalExpenseElement = document.getElementById('totalExpense');
    const netAmountElement = document.getElementById('netAmount');

    if (type === 'income') {
        const currentIncome = parseFloat(totalIncomeElement.textContent);
        const newIncome = currentIncome + amount;
        totalIncomeElement.textContent = newIncome.toFixed(2);
    } else if (type === 'expense') {
        const currentExpense = parseFloat(totalExpenseElement.textContent);
        const newExpense = currentExpense + amount;
        totalExpenseElement.textContent = newExpense.toFixed(2);
    }

    const totalIncome = parseFloat(totalIncomeElement.textContent);
    const totalExpense = parseFloat(totalExpenseElement.textContent);
    const netAmount = totalIncome - totalExpense;
    netAmountElement.textContent = netAmount.toFixed(2);
}

function deleteIncome(incomeElement, amount) {
    incomeElement.remove();
    updateTotalAmount(-amount, 'income');
    // Update localStorage after deleting
    updateLocalStorage();
}

function deleteExpense(expenseElement, amount) {
    expenseElement.remove();
    updateTotalAmount(-amount, 'expense');
    // Update localStorage after deleting
    updateLocalStorage();
}

function storeHistory(type, description, amount) {
    let history = JSON.parse(localStorage.getItem('expenseHistory')) || { income: [], expense: [] };
    history[type].push({ description, amount });
    localStorage.setItem('expenseHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('expenseHistory')) || { income: [], expense: [] };

    history.income.forEach(item => {
        addToList('incomeList', item.description, item.amount);
        updateTotalAmount(parseFloat(item.amount), 'income');
    });

    history.expense.forEach(item => {
        addToList('expenseList', item.description, item.amount);
        updateTotalAmount(parseFloat(item.amount), 'expense');
    });
}

function addToList(listId, description, amount) {
    const list = document.getElementById(listId);
    const newItem = document.createElement('li');

    const itemText = document.createElement('span');
    itemText.textContent = `${description}: ₹${amount}`;
    newItem.appendChild(itemText);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '❌';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function() {
        const type = listId === 'incomeList' ? 'income' : 'expense';
        deleteItem(newItem, parseFloat(amount), type);
    });
    newItem.appendChild(deleteBtn);

    list.appendChild(newItem);
}

function deleteItem(itemElement, amount, type) {
    itemElement.remove();
    updateTotalAmount(-amount, type);
    // Update localStorage after deleting
    updateLocalStorage();
}

function updateLocalStorage() {
    const incomeList = Array.from(document.getElementById('incomeList').children).map(item => ({
        description: item.firstChild.textContent.split(':')[0],
        amount: parseFloat(item.firstChild.textContent.split(':')[1].replace(' ₹', ''))
    }));

    const expenseList = Array.from(document.getElementById('expenseList').children).map(item => ({
        description: item.firstChild.textContent.split(':')[0],
        amount: parseFloat(item.firstChild.textContent.split(':')[1].replace(' ₹', ''))
    }));

    const history = { income: incomeList, expense: expenseList };
    localStorage.setItem('expenseHistory', JSON.stringify(history));
}

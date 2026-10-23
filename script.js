// Seleciona os elementos do DOM
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const expensesList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//Captura o evento de input para formatar o valor do input
amount.oninput = () => {
  // Obtem o valor do input e remove todos os caracteres que não são numeros
  let value = amount.value.replace(/\D/g, "");

  // Converte o valor para número e divide por 100 para obter o valor correto em reais
  value = Number(value) / 100;

  // Atualiza o valor do input com o valor formatado
  amount.value = formatCurrencyBRL(value);
}
//Formatar a moeda
function formatCurrencyBRL(value) {
  // Converte o valor para número e formata como moeda brasileira
  value = value.toLocaleString("pt-BR",
    {
      style: "currency",
      currency: "BRL"
    });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }
  expenseAdd(newExpense);
}

function expenseAdd(newExpense) {
  try {
    // throw new Error("Erro ao adicionar despesa"); ver se o erro é capturado no catch
    // Criando o elemento li para a nova despesa
    const expensesItems = document.createElement("li")
    expensesItems.classList.add("expense");

    // Criando o elemento img para o ícone da categoria
    const categoryIcon = document.createElement("img");
    categoryIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    categoryIcon.setAttribute("alt", newExpense.category_name);

    //criando div de infonformação da category
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //criando itens da div
    //Nome 
    const infoName = document.createElement("strong")
    infoName.textContent = newExpense.expense
    //Nome da categoria
    const infoCategory = document.createElement("span")
    infoCategory.textContent = newExpense.category_name
    //adicionando na div
    expenseInfo.append(infoName, infoCategory)

    // criando o span de valor
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "Remover Icone");

    //adicionando o ícone da categoria ao elemento li
    expensesItems.append(categoryIcon, expenseInfo, expenseAmount, removeIcon);

    //adicionando a li na ul
    expensesList.append(expensesItems);
    //Limpa o form
    formClear()
    //Atualiza o total 
    updateTotals()
  } catch (e) {
    alert("Erro ao adicionar despesa");
    console.log(e);
  }


}

function updateTotals() {
  try {
    const items = expensesList.children
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
    //Variável para incrementar  o total

    let total = 0
    //Percorre cada item(li) da lista(ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      //Remove caracteres não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      //Converte o valor para float
      value = parseFloat(value)

      //Verifica se é um número válido
      if (isNaN(value)) {
        alert("Não foi possível calcular o total.O valor não parecer ser um número")
      }
      total += Number(value)
    }

    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    expensesTotal.innerHTML = ""

    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("algo deu errado, tente novamente mais tarde")
  }
}

expensesList.addEventListener("click", (event) => {
  //Verifica se o elemento clicado é o ícone de remover
  if (event.target.classList.contains("remove-icon")) {
    //Obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")
    //Remove item da lista.
    item.remove()
  }
  //Atualiza os totais.
  updateTotals()
})

function formClear() {
  expense.value = ""
  amount.value = ""
  category.value = ""

  expense.focus()
}
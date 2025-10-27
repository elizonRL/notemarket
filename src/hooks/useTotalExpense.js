export const usetotalExpense = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.total, 0)
}

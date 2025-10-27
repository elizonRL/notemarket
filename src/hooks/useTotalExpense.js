export const useTotalExpense = (products) => {
  const productExpenses = products.map(product => ({
    name: product.name,
    total: product.quantity * product.price,
    percentage: 0
  }))

  return productExpenses.reduce((total, expense) => total + expense.total, 0)
}

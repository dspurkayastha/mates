import { Expense } from '@/features/expenses/hooks';
import { GroceryItem } from '@/features/groceries/hooks';
import { Chore } from '@/features/chores/hooks';

export function getThisMonthSpend(expenses: Expense[]): number {
  const now = new Date();
  return expenses
    .filter((e) => {
      const d = new Date(e.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getNumExpensesThisMonth(expenses: Expense[]): number {
  const now = new Date();
  return expenses.filter((e) => {
    const d = new Date(e.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

export function getMonthsSeries(expenses: Expense[], months = 6) {
  const now = new Date();
  const series: { label: string; total: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = date.toLocaleString('default', { month: 'short' });
    const total = expenses
      .filter((e) => {
        const d = new Date(e.created_at);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    series.push({ label, total });
  }
  return series;
}

export function getCategorySplit(expenses: Expense[], topN = 5) {
  const totals: Record<string, number> = {};
  let grandTotal = 0;
  expenses.forEach((e) => {
    const category = (e as any).category || e.title || 'Other';
    totals[category] = (totals[category] || 0) + e.amount;
    grandTotal += e.amount;
  });
  return Object.entries(totals)
    .map(([label, total]) => ({
      label,
      total,
      percent: grandTotal ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, topN);
}

export function getGroceriesBoughtPercent(items: GroceryItem[]): number {
  const bought = items.filter((i) => i.status === 'BOUGHT').length;
  const total = items.filter((i) => i.status === 'BOUGHT' || i.status === 'NEEDED').length;
  return total ? (bought / total) * 100 : 0;
}

export function getChoresCompletedPercent(chores: Chore[]): number {
  const completed = chores.filter((c) => c.completed_at).length;
  const total = chores.length;
  return total ? (completed / total) * 100 : 0;
}

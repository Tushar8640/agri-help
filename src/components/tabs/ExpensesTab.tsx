import React, { useState } from 'react';
import { Plus, Filter, SortAsc, Search, DollarSign, Calendar, Tag, Trash2 } from 'lucide-react';
import { Expense } from '../../context/ProjectContext';
import { Button } from '../ui/button';

interface ExpensesTabProps {
  projectId: string;
  expenses: Expense[];
  onAddExpense: () => void;
}

const ExpensesTab: React.FC<ExpensesTabProps> = ({ projectId, expenses, onAddExpense }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Filter expenses
  let filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort expenses
  switch (sortBy) {
    case 'date-asc':
      filteredExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case 'date-desc':
      filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'amount-asc':
      filteredExpenses.sort((a, b) => a.amount - b.amount);
      break;
    case 'amount-desc':
      filteredExpenses.sort((a, b) => b.amount - a.amount);
      break;
    default:
      break;
  }

  // Get unique categories for filter
  const categories = (expenses.map(e => e.category))

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div>
      {/* Expenses header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Project Expenses</h2>
          <p className="text-sm text-gray-600">
            Total: ${totalExpenses.toLocaleString()} from {expenses.length} expenses
          </p>
        </div>
        <Button
          onClick={onAddExpense}
          className=""
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Expense
        </Button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort expenses"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Expenses list */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No expenses found</h3>
          <p className="text-gray-600 mb-4">
            {expenses.length === 0
              ? "You haven't added any expenses to this project yet."
              : "Try adjusting your search or filters."}
          </p>
          <Button
            onClick={onAddExpense}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Add Expense
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Category
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Amount
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{expense.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-800">
                    ${expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Total
                </td>
                <td className="px-6 py-3 text-right font-semibold text-gray-800">
                  ${filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpensesTab;
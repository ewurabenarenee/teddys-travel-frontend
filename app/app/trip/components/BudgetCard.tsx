import {
  createExpense,
  deleteExpense,
  fetchExpenses,
} from "@/app/store/expenseSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function BudgetCard({
  budget,
  tripId,
}: {
  budget: number | undefined;
  tripId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector(
    (state: RootState) => state.expense.expenses || []
  );
  const loading = useSelector((state: RootState) => state.expense.loading);
  const error = useSelector((state: RootState) => state.expense.error);
  const [formData, setFormData] = useState({
    description: "",
    amount: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExpenses(tripId));
  }, [dispatch, tripId]);

  function handleAddExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(
      createExpense({
        tripId: tripId,
        expenseData: formData,
      })
    );
    setFormData({
      description: "",
      amount: 0,
    });
    setIsModalOpen(false);
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  }

  function calculateRemainingBudget() {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    return budget ? budget - totalExpenses : 0;
  }

  function handleRemoveExpense() {
    if (isRemoveMode) {
      for (const expenseId of selectedExpenses) {
        dispatch(deleteExpense({ tripId, expenseId }));
      }
      setSelectedExpenses([]);
    }
    setIsRemoveMode(!isRemoveMode);
  }

  function handleExpenseSelection(expense) {
    if (selectedExpenses.includes(expense._id)) {
      const updatedSelectedExpenses = selectedExpenses.filter(
        (id) => id !== expense._id
      );
      setSelectedExpenses(updatedSelectedExpenses);
    } else {
      const updatedSelectedExpenses = [...selectedExpenses, expense._id];
      setSelectedExpenses(updatedSelectedExpenses);
    }
  }

  return (
    <Card className="max-w-sm mb-2 cursor-pointer relative">
      <div className="relative">
        <div className="text-center justify-center m-2 p-2">
          <h2 className="text-lg font-semibold">Your trip's budget</h2>
        </div>
        <div className="flex justify-between m-2">
          <span className="font-semibold">Budget</span>
          <span>{budget}</span>
        </div>
        <hr className="my-2" />
        {expenses.length === 0 ? (
          <div className="flex justify-between m-2">
            <span>No expenses found!</span>
          </div>
        ) : (
          expenses.map((element) => (
            <div className="flex justify-between m-2" key={element._id}>
              <span>
                {isRemoveMode && (
                  <input
                    type="checkbox"
                    checked={selectedExpenses.includes(element._id)}
                    onChange={() => handleExpenseSelection(element)}
                    className="mr-2"
                  />
                )}{" "}
                {element.description}
              </span>
              <span>- {element.amount}</span>
            </div>
          ))
        )}
        <hr className="my-2" />
        <div className="flex justify-between m-2">
          <span>Budget left</span>
          <span>{calculateRemainingBudget()}</span>
        </div>
        {isModalOpen && (
          <form onSubmit={handleAddExpense} className="m-2">
            <textarea
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="mt-4">
              <Button type="submit" className="mr-2 px-4 py-2">
                Add Expense
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
        {!isModalOpen && (
          <>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="m-2 px-4 py-2"
            >
              Add Expense
            </Button>
            <Button onClick={handleRemoveExpense} className="m-2 px-4 py-2">
              {isRemoveMode ? "Delete Selected" : "Remove Expense"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

export default BudgetCard;

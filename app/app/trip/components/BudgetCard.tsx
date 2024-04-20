import {
  createExpense,
  deleteExpense,
  fetchExpenses,
} from "@/app/store/expenseSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const expenseSchema = z.object({
  description: z.string().min(1, { message: "Description is required." }),
  amount: z.preprocess((e) => {
    if (typeof e === "string") return parseFloat(e);
    return e;
  }, z.number().min(0, { message: "Amount must be a positive number." })),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
    },
  });

  useEffect(() => {
    dispatch(fetchExpenses(tripId));
  }, [dispatch, tripId]);

  const onSubmit = (data: ExpenseFormData) => {
    dispatch(
      createExpense({
        tripId: tripId,
        expenseData: data,
      })
    );
    form.reset();
    setIsModalOpen(false);
  };

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
            <div
              className="flex items-center justify-between m-2"
              key={element._id}
            >
              <span className="flex items-center">
                {isRemoveMode && (
                  <div className="flex items-center w-5 mr-2">
                    <Checkbox
                      checked={selectedExpenses.includes(element._id)}
                      onCheckedChange={() => handleExpenseSelection(element)}
                    />
                  </div>
                )}
                <span className={`${isRemoveMode ? "" : "flex-1"}`}>
                  {element.description}
                </span>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="m-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
          </Form>
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

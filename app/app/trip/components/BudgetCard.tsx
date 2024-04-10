import { Card } from "@/components/ui/card";

function BudgetCard({ budget }: { budget: number | undefined }) {
  return (
    <Card className="max-w-sm mb-2 cursor-pointer">
      <div className="text-center justify-center m-2 p-2"></div>
      <h2>Add a budget allocated to your trip</h2>
      <br />
      {budget}
    </Card>
  );
}

export default BudgetCard;

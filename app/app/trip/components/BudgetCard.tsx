import { Card } from "@/components/ui/card";

function BudgetCard() {
  return (
    <Card className="max-w-sm mb-2 flex justify-center items-center cursor-pointer">
      <div className="text-center justify-center m-2 p-2"></div>
      <h2>Add a budget allocated to your trip</h2>
    </Card>
  );
}

export default BudgetCard;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function BudgetCard({ budget }: { budget: number | undefined }) {
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
        <div className="flex justify-between m-2">
          <span>Horsebackriding</span>
          <span>-300</span>
        </div>
        <div className="flex justify-between m-2">
          <span>Museum</span>
          <span>1000</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between m-2">
          <span>Budget left</span>
          <span>7500</span>
        </div>
        <Button className="bottom-2 left-2 m-4 px-4 py-2">Add expense</Button>
      </div>
    </Card>
  );
}

export default BudgetCard;

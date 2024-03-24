import BudgetCard from "./components/BudgetCard";
import Day from "./components/Day";
import TripDocuments from "./components/TripDocumets";

export default function TripPage() {
  return (
    <>
      <h1 className="m-10 pt-6 justify-center text-center font-bold">
        Your Trip To Holland
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center mt-6 ml-6 pt-6">
        <div className="flex flex-col">
          <div className="h-auto max-w-full rounded-lg">
            <Day />
          </div>
          <div className="h-auto max-w-full rounded-lg">
            <Day />
          </div>
          <div className="h-auto max-w-full rounded-lg">
            <Day />
          </div>
          <div className="h-auto max-w-full rounded-lg">
            <Day />
          </div>
        </div>
        <div className="flex flex-col mt-6 mb-6">
          <div className="h-auto max-w-full rounded-lg mb-6">
            <BudgetCard />
          </div>
          <div className="h-auto max-w-full rounded-lg">
            <TripDocuments />
          </div>
        </div>
      </div>
    </>
  );
}

{
}

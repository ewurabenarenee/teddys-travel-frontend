import AddTripCard from "./AddTripCard";
import TripCard from "./TripCard";

function Dashboard() {
  return (
    <div className="flex justify-center items-center m-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TripCard />
        <TripCard />
        <TripCard />
        <TripCard />
        <TripCard />
        <AddTripCard />
      </div>
    </div>
  );
}

export default Dashboard;

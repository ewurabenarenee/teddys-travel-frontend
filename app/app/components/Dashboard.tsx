"use client";

import { AppDispatch, RootState } from "@/app/store/store";
import { fetchTrips } from "@/app/store/tripSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTripCard from "./AddTripCard";
import TripCard from "./TripCard";

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { trips, loading, error } = useSelector(
    (state: RootState) => state.trip
  );

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center m-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
        <AddTripCard />
      </div>
    </div>
  );
}

export default Dashboard;

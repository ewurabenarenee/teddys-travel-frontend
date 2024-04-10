"use client";

import { useEffect } from "react";
import BudgetCard from "../components/BudgetCard";
import Day from "../components/Day";
import TripDocuments from "../components/TripDocumets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { deleteTrip, fetchTrip } from "@/app/store/tripSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TripPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const { trip, loading, error } = useSelector(
    (state: RootState) => state.trip
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchTrip(params.id));
  }, [dispatch]);

  function handleDelete() {
    dispatch(deleteTrip(params.id));
    router.push("/app");
  }

  const days = trip?.days.map((element, index) => (
    <div key={index} className="h-auto max-w-full rounded-lg">
      <Day date={element.date} index={index + 1} />
    </div>
  ));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1 className="m-10 pt-6 justify-center text-center font-bold">
        Your Trip To {trip?.name}
        <Button onClick={handleDelete}>Delete this trip</Button>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center mt-6 ml-6 pt-6">
        <div className="flex flex-col">{days}</div>
        <div className="flex flex-col mt-6 mb-6">
          <div className="h-auto max-w-full rounded-lg mb-6">
            <BudgetCard budget={trip?.budget} />
          </div>
          <div className="h-auto max-w-full rounded-lg">
            <TripDocuments />
          </div>
        </div>
      </div>
    </>
  );
}

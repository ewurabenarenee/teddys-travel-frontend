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
        <br />
        <Button className="mt-4" onClick={handleDelete}>
          Delete this trip
        </Button>
      </h1>
      <div className="flex flex-col md:flex-row gap-10 m-6">
        <div className="flex-1 md:w-3/4">{days}</div>
        <div className="md:w-1/4">
          <div className="h-auto max-w-full rounded-lg ">
            <BudgetCard budget={trip?.budget} />
          </div>
        </div>
      </div>
    </>
  );
}

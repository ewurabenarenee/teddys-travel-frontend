"use client";

import { AppDispatch, RootState } from "@/app/store/store";
import {
  deleteTrip,
  fetchTrip,
  updateTrip,
  updateTripImage,
} from "@/app/store/tripSlice";
import { Button } from "@/components/ui/button";
import { faCheck, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BudgetCard from "../components/BudgetCard";
import Day from "../components/Day";

export default function TripPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const { trip, loading, error } = useSelector(
    (state: RootState) => state.trip
  );
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [newTripName, setNewTripName] = useState(trip?.name || "");

  useEffect(() => {
    dispatch(fetchTrip(params.id));
  }, [dispatch, params.id]);

  const sortedDays = useMemo(() => {
    if (trip && trip.days) {
      return trip.days
        .slice()
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }
    return [];
  }, [trip]);

  function handleDelete() {
    dispatch(deleteTrip(params.id));
    router.push("/app");
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(updateTripImage({ tripId: params.id, file }));
    }
  };

  function handleSaveName() {
    if (newTripName.trim() !== "") {
      dispatch(
        updateTrip({
          tripId: params.id,
          tripData: {
            name: newTripName,
          },
        })
      );
      setEditingName(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1 className="m-10 pt-6 justify-center text-center font-bold">
        Your Trip To{" "}
        {editingName ? (
          <>
            <input
              type="text"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              className="border-b border-gray-400 focus:outline-none focus:border-indigo-500"
            />
            <FontAwesomeIcon
              icon={faCheck}
              className="ml-2 cursor-pointer text-green-500"
              onClick={handleSaveName}
            />
          </>
        ) : (
          <>
            {trip?.name}
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="ml-2 cursor-pointer text-blue-500"
              onClick={() => setEditingName(true)}
            />
          </>
        )}
        <br />
        <Button className="mt-4" onClick={handleDelete}>
          Delete this trip
        </Button>
      </h1>
      <div className="flex flex-col md:flex-row gap-10 m-6">
        <div className="flex-1 md:w-3/4">
          {sortedDays.map((day, index) => (
            <div key={day._id} className="h-auto max-w-full rounded-lg">
              <Day day={day} index={index} tripId={params.id} />
            </div>
          ))}
        </div>
        <div className="md:w-1/4">
          <div className="h-auto max-w-full rounded-lg ">
            <BudgetCard budget={trip?.budget} tripId={params.id} />
          </div>
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
      </div>
    </>
  );
}

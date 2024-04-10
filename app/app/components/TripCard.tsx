import { Trip } from "@/app/store/tripTypes";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import windmill from "../assets/windmill.jpg";

function TripCard({ trip }: { trip: Trip }) {
  console.log(trip);
  return (
    <Link href={`/app/trip/${trip._id}`}>
      <Card className="w-80 xl:w-96 h-96">
        <div className="relative h-64">
          <Image
            className="rounded-t-lg object-cover w-full h-full"
            src={windmill}
            alt="windmill"
            fill
          />
        </div>
        <div className="p-6">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">
            {trip.name}
          </h1>
          <p className="text-sm">
            {new Date(trip.startDate).toLocaleDateString()}
            {" - "}
            {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default TripCard;

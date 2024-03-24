import { Card } from "@/components/ui/card";
import Link from "next/link";

function AddTripCard() {
  return (
    <Link href="/app/trip/new">
      <Card className="h-96 w-80 xl:w-96 flex justify-center items-center cursor-pointer">
        <span className="text-8xl text-primary">+</span>
      </Card>
    </Link>
  );
}

export default AddTripCard;

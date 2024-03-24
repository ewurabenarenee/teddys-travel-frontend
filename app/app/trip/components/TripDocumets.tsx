import { Card } from "@/components/ui/card";

function TripDocuments() {
  return (
    <Card className="max-w-sm mb-2 flex justify-center items-center cursor-pointer">
      <ul className="text-center justify-center m-2 p-2">
        <h2 className="text-bold">
          <li>Documents for your trip</li>
        </h2>
        <li>Passport</li>
        <li>Health Insuarance</li>
        <li>Visa</li>
        <li>Bank Statement</li>
        <li>Accomodation</li>
        <li>Drivers license</li>
        <li>Covid certificate</li>
      </ul>
    </Card>
  );
}

export default TripDocuments;

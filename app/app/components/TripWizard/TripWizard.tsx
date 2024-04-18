import { RootState } from "@/app/store/store";
import { createTrip } from "@/app/store/tripSlice";
import { Card } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepWizard from "react-step-wizard";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

function TripWizard() {
  const [tripDetails, setTripDetails] = useState({
    tripName: "",
    places: [],
    dateFrom: "",
    dateTo: "",
    budget: 0,
    currentStep: 1,
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.trip.loading);
  const { toast } = useToast();

  function updateTripDetails(newDetails) {
    setTripDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
  }

  async function handleSubmit(budget) {
    const payload = {
      name: tripDetails.tripName,
      places: tripDetails.places,
      startDate: tripDetails.dateFrom,
      endDate: tripDetails.dateTo,
      visaRequired: false,
      budget: budget,
    };

    try {
      await dispatch(createTrip(payload)).unwrap();
      toast({
        description: "Trip has been created for you!",
      });
      router.push("/app");
    } catch (error) {
      console.error("Error creating trip:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  function handleStepChange(stats) {
    updateTripDetails({ currentStep: stats.activeStep });
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-8 max-w-md w-full">
        <StepWizard onStepChange={handleStepChange}>
          <Step1
            tripDetails={tripDetails}
            updateTripDetails={updateTripDetails}
          />
          <Step2
            tripDetails={tripDetails}
            updateTripDetails={updateTripDetails}
          />
          <Step3
            tripDetails={tripDetails}
            updateTripDetails={updateTripDetails}
            onSubmit={(budget) => handleSubmit(budget)}
            loading={loading}
          />
        </StepWizard>
        <div className="flex justify-center space-x-2 mt-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-3 w-3 rounded-full ${
                tripDetails.currentStep === step ? "bg-primary" : "bg-secondary"
              }`}
            ></div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default TripWizard;

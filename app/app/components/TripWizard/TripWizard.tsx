import { Card } from "@/components/ui/card";
import { useState } from "react";
import StepWizard from "react-step-wizard";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

function TripWizard() {
  const [tripDetails, setTripDetails] = useState({
    tripName: "",
    dateFrom: "",
    dateTo: "",
    budget: "",
    currentStep: 1,
  });

  function updateTripDetails(newDetails) {
    setTripDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
  }

  function handleSubmit() {
    console.log(`Trip Details ${JSON.stringify(tripDetails, null, 2)}`);
    alert("Form Submitted! Check the console for details.");
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
            onSubmit={handleSubmit}
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

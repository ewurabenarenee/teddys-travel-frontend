"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

function Step2(props) {
  function handleDateChange(dateRange) {
    props.updateTripDetails({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
    });
  }

  function isNextDisabled() {
    return !props.tripDetails.dateFrom || !props.tripDetails.dateTo;
  }

  return (
    <div className="step step2">
      <CardTitle className="mb-4">Step 2: When are you going?</CardTitle>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !props.tripDetails.dateFrom &&
                !props.tripDetails.dateTo &&
                "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {props.tripDetails.dateFrom && props.tripDetails.dateTo ? (
              <>
                {format(props.tripDetails.dateFrom, "LLL dd, y")} -{" "}
                {format(props.tripDetails.dateTo, "LLL dd, y")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={props.tripDetails.dateFrom}
            selected={{
              from: props.tripDetails.dateFrom,
              to: props.tripDetails.dateTo,
            }}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="flex justify-between">
        <Button className="mt-4" onClick={props.previousStep}>
          Previous
        </Button>
        <Button
          className="mt-4"
          onClick={props.nextStep}
          disabled={isNextDisabled()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Step2;

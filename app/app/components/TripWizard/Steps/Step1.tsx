import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  tripName: z.string().min(2, {
    message: "Trip name must be at least 2 letters.",
  }),
  places: z
    .string()
    .transform((places) => places.split(",").map((dest) => dest.trim())),
});

function Step1(props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripName: "",
      places: "",
    },
  });

  function onSubmit(values) {
    props.updateTripDetails({
      tripName: values.tripName,
      places: values.places,
    });
    props.nextStep();
  }

  return (
    <div className="step1">
      <CardTitle className="mb-4">Step 1: What is your trip name?</CardTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="tripName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jamaica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="places"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What are some of the places you'll be visiting?
                </FormLabel>
                <FormControl>
                  <Input placeholder="Kingston, Montego Bay" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-4"
            type="submit"
            disabled={!form.watch("tripName") || !form.watch("places")}
          >
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Step1;

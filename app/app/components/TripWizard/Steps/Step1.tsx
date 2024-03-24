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
});

function Step1(props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.updateTripDetails({ tripName: values.tripName });
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
          <Button
            className="mt-4"
            type="submit"
            disabled={!form.watch("tripName")}
          >
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Step1;

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
  budget: z.preprocess(
    (value) => parseInt(value),
    z.number().min(100, "Budget must be at least 100.")
  ),
});

function Step3(props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: "",
    },
  });

  function onSubmit(values) {
    props.onSubmit(values.budget);
  }

  return (
    <div className="step step3">
      <CardTitle className="mb-4">Step 3: What's your budget?</CardTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Budget" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={props.previousStep}
              className="mt-4"
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="mt-4"
              disabled={!form.watch("budget") || props.loading}
            >
              {props.loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Step3;

import {
  createActivity,
  deleteActivity,
  fetchActivities,
  moveActivityDown,
  moveActivityUp,
  updateActivity,
} from "@/app/store/activitySlice";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  faCaretDown,
  faCaretUp,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

interface DayProps {
  day: {
    date: string;
    _id: string;
  };
  index: number;
  tripId: string;
}

const activitySchema = z.object({
  name: z.string().min(1, { message: "Activity name is required." }),
  description: z
    .string()
    .min(1, { message: "Activity description is required." }),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export default function Day({ day, index, tripId }: DayProps) {
  const dispatch = useDispatch<AppDispatch>();
  const activities = useSelector(
    (state: RootState) => state.activity.activitiesByDay[day._id] || []
  );
  const loading = useSelector((state: RootState) => state.activity.loading);
  const error = useSelector((state: RootState) => state.activity.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isExpanded) {
      dispatch(fetchActivities({ tripId, dayId: day._id }));
    }
  }, [dispatch, tripId, day._id, isExpanded]);

  const dayNumber = index + 1;
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  function handleAddActivity() {
    setIsModalOpen(true);
    setEditingActivityId(null);
    form.reset();
  }

  function onSubmit(data: ActivityFormData) {
    if (editingActivityId) {
      dispatch(
        updateActivity({
          tripId,
          dayId: day._id,
          activityId: editingActivityId,
          activityData: data,
        })
      );
    } else {
      dispatch(
        createActivity({
          tripId,
          dayId: day._id,
          activityData: data,
        })
      );
    }
    setIsModalOpen(false);
    form.reset();
    setEditingActivityId(null);
  }

  function handleDeleteActivity(activityId: string) {
    dispatch(deleteActivity({ tripId, dayId: day._id, activityId }));
  }

  function handleEditActivity(activity: Activity) {
    setIsModalOpen(true);
    setEditingActivityId(activity._id);
    form.setValue("name", activity.name);
    form.setValue("description", activity.description);
  }

  async function handleMoveActivityUp(activityId: string) {
    try {
      await dispatch(
        moveActivityUp({ tripId, dayId: day._id, activityId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to move activity up:", error);
    }
  }

  async function handleMoveActivityDown(activityId: string) {
    try {
      await dispatch(
        moveActivityDown({ tripId, dayId: day._id, activityId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to move activity down:", error);
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      onValueChange={(value) => setIsExpanded(value === day._id)}
    >
      <AccordionItem value={day._id}>
        <AccordionTrigger>
          Day {dayNumber} ({formattedDate})
        </AccordionTrigger>
        <AccordionContent>
          {loading ? (
            <div>Loading activities...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : activities.length > 0 ? (
            <Table>
              <TableHeader>
                {activities.map((activity) => (
                  <TableRow key={activity._id}>
                    <TableHead>
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        onClick={() => handleMoveActivityUp(activity._id)}
                        className="cursor-pointer mr-2"
                      />
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        onClick={() => handleMoveActivityDown(activity._id)}
                        className="cursor-pointer mr-2"
                      />
                      {activity.name}
                    </TableHead>
                    <TableHead>{activity.description}</TableHead>
                    <TableHead className="text-right">
                      <div>
                        <FontAwesomeIcon
                          onClick={() => handleEditActivity(activity)}
                          icon={faEdit}
                          className="cursor-pointer mx-2"
                        />
                        <FontAwesomeIcon
                          onClick={() => handleDeleteActivity(activity._id)}
                          icon={faTrashAlt}
                          className="cursor-pointer"
                        />
                      </div>
                    </TableHead>
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          ) : (
            <div>No activities found.</div>
          )}
          <br />
          {isModalOpen && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Table>
                  <TableRow>
                    <TableHead>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Activity Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableHead>
                    <TableHead>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Activity Description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableHead>
                    <TableHead className="text-right">
                      <Button type="submit" className="m-4 p-4">
                        {editingActivityId ? "Update" : "Submit"}
                      </Button>
                    </TableHead>
                  </TableRow>
                </Table>
              </form>
            </Form>
          )}
          <br />
          <Button onClick={handleAddActivity}>Add Activity</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

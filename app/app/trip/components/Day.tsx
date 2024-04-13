import {
  createActivity,
  deleteActivity,
  fetchActivities,
} from "@/app/store/activitySlice";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KeyboardEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface DayProps {
  day: {
    date: string;
    _id: string;
  };
  index: number;
  tripId: string;
}

export default function Day({ day, index, tripId }: DayProps) {
  const dispatch = useDispatch<AppDispatch>();
  const activities = useSelector(
    (state: RootState) => state.activity.activitiesByDay[day._id] || []
  );
  const loading = useSelector((state: RootState) => state.activity.loading);
  const error = useSelector((state: RootState) => state.activity.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleAddActivity = () => {
    setIsModalOpen(true);
  };

  const handleSubmitActivity = (event) => {
    event.preventDefault();
    dispatch(
      createActivity({
        tripId,
        dayId: day._id,
        activityData: {
          name: activityName,
          description: activityDescription,
        },
      })
    );
    setIsModalOpen(false);
    setActivityName("");
    setActivityDescription("");
  };

  const handleDeleteActivity = (activityId: string) => {
    dispatch(deleteActivity({ tripId, dayId: day._id, activityId }));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitActivity(event as any);
    }
  };

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
                    <TableHead>{activity.name}</TableHead>
                    <TableHead>{activity.description}</TableHead>
                    <TableHead className="text-right">
                      <Button
                        onClick={() => handleDeleteActivity(activity._id)}
                      >
                        Delete
                      </Button>
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
            <form onSubmit={handleSubmitActivity}>
              <Table>
                <TableRow>
                  <TableHead>
                    <textarea
                      placeholder="Activity Name"
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                      className="w-full"
                    />
                  </TableHead>
                  <TableHead>
                    <textarea
                      placeholder="Activity Description"
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                      className="w-full"
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <Button type="submit" className="m-4 p-4">
                      Submit
                    </Button>
                  </TableHead>
                </TableRow>
              </Table>
            </form>
          )}
          <br />
          <Button onClick={handleAddActivity}>Add Activity</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

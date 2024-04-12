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
import { useEffect, useState } from "react";
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

  const handleSubmitActivity = () => {
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
            <ul>
              {activities.map((activity) => (
                <li key={activity._id}>
                  <strong>{activity.name}</strong>: {activity.description}
                  <Button onClick={() => handleDeleteActivity(activity._id)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div>No activities found.</div>
          )}
          <Button onClick={handleAddActivity}>Add Activity</Button>
          {isModalOpen && (
            <div>
              <input
                type="text"
                placeholder="Activity Name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
              <textarea
                placeholder="Activity Description"
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
              ></textarea>
              <Button onClick={handleSubmitActivity}>Submit</Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

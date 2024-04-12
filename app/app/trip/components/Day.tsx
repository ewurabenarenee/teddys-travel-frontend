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
            <Table>
              <TableHeader>
                {activities.map((activity) => (
                  <TableRow key={activity._id}>
                    <TableHead className="">{activity.name}</TableHead>
                    <TableHead>{activity.description}</TableHead>
                    <TableHead className="text-right">
                      {" "}
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
            <div>
              <table>
                <TableHeader>
                  {/* <TableRow> */}
                  <TableHead className="w-[100px]">
                    {" "}
                    <textarea
                      placeholder="Activity Name"
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                    />
                  </TableHead>
                  <TableHead>
                    {" "}
                    <textarea
                      placeholder="Activity Description"
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    {" "}
                    <Button className="m-4 p-4" onClick={handleSubmitActivity}>
                      Submit
                    </Button>
                  </TableHead>
                  {/* </TableRow> */}
                </TableHeader>
              </table>
            </div>
          )}
          <br />
          <Button onClick={handleAddActivity}>Add Activity</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

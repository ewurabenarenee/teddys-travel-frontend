"use client";

import { AppDispatch, RootState } from "@/app/store/store";
import {
  deleteTrip,
  fetchTrip,
  shareTrip,
  updateTrip,
  updateTripImage,
} from "@/app/store/tripSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  faCheck,
  faPencilAlt,
  faShare,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import defaultTripImage from "../../assets/defaultTripImage.jpg";
import BudgetCard from "../components/BudgetCard";
import Day from "../components/Day";
import WeatherCard from "../components/WeatherCard";

const shareSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address"),
});

const tripNameSchema = z.object({
  tripName: z.string().min(1, "Trip name is required"),
});

const shareFormOptions = { resolver: zodResolver(shareSchema) };
const tripNameFormOptions = { resolver: zodResolver(tripNameSchema) };

export default function TripPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const { trip, loading, error } = useSelector(
    (state: RootState) => state.trip
  );
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  const {
    control: shareControl,
    handleSubmit: handleShareSubmit,
    reset: resetShareForm,
    formState: { errors: shareErrors },
  } = useForm(shareFormOptions);

  const {
    control: tripNameControl,
    handleSubmit: handleTripNameSubmit,
    formState: { errors: tripNameErrors },
  } = useForm(tripNameFormOptions);

  useEffect(() => {
    dispatch(fetchTrip(params.id));
  }, [dispatch, params.id]);

  const sortedDays =
    trip?.days
      ?.slice()
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ) || [];

  function handleDelete() {
    dispatch(deleteTrip(params.id));
    router.push("/app");
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await dispatch(updateTripImage({ tripId: params.id, file })).unwrap();
        toast({
          description: "Image uploaded successfully!",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem uploading the image.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleSaveName = ({ tripName }) => {
    dispatch(
      updateTrip({
        tripId: params.id,
        tripData: { name: tripName },
      })
    );
    setEditingName(false);
  };

  const onShareSubmit = async ({ recipientName, recipientEmail }) => {
    try {
      await dispatch(
        shareTrip({
          tripId: params.id,
          recipientName,
          recipientEmail,
        })
      ).unwrap();
      toast({
        description: "Trip shared successfully!",
      });
      setIsShareOpen(false);
      resetShareForm();
    } catch (error) {
      console.error("Error sharing trip:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sharing the trip.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <Image
          className="object-cover w-full h-full blur-md"
          src={trip?.imageUrl || defaultTripImage}
          alt="Trip Image"
          fill
        />
        <div className="absolute inset-0 bg-secondary opacity-75"></div>
      </div>
      <div className="relative pt-6 text-primary-background overflow-auto">
        <h1 className="m-10 flex justify-center items-center font-bold">
          Your Trip To{" "}
          {editingName ? (
            <form
              onSubmit={handleTripNameSubmit(handleSaveName)}
              className="flex items-center"
            >
              <Controller
                name="tripName"
                control={tripNameControl}
                defaultValue={trip?.name || ""}
                render={({ field }) => (
                  <Input {...field} type="text" className="w-auto ml-2" />
                )}
              />
              <button type="submit" className="ml-2">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="cursor-pointer text-green-500 w-4 h-4"
                />
              </button>
            </form>
          ) : (
            <>
              {trip?.name}
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="ml-2 cursor-pointer text-blue-500 w-4 h-4"
                onClick={() => setEditingName(true)}
              />
            </>
          )}
        </h1>
        <div className="flex mx-6 mt-4 md:space-x-4 space-y-2 flex-col md:flex-row items-center">
          <Button onClick={handleDelete}>Delete this trip</Button>
          <Collapsible open={isShareOpen} onOpenChange={setIsShareOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShare} className="w-4 h-4" /> Share
                Trip
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <form
                onSubmit={handleShareSubmit(onShareSubmit)}
                className="flex flex-col gap-2"
              >
                <Controller
                  name="recipientName"
                  control={shareControl}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="Recipient Name" />
                  )}
                />
                <Controller
                  name="recipientEmail"
                  control={shareControl}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Recipient Email"
                    />
                  )}
                />
                <Button type="submit">Send Invite</Button>
              </form>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} className="w-4 h-4" /> Upload a
                Cover Picture For the Dashboard
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4">
                <div className="grid w-full max-w-sm font-bold items-center gap-1.5">
                  <Input
                    id="picture"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="flex flex-col md:flex-row gap-10 m-6">
          <div className="flex-1 md:w-3/4">
            {sortedDays.map((day, index) => (
              <div key={day._id} className="h-auto max-w-full rounded-lg">
                <Day day={day} index={index} tripId={params.id} />
              </div>
            ))}
          </div>
          <div className="md:w-1/4">
            <WeatherCard places={trip?.places || []} />
            <BudgetCard budget={trip?.budget} tripId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

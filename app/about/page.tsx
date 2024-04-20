"use server";

import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export async function AboutPage() {
  return (
    <main className="">
      <p className="m-10">
        Welcome to Teddy's Travel, your premier destination service dedicated to
        flawless trip planning and organization. Whether it's a weekend escape
        or an adventurous journey, We have got you covered as our platform
        provide features for users to create, manage and share their travel
        plans. Experience the convenience of our trip dashboard, where you can
        see every aspect of your journey.
        <br />
        <br />
        Our trip creation and management tools helps you to tailor your
        itinerary to perfection. We offer a comprehensive trip view which is
        enchanced by features like calendar intergretion, budget tracking and a
        real time weather forecasts to help you to stay informed.
        <br />
        <br />
        Teddy's Travel makes it easy to connect and engage with like-minded
        adventurers therefore we've also incoperated sharing options into our
        platform to assist users to share their trips and connect with fellow
        travellers.
        <br />
        <br />
        Sign up now and unlock a world of splendid holiday ideas and
        destinations tailored to your preferences to make your trip a memorable
        one.
        <br />
        <br />
        <span className="italic font-bold">
          "Teddy's Travel, your ultimate trip-planning companion".
        </span>
      </p>

      <h1 className="mx-10 mb-4 text-4xl text-center italic">App Features</h1>
      <div className="flex justify-center mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 m-4">
          <Card className="max-w-sm">
            <div className="p-6">
              <Image
                className="rounded-t-lg"
                src="/calendar.jpg"
                width={1000}
                height={100}
                alt="calendar"
              />
              <CardTitle className="my-2">Calendar</CardTitle>
              Organize your trip with our calendar.
            </div>
          </Card>

          <Card className="max-w-sm">
            <div className="p-6">
              <Image
                className="rounded-t-lg"
                src="/budget.jpg"
                width={1000}
                height={100}
                alt="Budget"
              />
              <CardTitle className="my-2">Budget</CardTitle>
              Let's help you with an estimated budget for your trip.
            </div>
          </Card>

          <Card className="max-w-sm">
            <div className="p-6">
              <Image
                className="rounded-t-lg"
                src="/weather.jpg"
                width={1000}
                height={100}
                alt="Weather"
              />
              <CardTitle className="my-2">Weather</CardTitle>
              We've got you covered with all the weather forecast details
              tailored specifically to your trip. Whether you're planning a
              weekend getaway or a month-long adventure, we'll provide you with
              up-to-date forecasts so you can pack accordingly and make the most
              of your journey.
            </div>
          </Card>

          <Card className="max-w-sm">
            <div className="p-6">
              <Image
                className="rounded-t-lg"
                src="/share.jpg"
                width={1000}
                height={100}
                alt="Share"
              />
              <CardTitle className="my-2">Share</CardTitle>
              Share your trip with your friends and family via email.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;

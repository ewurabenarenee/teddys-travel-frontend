"use server";

import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export async function AboutPage() {
  return (
    <main className="">
      <p className="m-10">
        Teddy's Travel is a service which allows you to plan and oranize your
        trips. It helps you with the planning as it offers features for users to
        create, manage and share their travel plans. Some of these features
        includes a trip dashboard, trip creation and management tools, a
        detailed trip view, and additional features like weather forcasts and
        sharing options. Sign up to discover our splendid holiday ideas and
        destinations ideal for your travels as we have numerous activities and
        adventures line up for you to make your trip a memorable one.
      </p>

      <h1 className="mx-10 mb-4 text-4xl text-center italic">App Features</h1>
      <div className="flex justify-center items-center mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-4">
          <Card className="max-w-sm">
            <div className="p-6">
              <Image
                className="rounded-t-lg"
                src="/calendar.jpg"
                width={1000}
                height={100}
                alt="calender"
              />
              <CardTitle className="my-2">Calendar</CardTitle>
              Organize your trip with our calender
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
              Lets help you with an estimated budget for your trip
            </div>
          </Card>

          <Card className="max-w-sm">
            <div className="p-6">
              {/* <Image className="rounded-t-lg" src={weather} alt="weather" /> */}
              <Image
                className="rounded-t-lg"
                src="/weather.jpg"
                width={1000}
                height={100}
                alt="Weather"
              />
              <CardTitle className="my-2">Weather</CardTitle>
              We got you covered with all the weather forecast pertaining to
              your trip
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;

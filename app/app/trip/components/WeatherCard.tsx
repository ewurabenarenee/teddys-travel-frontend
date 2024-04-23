import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface WeatherCardProps {
  places: string[];
}

export default function WeatherCard({ places }: WeatherCardProps) {
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [weatherData, setWeatherData] = useState<{
    currentTemp: number;
    next2DaysTemp: number[];
  } | null>(null);

  useEffect(() => {
    async function fetchWeatherData() {
      if (places.length > 0) {
        const response = await fetch(
          `http://localhost:3000/weather/${places[currentPlaceIndex]}`
        );
        const data = await response.json();
        setWeatherData(data);
      }
    }

    fetchWeatherData();

    const interval = setInterval(() => {
      console.log("Changing Place");
      setCurrentPlaceIndex((prevIndex) => (prevIndex + 1) % places.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [places, currentPlaceIndex]);

  if (places.length === 0) {
    return null;
  }

  return (
    <Card className="max-w-sm mb-2 cursor-pointer relative bg-secondary">
      <div className="relative">
        <div className="text-center justify-center m-2 p-2">
          <h2 className="text-lg font-semibold">
            Weather in {places[currentPlaceIndex]}
          </h2>
        </div>

        {weatherData ? (
          <div className="flex flex-col items-center m-2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-left ">Current Temperature:</td>
                  <td className="text-right">{weatherData.currentTemp}°C</td>
                </tr>
                <tr>
                  <td className="text-left">Tomorrow:</td>
                  <td className="text-right">
                    {weatherData.next2DaysTemp[0]}°C
                  </td>
                </tr>
                <tr>
                  <td className="text-left">The Day after Tomorrow:</td>
                  <td className="text-right">
                    {weatherData.next2DaysTemp[1]}°C
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">Loading weather data...</p>
        )}
      </div>
    </Card>
  );
}

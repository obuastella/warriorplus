import BloodCount from "./components/BloodCount";
import Header from "./components/Header";
import HydrationTracker from "./components/HydrationTracker";
import Remainders from "./components/Remainders";
import Statistics from "./components/Statistics";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Header />
      <Statistics />
      <section className="flex flex-col md:flex-row gap-x-2 justify-between w-full">
        <Remainders />
        <HydrationTracker />
      </section>
      <div className="px-6 mb-20 md:mb-8">
        <BloodCount />
      </div>
    </div>
  );
}

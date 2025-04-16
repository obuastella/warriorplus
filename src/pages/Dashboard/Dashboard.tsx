import Header from "./components/Header";
import HydrationTracker from "./components/HydrationTracker";
import Remainders from "./components/Remainders";
import Statistics from "./components/Statistics";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Header />
      <Statistics />
      <section className="flex gap-x-10 justify-between w-full">
        <Remainders />
        <HydrationTracker />
      </section>
    </div>
  );
}

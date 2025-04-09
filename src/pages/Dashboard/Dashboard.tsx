import Header from "./components/Header";
import Statistics from "./components/Statistics";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Header />
      <Statistics />
    </div>
  );
}

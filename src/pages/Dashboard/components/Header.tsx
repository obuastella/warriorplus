import { Hand } from "lucide-react";

export default function Header() {
  return (
    <section className="p-8 flex justify-start items-start gap-x-4 w-full bg-primary text-white">
      <div>
        <Hand size={40} className="animate-pulse" />
      </div>
      <div>
        <h1 className="text-sm md:text-lg font-bold">Hello, User!</h1>
        <p className="text-sm md:text-lg">
          Today is Monday. Remeber to stay hydrated and take your medication.
          Stay strong!
        </p>
      </div>
    </section>
  );
}

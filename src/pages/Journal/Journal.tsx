export default function Journal() {
  const entries = [
    {
      date: "2025-01-01",
      duration: "2 hours",
      severity: "Moderate",
      description: "I was in so much pain",
    },
    {
      date: "2025-01-11",
      duration: "3 hours",
      severity: "Severe",
      description: "Words cannot explain",
    },
    {
      date: "2025-02-12",
      duration: "1 hour",
      severity: "Mild",
      description: "",
    },
  ];
  const handleSubmit = (e: any) => {
    e.preveentDefault();
  };
  return (
    <div className="flex gap-x-4">
      <div className="p-4 w-[30%] bg-primary/40 h-screen">
        <h2 className="mb-4 text-lg font-semibold">Previous Entries</h2>
        {entries.map((entry, id) => (
          <div
            key={id}
            className="my-4 space-y-1 rounded-sm border border-[#f5f5f5] p-3 text-sm font-light bg-white"
          >
            <p>Date: {entry.date}</p>
            <p>Duration: {entry.duration}</p>
            <p>Severity: {entry.severity}</p>
            <p>Description: {entry.description}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border border-[#f5f5f5] w-[70%] h-screen">
        <h2 className="text-lg font-semibold">Log a New Pain Episode</h2>
        <form onSubmit={handleSubmit} className="mt-4" action="">
          <div className="">
            <label htmlFor="">Date</label>
            <input
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              type="date"
              name=""
              id=""
            />
          </div>
          <div className="mt-4">
            <label htmlFor="">Duration in (hours)</label>
            <input
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              type="number"
              name=""
              id=""
            />
          </div>
          <div className="mt-4">
            <label htmlFor="">Severity</label>

            <select
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              name=""
              id=""
            >
              <option value=""></option>
              <option value="">Mild</option>
              <option value="">Moderate</option>
              <option value="">Severe</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="">Description</label>
            <textarea
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              name=""
              id=""
              cols={4}
              rows={5}
            ></textarea>
          </div>
          <button className="cursor-pointer mt-10 text-white bg-primary w-full p-3 rounded-md">
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
}

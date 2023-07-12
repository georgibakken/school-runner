type SchoolType = {
  "[Institution].[Institution].[Institution]": string;
  "[Institution].[Institutionstype].[Institutionstype]": string;
  Karaktergennemsnit: number;
};

async function getData() {
  const data = {
    område: "GS",
    emne: "OVER",
    underemne: "OVERSKO",
    nøgletal: ["Karaktergennemsnit"],
    detaljering: [
      "[Institution].[Institution]",
      "[Institution].[Institutionstype]",
      "[Institution].[Kommune]",
    ],
    filtre: {
      "[Institution].[Kommune]": ["København"],
    },
    indlejret: false,
    tomme_rækker: false,
    formattering: "json",
    side: 1,
  };

  const res = await fetch(
    "https://api.uddannelsesstatistik.dk/Api/v1/statistik",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.UDDANNELSE_API_KEY}`,
      },
      body: JSON.stringify(data),
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    console.log(res.status, res.statusText);
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page() {
  const data: SchoolType[] = await getData();

  return (
    <main>
      <h2 className={`mb-3 text-2xl font-semibold`}>Skoler i København</h2>

      {data.map((school) => {
        return (
          <div>
            <h2>{school["[Institution].[Institution].[Institution]"]}</h2>
            <p>Karaktergennemsnit: {school.Karaktergennemsnit}</p>
          </div>
        );
      })}
    </main>
  );
}

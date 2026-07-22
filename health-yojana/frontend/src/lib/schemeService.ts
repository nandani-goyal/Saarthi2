export const getEligibleSchemes = async (userData: any) => {
  const res = await fetch("http://localhost:3000/get-schemes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log(err);
    throw new Error(err);
  }

  const data = await res.json();
  console.log(data);

  return data.schemes ?? [];
};

export const getRecommendations =
async (userData: any) => {

  const response = await fetch(
    "http://localhost:5000/recommend",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify(userData)
    }
  );

  return await response.json();
};
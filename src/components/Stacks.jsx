import React, { useState, useEffect } from "react";
import { supabase } from "../client"; // Import the Supabase client instance

const Stacks = () => {
  const [stacks, setStacks] = useState([]); // State to store fetched data

  useEffect(() => {
    // Function to fetch data from the "Stack" table
    async function fetchStacks() {
      try {
        const { data, error } = await supabase.from("Stack").select("*");

        if (error) {
          throw error;
        }

        if (data) {
          setStacks(data); // Update the state with the fetched data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Call the fetchStacks function when the component mounts
    fetchStacks();
  }, []);

  return (
    <div>
      <h2>Stacks</h2>
      <ul>
        {stacks.map((stack) => (
          <li key={stack.id}>
            <strong>Name:</strong> {stack.name}
            <br />
            <strong>Time Created:</strong> {stack.time_created}
            <br />
            <strong>Owner:</strong> {stack.owner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stacks;

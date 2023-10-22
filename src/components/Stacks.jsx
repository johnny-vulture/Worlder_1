import React, { useState, useEffect } from "react";
import { supabase } from "../client";

const Stacks = () => {
  const [stacks, setStacks] = useState([]);

  useEffect(() => {
    async function fetchStacks() {
      try {
        const { data, error } = await supabase.from("Stack").select("*");

        if (error) {
          throw error;
        }

        if (data) {
          setStacks(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchStacks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Stacks</h2>
      <ul>
        {stacks.map((stack) => (
          <li key={stack.id} className="mb-4">
            <strong className="text-lg font-semibold">Name:</strong>{" "}
            {stack.name}
            <br />
            <strong className="text-lg font-semibold">
              Time Created:
            </strong>{" "}
            {stack.time_created}
            <br />
            <strong className="text-lg font-semibold">Owner:</strong>{" "}
            {stack.owner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stacks;

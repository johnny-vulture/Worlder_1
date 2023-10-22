import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";

const StackDetails = () => {
  const { stackId } = useParams(); // Get the stack ID from the URL

  const [stack, setStack] = useState(null);

  useEffect(() => {
    async function fetchStackDetails() {
      try {
        const { data, error } = await supabase
          .from("Stack")
          .select("*")
          .eq("id", stackId) // Filter by the stack ID from the URL
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setStack(data);
        }
      } catch (error) {
        console.error("Error fetching stack details:", error);
      }
    }

    fetchStackDetails();
  }, [stackId]);

  return (
    <div>
      {stack ? (
        <div>
          <h2>Stack Details</h2>
          <strong>Name:</strong> {stack.name}
          <br />
          <strong>Created At:</strong> {stack.created_at}
          {/* Display other stack details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StackDetails;

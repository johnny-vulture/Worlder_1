import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const StackDetails = () => {
  const { stackId } = useParams();
  const [stack, setStack] = useState(null);
  const [stackLinks, setStackLinks] = useState([]);

  useEffect(() => {
    async function fetchStackDetails() {
      try {
        const { data: stackData, error: stackError } = await supabase
          .from("Stack")
          .select("*")
          .eq("id", stackId)
          .single();

        if (stackError) {
          throw stackError;
        }

        if (stackData) {
          setStack(stackData);
        }
      } catch (stackError) {
        console.error("Error fetching stack details:", stackError);
      }
    }

    // Define a separate useEffect for fetching stack links
    async function fetchStackLinks() {
      try {
        const { data: linksData, error: linksError } = await supabase
          .from("Link")
          .select("*")
          .eq("stack_name", stack.name);

        if (linksError) {
          throw linksError;
        }

        if (linksData) {
          setStackLinks(linksData);
        }
      } catch (linksError) {
        console.error("Error fetching links:", linksError);
      }
    }

    fetchStackDetails(); // Fetch stack details first
    if (stack && stack.name) {
      fetchStackLinks(); // Fetch stack links only if stack and stack.name are available
    }
  }, [stackId, stack]); // stack is in the dependency array

  // Use this hook to programmatically navigate to another page
  const navigate = useNavigate();

  // This function is used to navigate to the home page
  // It will be called when the button is clicked
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {stack ? (
        <div>
          {/* Here's our custom back button */}
          <button onClick={goBack} className="back-button">
            &larr; Go Back
          </button>
          <h2>Stack Details</h2>
          <strong>Name:</strong> {stack.name}
          <br />
          <strong>Created At:</strong> {stack.created_at}
          {/* Display other stack details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h2>Links associated with this Stack</h2>
      <ul>
        {stackLinks.map((link) => (
          <li key={link.id}>
            <strong>Name:</strong> {link.name}
            <br />
            <strong>Source:</strong> {link.src}
            <br />
            {/* Display other link details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StackDetails;

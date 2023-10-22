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

    fetchStackDetails();
    if (stack && stack.name) {
      fetchStackLinks();
    }
  }, [stackId, stack]);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const deleteLink = async (linkId) => {
    try {
      await supabase.from("Link").delete().eq("id", linkId);
    } catch (error) {
      console.error("Error deleting link:", error);
    }

    try {
      const { data, error } = await supabase.from("Link").select("*");
      if (!error) {
        setStackLinks(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4">
      {stack ? (
        <div>
          <button
            onClick={goBack}
            className="mb-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            &larr; Go Back
          </button>
          <h2 className="text-2xl font-semibold">Stack Details</h2>
          <strong className="text-lg font-semibold">Name:</strong> {stack.name}
          <br />
          <strong className="text-lg font-semibold">Created At:</strong>{" "}
          {stack.created_at}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h2 className="text-2xl font-semibold mt-4">Stack Links</h2>
      <ul>
        {stackLinks.map((link) => (
          <li key={link.id} className="mb-4">
            <strong className="text-lg font-semibold">Name:</strong> {link.name}
            <br />
            <strong className="text-lg font-semibold">Source:</strong>{" "}
            {link.src}
            <br />
            <button
              onClick={() => {
                navigate(`/link/${link.id}`);
              }}
              className="mr-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteLink(link.id);
              }}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StackDetails;

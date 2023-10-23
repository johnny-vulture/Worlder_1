import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const StackDetails = () => {
  const { stackId } = useParams();
  const [stack, setStack] = useState(null);
  const [stackLinks, setStackLinks] = useState([]);
  const navigate = useNavigate();

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
          // After setting the stack, fetch the related links
          fetchStackLinks(stackData.name);
        }
      } catch (stackError) {
        console.error("Error fetching stack details:", stackError);
      }
    }

    async function fetchStackLinks(stackName) {
      try {
        const { data: linksData, error: linksError } = await supabase
          .from("Link")
          .select("*")
          .eq("stack_name", stackName);

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
  }, [stackId]);

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
            &larr;
          </button>
          <div>
            <h2>{stack.name}</h2>
            <h2>{stack.created_at}</h2>
          </div>
          <hr />
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h2 className="text-2xl font-semibold mt-4">Stack Links</h2>
      <ul>
        {stackLinks.map((link) => (
          <li key={link.id} className="my-4 ">
            <div class="w-1/2 mx-auto my-3">
              <div class="w-full shadow-2xl subpixel-antialiased rounded h-58 bg-black border-black mx-auto">
                <div
                  class="flex items-center h-6 rounded-t bg-gray-100 border-b border-gray-500 text-center text-black"
                  id="headerTerminal"
                >
                  <div
                    class="flex ml-2 items-center text-center border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3"
                    id="closebtn"
                  ></div>
                  <div
                    class="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3"
                    id="minbtn"
                  ></div>
                  <div
                    class="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3"
                    id="maxbtn"
                  ></div>
                  <div class="mx-auto pr-16" id="terminaltitle">
                    <p class="text-center text-sm">{stack.name}</p>
                  </div>
                </div>
                <div
                  class="pl-1 pt-1 h-auto  text-green-200 font-mono text-xs bg-black"
                  id="console"
                >
                  <p class="pb-1">name: {link.name}</p>
                  <p class="pb-1">Source: {link.src}</p>
                </div>
                <div className="mt-10 mx-auto flex justify-items-center">
                  <button
                    onClick={() => {
                      navigate(`/link/${link.id}`);
                    }}
                    className="ml-2 mr-2  px-2 p-1 bg-blue-500 hover-bg-blue-600 text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteLink(link.id);
                    }}
                    className="px-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {}}
                    className="ml-2 px-2 p-1 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StackDetails;

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

  const backgroundImage = {
    backgroundImage: `url('https://i.ytimg.com/vi/vegwtayzNj0/maxresdefault.jpg')`,
  };

  const backgroundImage1 = {
    backgroundImage: `url('https://4.bp.blogspot.com/-e_MNCEVegFw/UMahhk_gDYI/AAAAAAAABQY/7iZ1CQhJ_ew/s1600/you+will+pay.jpg')`,
  };

  return (
    <div className="p-4 h-screen" style={backgroundImage}>
      <div className="relative bg-white p-4" style={backgroundImage1}>
        {stack ? (
          <div>
            <button
              onClick={goBack}
              className="mx-2 rounded-lg border border-black py-3 px-4 font-sans text-xs font-bold uppercase text-blue-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              &larr; Back
            </button>
            <div className="flex items-center">
              <h2 className=" border border-blue-500 mt-3 ml-2 bg-gray-100 p-3 rounded-lg w-1/5">
                Stack: {stack.name}
              </h2>
            </div>
            <hr />
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <h2 className="text-2xl font-semibold mt-4">Stack Links</h2>
        <ul>
          {stackLinks.map((link) => (
            <li key={link.id} className="my-4">
              <div className="w-1/2 mx-auto my-3">
                <div className="w-full shadow-2xl subpixel-antialiased rounded h-58 bg-black border-black mx-auto">
                  <div className="flex items-center h-8 rounded-t bg-blue-500 text-white">
                    <div className="mx-auto pr-16">
                      <p className="text-center text-sm">{stack.name}</p>
                    </div>
                  </div>
                  <div className="pl-1 pt-1 h-auto text-green-200 font-mono text-xs bg-black">
                    <p className="pb-1">Name: {link.name}</p>
                    <p className="pb-1">Source: {link.src}</p>
                  </div>
                  <div className="mt-10 mx-auto flex justify-items-center">
                    <button
                      onClick={() => {
                        navigate(`/link/${link.id}`);
                      }}
                      className="ml-2 rounded-lg border border-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteLink(link.id);
                      }}
                      className="ml-2 rounded-lg border border-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {}}
                      className="ml-2 rounded-lg border border-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
    </div>
  );
};

export default StackDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const LinkDetails = () => {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLink, setEditedLink] = useState({ name: "", src: "" });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLinkDetails() {
      try {
        const { data: linkData, error: linkError } = await supabase
          .from("Link")
          .select("*")
          .eq("id", linkId)
          .single();

        if (linkError) {
          throw linkError;
        }

        if (linkData) {
          setLink(linkData);
          setEditedLink(linkData);
        }
      } catch (linkError) {
        console.error("Error fetching link details:", linkError);
      }
    }

    fetchLinkDetails();
  }, [linkId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from("Link")
        .update(editedLink)
        .eq("id", linkId);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      navigate("/homepage");
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLink(link);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLink((prevEditedLink) => ({
      ...prevEditedLink,
      [name]: value,
    }));
  };

  const goBack = () => {
    navigate(-1);
  };

  const backgroundImage = {
    backgroundImage: `url('https://i.ytimg.com/vi/vegwtayzNj0/maxresdefault.jpg')`,
  };

  return (
    <div className="p-4 h-screen " style={backgroundImage}>
      {link ? (
        <div>
          <button
            onClick={goBack}
            className="ml-2 my-3 items-center rounded-lg border border-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            &larr; Go Back
          </button>
          <hr />
          <div className=" mb-2 flex items-center">
            <h2 className=" text-pink-500 border border-green-700 mt-3 ml-2 bg-gray-200 p-3 rounded-lg w-1/5">
              {link.name}
            </h2>
            <h2 className="text-pink-500 border border-blue-500 mt-3 ml-2 bg-gray-200 p-3 rounded-lg w-1/5">
              {link.created_at}
            </h2>
          </div>
          <hr />

          <div className="w-1/2 mx-auto my-3">
            <div className="w-full shadow-2xl subpixel-antialiased rounded h-58 bg-black border-black mx-auto">
              <div className="flex items-center h-8 rounded-t bg-blue-500 text-white">
                <div className="mx-auto pr-16">
                  <p className=" text-center text-sm">{link.name}</p>
                </div>
              </div>
              <div className="pl-1 pt-1 h-auto  text-gray-400 font-mono text-xs bg-black">
                {isEditing ? (
                  <>
                    <label className="text-green-400 text-lg font-semibold">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedLink.name}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                    <label className="text-green-400 text-lg font-semibold">
                      Source:
                    </label>
                    <input
                      type="text"
                      name="src"
                      value={editedLink.src}
                      onChange={handleInputChange}
                      className="border rounded p-2 w-full"
                    />
                    <button
                      onClick={handleSave}
                      className="ml-2  my-2 rounded-lg border border-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="ml-2 my-2 rounded-lg border border-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p className="pb-1">Name: {link.name}</p>
                    <p className="pb-1">Source: {link.src}</p>
                    <button
                      onClick={handleEdit}
                      className="mt-2 rounded-lg border border-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      Edit Link
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LinkDetails;

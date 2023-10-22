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

  return (
    <div className="p-4">
      {link ? (
        <div>
          <h2 className="text-2xl font-semibold">Link Details</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={goBack}
              className="mb-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1"
              style={{ alignSelf: "flex-start" }}
            >
              &larr; Go Back
            </button>
            {isEditing ? (
              <div>
                <label className="text-lg font-semibold">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedLink.name}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                />
                <br />
                <label className="text-lg font-semibold">Source:</label>
                <input
                  type="text"
                  name="src"
                  value={editedLink.src}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                />
                <br />
                <button
                  onClick={handleSave}
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover-bg-red-600 text-white rounded-lg px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <strong className="text-lg font-semibold">Name:</strong>{" "}
                {link.name}
                <br />
                <strong className="text-lg font-semibold">Source:</strong>{" "}
                {link.src}
                <br />
                <button
                  onClick={handleEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2"
                >
                  Edit Link
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LinkDetails;

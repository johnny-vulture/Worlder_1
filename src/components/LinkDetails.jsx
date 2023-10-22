import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const LinkDetails = () => {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLink, setEditedLink] = useState({ name: "", src: "" });

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
          setEditedLink(linkData); // Initialize the edited link data
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

      setIsEditing(false); // Disable editing mode after saving
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Cancel editing and revert changes
    setEditedLink(link); // Reset editedLink to the original data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLink((prevEditedLink) => ({
      ...prevEditedLink,
      [name]: value,
    }));
  };

  // Use this hook to programmatically navigate to another page
  const navigate = useNavigate();

  // This function is used to navigate to the home page
  // It will be called when the button is clicked
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {link ? (
        <div>
          <h2>Link Details</h2>
          {isEditing ? (
            // Edit mode
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editedLink.name}
                onChange={handleInputChange}
              />
              <br />
              <label>Source:</label>
              <input
                type="text"
                name="src"
                value={editedLink.src}
                onChange={handleInputChange}
              />
              <br />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            // View mode
            <div>
              {/* Here's our custom back button */}
              <button onClick={goBack} className="back-button">
                &larr; Go Back
              </button>
              <strong>Name:</strong> {link.name}
              <br />
              <strong>Source:</strong> {link.src}
              <br />
              <button onClick={handleEdit}>Edit Link</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LinkDetails;

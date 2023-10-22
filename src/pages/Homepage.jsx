import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

const Homepage = ({ token }) => {
  let navigate = useNavigate();
  const [stacks, setStacks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [stackName, setStackName] = useState("");
  const [selectedStack, setSelectedStack] = useState(null);

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

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  const handleEdit = (stack) => {
    setSelectedStack(stack);
    setIsEditing(true);
    setStackName(stack.name);
  };

  const handleCreate = () => {
    setSelectedStack(null);
    setIsCreating(true);
    setStackName("");
  };

  const handleSubmit = async () => {
    if (isEditing) {
      try {
        await editStack(selectedStack.id, stackName);
      } catch (error) {
        console.error("Error updating stack:", error);
      }
    } else if (isCreating) {
      try {
        await createStack(stackName);
      } catch (error) {
        console.error("Error creating stack:", error);
      }
    }

    setIsEditing(false);
    setIsCreating(false);
    setStackName("");
    setSelectedStack(null);

    // Refresh the list of stacks after creating or updating
    try {
      const { data, error } = await supabase.from("Stack").select("*");
      if (!error) {
        setStacks(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createStack = async (stackName) => {
    if (stackName === "") return;

    try {
      const { data, error } = await supabase
        .from("Stack")
        .insert([
          {
            name: stackName,
            created_at: new Date(), // Set the created_at timestamp
            owner: token.user.id, // Replace with the appropriate owner value
          },
        ])
        .select();

      if (!error) {
        console.log("Stack created successfully:", data);
      } else {
        console.error("Error creating stack:", error);
      }
    } catch (error) {
      console.error("Error creating stack:", error);
    }
  };

  const editStack = async (stackId, stackName) => {
    if (stackName === "") return;

    try {
      await supabase
        .from("Stack")
        .update({ name: stackName })
        .eq("id", stackId);
    } catch (error) {
      console.error("Error updating stack:", error);
    }
  };

  const deleteStack = async (stackId) => {
    try {
      await supabase.from("Stack").delete().eq("id", stackId);
    } catch (error) {
      console.error("Error deleting stack:", error);
    }

    // Refresh the list of stacks after deletion
    try {
      const { data, error } = await supabase.from("Stack").select("*");
      if (!error) {
        setStacks(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h3>Welcome back, {token.user.user_metadata.full_name}</h3>
      <button onClick={handleLogout}>Logout</button>
      <h2>Your Stacks</h2>
      <ul>
        {stacks.map((stack) => (
          <li key={stack.id}>
            <strong>Name:</strong> {stack.name}
            <div>
              <button onClick={() => handleEdit(stack)}>Edit</button>
              <button onClick={() => deleteStack(stack.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleCreate}>Add Stack</button>
      {isEditing || isCreating ? (
        <div>
          <input
            type="text"
            placeholder="Stack Name"
            value={stackName}
            onChange={(e) => setStackName(e.target.value)}
          />
          <button onClick={handleSubmit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : null}
    </div>
  );
};

export default Homepage;

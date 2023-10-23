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

  const backgroundImage = {
    backgroundImage: `url('https://i.ytimg.com/vi/vegwtayzNj0/maxresdefault.jpg')`,
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={backgroundImage}
    >
      <div className="p-8">
        <h3 className="text-2xl font-semibold mb-4">
          Welcome back, {token.user.user_metadata.full_name}
        </h3>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
        <h2 className="text-2xl mt-4 mb-2">Your Stacks</h2>
        <div className="flex flex-wrap -mx-4">
          {stacks.map((stack) => (
            <div key={stack.id} className="w-1/4 px-4 mb-4">
              <div className="bg-gray-800 p-4  border  grid  rounded-lg shadow-lg shadow-emerald-200 border-white border-t-2 border-l-2 hover:rounded">
                <div className="mb">
                  <a
                    href={`/stack/${stack.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {stack.name}
                  </a>
                </div>

                <div className="mt-2">
                  <button
                    className="bg-blue-500 text-white rounded px-2 py-1 mr-2 hover:bg-blue-700"
                    onClick={() => handleEdit(stack)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-700"
                    onClick={() => deleteStack(stack.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-green-500 text-white rounded px-4 py-2 mt-4 hover:bg-green-700"
          onClick={handleCreate}
        >
          Add Stack
        </button>
        {isEditing || isCreating ? (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Stack Name"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
              className="w-64 p-2 rounded border bg-gray-800 text-white"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white rounded px-2 py-1 ml-2 hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white rounded px-2 py-1 ml-2 hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Homepage;

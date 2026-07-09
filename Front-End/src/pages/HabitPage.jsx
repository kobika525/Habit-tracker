import { useState, useEffect } from "react";
import API from "../api/api";
import HabitCard from "../components/HabitCard";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchHabits = async () => {
    try {
      const res = await API.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      showMessage("Title is required", true);
      return;
    }

    try {
      if (editingId) {
        await API.put(`/habits/${editingId}`, {
          title,
          description,
        });

        showMessage("Habit updated successfully");
        setEditingId(null);
      } else {
        await API.post("/habits", {
          title,
          description,
        });

        showMessage("Habit created successfully");
      }

      setTitle("");
      setDescription("");
      fetchHabits();
    } catch (err) {
      showMessage(err.response?.data?.detail || "Error", true);
    }
  };

  const requestDeleteHabit = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteHabit = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    if (!id) return;

    try {
      await API.delete(`/habits/${id}`);
      fetchHabits();
      showMessage("Habit deleted");
    } catch {
      showMessage("Error deleting habit", true);
    }
  };

  const markComplete = async (id) => {
    try {
      await API.post("/logs", {
        habitId: id,
      });

      showMessage("Habit marked complete");
    } catch (err) {
      showMessage(err.response?.data?.detail || "Error", true);
    }
  };

  const editHabit = (habit) => {
    setEditingId(habit._id);
    setTitle(habit.title);
    setDescription(habit.description || "");
  };

  const viewHistory = async (habitId) => {
    try {
      const res = await API.get(`/logs/${habitId}`);
      setHistory(res.data);
    } catch {
      showMessage("Error loading history", true);
    }
  };

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 sm:px-6 pt-20 pb-10">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Habit Tracker
      </h1>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded w-full max-w-md text-center text-sm sm:text-base ${
            isError ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-800 p-4 sm:p-5 rounded w-full max-w-md mb-6">
        <input
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-sm sm:text-base"
          placeholder="Habit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-sm sm:text-base"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm sm:text-base"
        >
          {editingId ? "Update Habit" : "Create Habit"}
        </button>
      </div>

      {/* Habit List */}
      <div className="w-full max-w-md space-y-4">
        {habits.map((habit) => (
          <HabitCard
            key={habit._id}
            habit={habit}
            onDelete={requestDeleteHabit}
            onComplete={markComplete}
            onEdit={editHabit}
            onHistory={viewHistory}
          />
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 bg-gray-800 p-4 rounded w-full max-w-md">
          <h2 className="font-bold mb-3 text-sm sm:text-base">
            Completion History
          </h2>

          {history.map((log) => (
            <div key={log._id} className="text-gray-300 text-sm sm:text-base">
              {new Date(log.date).toLocaleDateString()}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDeleteHabit}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This will also remove its completion history. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default Habits;

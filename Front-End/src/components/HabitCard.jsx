function HabitCard({habit,onDelete,onComplete,onEdit,onHistory,}) {

  return (

    <div className="bg-gray-800 p-4 sm:p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300">

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">
        {habit.title}
      </h3>


      {/* Description */}
      {habit.description && (

        <p className="text-gray-400 mb-2 text-sm sm:text-base break-words">
          {habit.description}
        </p>

      )}

      {/* Created date */}
      <p className="text-gray-500 text-xs sm:text-sm mb-3">
        Created:{" "}
        {new Date(habit.createdAt).toLocaleDateString()}
      </p>


      {/* Buttons */}
      <div className="flex flex-wrap gap-2">

        <button
          onClick={() =>
            onComplete(habit._id)
          }
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-xs sm:text-sm"
        >
          Complete
        </button>

        <button
          onClick={() =>
            onEdit(habit)
          }
          className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white text-xs sm:text-sm"
        >
          Edit
        </button>

        <button
          onClick={() =>
            onHistory(habit._id)
          }
          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-xs sm:text-sm"
        >
          History
        </button>

        <button
          onClick={() =>
            onDelete(habit._id)
          }
          className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-xs sm:text-sm"
        >
          Delete
        </button>

      </div>

    </div>

  );

}

export default HabitCard;
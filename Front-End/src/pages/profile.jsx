import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setProfile(res.data);
      } catch {
        setError("Could not load profile");
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900 px-4 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 sm:px-6 pt-20 pb-10">
      <div className="bg-gray-800 rounded-lg shadow-md w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          My Profile
        </h1>

        {error && (
          <div className="bg-red-600 text-white px-3 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-lg font-semibold">{profile.name}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg font-semibold break-words">
              {profile.email}
            </p>
          </div>

          {profile.createdAt && (
            <div>
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-lg font-semibold">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-700 hover:bg-red-800 py-2 rounded text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;

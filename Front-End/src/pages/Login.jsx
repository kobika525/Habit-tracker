import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      login(res.data);

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message || "Login failed"
      );

      setTimeout(() => setError(""), 3000);
    }
  };

  return (

    <div className="
      min-h-[calc(100vh-64px)]
      flex
      items-center
      justify-center
      px-4
      sm:px-6
      lg:px-8
      py-6
    ">

      <div className="
        w-full
        max-w-md
        bg-white
        shadow-xl
        rounded-2xl
        p-6
        sm:p-8
        border
        border-gray-200
      ">

        {/* Heading */}
        <h2 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-center
          text-gray-800
          mb-6
        ">
          Welcome Back
        </h2>

        {/* Error */}
        {error && (
          <div className="
            bg-red-100
            text-red-600
            px-3
            py-2
            rounded-lg
            mb-4
            text-sm
            text-center
          ">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            className="
              w-full
              px-4
              py-3
              border
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
            "
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            className="
              w-full
              px-4
              py-3
              border
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
            "
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          {/* Button */}
          <button
            type="submit"
            className="
              w-full
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              text-white
              py-3
              rounded-lg
              font-semibold
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
              duration-200
            "
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <p className="
          text-center
          mt-5
          text-gray-600
          text-sm
        ">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
              text-blue-600
              font-semibold
              hover:underline
            "
          >
            Register
          </Link>
        </p>

      </div>

    </div>

  );
}

export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext.jsx";

function LoginPage(props) {
  const { logIn } = useUserContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(formData);
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      password: "",
    });
    props.setNavShow(true);
    navigate("/");
  };

  return (
    <div
      className="relative flex items-center justify-center w-screen h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Kiruna.jpg/2560px-Kiruna.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Login box */}
      <div className="relative z-10 p-10 max-w-md w-full text-white text-opacity-80">
        <h2 className="text-4xl text-center mb-8">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-7 relative">
            <label
              className="block text-xl font-normal mb-3"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-100 px-4 h-12 rounded-full bg-customGray bg-opacity-30 backdrop-blur shadow text-white text-lg focus:outline-none"
            />
          </div>

          <div className="mb-16">
            <label
              className="block text-xl font-normal mb-3"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 h-12  rounded-full bg-customGray bg-opacity-30 backdrop-blur shadow text-white text-lg focus:outline-none"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="w-44 h-14 bg-customGray bg-opacity-80 shadow text-2xl  font-normal text-black rounded-full hover:bg-gray-400"
            >
              Go back
            </button>
            <button
              type="submit"
              className="w-44 h-14  bg-customBlue bg-opacity-100 shadow text-2xl  font-normal rounded-full hover:bg-[#2e5c79]"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
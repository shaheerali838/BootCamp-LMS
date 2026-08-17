// Fixed import path: updated from contextAPI to context directory
import { useAuth } from "../../context/AuthContext";

function ChangePassword() {
  const { changePassword } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await changePassword(
        currentPassword,
        newPassword
      );

      setMessage(
        response.data.message ||
          "Password changed successfully"
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-[#111528]">
          Change Password
        </h1>

        {error && (
          <p className="text-red-500 bg-red-50 p-2 rounded mt-4 text-sm">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-600 bg-green-50 p-2 rounded mt-4 text-sm">
            {message}
          </p>
        )}

        <label className="block text-sm font-semibold mt-5">
          Current Password
        </label>

        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          className="border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#0476b9]"
        />

        <label className="block text-sm font-semibold mt-4">
          New Password
        </label>

        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          className="border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#0476b9]"
        />

        <label className="block text-sm font-semibold mt-4">
          Confirm New Password
        </label>

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          className="border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#0476b9]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0476b9] disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold mt-5"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
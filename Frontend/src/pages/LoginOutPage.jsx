// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";


// const LoginOutPage = () => {
//   const navigate = useNavigate();

//   const { logout } = useAuth();

//   const [loading, setLoading] = useState(false);

//   const handleLogout = async () => {
//     try {
//       setLoading(true);

//       await logout();
//       navigate("/login", { replace: true,
//       });
//     } catch (error) {
//       console.log(
//         "Logout error:",
//         errorx``
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleLogout}
//       disabled={loading}
//     >
//       {loading
//         ? "Logging out..."
//         : "Logout"}
//     </button>
//   );
// };

// export default LoginOutPage;
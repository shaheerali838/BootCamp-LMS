// import React from "react";
// import { Navigate } from "react-router-dom";
// import {useAuth} from '../context/AuthContext'

// const ProtectedRoute = ({
//   children,
//   allowedRoles = [],
// }) => {
//   const {
//     user,
//     isAuthenticated,
//     loading,
//   } = useAuth();

//   // Wait for authentication check
//   if (loading) {
//     return (
//       <div>
//         <h2>Loading...</h2>
//       </div>
//     );
//   }

//   // User is not logged in
//   if (!isAuthenticated) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//       />
//     );
//   }

//   // Check role
//   if (
//     allowedRoles.length > 0 &&
//     !allowedRoles.includes(user?.role)
//   ) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         replace
//       />
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;
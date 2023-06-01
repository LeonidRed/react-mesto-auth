import React from 'react';
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element: Component, ...props }) {
  return (
    props.isLogged ? <Component {...props} /> : <Navigate to="/sign-in" replace />
  )
}
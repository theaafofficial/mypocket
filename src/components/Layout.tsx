import React from "react";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ToastContainer />
      {props.children}
    </div>
  );
}

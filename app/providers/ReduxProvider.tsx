"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store/store";

export default function Provider({ children }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

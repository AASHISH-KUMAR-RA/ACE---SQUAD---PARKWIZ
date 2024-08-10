import React from "react";

export function capitalize(str) {
  
  if (str==undefined ||str==null) return "process"; // Handle empty strings
  
  // Capitalize only the first character and keep the rest of the string unchanged
  return str.charAt(0).toUpperCase() + str.slice(1);
}

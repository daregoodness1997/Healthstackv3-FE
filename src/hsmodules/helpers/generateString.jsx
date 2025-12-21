export const generateRandomString = (length) => {
  // console.log("Generating random string with length:", length);
  if (typeof length !== "number" || length <= 0) {
    // console.error("Invalid length provided to generateRandomString:", length);
    return "ERROR";
  }
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const result = Array.from({ length }, () =>
    characters?.charAt(Math.floor(Math.random() * characters?.length))
  ).join("");
  // console.log("Generated string:", result);
  return result;
};

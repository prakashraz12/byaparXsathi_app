import uuid from "react-native-uuid";

export const idxGenerator = (): string => {
  const id = uuid.v4();
  if (!id || typeof id !== "string") {
    throw new Error("UUID generation failed");
  }
  return `${id}`;
};

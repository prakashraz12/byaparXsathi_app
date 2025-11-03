export const activityMessage = (type: string) => {
  switch (type) {
    case "Sales":
      return "Sales";
    case "Purchase":
      return "Purchase";
    case "Expenses":
      return "Expenses";
    case "Income":
      return "Income";
    default:
      return "Activity";
  }
};

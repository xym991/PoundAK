export default function searchAndSetFields(
  source: object,
  target: { [key: string]: any },
  fieldsToFind: string[]
) {
  const parsedFields = fieldsToFind.map((field) => {
    const [left, alias] = field.split("=");
    const [fieldKey, condition] = left.split("|");
    const [condKey, condValue] = condition?.split(":") || [];
    return {
      fieldKey,
      alias,
      condKey,
      condValue,
    };
  });

  function recursiveSearch(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(recursiveSearch);
    } else if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]: any) => {
        parsedFields.forEach(({ fieldKey, alias, condKey, condValue }) => {
          if (target[alias || fieldKey]) return;

          if (
            typeof value === "object" &&
            value !== null &&
            String(value?.[condKey]) === condValue
          ) {
            target[alias || fieldKey] = value[fieldKey];

            return recursiveSearch(value);
          }
          if (key === fieldKey && !condKey) {
            target[alias || fieldKey] = value;
          }
        });

        // Recurse into children even if not matched (general traversal)
        if (typeof value === "object" && value !== null) {
          recursiveSearch(value);
        }
      });
    }
  }

  recursiveSearch(source);
}

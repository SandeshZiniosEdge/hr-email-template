export const mergeString = (
  ...args: Array<string | boolean | undefined | null | number>
): string => {
  return args.reduce((prev: string, next): string => {
    if (typeof next === "string") {
      return `${prev} ${next}`;
    }
    return prev;
  }, "");
};

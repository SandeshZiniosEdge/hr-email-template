export const CharacterValidationReg = /^[0-9A-Za-z\s.-]+$/;
export const ValidFirstCharacter = /^[0-9A-Za-z]/;
export const emailRegex = /^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,}$/;
export const CharacterValidationWithColon = /^[0-9A-Za-z\s.,-:]+$/;

export const otherId = "00000000-0000-0000-0000-000000000000";

export const ifThisElseThat = <T, X>(
  condition: unknown,
  inThis: T,
  inThat: X
) => (condition ? inThis : inThat);

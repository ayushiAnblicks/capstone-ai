import Ajv from "ajv";

const ajv = new Ajv({
  allErrors: true,
});

export interface ValidationResult {
  valid: boolean;

  errors: unknown;
}

export function validateJson(
  data: unknown,

  schema: Record<string, unknown>,
): ValidationResult {
  const validate = ajv.compile(schema);

  const valid = validate(data);

  return {
    valid: Boolean(valid),

    errors: validate.errors || null,
  };
}

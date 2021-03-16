/**
 * Validates the given 'target' to match with
 * the given 'schema'. If the 'target' object must
 * have the same amount of properties than the schema.
 * 
 * Optional properties are supported by specifying an
 * object with '$optional' and a '$type' properties instead
 * of the required type (type is specified in the '$type'
 * property)
 */
export function validateSchema(schema: any, target: any): boolean {
  let schemaProps = new Set<string>(Object.getOwnPropertyNames(schema));
  let props = new Set<string>(Object.getOwnPropertyNames(target));

  for (let prop of schemaProps) {

    let type = schema[prop];
    let optional: boolean | undefined = type.$optional;
    let evalingProp = target[prop];

    if (optional !== undefined) {
      type = type.$type;
    }

    if (evalingProp === undefined) {
      if (optional) {
        continue;
      } else {
        return false;
      }
    }
    
    if (typeof type === 'object') {
      let result = validateSchema(type, evalingProp);
      if (!result) {
        return false;
      }
    } else if (typeof type === 'string') {
      if (typeof evalingProp !== type) {
        return false;
      }
    } else {
      throw new Error("Unsupported schema value type " + (typeof type));
    }

    !props.delete(prop);
  } 

  return props.size == 0;
}

export function wrapCode(type: string, text: string): string {
  return "```" + type + "\n" + text + "```"; 
}
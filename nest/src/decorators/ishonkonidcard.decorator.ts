import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_HongKong_ID = 'IsHongKongID';

/** 验证⾝分證號格式 */
function checkArrayElementInteger(str: string): boolean {
    if (typeof(str) !=='string') return false;
    const reg = /^([A-Z]\d{6}(\(\w{1}\))?)$/
    return str.match(reg)?.length > 0
}

/**
 * 检查参数是否满足.香港⾝分證號格式
 */
export function IsHongKongIdCard(validationOptions?: ValidationOptions): PropertyDecorator {
  const options = validationOptions;
  return ValidateBy(
    {
      name: IS_HongKong_ID,
      validator: {
          validate: (value, args): boolean => checkArrayElementInteger(value),
          defaultMessage: buildMessage(
              (eachPrefix) => eachPrefix + "$property'不是有效的身份ID",
              options,
          ),
      },
    },
    options,
  );
}
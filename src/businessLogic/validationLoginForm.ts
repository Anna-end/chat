
type DataValidationValue = {
  inputValue: string,
  maxLength: number,
  minLength: number,
}
type ValidationInput = (arg : DataValidationValue) => {error:string[], isValid: boolean}

export const validateInput = (value: string) => {
    const result = validationInput({ 
      inputValue: value, 
      maxLength: 30, 
      minLength: 8 
    })
    
    const isValid = result.isValid;
    
    const errorList = result.error 
    
    return { isValid, errors: errorList }
  }

const validationInput: ValidationInput = ({inputValue, maxLength, minLength}) => {
  const arrErrorsValid: string[] = []
  const password = inputValue.trim()
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const validLength = password.length >= minLength && password.length <= maxLength;

  if (!validLength) {
    arrErrorsValid.push(`*Длинна от ${minLength} до ${maxLength} символов`)
  }
  if (!hasUpperCase || !hasLowerCase) {
    arrErrorsValid.push('*Укажите хотя бы одну заглавную или строчную латинскую букву')
  }
  if (!hasNumber) {
    arrErrorsValid.push('*Укажите цифры от 0 до 9')
  }
  if (!hasSpecialChar) {
    arrErrorsValid.push('*Укажите хотя бы один специальный символ !@#$%^&*')
  }

  return {
    error: arrErrorsValid,
    isValid: hasUpperCase && hasLowerCase && hasNumber && validLength && hasSpecialChar
  }
}
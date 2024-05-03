export default class FormValidator {
  static isEmpty(field: string): { isValid: boolean; message: string } {
    const isValid = field.trim() === "";
    return {
      isValid,
      message: isValid ? "Field cannot be empty" : "",
    };
  }

  static hasUpperCase(field: string): { isValid: boolean; message: string } {
    const isValid = field.split("").some((char) => char >= "A" && char <= "Z");
    return {
      isValid,
      message: isValid ? "" : "Must contain at least one uppercase letter.",
    };
  }

  static hasSpecialCharacter(field: string): {
    isValid: boolean;
    message: string;
  } {
    const isValid = field
      .split("")
      .some((char) => '!@#$%^&*(),.?":{}|<>'.includes(char));
    return {
      isValid,
      message: isValid ? "" : "Must contain at least one special character.",
    };
  }

  static hasDigit(field: string): { isValid: boolean; message: string } {
    const isValid = field.split("").some((char) => char >= "0" && char <= "9");
    return {
      isValid,
      message: isValid ? "" : "Must contain at least one digit.",
    };
  }

  static hasLowerCase(field: string): { isValid: boolean; message: string } {
    const isValid = field.split("").some((char) => char >= "a" && char <= "z");
    return {
      isValid,
      message: isValid ? "" : "Must contain at least one lowercase letter.",
    };
  }

  static isMinLength(
    field: string,
    minLength: number = 6
  ): { isValid: boolean; message: string } {
    const isValid = field.length >= minLength;
    return {
      isValid,
      message: isValid ? "" : `Must be at least ${minLength} characters long.`,
    };
  }

  static isValidEmail(email: string): { isValid: boolean; message: string } {
    const atSymbolPos = email.indexOf("@");
    const dotPos = email.lastIndexOf(".");
    const isValid =
      atSymbolPos > 0 &&
      dotPos > atSymbolPos + 1 &&
      dotPos < email.length - 1 &&
      [".ca", ".com", ".org", ".net", ".edu"].some((tld) =>
        email.substring(dotPos).toLowerCase().endsWith(tld)
      );
    return {
      isValid,
      message: isValid ? "" : "You need to use a valid email address.",
    };
  }

  static validatePassword(password: string): {
    isValid: boolean;
    messages: string[];
  } {
    let messages: string[] = [];
    let validators = [
      this.isEmpty,
      this.hasUpperCase,
      this.hasSpecialCharacter,
      this.hasDigit,
      this.hasLowerCase,
      this.isMinLength,
    ];

    validators.forEach((validator) => {
      let result = validator(password);
      if (!result.isValid && result.message) {
        messages.push(result.message);
      }
    });

    return {
      isValid: messages.length === 0,
      messages,
    };
  }
}

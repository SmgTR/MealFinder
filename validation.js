class Check {
  constructor() {}
  // Show input error message

  // Check email is valid
  checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
      showSuccess(input);
    } else {
      showError(input, "Email is not valid");
    }
  }

  checkUrl(input) {
    const re = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if (re.test(input.value.trim())) {
      showSuccess(input);
    } else {
      showError(input, "URL is not valid");
    }
  }
  // Check required fields
  checkRequired(inputArr) {
    inputArr.forEach(function(input) {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
      } else {
        showSuccess(input);
      }
    });
  }
  // Check input length
  checkLength(input, min, max) {
    if (input.value.length < min) {
      showError(
        input,
        `${getFieldName(input)} must be at least ${min} characters`
      );
    } else if (input.value.length > max) {
      showError(
        input,
        `${getFieldName(input)} must be less than ${max} characters`
      );
    } else {
      showSuccess(input);
    }
  }

  // Check passwords match
  checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
      showError(input2, "Passwords do not match");
    } else {
      showSuccess(input2);
    }
  }

  // Get fieldname
}

const validateEmail = (email: string): boolean => {
  const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; // literally just A-B,ab-b, _,-,.  with @ A better one from a website I found /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email); // either true or false
};

const validatePassword = (password: string): boolean => {
  const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,24}$/; // password with 7 or more characters, has to have one number, and a sepcial character
  return pattern.test(password); // either true or false
};

export { validateEmail, validatePassword };

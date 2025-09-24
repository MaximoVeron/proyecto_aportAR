import { validationResult, matchedData } from "express-validator";

export const applyValidations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const validatedData = matchedData(req);
  console.log(validatedData);
  next();
};

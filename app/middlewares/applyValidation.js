import { validationResult, matchedData } from "express-validator";

// * middleware para validar los datos de entrada de express-validator
export const applyValidations = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.mapped() });
  }
  req.vData = matchedData(req);
  console.log(req.vData);
  next();
};

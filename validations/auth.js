import { body, header } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать хотя бы один символ').isLength({min: 1}),
    body('fullName', 'Имя должно содержать хотя бы один символ').isLength({min: 1}),
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать хотя бы один символ').isLength({min: 1}),
];

export const deleteValidation = [
    body('userIds').isArray(),
];
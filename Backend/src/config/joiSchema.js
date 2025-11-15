import joi from "joi";

export const registerSchema = joi
  .object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long.",
    }),
    phoneNumber: joi.string().required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const userUpdateSchema = joi
  .object({
    name: joi.string(),
    email: joi.string().email(),
    phoneNumber: joi.string(),
  })
  .min(1)
  .required();

export const changePasswordSchema = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi
      .string()
      .required()
      .min(8)
      .not(joi.ref("oldPassword"))
      .messages({
        "string.min": "New password must be at least 8 characters long.",
        "any.invalid": "New password cannot be the same as the old password.",
      }),
  })
  .required();

// seller Schemas

export const sellerRegisterSchema = joi
  .object({
    storeName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long.",
    }),
    phoneNumber: joi.string().required(),
    address: joi
      .object({
        street: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        zipCode: joi.string().required(),
        country: joi.string().required(),
      })
      .required(),
  })
  .required();

export const sellerUpdateSchema = joi
  .object({
    storeName: joi.string(),
    phoneNumber: joi.string(),
    address: joi.object({
      street: joi.string().required(),
      city: joi.string().required(),
      state: joi.string().required(),
      zipCode: joi.string().required(),
      country: joi.string().required(),
    }),
  })
  .min(1)
  .required();

// Category Schemas

export const categorySchema = joi
  .object({
    name: joi.string().required(),
    path: joi.string().required(),
    color: joi.string(),
  })
  .required();

export const categoryUpdateSchema = joi
  .object({
    name: joi.string(),
    path: joi.string(),
    color: joi.string(),
  })
  .min(1)
  .required();

// Product Schemas

export const productSchema = joi
  .object({
    name: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    offerPrice: joi.number().min(0).allow(null, ""),
    weight: joi.number().required().min(0),
    unit: joi.string().required(),
    stockQuantity: joi.number().required().min(0),
    category: joi.string().required(),
  })
  .required();

export const updateProductSchema = joi
  .object({
    name: joi.string(),
    description: joi.string(),
    price: joi.number().min(0),
    offerPrice: joi.number().min(0).allow(null, ""),
    weight: joi.number().min(0),
    unit: joi.string(),
    stockQuantity: joi.number().min(0),
    category: joi.string(),
  })
  .min(1)
  .required();

// Address Schemas

export const addressSchema = joi
  .object({
    recipientName: joi.string().required(),
    recipientPhone: joi.string().required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zipCode: joi.string().required(),
    country: joi.string().required(),
    addressType: joi.string().required(),
    isDefault: joi.boolean().default(false),
  })
  .required();

export const updateAddressSchema = joi
  .object({
    recipientName: joi.string(),
    recipientPhone: joi.string(),
    street: joi.string(),
    city: joi.string(),
    state: joi.string(),
    zipCode: joi.string(),
    country: joi.string(),
    addressType: joi.string(),
    isDefault: joi.boolean(),
  })
  .min(1)
  .required();

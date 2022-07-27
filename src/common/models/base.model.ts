import { Document, SchemaDefinition, Schema } from "mongoose";

export interface IBase extends Document {
  _id: string;
  isDelete: boolean;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export function SchemaBase(schema: SchemaDefinition) {
  const defaultSchema = {
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
    created_by: String,
    updated_by: String,
  };
  return {
    ...schema,
    ...defaultSchema,
  };
}

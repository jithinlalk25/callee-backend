import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FormDocument = HydratedDocument<Form>;

export enum AmountTypeEnum {
  FIXED = 'FIXED',
  CUSTOM = 'CUSTOM',
  QUANTITY = 'QUANTITY',
}

@Schema()
class Field {
  @Prop()
  name: string;

  @Prop()
  id: string;
}

@Schema()
class QuantityField {
  @Prop()
  name: string;
}

@Schema({ collection: 'Form', versionKey: false, timestamps: true })
export class Form {
  _id: Types.ObjectId;

  @Prop({ index: true })
  userId: Types.ObjectId;

  @Prop({ index: { unique: true } })
  urlPath: string;

  @Prop()
  title: string;

  @Prop()
  fields: Field[];

  @Prop()
  quantityField: QuantityField;

  @Prop()
  amountType: AmountTypeEnum;

  @Prop()
  amount: number;

  @Prop({ default: 0 })
  submissionCount: number;

  @Prop({ default: 0 })
  amountCollected: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const FormSchema = SchemaFactory.createForClass(Form);

// Middleware to apply `isDeleted: false` filter for all operations
const applyIsDeletedFilter = function (next) {
  if (!this.getQuery().hasOwnProperty('isDeleted')) {
    this.setQuery({ ...this.getQuery(), isDeleted: false });
  }
  next();
};

// Pre hooks for all relevant query operations
FormSchema.pre('find', applyIsDeletedFilter);
FormSchema.pre('findOne', applyIsDeletedFilter);
FormSchema.pre('findOneAndUpdate', applyIsDeletedFilter);
FormSchema.pre('updateOne', applyIsDeletedFilter);
FormSchema.pre('updateMany', applyIsDeletedFilter);
FormSchema.pre('deleteOne', applyIsDeletedFilter);
FormSchema.pre('deleteMany', applyIsDeletedFilter);

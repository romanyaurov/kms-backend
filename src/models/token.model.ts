import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
}

const TokenSchema: Schema<IToken> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
});

const TokenModel = mongoose.model<IToken>('Token', TokenSchema);

export default TokenModel;

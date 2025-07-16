// import mongoose, { Document } from 'mongoose';
// import bcrypt from 'bcryptjs';

// export enum UserRole {
//   USER = 'user',
//   ADMIN = 'admin'
// }

// interface IUser extends Document {
//   phone: string;
//   name: string;
//   password: string;
//   role: UserRole;
//   wishlist: mongoose.Types.ObjectId[];
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// interface IUserMethods {
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// const userSchema = new mongoose.Schema({
//   phone: { 
//     type: String, 
//     required: true, 
//     unique: true, // Enforces uniqueness (no need for separate index)
//     validate: {
//       validator: function(v: string) {
//         return /^[6-9]\d{9}$/.test(v);
//       },
//       message: (props: any) => `${props.value} is not a valid Indian phone number!`
//     }
//   },
//   name: { 
//     type: String, 
//     required: true,
//     trim: true,
//     minlength: [2, 'Name must be at least 2 characters']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false
//   },
//   role: { 
//     type: String, 
//     enum: Object.values(UserRole), 
//     default: UserRole.USER 
//   },
//   wishlist: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Product' 
//   }]
// }, { 
//   timestamps: true, 
//   collection: 'users'
// });

// // Password hashing
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password') || !this.password) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// // Password comparison
// userSchema.methods.comparePassword = async function(
//   candidatePassword: string
// ): Promise<boolean> {
//   if (!this.password) return false;
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Index for text search (only if needed)
// userSchema.index({ name: 'text' });

// type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
// export default mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);


import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface IUser extends Document {
  phone: string;
  name: string;
  password: string;
  role: UserRole;
  securityQuestions: SecurityQuestion[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const SecurityQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true, select: false }
});

const userSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid Indian phone number!`
    }
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.USER 
  },
  securityQuestions: {
    type: [SecurityQuestionSchema],
    required: true,
    validate: {
      validator: function(v: SecurityQuestion[]) {
        return v.length === 2;
      },
      message: 'Exactly two security questions are required'
    }
  },
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { 
  timestamps: true, 
  collection: 'users'
});

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Hash security question answers before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('securityQuestions')) return next();
  
  try {
    for (const question of this.securityQuestions) {
      if (this.isModified(`securityQuestions.${this.securityQuestions.indexOf(question)}.answer`)) {
        const salt = await bcrypt.genSalt(10);
        question.answer = await bcrypt.hash(question.answer, salt);
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// Password comparison
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Security question answer comparison
userSchema.methods.verifySecurityAnswers = async function(answers: string[]): Promise<boolean> {
  if (this.securityQuestions.length !== 2 || answers.length !== 2) return false;
  
  try {
    const match1 = await bcrypt.compare(answers[0], this.securityQuestions[0].answer);
    const match2 = await bcrypt.compare(answers[1], this.securityQuestions[1].answer);
    return match1 && match2;
  } catch (error) {
    return false;
  }
};

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
export default mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);
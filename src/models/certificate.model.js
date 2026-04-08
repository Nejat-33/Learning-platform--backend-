import mongoose from "mongoose";
import crypto from "crypto";

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
  },
  enrollment: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Enrollment',
     required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },

  finalGrade: {
    type: String, 
  },

  status: {
    type: String,
    enum: ["valid", "revoked"],
    default: "valid"
  },

  verificationURL: {
    type: String,
  },

}, { timestamps: true });



certificateSchema.pre("save", function() {
  if (!this.certificateId) {
    const randomBytes =crypto.randomBytes(8).toString("hex").toUpperCase(); 
    this.certificateId = `CERT-${randomBytes}-${new Date().getFullYear()}`
  }

  this.verificationURL = `${process.env.CLIENT_URL}/verify/${this.certificateId}`;

});

export const Certificate = mongoose.model("Certificate", certificateSchema);
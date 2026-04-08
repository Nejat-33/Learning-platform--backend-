import { Certificate } from "../models/certificate.model.js";
import Enrollment from "../models/enrollment.model.js";
import AppError from "../utils/customerror.handler.js";




export  const generateCertificate = async (enrollmentid)=>{
   const enrollment = await Enrollment.findById(enrollmentid)
   if(!enrollment) throw new AppError('enrollment not found', 404)
      
   const existing = await Certificate.findOne({
    enrollment: enrollment._id
   })

   if (existing) {
      await Enrollment.findByIdAndUpdate(enrollmentid, { certificateIssued: true });
      return existing;
   }
   const certificate = await Certificate.create({
    enrollment: enrollment._id,
    finalGrade: enrollment.finalGrade,
   })
   await Enrollment.findByIdAndUpdate(enrollmentid, { 
      certificateIssued: true,
      status: 'completed' 
   });
   await enrollment.save()
   return certificate
}

import { checkcompletion, createenrollment, Getenrollment, getenrollmentbybatch, getenrollmentbystudent, Getmyenrollment , modifyenrollment, updatefinalGrade} from "../services/enrollment.service.js"


export const createEnrollment = async(req, res, next) =>{
    try {        
        const student = req.user._id
        const {batch } = req.body
         const result = await createenrollment(student, batch)
     
         res.status(201).json({
             success: true,
             message: 'enrollment sucessfully created',
             data: result
         })
    } catch (error) {
        next(error)
    }
}


export const getEnrollmentofStudent = async(req, res, next) =>{
    try {
        const id = req.params.studentid
        
    const result = await getenrollmentbystudent(id)
 
    res.status(200).json({
        sucess: true,
        message: 'sucessfully get the student',
        data: result
    })

    } catch (error) {
        next(error)
    }

}


export const getEnrollmentbyBatch = async(req, res, next)=>{
    try {
        const id = req.params.batchid; 
        if (!id) {
            return next(new AppError('Batch ID is required', 400));
        }
    const result = await getenrollmentbybatch(id)

    res.status(200).json({
        success: true,
        message: 'sucessfully get the student enrolled in this batch',
        data: result
    })

    } catch (error) {
        next(error)
    }
   
}

export const getEnrollment = async(req, res , next)=>{
    try {
            const result = await Getenrollment()

    res.status(200).json({
        sucess: true,
        message: 'sucessfully get enrollment data',
        data: result
    })
    } catch (error) {
        next(error)
    }

}

export const getmyenrollment = async(req, res, next)=>{
    try {
          const result = await Getmyenrollment(req.user._id)
     res.status(200).json({
        sucess: true,
        message: 'sucessfully get enrollment data',
        data: result
    })
    } catch (error) {
        next(error)
    }
  
}


export const modifyEnrollment = async(req, res, next)=>{
    try {
        const id = req.params.id
const updateData = req.body; 
        if (Object.keys(updateData).length === 0) {
            return next(new AppError('No update data provided', 400));
        }
        const result = await modifyenrollment(id, updateData)
         res.status(200).json({
        sucess: true,
        message: 'sucessfully modified enrollment data',
        data: result
    })
    } catch (error) {
        next(error)
    }
}


export const updateFinalGrade = async(req, res, next)=>{
    try {
        const {id} = req.params
        const {finalGrade} = req.body
        const enrollment = await updatefinalGrade(id, finalGrade)

        res.status(200).json({
            sucess: true,
            message: "sucessfully updated finalgrade",
            data: enrollment
        })
    } catch (error) {
        next(error)
    }
}


export const completeenrollment = async(req, res, next)=>{
    try {
        const {id} = req.params
        const completion = await checkcompletion(id)

        res.status(200).json({
            success: true,
            message: "successfully completed",
            data: completion
        })
    } catch (error) {
        next(error)
    }
}

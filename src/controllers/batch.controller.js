import Enrollment from "../models/enrollment.model.js"
import Session from "../models/session.model.js"
import { createbatch, deletebatch, getAllbatches, 
    getbatchesforcourse, fetchBatchService, getUpcomingBatches,
     getFillingSoon_batch, getstat,getBatchAverageAttendance, totalsessionofbatch ,
    getAtRiskStudents,
    singlebatchstat,
    getAverageAttendedStudents,
    getWeeklyAttendanceTrends,
    getallbatchofinstructor} from "../services/batch.service.js"
import mongoose from "mongoose"
import Batch from "../models/batch.model.js"

export const getSinglebatch = async(req, res, next)=>{
    try {
        const {id} = req.params
        const batch = await fetchBatchService(id)
        
        res.status(200).json({
            sucess: true,
            meassage: "sucessfully get the batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const createBatch = async(req, res, next)=>{
    try {
        const user = req.user._id
        const batch = await createbatch(req.body, user)
        res.status(200).json({
            suceess: true,
            meassage: "sucessfully create the batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}


export const getAllBatches = async(req, res, next)=>{
    try {
        const batch = await getAllbatches(req.query)
        res.status(200).json({
            success: true,
            meassage: "sucessfully get all batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const getAllbatch_course = async (req, res, next)=>{
    try {
        const courseid = req.params
        const batchs = await getBatchforcourse(courseid)

        res.status(200).json({
            success: true,
            message: "successfully get the batchs for this corse",
            data: batchs
        })
    } catch (error) {
        next(next)
    }
}

export const updateBatch = async(req, res, next)=>{
    try {
        const {id} = req.params
        const batch = await updatebatch(id,req.body)

        res.status(200).json({
            sucess: true,
            meassage: "sucessfully update the batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const deleteBatch = async(req, res, next)=>{
    try {
        const {id } = req.params
        const batch = await deletebatch(id)

        res.status(200).json({
            sucess: true,
            message: "sucessfully delete batch"
        })
    } catch (error) {
        next(error)
    }
}

export const getBatchforcourse = async(req, res, next)=>{
    try {
        const courseid = req.params
        const batch = await getbatchesforcourse(courseid)

        res.status(200).json({
            sucess: true,
            message: "sucessfully get batch for batch",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}

export const get_upcomingBatches = async (req, res, next)=>{
    try {
        const batch = await getUpcomingBatches()

        res.status(200).json({
            success: true,
            message: "course retrived successfully",
            data: batch
        })
    } catch (error) {
        next(error)
    }
}


export const getFilling_batch = async(req, res, next)=>{
    try {
        const Batch = await getFillingSoon_batch()

        const formattedData = Batch.map(batch => ({
      batch: batch.batchName,
      left: batch.maxStudent - batch.currentStudent,
      color: (batch.maxStudent - batch.currentStudent) <= 2 ? 'bg-rose-500' : 'bg-amber-500'
    }));


    res.status(200).json({
        success: true,
        data: formattedData
    })

    } catch (error) {
        next(error)
    }
}

export const getStatofbatch = async(req, res, next)=>{
    try {
        const stat = await getstat()
        
        res.status(200).json({
            sucess: true,
            message: "successfully get batch statistics",
            data: stat
        })
    } catch (error) {
        next(error)
    }
}


export const batchTotalsession = async(req,res, next)=>{
    try {
        const {batchid} = req.params

        const stat = await totalsessionofbatch(batchid)

        res.status(200).json({
            sucess: true,
            data: stat
        })
    } catch (error) {
        
    }
}

export const batchAverageAttendanceController = async (req, res, next) => {
    try {
        const { batchId } = req.params; 

        const attendanceData = await getBatchAverageAttendance(batchId);

        res.status(200).json({
            success: true,
            data: attendanceData
        });
    } catch (error) {
        next(error); 
    }
};


export const Singlebatchstat = async (req, res, next) => {
    try {
        const { batchid } = req.params;
        const threshold = parseInt(req.query.threshold) || 75;

        const atRiskStudents = await getAtRiskStudents(batchid, threshold);
        const batchsta = await singlebatchstat(batchid)

        const stats = {
            atRiskStudents,
            no_atriskstudents : atRiskStudents.length,
            batchsta
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};


export const getAverageAttendedStudentsController = async (req, res, next) => {
    try {
        const { batchId } = req.params;
        
        const attendanceData = await getAverageAttendedStudents(batchId);

        res.status(200).json({
            success: true,
            data: attendanceData
        });
    } catch (error) {
        next(error);
    }
};


export const getWeeklyTrendsController = async (req, res, next) => {
    try {
        const { batchId } = req.params;
        const data = await getWeeklyAttendanceTrends(batchId);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};


export const getmybatch = async(req, res, next)=>{

    try {
        const enrollments = await Enrollment.find({
            student: req.user._id,
            isDeleted: false
        })
        .populate({
            path: 'batch',
            populate: [
                { path: 'instructor', select: 'firstname lastname' },
                { path: 'course',     select: 'title' }
            ]
        })
        .lean();

        const result = await Promise.all(
            enrollments
                .filter(e => e.batch && !e.batch.isDeleted)
                .map(async e => {
                    const sessions = await Session.find({ batch: e.batch._id })
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .lean();
                    return { batch: e.batch, sessions };
                })
        );

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}
export const getbatchInst = async (req, res, next) => {
    try {
        const id = new mongoose.Types.ObjectId(req.user._id.toString());
        console.log('instructor id:', id, typeof id);
        
        const batches = await Batch.find({ instructor: id, isDeleted: false });
        console.log('batches found:', batches.length);
               
        const sample = await Batch.findOne({}).select('instructor').lean();
        console.log('sample batch instructor field:', sample?.instructor);
        
        res.status(200).json({ success: true, data: batches });
    } catch (error) {
        next(error);
    }
};
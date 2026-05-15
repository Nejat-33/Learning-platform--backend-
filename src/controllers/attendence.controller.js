import { attendanceheatmap, markAttendaance } from "../services/attendence.service.js"
import AppError from "../utils/customerror.handler.js"
import Attendence from "../models/attendence.model.js"
import User  from "../models/user.model.js"
import Enrollment from "../models/enrollment.model.js"
import Session from "../models/session.model.js"


export const scanAttendenceQr = async(req, res, next)=>{
    try {

    const {qrToken} = req.body
    const studentid = req.user._id
    if(!qrToken){
        throw new AppError("No qr scanned")
    }
    const attendenceRecord = await markAttendaance(studentid, qrToken)
    res.status(200).json({
        success: true,
        message: "the attendence is successfuly scaned",
        data: attendenceRecord
    })

    } catch (error) {
        next(error)
    }
}

export const getAttendanceHeatmap = async (req, res) => {
  try {
  
   const heatmap = await attendanceheatmap()
   
    const high = heatmap.filter(item => item.intensity >= 70).slice(0, 3);
    const low = heatmap.filter(item => item.intensity < 70).slice(0, 3);

    res.status(200).json({ high, low });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAttendanceSummary = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    
    const presentCount = await Attendence.countDocuments({ student: studentId, status: 'present', isDeleted: false });
    const absentCount = await Attendence.countDocuments({ student: studentId, status: 'absent', isDeleted: false });
    const totalMarked = presentCount + absentCount;

    const Enrollment = (await import('../models/enrollment.model.js')).default;
    const enrolls = await Enrollment.find({ student: studentId });

    let attendancePercent = 0;
    if (totalMarked > 0) {
      attendancePercent = Math.round((presentCount / totalMarked) * 100 * 10) / 10; // one decimal
    } else if (enrolls && enrolls.length) {
      const avg = enrolls.reduce((s, e) => s + (e.attendencePercentage || 0), 0) / enrolls.length;
      attendancePercent = Math.round(avg * 10) / 10;
    }

    res.status(200).json({
      success: true,
      data: {
        present: presentCount,
        absent: absentCount,
        attendancePercent,
        minimumRequirement: 75,
      }
    });
  } catch (err) {
    next(err);
  }
};


export const getAttendanceLog = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const q = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const skip = parseInt(req.query.skip || '0', 10);

    const filter = { student: studentId, isDeleted: false };

    let records = await Attendence.find(filter)
      .populate({ path: 'batch', select: 'batchName section' })
      .populate({ 
        path: 'session', 
        select: 'instructor',
        populate: {
          path: 'instructor',
          model: 'Users',
          select: 'firstname lastname'
        }
      })
      .sort({ markedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const mapped = records.map(r => ({
      id: r._id,
      batch: r.batch?.batchName || 'Unknown',
      section: r.batch?.section || '',
      date: r.markedAt || r.createdAt,
      instructor: r.session?.instructor 
        ? `${r.session.instructor.firstname || ''} ${r.session.instructor.lastname || ''}`.trim()
        : '',
      status: r.status 
        ? r.status.charAt(0).toUpperCase() + r.status.slice(1) 
        : 'Unknown'
    }));

    const qLower = q.toLowerCase();
    const final = q
      ? mapped.filter(m =>
          (m.batch || '').toLowerCase().includes(qLower) ||
          (m.instructor || '').toLowerCase().includes(qLower) ||
          (m.status || '').toLowerCase().includes(qLower)
        )
      : mapped;

    res.status(200).json({ success: true, data: final });
  } catch (err) {
    next(err);
  }
};


export const getSessionAttendance = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId)
            .populate('instructor', 'firstname lastname')
            .lean();
        if (!session) return next(new AppError('Session not found', 404));

        // get all attendance records for this session
        const records = await Attendence.find({ session: sessionId, isDeleted: false })
            .populate('student', 'firstname lastname email profileImage')
            .lean();

        const present = records.filter(r => r.status === 'present').map(r => ({
            studentId:  r.student?._id,
            firstname:  r.student?.firstname,
            lastname:   r.student?.lastname,
            email:      r.student?.email,
            avatar:     r.student?.profileImage,
            markedAt:   r.markedAt,
        }));

        const absent = records.filter(r => r.status === 'absent').map(r => ({
            studentId:  r.student?._id,
            firstname:  r.student?.firstname,
            lastname:   r.student?.lastname,
            email:      r.student?.email,
            avatar:     r.student?.profileImage,
        }));

        // QR audit — split scans into first 5 min vs last 5 min
        const sessionStart = new Date(session.createdAt);
        const first5 = present.filter(p => 
            new Date(p.markedAt) - sessionStart <= 5 * 60 * 1000
        );
        const last5 = present.filter(p => {
            const diff = new Date(session.expirationDate) - new Date(p.markedAt);
            return diff <= 5 * 60 * 1000;
        });

        res.status(200).json({
            success: true,
            data: {
                session: {
                    _id:            session._id,
                    isActive:       session.isActive,
                    createdAt:      session.createdAt,
                    expirationDate: session.expirationDate,
                    instructor:     session.instructor,
                },
                summary: {
                    totalPresent: present.length,
                    totalAbsent:  absent.length,
                    total:        records.length,
                    attendanceRate: records.length
                        ? Math.round((present.length / records.length) * 100)
                        : 0,
                },
                present,
                absent,
                qrAudit: {
                    generatedAt:   session.createdAt,
                    first5Minutes: first5.length,
                    last5Minutes:  last5.length,
                    first5Students: first5,
                    last5Students:  last5,
                },
            }
        });
    } catch (err) {
        next(err);
    }
};



export const getBatchSessionsAttendance = async (req, res, next) => {
    try {
        const { batchId } = req.params;

        const sessions = await Session.find({ batch: batchId })
            .populate('instructor', 'firstname lastname')
            .sort({ createdAt: -1 })
            .lean();

        const sessionData = await Promise.all(
            sessions.map(async (s, idx) => {
                const records = await Attendence.find({ session: s._id, isDeleted: false }).lean();
                const present = records.filter(r => r.status === 'present').length;
                const total   = records.length;
                return {
                    _id:            s._id,
                    sessionNumber:  sessions.length - idx,
                    isActive:       s.isActive,
                    createdAt:      s.createdAt,
                    expirationDate: s.expirationDate,
                    instructor:     s.instructor,
                    attendance: {
                        present,
                        absent: total - present,
                        total,
                        rate: total ? Math.round((present / total) * 100) : 0,
                    }
                };
            })
        );

        const completedSessions = sessionData.filter(s => !s.isActive);
        const avgAttendance = completedSessions.length
            ? Math.round(completedSessions.reduce((s, x) => s + x.attendance.rate, 0) / completedSessions.length)
            : 0;

        const trend = [...sessionData]
            .reverse()
            .slice(-7)
            .map(s => ({ sessionNumber: s.sessionNumber, rate: s.attendance.rate }));

        const activeSession = sessionData.find(s => s.isActive) || null;

        res.status(200).json({
            success: true,
            data: {
                kpis: {
                    totalSessions:     sessions.length,
                    completedSessions: completedSessions.length,
                    completionRate:    sessions.length
                        ? Math.round((completedSessions.length / sessions.length) * 100)
                        : 0,
                    avgAttendance,
                    trend,
                },
                activeSession,
                sessions: sessionData,
            }
        });
    } catch (err) {
        next(err);
    }
};
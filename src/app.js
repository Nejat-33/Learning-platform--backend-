
import express from 'express'
import courseRoute from './routes/course.route.js'
import userRoute from './routes/user.route.js'
import enrollmentRoute from './routes/enrollment.route.js'
import paymentRoute from './routes/payment.route.js'
import sessionRouter from './routes/session.route.js'
import attendenceRoute from './routes/attendence.route.js'
import dashboardRoute from './routes/dashboard.route.js'
import authRouter from './routes/auth.route.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { notFoundmiddleware } from './middlewares/notFound.middleware.js'
import passport from 'passport'
import './config/passport.js'
import batchRoute from './routes/batch.route.js'
import analyticsRouter from './routes/analytics.route.js'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true 
}));
app.use(express.json())


app.use(passport.initialize())

app.use('/api/auth', authRouter)
app.use('/api/course', courseRoute)
app.use('/api/users', userRoute)
app.use('/api/enrollment', enrollmentRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/session', sessionRouter)
app.use('/api/attendance', attendenceRoute)
app.use('/api/analytics',  analyticsRouter)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/batch', batchRoute)

app.use(errorMiddleware)
app.use(notFoundmiddleware)

export default app

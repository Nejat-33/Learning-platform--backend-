import cron from 'node-cron'
import Batch from '../models/batch.model.js';

export const startBatchStatusScheduler = () => {

    cron.schedule('0 * * * *', async () => {
        const now = new Date();
        console.log(`--- Running Batch Status Update: ${now.toLocaleString()} ---`);

        try {

            const started = await Batch.updateMany(
                { 
                    status: 'upcoming', 
                    startDate: { $lte: now },
                    endDate: { $gt: now } 
                },
                { $set: { status: 'ongoing' } }
            );
            const finished = await Batch.updateMany(
                { 
                    status: { $in: ['ongoing', 'upcoming'] }, 
                    endDate: { $lte: now } 
                },
                { $set: { status: 'completed' } }
            );

            if (started.modifiedCount > 0 || finished.modifiedCount > 0) {
                console.log(`Updated: ${started.modifiedCount} to ongoing, ${finished.modifiedCount} to completed.`);
            }
        } catch (error) {
            console.error('Batch Scheduler Error:', error);
        }
    });
};
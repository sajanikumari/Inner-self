// Simple reminder scheduler stub using node-cron
// Later, expand to query Reminder model and schedule jobs

let cron;
let isScheduled = false;

function scheduleReminders() {
  try {
    if (isScheduled) return; // prevent double scheduling
    
    // Import node-cron only when needed
    cron = require('node-cron');
    isScheduled = true;

    // Run every minute as a placeholder
    cron.schedule('* * * * *', () => {
      try {
        // TODO: Fetch due reminders and send notifications via WebSocket or other channels
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[scheduler] Running periodic check at ${new Date().toISOString()}`);
        }
      } catch (error) {
        console.error('[scheduler] Error in scheduled task:', error.message);
      }
    });

    console.log('[scheduler] Reminder scheduler initialized');
  } catch (error) {
    console.error('[scheduler] Failed to initialize reminder scheduler:', error.message);
    throw error; // Re-throw to be caught by caller
  }
}

module.exports = { scheduleReminders };
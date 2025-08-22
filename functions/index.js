/**
 * Firebase Functions for InnerSelf Buddy
 * Currently using Render for backend, Firebase for hosting only
 */

const {setGlobalOptions} = require("firebase-functions");

// Set global options for cost control
setGlobalOptions({maxInstances: 10});

// No functions needed currently - using Render for backend
// This file exists to satisfy Firebase Functions requirements

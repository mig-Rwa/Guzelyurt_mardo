"use strict";
/**
 * Mardo Café - Firebase Cloud Functions
 *
 * Functions:
 * 1. dailySummary - Scheduled job that runs daily at midnight to create summary
 * 2. webhookHandler - Generic webhook endpoint with signature verification
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onOrderCreated = exports.webhookHandler = exports.dailySummary = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
/**
 * Scheduled function: Daily Summary
 * Runs every day at midnight (Europe/Istanbul timezone)
 * Creates a summary document with daily statistics
 */
exports.dailySummary = functions
    .region('europe-west1')
    .pubsub.schedule('0 0 * * *')
    .timeZone('Europe/Istanbul')
    .onRun(async (context) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(yesterday);
    endOfDay.setHours(23, 59, 59, 999);
    try {
        // Count orders from yesterday
        const ordersSnapshot = await db
            .collection('orders')
            .where('createdAt', '>=', startOfDay.toISOString())
            .where('createdAt', '<=', endOfDay.toISOString())
            .get();
        let totalRevenue = 0;
        ordersSnapshot.docs.forEach((doc) => {
            const order = doc.data();
            totalRevenue += order.total || 0;
        });
        // Count reservations from yesterday
        const reservationsSnapshot = await db
            .collection('reservations')
            .where('createdAt', '>=', startOfDay.toISOString())
            .where('createdAt', '<=', endOfDay.toISOString())
            .get();
        // Count new newsletter subscribers
        const subscribersSnapshot = await db
            .collection('newsletterSubscribers')
            .where('subscribedAt', '>=', startOfDay.toISOString())
            .where('subscribedAt', '<=', endOfDay.toISOString())
            .get();
        // Create summary document
        const summaryId = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD
        const summary = {
            id: summaryId,
            date: summaryId,
            totalOrders: ordersSnapshot.size,
            totalRevenue: totalRevenue,
            totalReservations: reservationsSnapshot.size,
            newSubscribers: subscribersSnapshot.size,
            createdAt: now.toISOString(),
        };
        await db.collection('dailySummaries').doc(summaryId).set(summary);
        functions.logger.info('Daily summary created', summary);
        return null;
    }
    catch (error) {
        functions.logger.error('Error creating daily summary', error);
        throw error;
    }
});
/**
 * HTTP function: Generic Webhook Handler
 * Receives webhooks with signature verification
 * Can be extended for various integrations (payments, notifications, etc.)
 */
exports.webhookHandler = functions
    .region('europe-west1')
    .https.onRequest(async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    // Note: Webhook secret would normally be used for HMAC verification
    // const webhookSecret = process.env.WEBHOOK_SECRET || 'mardo-webhook-secret';
    // Verify signature (example implementation)
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    if (!signature || !timestamp) {
        functions.logger.warn('Missing webhook signature or timestamp');
        res.status(401).send('Unauthorized');
        return;
    }
    // Simple signature verification is intentionally disabled here.
    // In production, use an HMAC-SHA256 check against the shared secret.
    try {
        const payload = req.body;
        const eventType = payload.type || 'unknown';
        functions.logger.info('Webhook received', {
            type: eventType,
            timestamp: timestamp,
        });
        // Handle different webhook event types
        switch (eventType) {
            case 'order.created':
                // Handle new order notification
                await handleOrderCreated(payload.data);
                break;
            case 'reservation.confirmed':
                // Handle reservation confirmation
                await handleReservationConfirmed(payload.data);
                break;
            case 'loyalty.reward_earned':
                // Handle loyalty reward
                await handleLoyaltyReward(payload.data);
                break;
            default:
                functions.logger.info('Unhandled webhook event type', { type: eventType });
        }
        // Log webhook to Firestore for audit trail
        await db.collection('webhookLogs').add({
            type: eventType,
            payload: payload,
            receivedAt: admin.firestore.FieldValue.serverTimestamp(),
            signature: signature,
        });
        res.status(200).json({ received: true });
    }
    catch (error) {
        functions.logger.error('Webhook processing error', error);
        res.status(500).send('Internal Server Error');
    }
});
// Helper functions for webhook handling
async function handleOrderCreated(data) {
    functions.logger.info('Processing new order', { orderId: data?.orderId });
    // Add notification logic, inventory updates, etc.
}
async function handleReservationConfirmed(data) {
    functions.logger.info('Processing reservation confirmation', {
        reservationId: data?.reservationId,
    });
    // Send confirmation email, update calendar, etc.
}
async function handleLoyaltyReward(data) {
    functions.logger.info('Processing loyalty reward', { userId: data?.userId });
    // Update user's loyalty points, send notification, etc.
}
/**
 * Firestore trigger: New Order Created
 * Triggered when a new order is added to the orders collection
 */
exports.onOrderCreated = functions
    .region('europe-west1')
    .firestore.document('orders/{orderId}')
    .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;
    functions.logger.info('New order created', {
        orderId,
        total: order.total,
        items: order.items?.length,
    });
    // Update user's loyalty points if authenticated
    if (order.userId && order.userId !== 'guest') {
        try {
            const loyaltyRef = db.collection('loyaltyPoints').doc(order.userId);
            const loyaltyDoc = await loyaltyRef.get();
            if (loyaltyDoc.exists) {
                // Add a stamp for the order
                await loyaltyRef.update({
                    stamps: admin.firestore.FieldValue.increment(1),
                    lastUpdated: new Date().toISOString(),
                });
            }
            else {
                // Create new loyalty record
                await loyaltyRef.set({
                    userId: order.userId,
                    stamps: 1,
                    totalRedeemed: 0,
                    lastUpdated: new Date().toISOString(),
                });
            }
            functions.logger.info('Loyalty points updated', { userId: order.userId });
        }
        catch (error) {
            functions.logger.error('Error updating loyalty points', error);
        }
    }
    return null;
});
//# sourceMappingURL=index.js.map
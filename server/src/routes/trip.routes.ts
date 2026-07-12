import { Router } from 'express';
import { TripController } from '../controllers/trip.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { USER_ROLES } from '../types/role.types';
import {
  createTripSchema,
  updateTripSchema,
  completeTripSchema,
  getTripByIdSchema,
  listTripsSchema,
} from '../validators/trip.validator';

const router = Router();

// GET / - List all trips (authenticated)
router.get(
  '/',
  authenticate,
  validate(listTripsSchema),
  TripController.getTrips
);

// POST / - Create a new trip (DISPATCHER only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.DISPATCHER),
  validate(createTripSchema),
  TripController.createTrip
);

// PATCH /:id/dispatch - Dispatch a trip (DISPATCHER only)
router.patch(
  '/:id/dispatch',
  authenticate,
  authorize(USER_ROLES.DISPATCHER),
  validate(getTripByIdSchema),
  TripController.dispatchTrip
);

// PATCH /:id/complete - Complete a trip (DISPATCHER only)
router.patch(
  '/:id/complete',
  authenticate,
  authorize(USER_ROLES.DISPATCHER),
  validate(getTripByIdSchema),
  validate(completeTripSchema),
  TripController.completeTrip
);

// PATCH /:id/cancel - Cancel a trip (DISPATCHER only)
router.patch(
  '/:id/cancel',
  authenticate,
  authorize(USER_ROLES.DISPATCHER),
  validate(getTripByIdSchema),
  TripController.cancelTrip
);

// GET /:id - Get trip by ID (authenticated)
router.get(
  '/:id',
  authenticate,
  validate(getTripByIdSchema),
  TripController.getTripById
);

// PATCH /:id - Update an existing trip planning fields (DISPATCHER only)
router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.DISPATCHER),
  validate(getTripByIdSchema),
  validate(updateTripSchema),
  TripController.updateTrip
);

export default router;

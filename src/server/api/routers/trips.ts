import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const tripsRouter = createTRPCRouter({
	getTrip: publicProcedure
		.input(z.object({
			slug: z.string().regex(/^[a-z0-9\-]+$/),
			includeSegments: z.boolean().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			console.log('trips router');

			const { slug } = input;
			const includeSegments = input.includeSegments ?? false;

			try {
				console.log('getting trip');

				const trip = await ctx.prisma.trip.findUnique({
					where: {
						slug,
					},
					include: {
						segments: includeSegments,
					},
				});

				console.log(trip);

				if (!trip) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: '(TRIPS/TRIP-NOT-FOUND) Trip not found',
						cause: 'Trip not found',
					});
				}

				return trip;
			} catch (error) {
				console.error('[ERROR] Failed to get trip');
				console.error('[ERROR] input', input);
				console.error('[ERROR] error', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to get trip',
				});
			}
		}),
	getTrips: protectedProcedure
		.query(async ({ ctx }) => {
			try {
				const trips = await ctx.prisma.trip.findMany({
					where: {
						userId: ctx.session.user.id,
					},
				});

				return trips;
			} catch (error) {
				console.error('[ERROR] Failed to get trips');
				console.error('[ERROR] error', error);
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Failed to get trips',
					cause: error
				});
			}
		}),
	newTrip: protectedProcedure
		.input(z.object({
			name: z.string(),
			slug: z.string().regex(/^[a-z0-9\-]+$/),
			description: z.string(),
			destination: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			console.log('new trip');

			const { name, slug, description, destination } = input;

			const doesSlugExist = await ctx.prisma.trip.findUnique({
				where: {
					slug,
				},
			});

			if (doesSlugExist) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: '(TRIPS/SLUG-IN-USE) Slug already exists',
					cause: 'Slug already exists',
				});
			}

			try {
				const trip = await ctx.prisma.trip.create({
					data: {
						name,
						slug,
						description,
						destination,
						userId: ctx.session.user.id,
					}
				});

				return trip;
			} catch (error) {
				console.error('[ERROR] Failed to create trip');
				console.error('[ERROR] input', input);
				console.error('[ERROR] error', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to create trip',
				});
			}
		}),
});

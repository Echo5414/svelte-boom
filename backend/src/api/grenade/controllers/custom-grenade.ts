import { factories } from '@strapi/strapi';
import { Context } from 'koa';

interface User {
  id: number;
  username: string;
}

interface GrenadeEntity {
  id: number;
  likes?: number;
  likedBy?: User[];
  publishedAt?: string;
}

export default factories.createCoreController('api::grenade.grenade', ({ strapi }) => ({
  async likeGrenade(ctx: Context) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to like grenades');
    }

    try {
      // Fetch the grenade
      const existingGrenade = await strapi.db.query('api::grenade.grenade').findOne({
        where: { id },
        populate: ['likedBy'],
      }) as GrenadeEntity;

      if (!existingGrenade) {
        return ctx.notFound('Grenade not found');
      }

      const likedByUsers = existingGrenade.likedBy || [];
      const alreadyLiked = likedByUsers.some(u => u.id === user.id);

      if (alreadyLiked) {
        return ctx.badRequest('You have already liked this grenade');
      }

      // Create the new likedBy array in the required format
      const updatedLikedBy = [
        ...likedByUsers.map(u => ({ id: u.id })),
        { id: user.id }
      ];

      const updatedGrenade = await strapi.entityService.update('api::grenade.grenade', id, {
        data: {
          likes: (existingGrenade.likes || 0) + 1,
          likedBy: updatedLikedBy as any, // Force type to any here
          publishedAt: existingGrenade.publishedAt || new Date().toISOString(),
        },
        populate: ['likedBy'],
      }) as GrenadeEntity;

      return {
        data: {
          id: parseInt(id),
          likes: updatedGrenade.likes,
          likedBy: updatedGrenade.likedBy || []
        }
      };

    } catch (error) {
      console.error('Error in likeGrenade:', error);
      return ctx.internalServerError('An error occurred while liking the grenade');
    }
  },

  async unlikeGrenade(ctx: Context) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to unlike grenades');
    }

    try {
      const existingGrenade = await strapi.db.query('api::grenade.grenade').findOne({
        where: { id },
        populate: ['likedBy'],
      }) as GrenadeEntity;

      if (!existingGrenade) {
        return ctx.notFound('Grenade not found');
      }

      const likedByUsers = existingGrenade.likedBy || [];
      const hasLiked = likedByUsers.some(u => u.id === user.id);

      if (!hasLiked) {
        return ctx.badRequest('You have not liked this grenade');
      }

      // Filter out the user and convert to [{ id: number }] format
      const updatedLikedBy = likedByUsers
        .filter(u => u.id !== user.id)
        .map(u => ({ id: u.id }));

      const updatedGrenade = await strapi.entityService.update('api::grenade.grenade', id, {
        data: {
          likes: Math.max((existingGrenade.likes || 0) - 1, 0),
          likedBy: updatedLikedBy as any,
          publishedAt: existingGrenade.publishedAt || new Date().toISOString(),
        },
        populate: ['likedBy'],
      }) as GrenadeEntity;

      return { 
        data: {
          id: parseInt(id), // Wichtig: Hier geben wir die ursprüngliche ID zurück
          likes: updatedGrenade.likes,
          likedBy: updatedGrenade.likedBy || []
        }
      };

    } catch (error) {
      console.error('Error in unlikeGrenade:', error);
      return ctx.internalServerError('An error occurred while unliking the grenade');
    }
  }
}));

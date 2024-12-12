import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import type { Strapi as StrapiType } from '@strapi/types/dist/core';

interface User {
  id: number;
  username: string;
}

interface GrenadeEntity {
  id: number;
  documentId: string;
  title?: string;
  likes?: number;
  views?: number;
  position?: string;
  public?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  likedBy?: User[];
}

export default factories.createCoreController('api::grenade.grenade', ({ strapi }) => ({
  async likeGrenade(ctx: Context) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to like grenades');
    }

    try {
      // First find the grenade with its relations
      const existingGrenade = await strapi.db.query('api::grenade.grenade').findOne({
        where: { id },
        populate: ['likedBy']
      }) as GrenadeEntity;

      console.log('Found grenade:', existingGrenade);

      if (!existingGrenade) {
        return ctx.notFound('Grenade not found');
      }

      // Check if already liked
      const likedByUsers = existingGrenade.likedBy || [];
      const alreadyLiked = likedByUsers.some(u => u.id === user.id);

      if (alreadyLiked) {
        return ctx.badRequest('You have already liked this grenade');
      }

      // Update the grenade
      const updatedGrenade = await strapi.db.query('api::grenade.grenade').update({
        where: { id },
        data: {
          likes: (existingGrenade.likes || 0) + 1,
          likedBy: {
            connect: [user.id]
          }
        },
        populate: ['likedBy']
      }) as GrenadeEntity;

      // Fetch fresh data to ensure we have the updated relations
      const finalGrenade = await strapi.db.query('api::grenade.grenade').findOne({
        where: { id },
        populate: ['likedBy']
      }) as GrenadeEntity;

      console.log('Final grenade after like:', finalGrenade);

      return {
        data: {
          id: finalGrenade.id,
          likes: finalGrenade.likes,
          likedBy: finalGrenade.likedBy || []
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
        populate: ['likedBy']
      }) as GrenadeEntity;

      if (!existingGrenade) {
        return ctx.notFound('Grenade not found');
      }

      const likedByUsers = existingGrenade.likedBy || [];
      const hasLiked = likedByUsers.some(u => u.id === user.id);

      if (!hasLiked) {
        return ctx.badRequest('You have not liked this grenade');
      }

      // Update the grenade
      const updatedGrenade = await strapi.db.query('api::grenade.grenade').update({
        where: { id },
        data: {
          likes: Math.max((existingGrenade.likes || 0) - 1, 0),
          likedBy: {
            disconnect: [user.id]
          }
        },
        populate: ['likedBy']
      }) as GrenadeEntity;

      return {
        data: {
          id: updatedGrenade.id,
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
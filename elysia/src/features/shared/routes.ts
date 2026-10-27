import Elysia from 'elysia';
import { db } from '~/db';
import { redis } from './helpers';

export const setup = new Elysia({ name: 'setup' })
	.decorate('redis', redis)
	.decorate('db', db);

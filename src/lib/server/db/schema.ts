import { pgTable, serial, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';

export const kudos = pgTable('Kudo', {
  id: serial('id').primaryKey(),
  kudoTitle: varchar('kudoTitle', { length: 20 }).notNull().default('WELL_DONE'),
  createdAt: timestamp('createdAt', { precision: 6 }).notNull().defaultNow(),
  content: varchar('content', { length: 1000 }).notNull().default(''),
  from: varchar('from', { length: 255 }).notNull().default('-'),
  to: varchar('to', { length: 255 }).notNull().default('-'),
  img: text('img').notNull().default(''),
  archived: boolean('archived').notNull().default(false),
});

export type KudosTable = typeof kudos;

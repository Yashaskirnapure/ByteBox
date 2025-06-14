import { pgTable, integer, text, boolean, uuid, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    //basic file information
    name: text("name").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    type: text("type").notNull(),

    //storage information
    fileUrl: text("fileURL"),
    thumbnailUrl: text("thumbnailURL"),

    //ownership
    userID: text("userID").notNull(),
    parentID: uuid("parentID"),

    //type/options
    isFolder: boolean("isFolder").notNull().default(false),
    isStarred: boolean("isStarred").notNull().default(false),
    isTrash: boolean("isTrash").notNull().default(false),

    //timestamps
    createdAt: date("createdAt").defaultNow().notNull(),
    updatedAt: date("updatedAt").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
    parent: one(files, {
        fields: [files.parentID],
        references: [files.id],
    }),

    children: many(files)
}));

export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert
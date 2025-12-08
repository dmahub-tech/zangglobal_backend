import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
	galleryId: string;
	title: string;
	description: string;
	imageUrl: string;
	category: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
	{
		galleryId: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: false,
			trim: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: ["technology", "sustainability", "events", "team", "projects", "general"],
			default: "general",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

const GalleryModel = mongoose.model<IGallery>("Gallery", GallerySchema);

export default GalleryModel;
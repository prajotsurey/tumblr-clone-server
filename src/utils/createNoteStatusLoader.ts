import DataLoader from "dataloader";
import { Note } from "../entities/Note";

export const createNoteStatusLoader = () => 
new DataLoader<{postId: number; userId: number}, Boolean>(
	async (keys) => {
	const noteStatuses = await Note.findByIds(keys as any);
	const noteStatusesToStatus: Record<string, Note> = {};
	noteStatuses.forEach(n => {
		noteStatusesToStatus[`${n.userId}|${n.postId}`] = n;
	})

	const statuses = keys.map((key) => noteStatusesToStatus[`${key.userId}|${key.postId}`] ? true : false)
	return statuses
});
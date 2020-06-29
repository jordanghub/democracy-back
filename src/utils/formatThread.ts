import { Thread } from 'src/thread/models/thread.entity';

export const formatThreadLatest = (thread: Thread) => {
  if (!(thread instanceof Thread)) {
    return {};
  }
  const result: any = {};

  result.id = thread.id;
  result.title = thread.title;
  result.slug = thread.slug;
  result.createdAt = thread.createdAt;

  if (thread.author) {
    result.author = thread.author;
  }

  if (thread.messages) {
    result.messages = thread.messages;
  }

  if (thread.followers) {
    result.isFollowing = thread.followers.length > 0;
  }

  if (thread.categories) {
    result.categories = thread.categories.map(threadCat => threadCat.category);
  }
  if (thread.originalSelection) {
    result.originalSelection = thread.originalSelection;
  }

  if (thread.votes) {
    result.votes = thread.votes;
  }

  if (thread.locked) {
    result.locked = thread.locked;
  } else {
    result.locked = null;
  }
  return result;
};

import { Thread } from 'src/thread/thread.entity';

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

  if (thread.categories) {
    result.categories = thread.categories.map((threadCat) => threadCat.category);
  }

  return result;

};

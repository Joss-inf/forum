import * as TagModel from './tags.model.js';

export async function getTagById(id) {
  return await TagModel.findTagById(id);
}

export async function addTag(name) {
  return await TagModel.createTag(name);
}

export async function getAllTags() {
  return await TagModel.ObtainAllsTags();
}

export async function editTag(id, name) {
  return await TagModel.updateTag(id, name);
}

export async function removeTag(id) {
  return await TagModel.deleteTag(id);
}


import * as TagService from './tags.service.js';

export async function createTag(req, res, next) {
  try {
    const { name } = req.body;
    const newTag = await TagService.addTag(name);
    res.status(201).json(newTag);
  } catch (error) {
    next(error);
  }
}

export async function getTagById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const tag = await TagService.getTagById(id);
    if (!tag) return res.status(404).json({ message: 'Tag non trouvé' });
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
}

export async function getAllTags(_req, res, next) {
  try {
    const tags = await TagService.getAllTags();
    console.log(tags)
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
}

export async function updateTag(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const updatedTag = await TagService.editTag(id, name);
    if (!updatedTag) return res.status(404).json({ message: 'Tag non trouvé' });
    res.status(200).json(updatedTag);
  } catch (error) {
    next(error);
  }
}

export async function deleteTag(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deletedTag = await TagService.removeTag(id);
    if (!deletedTag) return res.status(404).json({ message: 'Tag non trouvé' });
    res.status(204).send({ message: 'Tag supprimé', tag: deletedTag });
  } catch (error) {
    next(error);
  }
}

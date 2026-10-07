import makeComment from '../comment'
export class EditComment {
  constructor ({ commentsDb, handleModeration }) {
    this.commentsDb = commentsDb
    this.handleModeration = handleModeration
  }

  async execute ({ id, ...changes } = {}) {
    if (!id) {
      throw new Error('You must supply an id.')
    }
    if (!changes.text) {
      throw new Error('You must supply text.')
    }
    const existing = await this.commentsDb.findById({ id })

    if (!existing) {
      throw new RangeError('Comment not found.')
    }
    const comment = makeComment({ ...existing, ...changes, modifiedOn: null })
    if (comment.getHash() === existing.hash) {
      return existing
    }
    const moderated = await this.handleModeration({ comment })
    const updated = await this.commentsDb.update({
      id: moderated.getId(),
      published: moderated.isPublished(),
      modifiedOn: moderated.getModifiedOn(),
      text: moderated.getText(),
      hash: moderated.getHash()
    })
    return { ...existing, ...updated }
  }
}

export default function makeEditComment (dependencies) {
  const editComment = new EditComment(dependencies)
  return editComment.execute.bind(editComment)
}

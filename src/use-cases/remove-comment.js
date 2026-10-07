import makeComment from '../comment'

export class RemoveComment {
  constructor ({ commentsDb }) {
    this.commentsDb = commentsDb
  }

  async execute ({ id } = {}) {
    if (!id) {
      throw new Error('You must supply a comment id.')
    }

    const commentToDelete = await this.commentsDb.findById({ id })

    if (!commentToDelete) {
      return this.deleteNothing()
    }

    if (await this.hasReplies(commentToDelete)) {
      return this.softDelete(commentToDelete)
    }

    if (await this.isOnlyReplyOfDeletedParent(commentToDelete)) {
      return this.deleteCommentAndParent(commentToDelete)
    }

    return this.hardDelete(commentToDelete)
  }

  async hasReplies ({ id: commentId }) {
    const replies = await this.commentsDb.findReplies({
      commentId,
      publishedOnly: false
    })
    return replies.length > 0
  }

  async isOnlyReplyOfDeletedParent (comment) {
    if (!comment.replyToId) {
      return false
    }
    const parent = await this.commentsDb.findById({ id: comment.replyToId })
    if (parent && makeComment(parent).isDeleted()) {
      const replies = await this.commentsDb.findReplies({
        commentId: parent.id,
        publishedOnly: false
      })
      return replies.length === 1
    }
    return false
  }

  deleteNothing () {
    return {
      deletedCount: 0,
      softDelete: false,
      message: 'Comment not found, nothing to delete.'
    }
  }

  async softDelete (commentInfo) {
    const toDelete = makeComment(commentInfo)
    toDelete.markDeleted()
    await this.commentsDb.update({
      id: toDelete.getId(),
      author: toDelete.getAuthor(),
      text: toDelete.getText(),
      replyToId: toDelete.getReplyToId(),
      postId: toDelete.getPostId()
    })
    return {
      deletedCount: 1,
      softDelete: true,
      message: 'Comment has replies. Soft deleted.'
    }
  }

  async deleteCommentAndParent (comment) {
    await Promise.all([
      this.commentsDb.remove(comment),
      this.commentsDb.remove({ id: comment.replyToId })
    ])
    return {
      deletedCount: 2,
      softDelete: false,
      message: 'Comment and parent deleted.'
    }
  }

  async hardDelete (comment) {
    await this.commentsDb.remove(comment)
    return {
      deletedCount: 1,
      softDelete: false,
      message: 'Comment deleted.'
    }
  }
}

export default function makeRemoveComment (dependencies) {
  const removeComment = new RemoveComment(dependencies)
  return removeComment.execute.bind(removeComment)
}

export class ListComments {
  constructor ({ commentsDb }) {
    this.commentsDb = commentsDb
  }

  async execute ({ postId } = {}) {
    if (!postId) {
      throw new Error('You must supply a post id.')
    }
    const comments = await this.commentsDb.findByPostId({
      postId,
      omitReplies: false
    })
    return this.nest(comments)
  }

  // If this gets slow introduce caching.
  nest (comments) {
    if (comments.length === 0) {
      return comments
    }
    return comments.reduce((nested, comment) => {
      comment.replies = comments.filter(
        reply => reply.replyToId === comment.id
      )
      this.nest(comment.replies)
      if (comment.replyToId == null) {
        nested.push(comment)
      }
      return nested
    }, [])
  }
}

export default function makeListComments (dependencies) {
  const listComments = new ListComments(dependencies)
  return listComments.execute.bind(listComments)
}

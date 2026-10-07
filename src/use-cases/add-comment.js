import makeComment from '../comment'
export class AddComment {
  constructor ({ commentsDb, handleModeration }) {
    this.commentsDb = commentsDb
    this.handleModeration = handleModeration
  }

  async execute (commentInfo) {
    const comment = makeComment(commentInfo)
    const exists = await this.commentsDb.findByHash({ hash: comment.getHash() })
    if (exists) {
      return exists
    }

    const moderated = await this.handleModeration({ comment })
    const commentSource = moderated.getSource()
    return this.commentsDb.insert({
      author: moderated.getAuthor(),
      createdOn: moderated.getCreatedOn(),
      hash: moderated.getHash(),
      id: moderated.getId(),
      modifiedOn: moderated.getModifiedOn(),
      postId: moderated.getPostId(),
      published: moderated.isPublished(),
      replyToId: moderated.getReplyToId(),
      source: {
        ip: commentSource.getIp(),
        browser: commentSource.getBrowser(),
        referrer: commentSource.getReferrer()
      },
      text: moderated.getText()
    })
  }
}

export default function makeAddComment (dependencies) {
  const addComment = new AddComment(dependencies)
  return addComment.execute.bind(addComment)
}

export default function buildMakeComment ({ Id, md5, sanitize, makeSource }) {
  class Comment {
    constructor ({
      author,
      createdOn = Date.now(),
      id = Id.makeId(),
      source,
      modifiedOn = Date.now(),
      postId,
      published = false,
      replyToId,
      text
    } = {}) {
      if (!Id.isValidId(id)) {
        throw new Error('Comment must have a valid id.')
      }
      if (!author) {
        throw new Error('Comment must have an author.')
      }
      if (author.length < 2) {
        throw new Error("Comment author's name must be longer than 2 characters.")
      }
      if (!postId) {
        throw new Error('Comment must contain a postId.')
      }
      if (!text || text.length < 1) {
        throw new Error('Comment must include at least one character of text.')
      }
      if (!source) {
        throw new Error('Comment must have a source.')
      }
      if (replyToId && !Id.isValidId(replyToId)) {
        throw new Error('If supplied. Comment must contain a valid replyToId.')
      }

      const sanitizedText = sanitize(text).trim()
      if (sanitizedText.length < 1) {
        throw new Error('Comment contains no usable text.')
      }

      this.author = author
      this.createdOn = createdOn
      this.id = id
      this.source = makeSource(source)
      this.modifiedOn = modifiedOn
      this.postId = postId
      this.published = published
      this.replyToId = replyToId
      this.text = sanitizedText
      this.deletedText = '.xX This comment has been deleted Xx.'
      this.hash = null
    }

    getAuthor () {
      return this.author
    }

    getCreatedOn () {
      return this.createdOn
    }

    getHash () {
      if (!this.hash) {
        this.hash = this.makeHash()
      }
      return this.hash
    }

    getId () {
      return this.id
    }

    getModifiedOn () {
      return this.modifiedOn
    }

    getPostId () {
      return this.postId
    }

    getReplyToId () {
      return this.replyToId
    }

    getSource () {
      return this.source
    }

    getText () {
      return this.text
    }

    isDeleted () {
      return this.text === this.deletedText
    }

    isPublished () {
      return this.published
    }

    markDeleted () {
      this.text = this.deletedText
      this.author = 'deleted'
      this.hash = null
    }

    publish () {
      this.published = true
      this.hash = null
    }

    unPublish () {
      this.published = false
      this.hash = null
    }

    makeHash () {
      return md5(
        this.text +
          this.published +
          (this.author || '') +
          (this.postId || '') +
          (this.replyToId || '')
      )
    }
  }

  return function makeComment (commentInfo) {
    return new Comment(commentInfo)
  }
}

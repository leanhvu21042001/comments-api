import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import makeRemoveComment from './remove-comment'
import makeListComments from './list-comments'
import makeHandleModeration from './handle-moderation'
import commentsDb from '../data-access'
import isQuestionable from '../is-questionable'

class CommentService {
  constructor () {
    this.handleModeration = makeHandleModeration({
      isQuestionable,
      initiateReview: async () => {} // TODO: Make real initiate review function.
    })
    this.addComment = makeAddComment({
      commentsDb,
      handleModeration: this.handleModeration
    })
    this.editComment = makeEditComment({
      commentsDb,
      handleModeration: this.handleModeration
    })
    this.listComments = makeListComments({ commentsDb })
    this.removeComment = makeRemoveComment({ commentsDb })
  }
}

const commentService = new CommentService()
const { addComment, editComment, listComments, removeComment } = commentService

export default commentService
export { addComment, editComment, listComments, removeComment }

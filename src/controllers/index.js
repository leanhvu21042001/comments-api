import {
  addComment,
  editComment,
  listComments,
  removeComment
} from '../use-cases'
import makeDeleteComment from './delete-comment'
import makeGetComments from './get-comments'
import makePostComment from './post-comment'
import makePatchComment from './patch-comment'
import notFound from './not-found'

class CommentController {
  constructor () {
    this.deleteComment = makeDeleteComment({ removeComment })
    this.getComments = makeGetComments({
      listComments
    })
    this.postComment = makePostComment({ addComment })
    this.patchComment = makePatchComment({ editComment })
    this.notFound = notFound
  }
}

const commentController = new CommentController()
const {
  deleteComment,
  getComments,
  notFound: notFoundController,
  postComment,
  patchComment
} = commentController

export default commentController
export {
  deleteComment,
  getComments,
  notFoundController as notFound,
  postComment,
  patchComment
}

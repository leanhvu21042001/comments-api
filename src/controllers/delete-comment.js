export class DeleteCommentController {
  constructor ({ removeComment }) {
    this.removeComment = removeComment
  }

  async execute (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const deleted = await this.removeComment({ id: httpRequest.params.id })
      return {
        headers,
        statusCode: deleted.deletedCount === 0 ? 404 : 200,
        body: { deleted }
      }
    } catch (e) {
      // TODO: Error logging
      console.log(e)
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}

export default function makeDeleteComment (dependencies) {
  const deleteCommentController = new DeleteCommentController(dependencies)
  return deleteCommentController.execute.bind(deleteCommentController)
}

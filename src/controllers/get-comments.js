export class GetCommentsController {
  constructor ({ listComments }) {
    this.listComments = listComments
  }

  async execute (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const postComments = await this.listComments({
        postId: httpRequest.query.postId
      })
      return {
        headers,
        statusCode: 200,
        body: postComments
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

export default function makeGetComments (dependencies) {
  const getCommentsController = new GetCommentsController(dependencies)
  return getCommentsController.execute.bind(getCommentsController)
}

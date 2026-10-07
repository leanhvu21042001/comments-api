export class PostCommentController {
  constructor ({ addComment }) {
    this.addComment = addComment
  }

  async execute (httpRequest) {
    try {
      const { source = {}, ...commentInfo } = httpRequest.body
      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['User-Agent']
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const posted = await this.addComment({
        ...commentInfo,
        source
      })
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(posted.modifiedOn).toUTCString()
        },
        statusCode: 201,
        body: { posted }
      }
    } catch (e) {
      // TODO: Error logging
      console.log(e)

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}

export default function makePostComment (dependencies) {
  const postCommentController = new PostCommentController(dependencies)
  return postCommentController.execute.bind(postCommentController)
}

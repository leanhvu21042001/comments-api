export class HandleModeration {
  constructor ({ isQuestionable, initiateReview }) {
    this.isQuestionable = isQuestionable
    this.initiateReview = initiateReview
  }

  async execute ({ comment }) {
    const shouldModerate = await this.isQuestionable({
      text: comment.getText(),
      ip: comment.getSource().getIp(),
      browser: comment.getSource().getBrowser(),
      referrer: comment.getSource().getReferrer(),
      author: comment.getAuthor(),
      createdOn: comment.getCreatedOn(),
      modifiedOn: comment.getModifiedOn()
    })
    if (shouldModerate) {
      this.initiateReview({ id: comment.getId(), content: comment.getText() })
      comment.unPublish()
    } else {
      comment.publish()
    }
    return comment
  }
}

export default function makeHandleModeration (dependencies) {
  const handleModeration = new HandleModeration(dependencies)
  return handleModeration.execute.bind(handleModeration)
}

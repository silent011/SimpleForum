module.exports = (posts) => {
  let sorted = posts.sort((a, b) => {
    let aLength = a.answers.length
    let bLength = b.answers.length
    let parameterA = a.date
    let parameterB = b.date
    if (aLength > 0) {
      parameterA = a.answers[aLength - 1].date
    }
    if (bLength > 0) {
      parameterB = b.answers[bLength - 1].date
    }

    return parameterB - parameterA
  })

  return sorted
}

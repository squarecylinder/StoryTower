const aggregationPipelineFindShadowChapters = [
    {
      $lookup: {
        from: "chapters",
        localField: "chapters",
        foreignField: "_id",
        as: "result"
      }
    },
    {
      $addFields: {
        missing_chapters: {
          $setDifference: ["$chapters", "$result._id"]
        }
      }
    },
    {
      $match: {
        missing_chapters: { $ne: [] }
      }
    },
    {
      $project: {
        _id: 1,
        missing_chapters: 1
      }
    }
  ]

  module.exports = aggregationPipelineFindShadowChapters
  
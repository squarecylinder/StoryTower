const aggregationPipelineFindOrphanedStories = [
    {
      $lookup:
        
        {
          from: "stories",
          localField: "story",
          foreignField: "_id",
          as: "results",
        },
    },
    {
      $match:
        {
          results: {
            $size: 0,
          },
        },
    },
]
module.exports = aggregationPipelineFindOrphanedStories
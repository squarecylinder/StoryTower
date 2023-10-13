const aggregationPipelineFindDuplicateChapters = [
  {
    $unwind: {
      path: "$chapters",
    },
  },
  {
    $lookup: {
      from: "chapters",
      localField: "chapters",
      foreignField: "_id",
      as: "chapterDetails",
    },
  },
  {
    $project: {
      _id: 0,
      chapterId: "$chapterDetails._id",
      chapterTitle: "$chapterDetails.title",
    },
  },
  {
    $unwind:
    {
      path: "$chapterTitle",
    },
  },
  {
    $unwind:
    {
      path: "$chapterId",
    },
  },
  {
    $group: {
      _id: "$chapterTitle",
      count: {
        $sum: 1,
      },
      chapterTitles: {
        $first: "$chapterTitle",
      },
      chapterId: {
        $first: "$chapterId",
      },
    },
  },
  {
    $match: {
      count: {
        $gt: 1,
      },
    },
  },
  {
    $project:
    {
      _id: 1,
      chapterId: 1,
      chapterTitles: 1,
    },
  },
  {
    $group:
    {
      _id: null,
      chapterIds: {
        $push: "$chapterId",
      },
    },
  },
]

module.exports = aggregationPipelineFindDuplicateChapters
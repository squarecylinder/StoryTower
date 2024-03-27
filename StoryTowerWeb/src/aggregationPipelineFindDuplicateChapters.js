const aggregationPipelineFindDuplicateChapters = [
  {
    $group: {
      _id: {
        title: "$title",
        story: "$story"
      },
      chapters: { $push: "$_id" },
      count: { $sum: 1 }
    }
  },
  {
    $match: {
      count: { $gt: 1 }
    }
  },
  {
    $project: {
      _id: "$chapters",
      story: "$_id.story"
    }
  }
];

module.exports = aggregationPipelineFindDuplicateChapters
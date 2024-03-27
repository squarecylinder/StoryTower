const aggregationPipelineFindNullChapters = [
    {
      $match:
        {
          images: null,
        },
    },
  ]

module.exports = aggregationPipelineFindNullChapters;
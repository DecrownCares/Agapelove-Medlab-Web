const Post = require('../models/Post');

const cookieRecommend = async (req, res) => {
  const categoryViews = req.cookies.categoryViews ? JSON.parse(req.cookies.categoryViews) : {};
  const sortedCategories = Object.keys(categoryViews).sort((a, b) => categoryViews[b] - categoryViews[a]);

  // Fetch posts based on sorted categories
  const recommendedPosts = await fetchPostsByCategories(sortedCategories);
  res.json(recommendedPosts);
};

async function fetchPostsByCategories(categories) {
  try {
    const postsByCategory = await Promise.all(
      categories.map(async (category) => {
        const posts = await Post.find({ categories: category }).limit(2); // Adjust the limit as necessary
        return { category, posts };
      })
    ); 
    return postsByCategory;
  } catch (error) {
    console.error('Error fetching posts by categories:', error);
    return categories.map(category => ({
      category,
      posts: [] // Return empty array in case of error
    }));
  }
}

module.exports = {
  cookieRecommend,
  fetchPostsByCategories
};

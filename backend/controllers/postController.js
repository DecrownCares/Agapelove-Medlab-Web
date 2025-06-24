const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User'); 
const slugify = require("../utils/slugify");
const Subscriber = require('../models/Subscription');
const webPush = require('../utils/webPushConfig');
const { htmlToText } = require('html-to-text');
const stripHtml = (html) => html.replace(/<[^>]*>/g, ''); 





const createPost = async (req, res) => {
  console.log('Request user:', req.user);
  const { title, content, videoUrl, categories, subCategories, types, tags, isSponsored } = req.body;
  console.log('Post data:', { title, content, videoUrl, categories, types, tags, });


  if (!title || !content || !categories || !subCategories || !types || !tags ) {
      console.error('Missing required fields');
      return res.status(400).json({ "message": "Fill all required fields" });
  }

  const duplicate = await Post.findOne({ title });
  if (duplicate) {
      console.error('Duplicate post title');
      return res.status(409).json({ message: "A post with this title already exists." });
  }

  let image = null;

  try {
      if (!req.user || !req.user._id || !req.user.username) {
          console.error('User not found in request');
          return res.status(401).json({ message: 'User not authenticated' });
      }

      const authorId = req.user._id; 
      const authorUsername = req.user.username; 

      console.log("Creating post with data:", { title, content, videoUrl, categories, subCategories, types, tags, authorId });

      if (req.file) {
          image = `/uploads/${req.file.filename}`;
          console.log("Image URL created:", image);
      }

      const slug = slugify(title, { lower: true, strict: true });
      
      // Generate metadata for SEO
      const generateMetadata = (post) => {
          const contentSnippet = post.content.substring(0, 150).trim() + '...';
          const defaultImage = 'https://infohubnaija.com.ng/default-image.jpg';
          return { 
            title: post.title,
            description: contentSnippet,
            keywords: post.title.split(' ').slice(0, 10).join(', '),
            
            // Open Graph Meta Tags
            ogTitle: post.title,
            ogDescription: contentSnippet,
            ogImage: post.image || defaultImage,
            ogUrl: `https://infohubnaija.com.ng/post?slug=${encodeURIComponent(post.slug || '')}`,
            
            // Twitter Card Meta Tags
            twitterCard: 'summary_large_image',  
            twitterTitle: post.title,
            twitterDescription: contentSnippet,
            twitterImage: post.image || defaultImage,
            twitterUrl: `https://infohubnaija.com.ng/post?slug=${encodeURIComponent(post.slug || '')}`,
            
            // SEO and Indexing
            canonicalUrl: `https://infohubnaija.com.ng/post?slug=${encodeURIComponent(post.slug || '')}`,
            robots: 'index, follow',
            lastModified: new Date().toISOString(),
        };
        
      };

      // Create the post
      const post = await Post.create({
          title,
          slug,
          content,
          author: authorId, 
          authorUsername, 
          image,
          videoUrl,
          categories,
          subCategories: JSON.parse(subCategories),
          types,
          tags : JSON.parse(tags),
          isSponsored: isSponsored === 'true', 
          createdAt: Date.now(),
          meta: generateMetadata({ title, content, image, slug }),
      });

      // Add the post to the author's profile
      const user = await User.findOne({ username: authorUsername });
      if (!user) {
        return res.status(404).json({ message: "Author not found" });
      }
      user.post.push(post._id);
      await user.save();

      // Notify users
      const users = await User.find();
      users.forEach(async (user) => {
          const notification = new Notification({
              userId: user._id,
              type: 'post',
              message: `A new post titled "${post.title}" has been published.`,
          });
          await notification.save();
      });

      res.status(201).json({ message: "Post created successfully!", post });
      console.log("Uploaded file:", req.file);
  } catch (error) {
      console.error("Error in createPost:", error);
      res.status(500).json({ message: "Error creating post", error });
  }
};




const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Published' })
    .populate({
      path: 'author',
      select: 'fullName', 
    })
      .populate('comments'); // Populate comments
    
    res.status(200).json(posts);
  } catch (error) {
    console.error("Database error while fetching posts:", error);
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};


const renderPostListPage = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Published' })
      .populate({
        path: 'author',
        select: 'fullName',
      })
      .populate('comments'); // Populate comments

    const getReactionIcon = (type) => {
      const icons = {
        like: '👍',
        love: '❤️',
        haha: '😂',
        wow: '😮',
        sad: '😢',
        angry: '😡'
      };
      return icons[type] || '';
    }

    // Function to format date for post published
    const formatPostDate = (date) => {
      const currentTime = new Date();
      const timeDifference = currentTime - date; // Difference in milliseconds
      const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
      if (timeDifference < oneDayInMs) {
        // If less than 24 hours, include time of publish
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      } else {
        // If more than 24 hours, show only the date
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      }
    }

    // Otherwise, render the EJS page
    res.render('blog-list', { 
      posts, 
      formatPostDate, 
      getReactionIcon, 
      stripHtml 
    });
  } catch (error) {
    console.error("Database error while fetching posts:", error);
    res.status(500).render('error', { message: 'Error loading blog posts' });
  }
};


const getAdminPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate({
      path: 'author',
      select: 'fullName', 
    })
      .populate('comments'); // Populate comments
    
    res.status(200).json(posts);
  } catch (error) {
    console.error("Database error while fetching posts:", error);
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};


const renderPostPage = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOneAndUpdate(
      { slug: slug }, // Find the post by slug
      { $inc: { views: 1 } }, // Increment views
      { new: true } // Return the updated document
    )
    .populate({
      path: 'author',
      select: 'fullName avatar bio', 
    })
    .populate({
      path: 'comments',
      select: '_id author content createdAt reactions', // Include reactions field
      populate: [
        {
          path: 'author', // Populate userId for comments
          select: 'fullName avatar',
        },
        {
          path: 'replies',
          select: '_id author content createdAt replyReactions', // Include reactions field for replies
          populate: {
            path: 'author', // Populate userId for replies
            select: 'fullName avatar',
          },
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const getReactionIcon = (type) => {
      const icons = {
        like: '👍',
        love: '❤️',
        haha: '😂',
        wow: '😮',
        sad: '😢',
        angry: '😡'
      };
      return icons[type] || '';
    }

    const formatCommentDate = (date) => {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Function to format date for post published
    const formatPostDate = (date) => {
      const currentTime = new Date();
      const timeDifference = currentTime - date; // Difference in milliseconds
      const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
      if (timeDifference < oneDayInMs) {
        // If less than 24 hours, include time of publish
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      } else {
        // If more than 24 hours, show only the date
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      }
    }

    console.log("Description:", stripHtml(post.content).replace(/([a-z])([A-Z])/g, '$1 $2'));

    // Apply stripHtml to individual meta tags' content
    const metaTags = post.meta || {
      title: post.title,
      description: stripHtml(post.content).replace(/([a-z])([A-Z])/g, '$1 $2').slice(0, 360), // ✅ Fix applied
      image: post.image ? `https://infohub-ffez.onrender.com${post.image}` : 'default-image-path.jpg',
      url: `https://infohub-ffez.onrender.com/api/posts/post/${post.slug}`,
      
      // Open Graph Meta Tags
      ogTitle: post.meta?.ogTitle || post.title,
      ogDescription: stripHtml(post.meta?.ogDescription || post.content).replace(/([a-z])([A-Z])/g, '$1 $2') || stripHtml(post.content).replace(/([a-z])([A-Z])/g, '$1 $2').slice(0, 360),
      ogImage: post.meta?.ogImage || `https://infohub-ffez.onrender.com${post.image}` || 'default-image-path.jpg',
      ogUrl: `https://infohub-ffez.onrender.com/api/posts/post/${post.slug}`,
      
      // Twitter Card Meta Tags
      twitterCard: 'summary_large_image',
      twitterTitle: post.meta?.twitterTitle || post.title,
      twitterDescription: stripHtml(post.meta?.twitterDescription || post.content).replace(/([a-z])([A-Z])/g, '$1 $2') || stripHtml(post.content).replace(/([a-z])([A-Z])/g, '$1 $2').slice(0, 360),
      twitterImage: post.meta?.twitterImage || `https://infohub-ffez.onrender.com${post.image}` || 'default-image-path.jpg',
      twitterUrl: `https://infohub-ffez.onrender.com/api/posts/post/${post.slug}`,
      
      // SEO & Indexing
      canonicalUrl: post.meta?.canonicalUrl || `https://infohub-ffez.onrender.com/api/posts/post/${post.slug}`,
      robots: post.meta?.robots || 'index, follow',
      lastModified: post.meta?.lastModified || new Date().toISOString(),
    };

    // Render the EJS template with only meta tags
    res.render('postPage', { 
      metaTags, 
      slug, 
      post, 
      formatPostDate, 
      formatCommentDate, 
      getReactionIcon 
    });
  } catch (error) {
    console.error("Error rendering postPage:", error);
    res.status(500).render('error', { message: 'Error loading post page' });
  }
};




const getPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOneAndUpdate(
      { slug: slug }, // Find the post by slug
      { $inc: { views: 1 } }, // Increment views
      { new: true } // Return the updated document
    )
    .populate({
      path: 'author',
      select: 'fullName avatar bio', 
    })
    .populate({
      path: 'comments',
      select: '_id author content createdAt reactions', // Include reactions field
      populate: [
        {
          path: 'author', // Populate userId for comments
          select: 'fullName avatar',
        },
        {
          path: 'replies',
          select: '_id author content createdAt replyReactions', // Include reactions field for replies
          populate: {
            path: 'author', // Populate userId for replies
            select: 'fullName avatar',
          },
        },
      ],
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error("Database error while fetching post:", error);
    res.status(500).json({ message: 'Error fetching post', error });
  }
};


const getPostPreviewById = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOneAndUpdate(
      { slug: slug }, // Find the post by slug
      { $inc: { views: 1 } }, // Increment views
      { new: true } // Return the updated document
    )
    .populate({
      path: 'author',
      select: 'fullName', 
    })
    .populate({
      path: 'comments',
      select: '_id author content createdAt reactions', // Include reactions field
      populate: [
        {
          path: 'author', // Populate userId for comments
          select: 'fullName',
        },
        {
          path: 'replies',
          select: '_id author content createdAt replyReactions', // Include reactions field for replies
          populate: {
            path: 'author', // Populate userId for replies
            select: 'fullName',
          },
        },
      ],
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Database error while fetching post:", error);
    res.status(500).json({ message: 'Error fetching post', error });
  }
};



const getTopHeadlines = async (req, res) => {
  console.log("getTopHeadlines function called"); 
  try {
      const categories = ["Technology", "Science", "Health", "Sports", "Entertainment", "Education", "Romance", "Politics", "Business", "Travel", "Fashion"];
      const headlinesData = [];

      for (const category of categories) {
          const posts = await Post.find({ categories: category, status: 'Published' }) 
              .sort({ views: -1, createdAt: -1 }) 
              .limit(5); 

          headlinesData.push({
              category,
              headlines: posts.map(post => ({
                  slug: post.slug,
                  title: post.title,
                  image: post.image
              }))
          });
      }

      console.log("Headlines data:", headlinesData); // Log headlines data
      res.json(headlinesData);
  } catch (error) {
      console.error("Error fetching headlines:", error); // Log error
      res.status(500).json({ message: "Error fetching headlines" });
  }
};



const getTrendingPosts = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trendingPosts = await Post.find({ createdAt: { $gte: oneWeekAgo }, status: 'Published' })
      .sort({ views: -1 }) // Sort by views in descending order
      .limit(4) // Limit to top 4 trending posts
      .select('_id title image slug'); // Select only necessary fields for rendering

    res.status(200).json(trendingPosts);
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    res.status(500).json({ message: 'Error fetching trending posts', error });
  }
};



const getTopPosts = async (req, res) => {
  try {
      const categories = [
          "Romance", "Technology", "Business", "Education", "Travel",
          "Lifestyle", "Fashion", "Sports", "Entertainment", "Health",
          "Science", "Politics"
      ];
      const postsByCategory = {};
      const fallbackPosts = [];
    
      // Fetch top post for each category
      for (const category of categories) {
        const topPost = await Post.find({ categories: category }) 
            .sort({ createdAt: -1, views: -1 })
            .limit(1)
            .populate({
                path: 'author',
                select: 'username', 
            });

        postsByCategory[category] = topPost.length > 0 ? topPost[0] : null;
    }

      // Identify missing categories
      const missingCategories = Object.keys(postsByCategory).filter(category => !postsByCategory[category]);

      if (missingCategories.length > 0) {
          const fallbackQuery = await Post.find({ categories: { $in: categories } })
              .sort({ createdAt: -1, views: -1 })
              .skip(1) // Skip top posts
              .limit(missingCategories.length);

          fallbackPosts.push(...fallbackQuery);

          missingCategories.forEach((category, index) => {
              postsByCategory[category] = fallbackPosts[index] || null;
          });
      }

      // Respond with the data
      res.json(postsByCategory);
  } catch (error) {
      console.error('Error fetching top posts:', error);
      res.status(500).json({ message: "Server Error" });
  }
};



const updatePost = async (req, res) => { 
  const { slug } = req.params; // Assuming you're using an id or slug here
  const { title, content, categories, types } = req.body;
 

  try {
    const post = await Post.findOne({ slug: slug });
  if (!post) {
    console.error('Post not found with slug:', slug);
    return res.status(404).json({ message: 'Post not found' });
  }

  // Log initial data
  console.log('Original post data:', post);

  // Assign new values
  if (title !== undefined) {
    post.title = title;

    // Update the slug based on the title
    post.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
if (content !== undefined) post.content = content;
if (req.file) {
  post.image = `/uploads/${req.file.filename}`;
}
// Only assign if categories are provided to avoid overwriting existing data
if (categories && Array.isArray(categories) && categories.length > 0) {
  post.categories = categories;
}
if (types && Array.isArray(types) && types.length > 0) {
  post.types = types;
}
  post.updatedAt = Date.now();
  // Log the updated data before saving
  console.log('Updated post data:', post);
  
// Filter out any undefined values
Object.keys(post._doc).forEach(key => {
  if (post[key] === undefined) {
    delete post[key];
  }
});

  // Save the updated post
  await post.save();
  res.status(200).json(post);
} catch (error) {
  console.error('Error details:', error);
  res.status(500).json({ message: 'Error updating post', error });
}
};


// Controller function for single post delete
const deletePost = async (req, res) => {

  try {
    const { slug } = req.params;

    const result = await Post.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  }  catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

// Controller function for bulk delete
const bulkDeletePosts = async (req, res) => {
  const { postIds } = req.body; // Array of post IDs

  if (!postIds || postIds.length === 0) {
    return res.status(400).json({ message: 'No post IDs provided' });
  }

  try {
    // Delete the posts
    await Post.deleteMany({ _id: { $in: postIds } });
    res.status(200).json({ message: 'Selected posts deleted successfully' });
  } catch (error) {
    console.error('Error deleting selected posts:', error);
    res.status(500).json({ message: 'Error deleting selected posts', error });
  }
};

// Bulk Archive Function
const bulkArchivePosts = async (req, res) => {
  const { postIds } = req.body; // Array of post IDs

  if (!postIds || postIds.length === 0) {
    return res.status(400).json({ message: 'No post IDs provided' });
  }

  try {
    // Archive the posts by updating the status
    await Post.updateMany(
      { _id: { $in: postIds } },
      { $set: { status: 'Archived' } }
    );
    res.status(200).json({ message: 'Selected posts archived successfully' });
  } catch (error) {
    console.error('Error archiving selected posts:', error);
    res.status(500).json({ message: 'Error archiving selected posts', error });
  }
};



const searchQuery = async (req, res) => {
  console.log('Search route accessed');
  const searchTerm = req.query.term;
  console.log('Searching for:', searchTerm);

  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(400).json({ message: "Search term cannot be empty" });
  }

  try {
    const posts = await Post.find({
      status: 'Published',
      $or: [
        { authorUsername: { $regex: searchTerm, $options: "i" } },   // String field: title
        { title: { $regex: searchTerm, $options: "i" } },   // String field: title
        { content: { $regex: searchTerm, $options: "i" } }, // String field: content
        { tags: { $elemMatch: { $regex: searchTerm, $options: "i" } } },  // Array field: tags
        { categories: { $elemMatch: { $regex: searchTerm, $options: "i" } } }  // Array field: categories
      ]
    })
    .populate({
      path: 'author',
      select: 'username',
    })
    .sort({ createdAt: -1 });

    // Filter out posts where the populated author didn't match the search term
    const filteredPosts = posts.filter(post => post.authorUsername !== null);
    console.log("Posts before filtering:", posts);

    if (filteredPosts.length === 0) {
      return res.status(404).json([]);
    }


    res.status(200).json(filteredPosts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Error searching posts" });
  }
};

// const vapidKeys = webPush.generateVAPIDKeys();
// console.log(vapidKeys);


const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the post ID is passed
    const { status } = req.body; // The new status (e.g., 'published', 'draft', 'archived')

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure only the status field is updated without altering other required fields
    const previousStatus = post.status; // Save the previous status to check if it's changing to 'published'
    post.status = status;

    // Set the published date only if transitioning to 'published' for the first time
    if (status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date(); // Record the first published date
    }

    // Save the post with the updated status
    await post.save({ validateModifiedOnly: true });

    // If the post was updated to 'published', send a push notification
    if (status.toLowerCase() === 'published' && previousStatus.toLowerCase() !== 'published') {
      console.log('Preparing to send notifications for published post:', post.title);
      // Fetch all subscriptions
      const subscribers = await Subscriber.find(); 
      console.log('Subscribers:', subscribers);

      // Prepare the push notification payload
      const payload = JSON.stringify({
        title: `New Post: ${post.title}`,
        body: `Check out the new post titled "${post.title}"`,
        icon: '/path-to-icon.png', // You can replace with your own icon
        image: post.image, // Assuming the post has an image field
        tag: 'new-post',
        url: `/post?slug=${post.slug}` // Link to the post page
      });

      // Send the notification to each subscribed user
      subscribers.forEach(async (subscriber) => {
        try {
          await webPush.sendNotification({
            endpoint: subscriber.endpoint,
            keys: {
              p256dh: subscriber.keys.p256dh,
              auth: subscriber.keys.auth
            }
          }, payload);
          console.log('Push notification sent successfully');
        } catch (error) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log('Removing invalid subscription:', subscriber.endpoint);
            await Subscriber.deleteOne({ _id: subscriber._id });
          } else {
            console.error('Error sending notification:', error);
          }
        }
      });
    } else {
      console.log('Notification not sent. Status:', status, 'Previous status:', previousStatus);
  }

    res.status(200).json({ message: 'Post status updated successfully', post });
  } catch (error) {
    console.error('Error updating post status:', error);
    res.status(500).json({ message: 'Error updating post status', error });
  }
};


const getHomePagePosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Published' }) 
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username',
      });

    if (!posts || posts.length === 0) {
      return res.json([]);
    }

    // Transform the data: group posts by categories
    const groupedPosts = {};
    posts.forEach(post => {
      const category = post.categories;
      if (!groupedPosts[category]) {
        groupedPosts[category] = [];
      }
      groupedPosts[category].push(post);
    });

    // Format the grouped posts into an array for frontend consumption
    const transformedPosts = Object.keys(groupedPosts).map(category => ({
      categories: category,
      posts: groupedPosts[category],
    }));

    console.log('API Response:', transformedPosts);

    return res.json(transformedPosts);

  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).send('Server Error');
  }
};



// Helper function to calculate total reactions
const calculateReactions = (reactions) => {
  return Object.values(reactions).reduce((acc, val) => acc + val, 0);
};

// Fetch posts for layout
const getPostsForLayout = async (req, res) => {
  try {
    const recentPosts = await Post.find({ status: 'Published' })
      .sort({ publishedAt: -1 })
      .limit(5);

    const topPosts = await Post.find({ status: 'Published' })
      .sort({ views: -1, 'meta.lastModified': -1 })
      .limit(5)
      .lean();

    topPosts.forEach((post) => {
      post.totalReactions = calculateReactions(post.reactions);
    });

    const randomPosts = await Post.aggregate([
      { $match: { status: 'Published' } },
      { $sample: { size: 5 } },
    ]);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const yearlyPopular = await Post.find({
      publishedAt: { $gte: oneYearAgo },
      status: 'Published',
    })
      .sort({ views: -1, 'reactions.like': -1 })
      .limit(3);

    const recentWithThumbs = await Post.find({
      status: 'Published',
      image: { $exists: true, $ne: null },
    })
      .sort({ publishedAt: -1 })
      .limit(4);

    // Fetch most shared posts
    const mostShared = await Post.find({ status: 'Published' })
      .sort({ shares: -1 })
      .limit(4);

    res.json({
      recentPosts,
      topPosts,
      randomPosts,
      yearlyPopular,
      recentWithThumbs,
      mostShared, // Include in the response
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};



const getPostsByType = async (req, res) => {
  const { type } = req.params;
  const { category } = req.query;
  console.log("Categories Request:", req.query)
  console.log("Type:", type)

  try {
    if (!type || !category) {
      return res.status(400).json({ message: "Type and category are required" });
    }

    const posts = await Post.find({
      types: type,        // Match 'type' in the 'types' array
      categories: category // Match 'category' in the 'categories' array
    })
      .sort({ createdAt: -1 }) // Sort by latest posts
      .limit(4);               // Limit to top 4 posts

      console.log('Query:', { types: type, categories: category });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};





module.exports = {
  createPost,
  getPosts,
  renderPostListPage,
  getAdminPosts,
  renderPostPage,
  getPostBySlug,
  getPostPreviewById,
  updatePost,
  deletePost,
  getTopHeadlines,
  getTrendingPosts,
  getTopPosts,
  searchQuery,
  bulkDeletePosts,
  bulkArchivePosts,
  updatePostStatus,
  getHomePagePosts,
  getPostsForLayout,
  getPostsByType,
};




// const createPost = async (req, res) => {
//   const { title, content, videoUrl, categories, tags, author } = req.body;

//   let image = null;

//   try {
//     console.log("Creating post with data:", { title, content, videoUrl, categories, tags, author });

//     // Handling the image if it's part of FormData
//     if (req.file) {
//       image = `/uploads/${req.file.filename}`;
//       console.log("Image URL created:", image);
//     }

//     // Generate a unique slug
//     const slug = slugify(title, { lower: true, strict: true });

//     // Generate metadata
//     const generateMetadata = (post) => {
//       const contentSnippet = post.content.substring(0, 150).trim() + '...';
    
//       return {
//         title: post.title,
//         description: post.contentSnippet,
//         keywords: post.title.split(' ').slice(0, 5).join(', '),
//         ogTitle: post.title,
//         ogDescription: contentSnippet,
//         ogImage: post.image || 'default-image-url.jpg',
//         twitterTitle: post.title,
//         twitterDescription: post.contentSnippet,
//         twitterImage: post.image || 'default-image-url.jpg',
//         canonicalUrl: `https://yourwebsite.com/posts/${post.slug}`,
//         robots: 'index, follow',
//         lastModified: new Date().toISOString(), // Sets the last modified date
//       };
//     };
    

//     // Create a new post instance
//     const post = new Post({
//       title,
//       slug,
//       content,
//       author,
//       image,
//       videoUrl,
//       categories,
//       tags: JSON.parse(tags), // Convert tags back to array if passed as JSON string
//       createdAt: Date.now(),
//       meta: generateMetadata({ title, content, image, slug }), // Populate meta field
//     });

//     await post.save();

//     console.log("Post saved successfully:", post);

//     // Notify all users
//     const users = await User.find();
//     users.forEach(async (user) => {
//       const notification = new Notification({
//         userId: user._id,
//         type: 'post',
//         message: `A new post titled "${post.title}" has been published.`,
//       });
//       await notification.save();
//     });

//     res.status(201).json({ message: "Post created successfully!", post });
//     console.log("Uploaded file:", req.file);
//   } catch (error) {
//     console.error("Error in createPost:", error);
//     res.status(500).json({ message: "Error creating post", error });
//   }
// };
// Load environment variables
require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();

// Core dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Middleware and utility imports
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const { logActivity, activityLogger } = require('./middleware/analyticsMiddleware');
const Review = require("./models/Reviews");

// Database connection
const connectDB = require('./config/database');
connectDB(); // Ensure database is connected before starting the server

// Initialize Express app
const app = express();

// Setting EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/results', express.static(path.join(__dirname, 'uploads/results')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Middleware setup
app.use(logger);
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  const allowedOrigins = [
      'http://localhost:3173',
      'http://localhost:5120',
      'https://infohub-ffez.onrender.com',
      'https://infohubnaija.com.ng',
      'https://www.infohubnaija.com.ng'
  ];
  
  if (allowedOrigins.includes(req.headers.origin)) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Handle Preflight Requests (OPTIONS)
app.options('*', (req, res) => {
  res.status(200).end();
});


// Route imports
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const editorRoutes = require('./routes/editorRoutes');
const postRoutes = require('./routes/postRoutes');
const postMngtRoutes = require('./routes/post_mngtRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const authRoutes = require('./routes/authRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const readerRoutes = require('./routes/readerRoutes'); 
const refreshRoutes = require('./routes/refreshRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const newsletterRoutes = require('./routes/newsLetterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const cookiesRoutes = require('./routes/cookiesRoutes');
const adsRoutes = require('./routes/adsRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const rootRoutes = require('./routes/root');
const reviewsRoutes = require("./routes/reviewsRoutes");
const testRoutes = require("./routes/testRoutes");
 
// Serve Home HTML page
// app.get('/', activityLogger('visitor'), logActivity, (req, res) =>
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
// );

app.get('/', async (req, res) => {
  try {
      const reviews = await Review.find({ status: "Approved" })
          .sort({ createdAt: -1 })
          .limit(20); // Get latest 20 approved reviews

      res.render('index', {
          title: 'Welcome to AMLAD',
          description: 'Agapelove Medical Laboratory and Diagnostic Ltd provides world-class diagnostic services.',
          keywords: 'medical tests, diagnostic services, laboratory, blood test',
          reviews: reviews // Pass reviews to the template
      });
  } catch (error) {
      console.error("Error fetching reviews:", error);
      res.render('index', {
          title: 'Welcome to AMLAD',
          description: 'Agapelove Medical Laboratory and Diagnostic Ltd provides world-class diagnostic services.',
          keywords: 'medical tests, diagnostic services, laboratory, blood test',
          reviews: [] // Pass an empty array if an error occurs
      });
  }
});


// Serve other static page routes
  app.get('/book-appointment', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'appointment.html'))
  );
  app.get('/appointment-confirmed', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'confirmedAppt.html'))
  );
  app.get('/reset-password', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..',  'frontend','reset-password.html'))
  );
app.get('/new-password', (req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'new-password.html')));
  app.get('/new-password', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..',  'frontend', 'resetPassword.html'))
  );
  // app.get('/patient-dashboard', activityLogger('pageView'), logActivity, (req, res) =>
  //   res.sendFile(path.join(__dirname, '..', 'frontend',  'patient.html'))
  // );
  app.get('/admin-staffs', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'ourTeam.html'))
  );
  app.get('/our-blogs', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'blog-list.html'))
  );
  app.get('/about', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'about.html'))
  );
  app.get('/contact', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'contact.html'))
  );
  app.get('/cookie', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'cookie.html'))
  );
  app.get('/create-blog', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'createBlog.html'))
  );
  // app.get('/patient-dashboard', activityLogger('pageView'), logActivity, (req, res) =>
  //   res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'))
  // );
  app.get('/patient-account', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'account.html'))
  );
  app.get('/patient-results', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'docs.html'))
  );
  app.get('/faq', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'help.html'))
  ); 
  app.get('/notifications', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'notifications.html'))
  );  
  app.get('/settings', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'settings.html'))
  );
  app.get('/medical-history', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'records.html'))
  );
  app.get('/health-charts', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'charts.html'))
  );
  app.get('/support', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'chat.html'))
  ); 
  app.get('/privacy-policy', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'privacyPolicy.html'))
  );
  app.get('/terms-of-service', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'termsOfService.html'))
  );
  app.get('/cookies', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'cookie.html'))
  );
  app.get('/service', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'service.html'))
  );
  app.get('/vacancy', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'vacancy.html'))
  );
  app.get('/resource', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'resource.html'))
  );
  // app.get('/client-testimonial', activityLogger('pageView'), logActivity, (req, res) =>
  //   res.sendFile(path.join(__dirname, '..', 'frontend', 'testimonial.html'))
  // );
  app.get('/client-testimonial', activityLogger('pageView'), logActivity, async (req, res) => {
    try {
        const reviews = await Review.find({ status: "Approved" })
            .sort({ createdAt: -1 })
            .limit(20); // Get latest 20 approved reviews
  
        res.render('testimonial', {
            title: 'Welcome to AMLAD',
            description: 'Agapelove Medical Laboratory and Diagnostic Ltd provides world-class diagnostic services.',
            keywords: 'medical tests, diagnostic services, laboratory, blood test',
            reviews: reviews // Pass reviews to the template
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.render('testimonial', {
            title: 'Welcome to AMLAD',
            description: 'Agapelove Medical Laboratory and Diagnostic Ltd provides world-class diagnostic services.',
            keywords: 'medical tests, diagnostic services, laboratory, blood test',
            reviews: [] // Pass an empty array if an error occurs
        });
    }
  });
  app.get('/our-team', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'team.html'))
  );
  app.get('/patient-login', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'))
  );
  app.get('/test-details', activityLogger('pageView'), logActivity, (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'tests-view-page.html'))
  );
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'sitemap.xml'));
});
  

// Public API routes
app.use('/api/auth', express.json(), authRoutes);
app.use('/api/refresh', refreshRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/reader', express.json(), readerRoutes);
app.use('/api/admin', express.json(), adminRoutes);
app.use('/api/editor', express.json(), editorRoutes);
app.use('/api/user', express.json(), userRoutes);
app.use('/api/posts', express.json(), postRoutes);
app.use('/api/post', postMngtRoutes);
app.use('/api/newsLetter', express.json(), newsletterRoutes);
app.use('/api/contact', express.json(), contactRoutes);
app.use('/api/promotion', express.json(), promotionRoutes);
app.use('/api/cookie', express.json(), cookiesRoutes);
app.use('/api/ads', express.json(), adsRoutes);
app.use('/api/applications', express.json(), applicationRoutes);
app.use('/api/reviews', express.json(), reviewsRoutes);
app.use('/api/test', express.json(), testRoutes);
app.use('/', rootRoutes);

// Fallback 404 handler (MUST be placed after all pages and routes)
app.get('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, '..', 'frontend', '404.html')); // Confirm correct path
    } else if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
    } else {
      res.type('txt').send('404 Not Found');
    }
  });

// Applying verifyJWT middleware only to protected routes
app.use(verifyJWT);

// Protected API routes
app.use('/api/comments', express.json(), commentRoutes);
app.use('/api/reactions', express.json(), reactionRoutes);
app.use('/api/analytics', express.json(), analyticsRoutes);

// Global error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

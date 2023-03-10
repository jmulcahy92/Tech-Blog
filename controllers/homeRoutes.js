const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      // Get all projects and JOIN with user data
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });

      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));
  
      console.log(posts);

      // Pass serialized data and session flag into template
      res.render('homepage', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
  let user = req.session;
  try {
    const postData = await Post.findAll({
      where: {
        userId: user.user_id
      }
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', {
      user,
      posts,
      logged_in: user.logged_in
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [
            {
              model: User
            }
          ]
        }
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('*', (req, res) => {
  res.render('login');
});
  
module.exports = router;
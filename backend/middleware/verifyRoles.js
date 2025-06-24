const verifyRoles = (...allowedTypes) => {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      console.log('Allowed Types:', allowedTypes);
      console.log('User Type:', req.user.role);
  
      if (!allowedTypes.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Unauthorized role' });
      }
  
      next();
    };
  };
  
  module.exports = verifyRoles;
  
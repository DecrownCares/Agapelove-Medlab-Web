
const axios = require('axios');

const fetchDailyQuotes = async () => {
  try {
    const {data} = await axios.get('http://localhost:0.0.0.0:3173/https://quotes.rest/qod/categories?language=en&detailed=false', {
        headers: {
          'Authorization': 'Bearer Ii0eYLCC8ADMxUjBizxqil9vGwPgBORX8jhIDWIB0f6d9b55',
          'Content-Type': 'application/json'
        }
      });
    return data.results; 
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('Failed to fetch daily quotes');
  }
};

module.exports = { fetchDailyQuotes };

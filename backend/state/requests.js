const requestCache = {}; // { userId: requestCount }

const RequestService = {
  getUserRequests(userId) {
    return requestCache[userId] || 0;
  },

  incrementRequests(userId) {
    requestCache[userId] = (requestCache[userId] || 0) + 1;

    return requestCache[userId];
  },
};

export default RequestService;

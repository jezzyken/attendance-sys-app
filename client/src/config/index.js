let url;

if (process.env.NODE_ENV === "production") {
  url = `/api`;
} else {
  url = `http://localhost:3002/api`;
}

module.exports = {
  url,
};

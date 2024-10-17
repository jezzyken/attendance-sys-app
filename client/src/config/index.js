let url;

if (process.env.NODE_ENV === "production") {
  url = `/api/v1`;
} else {
  url = `http://localhost:3001/api/v1`;
}

module.exports = {
  url,
};

/* Pagination Utility */
const paginateResults = async (allFiles, page, res) => {
  const contentPerPage = 20;
  const dataList = [];

  const cursor = await allFiles.sort()
    .skip(page > 0 ? ((page + 1) * contentPerPage) : contentPerPage).limit(contentPerPage);
  await cursor.forEach((document) => {
    dataList.push(document);
  });
  res.status(201).send(JSON.stringify(dataList));
};
export default paginateResults;

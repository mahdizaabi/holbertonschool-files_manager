/* Pagination Utility */
const paginateResults = async (allFiles, page = 0, res) => {
  const contentPerPage = 20;
  const dataList = [];

  const cursor = await allFiles.sort()
    .skip(page > 0 ? ((page + 1) * contentPerPage) : 0)
    .limit(contentPerPage);
  await cursor.forEach((document) => {
    dataList.push(document);
  });

  return res.status(201).json(dataList);
};
export default paginateResults;

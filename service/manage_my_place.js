const { checkPlaceInfo } = require('./init-module');

async function getSearchPlaces(userInfo) {
  try {
    const searchResult = {};
    const searchInfo = userInfo.searchPlaces;
    searchResult.items = [];
    searchResult.totalCount = 0;
    if (searchInfo && searchInfo.searchItems && searchInfo.searchItems.length !== 0) {
      const userSearch = searchInfo.searchItems;
      searchResult.totalCount = userSearch.length;
      for (const contentId of userSearch) {
        searchResult.items.push({
          contentID: contentId,
        });
      }
      await checkPlaceInfo(userInfo, searchResult);
    }
    return searchResult;
  } catch (err) {
    console.error('getSearchPlaces() error');
    console.error(err.message);
    throw err;
  }
}

async function getBasketPlaces(userInfo) {
  try {
    const basketResult = {};
    const basketInfo = userInfo.basketPlaces;
    basketResult.items = [];
    basketResult.totalCount = 0;
    if (basketInfo && basketInfo.basketItems && basketInfo.basketItems.length !== 0) {
      const userBasket = basketInfo.basketItems;
      basketResult.totalCount = userBasket.length;
      for (const contentId of userBasket) {
        basketResult.items.push({
          contentID: contentId,
        });
      }
      await checkPlaceInfo(userInfo, basketResult);
    }
    return basketResult;
  } catch (err) {
    console.error('getSearchPlaces() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  getSearchPlaces,
  getBasketPlaces,
};
const MainService = require('../services/MainService');

class MainController {
  constructor() {
    this.mainService = new MainService();
  }

  async getMainData(req, res, next) {
    try {
      const mainData = await this.mainService.getMainData();
      res.json(mainData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MainController;

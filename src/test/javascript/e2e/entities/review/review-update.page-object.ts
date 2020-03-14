import { element, by, ElementFinder } from 'protractor';

export default class ReviewUpdatePage {
  pageTitle: ElementFinder = element(by.id('yumzApp.review.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  reviewTextInput: ElementFinder = element(by.css('input#review-reviewText'));
  foodInput: ElementFinder = element(by.css('input#review-food'));
  hospitalityInput: ElementFinder = element(by.css('input#review-hospitality'));
  atmosphereInput: ElementFinder = element(by.css('input#review-atmosphere'));
  reviewDateInput: ElementFinder = element(by.css('input#review-reviewDate'));
  userSelect: ElementFinder = element(by.css('select#review-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setReviewTextInput(reviewText) {
    await this.reviewTextInput.sendKeys(reviewText);
  }

  async getReviewTextInput() {
    return this.reviewTextInput.getAttribute('value');
  }

  async setFoodInput(food) {
    await this.foodInput.sendKeys(food);
  }

  async getFoodInput() {
    return this.foodInput.getAttribute('value');
  }

  async setHospitalityInput(hospitality) {
    await this.hospitalityInput.sendKeys(hospitality);
  }

  async getHospitalityInput() {
    return this.hospitalityInput.getAttribute('value');
  }

  async setAtmosphereInput(atmosphere) {
    await this.atmosphereInput.sendKeys(atmosphere);
  }

  async getAtmosphereInput() {
    return this.atmosphereInput.getAttribute('value');
  }

  async setReviewDateInput(reviewDate) {
    await this.reviewDateInput.sendKeys(reviewDate);
  }

  async getReviewDateInput() {
    return this.reviewDateInput.getAttribute('value');
  }

  async userSelectLastOption() {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}

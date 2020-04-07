import { element, by, ElementFinder } from 'protractor';

export default class RestaurantUpdatePage {
  pageTitle: ElementFinder = element(by.id('yumzApp.restaurant.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  nameInput: ElementFinder = element(by.css('input#restaurant-name'));
  locationInput: ElementFinder = element(by.css('input#restaurant-location'));
  phoneInput: ElementFinder = element(by.css('input#restaurant-phone'));
  websiteInput: ElementFinder = element(by.css('input#restaurant-website'));
  cuisineTypeSelect: ElementFinder = element(by.css('select#restaurant-cuisineType'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setLocationInput(location) {
    await this.locationInput.sendKeys(location);
  }

  async getLocationInput() {
    return this.locationInput.getAttribute('value');
  }

  async setPhoneInput(phone) {
    await this.phoneInput.sendKeys(phone);
  }

  async getPhoneInput() {
    return this.phoneInput.getAttribute('value');
  }

  async setWebsiteInput(website) {
    await this.websiteInput.sendKeys(website);
  }

  async getWebsiteInput() {
    return this.websiteInput.getAttribute('value');
  }

  async cuisineTypeSelectLastOption() {
    await this.cuisineTypeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async cuisineTypeSelectOption(option) {
    await this.cuisineTypeSelect.sendKeys(option);
  }

  getCuisineTypeSelect() {
    return this.cuisineTypeSelect;
  }

  async getCuisineTypeSelectedOption() {
    return this.cuisineTypeSelect.element(by.css('option:checked')).getText();
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

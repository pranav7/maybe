import { Controller } from "@hotwired/stimulus";
import { CurrenciesService } from "services/currencies_service";

// Connects to data-controller="money-field"
// when currency select change, update the input value with the correct placeholder and step
export default class extends Controller {
  static targets = ["amount", "currency", "symbol"];

  connect() {
    // No need to manually add event listeners as we're using data-action
  }

  handleCurrencyChange(e) {
    const selectedCurrency = e.target.value;
    this.updateAmount(selectedCurrency);
  }

  updateAmount(currency) {
    new CurrenciesService().get(currency).then((currency) => {
      this.amountTarget.step = currency.step;

      if (Number.isFinite(this.amountTarget.value)) {
        this.amountTarget.value = Number.parseFloat(
          this.amountTarget.value,
        ).toFixed(currency.default_precision);
      }

      this.symbolTarget.innerText = currency.symbol;
    });
  }

  handleCalculation(e) {
    const input = e.target;
    const value = input.value.trim();

    // Skip if the value is empty
    if (!value) {
      return;
    }

    // Check if the value contains any calculation operators
    const hasCalculation = /[+\-*/×÷]/.test(value);

    // If it's just a number (no calculation), format it according to currency precision
    if (!hasCalculation && !isNaN(parseFloat(value))) {
      const currencyCode = this.hasCurrencyTarget ? this.currencyTarget.value : "USD";

      new CurrenciesService().get(currencyCode).then((currency) => {
        input.value = Number(parseFloat(value)).toFixed(currency.default_precision);
      });
      return;
    }

    // If it contains a calculation, evaluate it
    try {
      // Replace × with * and ÷ with / for calculation
      const sanitizedValue = value
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '');

      // Use Function constructor to safely evaluate the expression
      const result = Function(`"use strict"; return (${sanitizedValue})`)();

      if (!isNaN(result)) {
        // Get the current currency to determine precision
        const currencyCode = this.hasCurrencyTarget ? this.currencyTarget.value : "USD";

        new CurrenciesService().get(currencyCode).then((currency) => {
          // Format the result with the appropriate precision
          input.value = Number(result).toFixed(currency.default_precision);
        });
      }
    } catch (error) {
      // If calculation fails, leave the input as is
      console.error("Calculation error:", error);
    }
  }
}
